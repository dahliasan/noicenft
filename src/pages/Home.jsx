import { useState, useEffect, useMemo } from 'react'
import useApi from '../hooks/useApi'
import SearchBar from '../components/SearchBar'
import ListingCard from '../components/ListingCard'
import CollectionInfo from '../components/CollectionInfo'

import {
  Container,
  Box,
  Center,
  Spinner,
  Flex,
  VStack,
  Text,
  SimpleGrid,
  Heading,
  Grid,
  GridItem,
  AvatarBadge,
  Avatar,
  Image,
  Link,
} from '@chakra-ui/react'
import { nanoid } from 'nanoid'

export default function Home() {
  const [query, setQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState()
  const [insightsPeriod, setInsightsPeriod] = useState('90d')
  const { loading, error, data } = useApi(
    query,
    selectedCollection,
    insightsPeriod
  )
  const { search, newListings } = data || {}

  console.log('render')

  function handleSearchClick(collection) {
    console.log(
      `--- collection ${collection.name} ${collection.address} is selected!`
    )
    setSelectedCollection(collection)
    setQuery('')
  }

  return (
    <Container maxW="container.xl">
      <VStack mt={10} mb={4} spacing={4}>
        <Heading as="h1" textAlign="center">
          Snipe the latest listings on OpenSea
        </Heading>
        <SearchBar
          query={query}
          handleChange={(e) => setQuery(e.target.value.toLowerCase())}
          searchResults={search}
          handleClick={handleSearchClick}
          loading={loading.search || loading?.listings}
        />
      </VStack>

      {data.collectionStats && (
        <CollectionInfo
          data={data}
          selectedCollection={selectedCollection}
          setInsightsPeriod={setInsightsPeriod}
          insightsPeriod={insightsPeriod}
          insightsIsLoading={loading?.insights}
        />
      )}

      {selectedCollection && (
        <Box>
          <Heading as="h2" size="lg">
            New listings for {selectedCollection.name}
          </Heading>
          <Text fontSize="sm">{`(auto refreshes every 5 min)`}</Text>
        </Box>
      )}
      <Grid
        templateColumns="repeat(auto-fit, minmax(13rem, 1fr))"
        gap={4}
        my={4}
      >
        {newListings?.listings?.map((item) => {
          return (
            <ListingCard
              key={nanoid()}
              data={item}
              totalSupply={selectedCollection.totalSupply}
            />
          )
        })}
      </Grid>
      {!selectedCollection && (
        <VStack>
          <Text mt={10}>This tool was originally inspired by:</Text>
          <Link
            href="https://twitter.com/NFT_GOD/status/1546483299090108418"
            isExternal
          >
            <Image
              width="400px"
              maxWidth="100%"
              border="1px solid black"
              borderRadius="15px"
              src="https://github.com/dahliasan/noicenft/blob/7629199233f47ac8f9b750c4b4b9cc0643216b4d/src/assets/nftgod_tweet.png?raw=true"
            />
          </Link>
        </VStack>
      )}

      {error && <div>error!</div>}
    </Container>
  )
}
