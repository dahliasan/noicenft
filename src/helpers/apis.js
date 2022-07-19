import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config

export const API_KEYS = {
  ubiquity: import.meta.env['VITE_UBIQUITY_API_KEY'],
  moralis: import.meta.env['VITE_MORALIS_API_KEY'],
  nftport: import.meta.env['VITE_NFTPORT_API_KEY'],
  module: import.meta.env['VITE_MODULE_API_KEY'],
  rarify: import.meta.env['VITE_RARIFY_API_KEY'],
}

// Rarify API --------------------------------
// docs: https://docs.rarify.tech/reference/#tag/DataContracts

export async function getContractApi(
  contractAddress,
  params = { include: '' }
) {
  try {
    const config = {
      method: 'GET',
      headers: { Authorization: `Bearer ${API_KEYS.rarify}` },
      url: `https://api.rarify.tech/data/contracts${
        contractAddress ? `/ethereum:${contractAddress}` : ''
      }`,
      params: params,
    }
    const data = await axios(config).then((res) => res.data)
    return data
  } catch (err) {
    console.log(err)
  }

  // include
  // string
  // The resources to include in the response; "insights" provides aggregated pricing and trading information for the previous 90 days and "insights_history" provides pricing and trading information for each day in the last 90 days, "token_attributes returns list of attributes that are available for tokens within a contract"

  // Enum: "metadata" "insights" "insights_history" "token_attributes"
  // Example: include=insights,insights_history
}

export async function getContractSmartFloorPriceApi(contractAddress) {
  try {
    const config = {
      method: 'GET',
      headers: { Authorization: `Bearer ${API_KEYS.rarify}` },
      url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/smart-floor-price`,
    }
    const data = await axios(config).then((res) => res.data)
    return data
  } catch (err) {
    console.log(err)
  }
}

export async function getContractInsightsApi(
  contractAddress,
  period = 'all_time'
) {
  const config = {
    method: 'GET',
    headers: { Authorization: `Bearer ${API_KEYS.rarify}` },
    url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/insights/${period}`,
  }
  const data = await axios(config).then((res) => res.data)
  console.log('contract insights -- ', data)
  return data
}

export async function getContractWhalesApi(contractAddress) {
  const config = {
    method: 'GET',
    headers: { Authorization: `Bearer ${API_KEYS.rarify}` },
    url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/whales/`,
  }
  const data = await axios(config).then((res) => res.data)
  console.log('contract whales -- ', data)
  return data
}

// Zora API --------------------------------
import { ZDK, ZDKNetwork, ZDKChain } from '@zoralabs/zdk'

export async function getZDKApi(tokenIdsArray, contractAddress) {
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

// Module API --------------------------------
const module_header = {
  Accept: 'application/json',
  'X-API-KEY': API_KEYS.module,
}

export async function getSearchCollectionsApi(query, options = {}) {
  try {
    const config = {
      method: 'GET',
      url: `https://api.modulenft.xyz/api/v1/central/utilities/search`,
      headers: module_header,
      params: {
        term: query,
        count: 5,
        match: false,
        isVerified: false,
      },
      ...options,
    }

    const data = await axios(config).then((res) => res.data)
    console.log('search collections -- ', data)
    return data
  } catch (err) {
    if (err.name === 'CanceledError') return
    console.log(err)
    throw err
  }
}

export async function getNewListingsApi(
  contractAddress,
  options = {},
  params = {}
) {
  try {
    const config = {
      method: 'GET',
      headers: module_header,
      url: `https://api.modulenft.xyz/api/v1/opensea/listings/new-listings`,
      params: {
        type: contractAddress,
        count: 20,
        currencySymbol: 'ETH',
        ...params,
      },
      ...options,
    }

    const data = await axios(config).then((res) => res.data)

    return data
  } catch (err) {
    if (err.name === 'CanceledError') return
    console.log(err)
    throw err
  }
}

// 'https://api.modulenft.xyz/api/v1/opensea/listings/listingsV2?type=azuki&count=25&offset=0&currencySymbol=ETH&stringTraits=Type%253ASpirit'

//'https://api.modulenft.xyz/api/v1/opensea/listings/listingsV2?type=0xed5af388653567af2f388e6224dc7c4b3241c544&count=25&offset=0&currencySymbol=ETH&stringTraits=Type%253ASpirit'

export async function getNewListingsV2Api(
  contractAddress,
  options = {},
  params = {}
) {
  try {
    const config = {
      method: 'GET',
      headers: module_header,
      url: `https://api.modulenft.xyz/api/v1/opensea/listings/listingsV2`,
      params: {
        type: contractAddress,
        count: 3,
        ...params,
      },
      ...options,
    }

    const data = await axios(config).then((res) => res.data)

    return data
  } catch (err) {
    if (err.name === 'CanceledError') return
    console.log(err)
    throw err
  }
}

// Uniq API ------------------------------
export async function getAssetsApi(contractAddress, tokenIds, options = {}) {
  try {
    console.log('fetching assets...')

    let endpoints = tokenIds.map(
      (id) =>
        `https://api.uniq.cx/api/assets/?contract_address=${contractAddress}&token_id=${id}`
    )

    const responses = await axios.all(
      endpoints.map((endpoint) => axios.get(endpoint, options))
    )

    let tokensData = []
    responses.map((res) => {
      tokensData.push(res.data.data)
    })

    return tokensData
  } catch (err) {
    console.log(err)
    return null
  }
}

// Traitsnper API ------------------------------
export async function getTraitFloorPricesApi(slug) {
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

// Nftport API -------------------------------

export async function getContractSalesStatsApi(contractAddress) {
  try {
    const config = {
      method: 'GET',
      url: `https://api.nftport.xyz/v0/transactions/stats/${contractAddress}`,
      params: { chain: 'ethereum' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_KEYS.nftport,
      },
    }

    const data = await axios(config).then((res) => res.data)

    return data
  } catch (err) {
    console.log(err)
  }
}
