import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  createSearchCollectionConfig,
  createNewListingsConfig,
  createBatchTokenInfoConfig,
  API_KEYS,
} from '../utils/api.js'
import { ZDK, ZDKNetwork, ZDKChain } from '@zoralabs/zdk'

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
    console.log('get new listings from collection...')

    if (selectedCollection.address === '' || !selectedCollection.address) return // ignore the first render

    async function getNewListings() {
      try {
        setLoading((prev) => ({ ...prev, listings: true }))
        setError(false)

        let contractAddress = selectedCollection.address
        let config = createNewListingsConfig(contractAddress)

        const data = await axios(config).then((res) => res.data)

        console.log('-- new listings:', data)

        const tokenIds = data.listings.map((item) => item.tokenId)

        // getBatchTokenInfo(tokenIds, contractAddress)
        const tokensData = await getZoraApi(tokenIds, contractAddress)
        const collectionData = await getCollectionAttributes(contractAddress)
        const collectionAttributes =
          collectionData.included[0].attributes.attributes_stats

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

    // This MODULE endpoint not working correctly
    // async function getBatchTokenInfo(tokenIdsArray, contractAddress) {
    //   let config = createBatchTokenInfoConfig(tokenIdsArray, contractAddress)

    //   const data = await axios(config).then((res) =>
    //     console.log('module get tokens -- ', res)
    //   )
    // }

    async function getZoraApi(tokenIdsArray, contractAddress) {
      try {
        const networkInfo = {
          network: ZDKNetwork.Ethereum,
          chain: ZDKChain.Mainnet,
        }

        const API_ENDPOINT = 'https://api.zora.co/graphql'

        const args = {
          endPoint: API_ENDPOINT,
          networks: [networkInfo],
        }

        const zdk = new ZDK(args)

        let tokenArgs = tokenIdsArray.map((item) => ({
          address: contractAddress,
          tokenId: item,
        }))

        const tokensData = await zdk.tokens({
          where: { tokens: tokenArgs },
          includeFullDetails: true,
          pagination: { limit: 100 },
        })

        console.log('ZDK query -- ', tokensData)

        // const collectionTraits = await zdk.aggregateAttributes({
        //   where: { collectionAddresses: contractAddress },
        // })

        return tokensData
      } catch (err) {
        console.log(err)
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
