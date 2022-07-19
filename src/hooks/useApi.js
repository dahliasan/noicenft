import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  getSearchCollectionsApi,
  getNewListingsV2Api,
  getNewListingsApi,
  getAssetsApi,
  getTraitFloorPricesApi,
  getContractSmartFloorPriceApi,
  getContractSalesStatsApi,
  getContractInsightsApi,
  getContractApi,
} from '../helpers/apis.js'

export default function useApi(query, selectedCollection, insightsPeriod) {
  const [loading, setLoading] = useState({})
  const [error, setError] = useState(false)
  const [data, setData] = useState({})

  // Reset nfts array when a new collection is selected
  useEffect(() => {
    setData({})
    setError(false)
    setLoading({})
  }, [selectedCollection])

  // Search for collections
  useEffect(() => {
    console.log('searching collections...')

    const abortController = new AbortController()

    if (query === '') {
      setData((prev) => ({ ...prev, search: null }))
      setLoading((prev) => ({ ...prev, search: false }))
      setError(null)
      return
    }

    async function searchCollections() {
      try {
        setLoading((prev) => ({ ...prev, search: true }))
        setError(null)

        const data = await getSearchCollectionsApi(query, {
          signal: abortController.signal,
        })

        setData((prev) => ({ ...prev, search: data }))
      } catch (err) {
        console.log(err)
        setError(true)
      } finally {
        setLoading((prev) => ({ ...prev, search: false }))
      }
    }

    searchCollections()

    return () => abortController.abort()
  }, [query])

  // fetch new listings of selected collection
  useEffect(() => {
    const abortController = new AbortController()

    if (!selectedCollection) return // ignore the first render
    console.log(selectedCollection)

    async function getNewListings() {
      try {
        setLoading((prev) => ({ ...prev, listings: true }))
        setError(false)

        let contractAddress = selectedCollection.address

        // Get new listings
        console.log('fetching listings...')
        const listingsData = await getNewListingsApi(
          contractAddress,
          {
            signal: abortController.signal,
          },
          { count: 3 }
        )
        console.log('get new listings -- ', listingsData)

        const tokenIds = listingsData.listings.map((item) => item.tokenId)

        // Get asset details
        const tokensData = await getAssetsApi(contractAddress, tokenIds)
        console.log('assets -- ', tokensData)

        // normalise listing data
        const newListingsArray = listingsData.listings.map((listing, index) => {
          // console.log(listing.tokenId, tokensData[index].asset.token_id)
          return {
            ...listing,
            details: tokensData ? tokensData[index] : null,
          }
        })

        // // Get collection stats
        // const slug = listingsData.collection
        // console.log('fetching collection stats...')
        // const [traitFloorPrices, smartFloorPrice, salesStats] =
        //   await Promise.all([
        //     getTraitFloorPricesApi(slug),
        //     getContractSmartFloorPriceApi(contractAddress),
        //     getContractSalesStatsApi(contractAddress),
        //   ])
        // const collectionStats = {
        //   traitFloorPrices,
        //   smartFloorPrice: smartFloorPrice.data,
        //   salesStats: salesStats.statstics,
        // }

        // console.log('collection stats -- ', collectionStats)

        // // Get collection insights
        // const collectionInsights = await getContractInsightsApi(contractAddress)
        // console.log('collection insights -- ', collectionInsights)

        // Set data state
        setData((prev) => ({
          ...prev,
          newListings: { ...listingsData, listings: newListingsArray },
          // collectionStats: collectionStats,
          // collectionInsights: collectionInsights,
        }))
      } catch (err) {
        console.log(err)
        setError(true)
      } finally {
        setLoading((prev) => ({ ...prev, listings: false }))
      }
    }

    getNewListings()

    return () => abortController.abort()
  }, [selectedCollection])

  // Fetch trending collections using rarify API
  useEffect(() => {
    async function getTrendingCollections() {
      try {
        setLoading((prev) => ({ ...prev, trending: true }))
        const params = {
          'insights_trends.period': '24h',
          include: 'insights_trends',
          sort: '-insights_trends.volume_change_percent',
          'page[limit]': 10,
        }

        const data = await getContractApi('', params)
        console.log('trending collections -- ', data)

        setData((prev) => ({ ...prev, trendingCollections: data }))
      } catch (err) {
        console.log(err)
      } finally {
        setLoading((prev) => ({ ...prev, trending: false }))
      }
    }

    getTrendingCollections()
  }, [])

  return { data, loading, error }
}
