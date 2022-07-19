import React from 'react'
import { HStack, Flex, Spacer, Text, Image } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

export default function SearchResultCard(props) {
  const { collection, handleClick } = props

  const { address, name, imageUrl, totalSupply, isVerified } = collection

  if (!imageUrl) return

  return (
    <Flex
      align="center"
      border="2px solid"
      borderColor="gray.900"
      borderRadius="10px"
      my="2"
      p="3"
      cursor="pointer"
      background="white"
      _hover={{
        background: 'yellow',
      }}
      onClick={() => {
        handleClick(collection)
      }}
    >
      <HStack spacing="2">
        <Image
          borderRadius="full"
          boxSize="50px"
          src={`${imageUrl}`}
          alt={`${name} logo`}
        />

        <Text>{name}</Text>
        {isVerified && <CheckCircleIcon boxSize="12px" />}
      </HStack>
      <Spacer />
      <Text size="sm">{totalSupply}</Text>
    </Flex>
  )
}

// ;<div
//   className="search-result--container"
//   onClick={() => {
//     handleClick(name, address)
//   }}
// >
//   <img className="search-result--logo" src={`${imageUrl}`} />

//   <div className="search-result--name">{name}</div>
//   <div className="search-result--total-supply">{totalSupply}</div>
// </div>
