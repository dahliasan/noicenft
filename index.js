const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const axios = require('axios')

const app = express()
app.use(
  cors({
    origin: '*',
  })
)

app.get('/', (req, res) => {
  res.send('hi wyd')
})

app.get('/smart-floor-price', (req, res) => {
  async function getContractSmartFloorPriceApi(contractAddress) {
    try {
      const config = {
        method: 'GET',
        headers: { Authorization: `Bearer ${process.env.VITE_RARIFY_API_KEY}` },
        url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/smart-floor-price`,
      }
      const data = await axios(config).then((res) => res.data)

      //   console.log(data)
      res.json(data)
      //   return data
    } catch (err) {
      console.log(err)
    }
  }

  let contractAddress = req.query.contractAddress
  getContractSmartFloorPriceApi(contractAddress)
})

app.get('/contract-sales-stats', (req, res) => {
  async function getContractSalesStatsApi(contractAddress) {
    try {
      const config = {
        method: 'GET',
        url: `https://api.nftport.xyz/v0/transactions/stats/${contractAddress}`,
        params: { chain: 'ethereum' },
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.VITE_NFTPORT_API_KEY,
        },
      }

      const data = await axios(config).then((res) => res.data)
      console.log(data)
      res.json(data)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  let contractAddress = req.query.contractAddress
  getContractSalesStatsApi(contractAddress)
})

app.listen(PORT, () => console.log('server is running on port ' + PORT))

module.exports = app
