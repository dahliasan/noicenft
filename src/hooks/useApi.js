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
  getAssetContract,
  getListingsUniqApi,
  getEthMarketData,
} from '../helpers/apis.js'

import { debounce } from 'lodash'

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

    // searchCollections()

    const debounceSearch = debounce(() => {
      searchCollections()
    }, 200)

    debounceSearch()

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

        // get collection slug
        console.log('fetching collection slug...')

        const contractData = await getAssetContract(contractAddress)
        console.log(contractData)
        let slug = contractData.collection.slug

        // Get new listings
        console.log('fetching listings...')
        // const listingsData = await getNewListingsApi(contractAddress, {
        //   signal: abortController.signal,
        // })
        // console.log('get new listings -- ', listingsData)

        async function getLastListingsFromUniqApi(slug) {
          const listingsData = await getListingsUniqApi(slug)
          console.log('last listings', listingsData)

          const ethMarketData = await getEthMarketData()
          console.log(ethMarketData)

          const ethUsdPrice = ethMarketData.data.market_data.price_usd

          let normalisedListings = listingsData?.data.map((item) => {
            const {
              created_at,
              image_url,
              name,
              opensea_url,
              rank,
              token_id,
              value,
            } = item
            return {
              tokenId: token_id,
              image_url: image_url,
              permalink: opensea_url,
              price: value,
              priceInUSD: value * ethUsdPrice,
              priceSymbol: 'ETH',
              eventTimestamp: created_at.replace('Z', ''),
            }
          })

          return {
            collection: slug,
            listings: normalisedListings,
          }
        }

        const listingsData = await getLastListingsFromUniqApi(slug)

        const tokenIds = listingsData.listings.map((item) => item.tokenId)

        // Get asset details
        const tokensData = await getAssetsApi(contractAddress, tokenIds)
        console.log('assets -- ', tokensData)

        // combine and normalise listing data with details
        const newListingsArray = listingsData.listings.map((listing, index) => {
          // console.log(listing.tokenId, tokensData[index].asset.token_id)
          return {
            ...listing,
            details: tokensData ? tokensData[index] : null,
          }
        })

        // Set data state
        setData((prev) => ({
          ...prev,
          newListings: { ...listingsData, listings: newListingsArray },
        }))

        return { contractAddress, slug }
      } catch (err) {
        console.log(err)
        setError(true)
      } finally {
        setLoading((prev) => ({ ...prev, listings: false }))
      }
    }

    async function getCollectionStats(contractAddress, slug) {
      try {
        // Get collection stats
        console.log('fetching collection stats...')

        const [smartFloorPrice, salesStats] = await Promise.all([
          getContractSmartFloorPriceApi(contractAddress),
          getContractSalesStatsApi(contractAddress),
        ])
        const collectionStats = {
          smartFloorPrice: smartFloorPrice.data,
          salesStats: salesStats?.statistics,
        }
        console.log('collection stats -- ', collectionStats)

        // Get collection insights
        const collectionInsights = await getContractInsightsApi(
          contractAddress,
          insightsPeriod
        )
        console.log('collection insights -- ', collectionInsights)

        setData((prev) => ({
          ...prev,
          collectionStats: collectionStats,
          collectionInsights: collectionInsights,
        }))
      } catch (err) {
        console.log(err)
      }
    }

    getNewListings().then((res) => {
      getCollectionStats(res.contractAddress, res.slug)
    })

    const interval = setInterval(() => {
      getNewListings()
    }, 300000)

    return () => {
      clearInterval(interval)
      abortController.abort()
    }
  }, [selectedCollection])

  // Fetch selected insights period
  useEffect(() => {
    if (!selectedCollection) return // ignore the first render

    async function fetchContractInsights() {
      try {
        let contractAddress = selectedCollection.address

        setLoading((prev) => ({ ...prev, insights: true }))
        // Get collection insights
        const collectionInsights = await getContractInsightsApi(
          contractAddress,
          insightsPeriod
        )

        setData((prev) => ({
          ...prev,
          collectionInsights: collectionInsights,
        }))
      } catch (err) {
        console.log(err)
      } finally {
        setLoading((prev) => ({ ...prev, insights: false }))
      }
    }

    fetchContractInsights()
  }, [insightsPeriod])

  // Fetch trending collections using rarify API
  // useEffect(() => {
  //   async function getTrendingCollections() {
  //     try {
  //       setLoading((prev) => ({ ...prev, trending: true }))
  //       const params = {
  //         'insights_trends.period': '24h',
  //         include: 'insights_trends',
  //         sort: '-insights_trends.volume_change_percent',
  //         'page[limit]': 10,
  //       }

  //       const data = await getContractApi('', params)
  //       console.log('trending collections -- ', data)

  //       setData((prev) => ({ ...prev, trendingCollections: data }))
  //     } catch (err) {
  //       console.log(err)
  //     } finally {
  //       setLoading((prev) => ({ ...prev, trending: false }))
  //     }
  //   }

  //   getTrendingCollections()
  // }, [])

  return { data, loading, error }
}
