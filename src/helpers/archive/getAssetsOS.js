export default async function getAssetsOS(contractAddress, tokenIds) {
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
