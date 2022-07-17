// docs: https://docs.rarify.tech/reference/#tag/DataContracts

import { API_KEYS } from './api'

export async function getContract(contractAddress, params = { include: '' }) {
  const config = {
    method: 'GET',
    headers: { Authorization: `Bearer ${API_KEYS.rarify}` },
    url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/`,
    params: params,
  }
  const data = await axios(config).then((res) => res.data)
  console.log('contract -- ', data)
  return data

  // include
  // string
  // The resources to include in the response; "insights" provides aggregated pricing and trading information for the previous 90 days and "insights_history" provides pricing and trading information for each day in the last 90 days, "token_attributes returns list of attributes that are available for tokens within a contract"

  // Enum: "metadata" "insights" "insights_history" "token_attributes"
  // Example: include=insights,insights_history
}

export async function getContractSmartFloorPrice(contractAddress) {
  const config = {
    method: 'GET',
    headers: { Authorization: `Bearer ${API_KEYS.rarify}` },
    url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/smart-floor-price/`,
  }
  const data = await axios(config).then((res) => res.data)
  console.log('smart floor price --  ', data)
  return data
}

export async function getContractInsights(contractAddress, period) {
  const config = {
    method: 'GET',
    headers: { Authorization: `Bearer ${API_KEYS.rarify}` },
    url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/insights/${period}`,
  }
  const data = await axios(config).then((res) => res.data)
  console.log('contract insights -- ', data)
  return data
}

export async function getContractWhales(contractAddress) {
  const config = {
    method: 'GET',
    headers: { Authorization: `Bearer ${API_KEYS.rarify}` },
    url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/whales/`,
  }
  const data = await axios(config).then((res) => res.data)
  console.log('contract whales -- ', data)
  return data
}
