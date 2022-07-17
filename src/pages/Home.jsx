import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import useApi from '../hooks/useApi'
import SearchBar from '../components/SearchBar'
import { nanoid } from 'nanoid'
import { resolveUrl } from '../helpers/formatting.jsx'
import TimeAgo from 'timeago-react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState({
    name: '',
    address: '',
  })
  const { loading, error, data } = useApi(query, selectedCollection)
  const { search, newListings } = data || {}

  function handleSearchClick(name, contractAddress) {
    console.log(`--- collection ${name} ${contractAddress} is selected!`)
    setSelectedCollection({ name: name, address: contractAddress })
    setQuery('')
  }

  function renderListings() {
    const { collection, count, listings, error } = newListings

    // get nft section html
    const listingsHtml = listings.map((item) => {
      const {
        tokenId,
        eventTimestamp,
        image_url,
        permalink,
        price,
        priceInUSD,
        priceSymbol,
        details,
      } = item || {}

      const { rank, score } = details.asset || {}

      // create attributes html
      let attributesHtml = []
      let highestTraitFloorPrice = 0
      for (const [trait, data] of Object.entries(details.trait_floors)) {
        // console.log(`${trait}`, data)
        const [traitType, value] = trait.split(';')
        const rarityPercentage = (data.ratio * 100).toFixed(2)
        const traitFloorPrice = data.assets_lowest_price[0]?.price / 10 ** 18

        attributesHtml.push(
          <div key={nanoid()} className="nft-card--trait">
            <div>{traitType}</div>
            <div className="trait--value">
              {value} {rarityPercentage}%
            </div>
            <div>{traitFloorPrice}Ξ</div>
          </div>
        )

        // get highest trait floor price
        if (traitFloorPrice > highestTraitFloorPrice)
          highestTraitFloorPrice = traitFloorPrice
      }

      // create entire nft card html
      return (
        <div key={nanoid()} className="nft-card--container">
          <div className="nft-card--image-container">
            <div className="nft-card--image">{resolveUrl(image_url)}</div>
            <div className="nft-card--tokenId">{'#' + tokenId}</div>
            <div className="nft-card--image-overlay">
              <div>{attributesHtml}</div>
              <div>Overall rarity score: {Math.round(score)}</div>
              <div>Overall rarity rank: {rank}</div>
            </div>
          </div>

          <div>{`${price} ${priceSymbol} ($${parseInt(priceInUSD)}) ${
            price < highestTraitFloorPrice
              ? '🤑'
              : price > highestTraitFloorPrice
              ? '🧐'
              : ''
          }`}</div>
          <div>
            Listed <TimeAgo datetime={`${eventTimestamp}Z`} />
          </div>
          <a href={permalink} target="_blank">
            Buy on OpenSea
          </a>
        </div>
      )
    })

    return (
      <>
        <div className="collection-nfts--container">{listingsHtml}</div>
      </>
    )
  }

  return (
    <>
      <SearchBar
        query={query}
        handleChange={(e) => setQuery(e.target.value)}
        searchResults={search}
        handleClick={handleSearchClick}
        loading={loading.search}
      />

      <div className="listings--container">
        {loading?.listings && <div>loading...</div>}
        {newListings && renderListings()}
      </div>

      {error && <div>error!</div>}
    </>
  )
}
