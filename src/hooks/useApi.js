import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  createSearchCollectionConfig,
  createNewListingsConfig,
  createBatchTokenInfoConfig,
  API_KEYS,
} from '../utils/api.js'
import { ZDK, ZDKNetwork, ZDKChain } from '@zoralabs/zdk'

// axios.defaults.baseURL = `http://localhost:5000`

export default function useApi(query, selectedCollection) {
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
      setLoading((prev) => ({ ...prev, search: true }))
      setError(null)

      let config = createSearchCollectionConfig(query, {
        signal: abortController.signal,
      })

      const data = await axios(config).then((res) => res.data)
      console.log('--- search collections', data)
      setData((prev) => ({ ...prev, search: data }))
    }

    searchCollections()
      .catch((error) => {
        if (error.name === 'CanceledError') return
        console.log(error)
        setError(true)
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, search: false }))
      })

    return () => abortController.abort()
  }, [query])

  // fetch new listings of selected collection
  useEffect(() => {
    console.log('fetching listings...')

    if (selectedCollection.address === '' || !selectedCollection.address) return // ignore the first render

    async function getNewListings() {
      try {
        setLoading((prev) => ({ ...prev, listings: true }))
        setError(false)

        let contractAddress = selectedCollection.address

        // Get listings
        let config = createNewListingsConfig(contractAddress)
        const listingsData = await axios(config).then((res) => res.data)
        console.log('-- new listings:', listingsData)
        const tokenIds = listingsData.listings.map((item) => item.tokenId)

        // Get asset details
        async function getAssets(contractAddress, tokenIds) {
          try {
            console.log('fetching assets...')
            let paramsArray = tokenIds.map((id) => `&token_ids=${id}`)
            paramsArray = _chunkArray(paramsArray, 20)

            let endpoints = paramsArray.map(
              (chunk) =>
                `https://api.opensea.io/api/v1/assets?asset_contract_address=${contractAddress}&limit=20${chunk}`
            )

            const responses = await axios.all(
              endpoints.map((endpoint) => axios.get(endpoint))
            )

            let tokensData = []
            responses.map((res) => {
              tokensData.push(...res.data.assets)
            })

            return tokensData
          } catch (err) {
            console.log(err)
          }

          function _chunkArray(myArray, chunk_size) {
            var results = []

            while (myArray.length) {
              results.push(myArray.splice(0, chunk_size).join(''))
            }

            return results
          }
        }
        const tokensData = await getAssets(contractAddress, tokenIds)
        console.log(tokensData)

        // Get collection details
        const collectionData = await getCollectionAttributes(contractAddress)
        const collectionAttributes =
          collectionData.included[0].attributes.attributes_stats

        // Get floor prices by trait
        const slug = listingsData.collection

        async function getFloorPrices(slug) {
          try {
            console.log('fetching floor prices...')
            const data = await axios
              .get(`https://api.traitsniper.com/api/projects/${slug}/traits`)
              .then((res) => res.data)

            return data
          } catch (err) {
            console.log(err)
          }
        }

        const traitFloorPrices = await getFloorPrices(slug)
        console.log(traitFloorPrices)

        // Calculate rarity stats for each asset
        const listingsWithDetails = data.listings.map((item) => {
          const tokenDetails = tokensData.tokens.nodes.filter(
            (token) => token.token.tokenId === item.tokenId
          )[0]

          // get each trait rarity
          const newAttributesArr = tokenDetails.token.attributes.map(
            (trait) => {
              const { traitType, value } = trait

              let traitStat
              let rarityScore

              if (!value.includes('Ξ')) {
                traitStat = collectionAttributes.filter(
                  (ref) => ref.trait_type === traitType && ref.value === value
                )[0]

                rarityScore =
                  1 / (parseFloat(traitStat?.rarity_percentage) / 100)
              }

              return {
                ...trait,
                overallCount: traitStat
                  ? traitStat.overall_with_trait_value
                  : null,
                rarityPercentage: traitStat
                  ? traitStat.rarity_percentage
                  : null,
                rarityScore: rarityScore ? Number(rarityScore?.toFixed(2)) : 0,
              }
            }
          )

          // calculate OVERALL rarity score of listing
          const overallRarityScore = newAttributesArr.reduce(
            (prev, current) => {
              return prev + current.rarityScore
            },
            0
          )

          const newTokenObj = {
            ...tokenDetails.token,
            attributes: newAttributesArr,
            rarityScore: overallRarityScore.toFixed(2),
          }

          return { ...item, details: { ...tokenDetails, token: newTokenObj } }
        })

        console.log(listingsWithDetails)

        // Set data state
        setData((prev) => ({
          ...prev,
          newListings: { ...data, listings: listingsWithDetails },
        }))
      } catch (err) {
        console.log(err)
        setError(true)
      } finally {
        setLoading((prev) => ({ ...prev, listings: false }))
      }
    }

    async function getCollectionAttributes(contractAddress) {
      const config = {
        method: 'GET',
        headers: { Authorization: `Bearer ${API_KEYS.rarify}` },
        url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}`,
        params: {
          include: 'token_attributes',
        },
      }
      const data = await axios(config).then((res) => res.data)
      console.log('rarify fetch -- ', data)
      return data
    }

    getNewListings()
  }, [selectedCollection])

  // Fetch trending collections using rarify API
  //   useEffect(() => {
  //     const config = {
  //       method: 'GET',
  //       headers: { Authorization: `Bearer ${API_KEYS.rarify}` },
  //       url: 'https://api.rarify.tech/data/contracts',
  //       params: {
  //         'insights_trends.period': '30d',
  //         include: 'insights_trends',
  //         sort: '-insights_trends.volume_change_percent',
  //         'page[limit]': 3,
  //       },
  //     }

  //     axios(config).then((res) => console.log(res.data))
  //   }, [])

  return { data, loading, error }
}
