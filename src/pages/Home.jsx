import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
// import { nanoid } from 'nanoid'
import useApi from '../hooks/useApi'
import SearchBar from '../components/SearchBar'
import { nanoid } from 'nanoid'
import { resolveUrl, shortenString } from '../utils/formatting.jsx'
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

    // get nft html
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

      const { attributes, rarityScore: overallRarityScore } = details.token

      const attributesHtml = attributes?.map((item) => {
        let { traitType, value, rarityPercentage, rarityScore } = item || {}

        value = shortenString(value)

        return (
          <div key={nanoid()} className="nft-card--trait">
            <div>{traitType}</div>
            <div className="trait--value">
              {value} {rarityPercentage ? `${rarityPercentage}%` : ''}{' '}
              {rarityPercentage ? `+${rarityScore}` : ''}
            </div>
          </div>
        )
      })

      return (
        <div key={nanoid()} className="nft-card--container">
          <div className="nft-card--image-container">
            <div className="nft-card--image">{resolveUrl(image_url)}</div>
            <div className="nft-card--tokenId">{'#' + tokenId}</div>
            <div className="nft-card--image-overlay">
              <div>{attributesHtml}</div>
              <div>Overall rarity score: {overallRarityScore}</div>
            </div>
          </div>

          <div>{`${price} ${priceSymbol} ($${parseInt(priceInUSD)})`}</div>
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
