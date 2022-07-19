// TODO:
// Change listing feed component to a single listing card - make the card a drawer

import { useState, useEffect, useMemo } from 'react'
import useApi from '../hooks/useApi'
import SearchBar from '../components/SearchBar'

import ListingCard from '../components/ListingCard'

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
} from '@chakra-ui/react'
import { nanoid } from 'nanoid'

export default function Home() {
  const [query, setQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState()
  const { loading, error, data } = useApi(query, selectedCollection)
  const { search, newListings } = data || {}

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
        <Heading textAlign="center">
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

      <VStack px={4} alignItems="flex-start">
        {selectedCollection && (
          <Box>
            <Heading>New listings for {selectedCollection.name}</Heading>
            <Text fontSize="sm">{`(auto refreshes every 5 min)`}</Text>
          </Box>
        )}
        <Grid
          templateColumns="repeat(auto-fit, minmax(12rem, 1fr))"
          gap={4}
          // autoColumns="min-content"
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
      </VStack>

      {error && <div>error!</div>}
    </Container>
  )
}
