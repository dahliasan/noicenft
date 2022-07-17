import React from 'react'
import { nanoid } from 'nanoid'
import SearchResultCard from './SearchResultCard.jsx'
import {
  Box,
  Container,
  Input,
  Spinner,
  VStack,
  Stack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'

import { SearchIcon } from '@chakra-ui/icons'

export default function SearchBar(props) {
  const { query, handleChange, searchResults, handleClick, loading } = props

  return (
    <Container>
      <Stack>
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
          <Input
            placeholder="search for a collection"
            value={query}
            onChange={handleChange}
          />
          <InputRightElement children={loading && <Spinner size="xs" />} />
        </InputGroup>

        <Box pos="relative">
          <Box pos="absolute" zIndex="dropdown" w="100%">
            {searchResults?.collections.map((collection) => {
              return (
                <SearchResultCard
                  key={nanoid()}
                  collection={collection}
                  handleClick={handleClick}
                />
              )
            })}
          </Box>
        </Box>
      </Stack>
    </Container>
  )
}
