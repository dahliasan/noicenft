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
  Heading,
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
      <VStack my={10} spacing={4}>
        <Heading textAlign="center">
          Snipe the latest listings on OpenSea
        </Heading>
        <SearchBar
          query={query}
          handleChange={(e) => setQuery(e.target.value)}
          searchResults={search}
          handleClick={handleSearchClick}
          loading={loading.search || loading?.listings}
        />
      </VStack>

      <VStack padding={10} alignItems="flex-start">
        {selectedCollection && (
          <Heading>New listings for {selectedCollection.name}</Heading>
        )}
        <Flex wrap="wrap" gap={5}>
          {newListings?.listings?.map((item) => {
            return (
              <ListingCard
                key={nanoid()}
                data={item}
                totalSupply={selectedCollection.totalSupply}
              />
            )
          })}
        </Flex>
      </VStack>

      {error && <div>error!</div>}
    </Container>
  )
}
