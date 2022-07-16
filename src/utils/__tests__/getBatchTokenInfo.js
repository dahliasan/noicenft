// This MODULE endpoint not working correctly
async function getBatchTokenInfo(tokenIdsArray, contractAddress) {
  let config = createBatchTokenInfoConfig(tokenIdsArray, contractAddress)

  const data = await axios(config).then((res) =>
    console.log('module get tokens -- ', res)
  )
}
