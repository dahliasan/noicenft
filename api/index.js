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

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.send('hi wyd')
})

// RARIFY API -----------------------------
app.get('/api/smart-floor-price', (req, res) => {
  async function getContractSmartFloorPriceApi(contractAddress) {
    try {
      console.log('fetching floor price...')
      const config = {
        method: 'GET',
        headers: { Authorization: `Bearer ${process.env.VITE_RARIFY_API_KEY}` },
        url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/smart-floor-price`,
      }
      const data = await axios(config).then((res) => res.data)

      res.json(data)
      //   return data
    } catch (err) {
      console.log(err)
    }
  }

  let contractAddress = req.query.contractAddress
  // res.send(contractAddress)
  getContractSmartFloorPriceApi(contractAddress)
})

app.get('/api/contract-insights', (req, res) => {
  async function getContractInsightsApi(contractAddress, period = 'all_time') {
    try {
      const config = {
        method: 'GET',
        headers: { Authorization: `Bearer ${process.env.VITE_RARIFY_API_KEY}` },
        url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/insights/${period}`,
      }
      const data = await axios(config).then((res) => res.data)
      res.json(data)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  let contractAddress = req.query.contractAddress
  getContractInsightsApi(contractAddress)
})

app.get('/api/contract-whales', (req, res) => {
  async function getContractWhalesApi(contractAddress) {
    try {
      const config = {
        method: 'GET',
        headers: { Authorization: `Bearer ${process.env.VITE_RARIFY_API_KEY}` },
        url: `https://api.rarify.tech/data/contracts/ethereum:${contractAddress}/whales/`,
      }

      const data = await axios(config).then((res) => res.data)
      res.json(data)
    } catch (err) {
      console.log(err)
    }
  }

  let contractAddress = req.query.contractAddress
  getContractWhalesApi(contractAddress)
})

// NFTPORT API --------------------------------

app.get('/api/contract-sales-stats', (req, res) => {
  async function getContractSalesStatsApi(contractAddress) {
    try {
      console.log('fetching contact sales stats...')
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
  // res.send(contractAddress)
  getContractSalesStatsApi(contractAddress)
})

app.listen(PORT, () => console.log('server is running on port ' + PORT))

module.exports = app
