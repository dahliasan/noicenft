// TODO:
// Change listing feed component to a single listing card - make the card a drawer

import { useState, useEffect } from 'react'
import useApi from '../hooks/useApi'
import SearchBar from '../components/SearchBar'
import TokenDetails from '../components/TokenDetails'
import ListingCard from '../components/ListingCard'
import {
  Container,
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
  const [selectedCollection, setSelectedCollection] = useState({
    name: '',
    address: '',
  })
  const { loading, error, data } = useApi(query, selectedCollection)
  const { search, newListings } = data || {}

  const [selectedToken, setSelectedToken] = useState('')

  useEffect(() => {
    setSelectedToken('')
  }, [selectedCollection])

  function handleSearchClick(name, contractAddress) {
    console.log(`--- collection ${name} ${contractAddress} is selected!`)
    setSelectedCollection({ name: name, address: contractAddress })
    setQuery('')
  }

  function handleListingClick(tokenId) {
    setSelectedToken(tokenId)
    console.log(tokenId, 'clicked!')
  }

  return (
    <Container maxW="container.xl">
      <SearchBar
        query={query}
        handleChange={(e) => setQuery(e.target.value)}
        searchResults={search}
        handleClick={handleSearchClick}
        loading={loading.search || loading?.listings}
      />

      <Flex my={10} direction={{ base: 'column', lg: 'row' }}>
        <VStack w="full" padding={10} alignItems="flex-start">
          <Heading>New Listings</Heading>
          <Flex
            direction={{ base: 'row', lg: 'column' }}
            wrap={{ base: 'wrap', lg: 'nowrap' }}
            w={{ base: 'auto', lg: 'full' }}
            gap={3}
            alignItems="stretch"
          >
            {newListings?.listings?.map((item) => {
              return (
                <ListingCard
                  key={nanoid()}
                  data={item}
                  handleClick={handleListingClick}
                  selectedToken={selectedToken}
                />
              )
            })}
          </Flex>
        </VStack>

        <VStack
          w="full"
          background="gray.100"
          padding={10}
          alignItems="flex-start"
          borderRadius="15px"
        >
          <Heading>The Deets</Heading>
          {/* Use Stat component */}
          {selectedToken === '' && (
            <Text>Click on a listing to view its details</Text>
          )}

          <TokenDetails
            data={
              newListings?.listings?.filter(
                (item) => item.tokenId === selectedToken
              )[0]
            }
          />
        </VStack>
      </Flex>

      {error && <div>error!</div>}
    </Container>
  )
}
