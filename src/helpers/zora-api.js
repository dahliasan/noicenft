import { ZDK, ZDKNetwork, ZDKChain } from '@zoralabs/zdk'

export async function getZoraApi(tokenIdsArray, contractAddress) {
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
