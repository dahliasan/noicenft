const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const axios = require('axios')

const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.json('hi wyd')
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

app.listen(PORT, () => console.log('server is running on port ' + PORT))
