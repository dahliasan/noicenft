import React from 'react'
import { nanoid } from 'nanoid'
import {
  Flex,
  Image,
  Tooltip,
  Tag,
  Text,
  VStack,
  Button,
  Link,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { resolveUrl } from '../helpers/formatting'
import TimeAgo from 'timeago-react'

export default function ListingCard({ data, handleClick, selectedToken }) {
  console.log(data)

  const {
    tokenId,
    eventTimestamp,
    image_url,
    permalink,
    price,
    priceInUSD,
    priceSymbol,
    details,
  } = data || {}

  const { rank } = details?.asset || {}
  const collection = details?.collection.name || {}

  return (
    <Flex
      key={nanoid()}
      justify="space-between"
      border="solid black 2px"
      borderRadius="10px"
      p={3}
      mb={3}
      direction={{ base: 'column', lg: 'row' }}
      gap={4}
      onClick={() => handleClick(tokenId)}
      bg={selectedToken === tokenId ? 'yellow' : 'white'}
    >
      <Image
        src={resolveUrl(image_url)}
        alt={`${collection} token id ${tokenId} nft`}
        objectFit="cover"
        w="auto"
        maxH="100px"
        rounded="lg"
      />

      <Flex direction="column" alignItems="space-evenly" wrap="wrap">
        <Text fontSize={{ base: 'xl' }}>{`${price} ${priceSymbol}`}</Text>
        <Text fontSize="sm">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(priceInUSD)}
        </Text>

        <Tooltip label="rarity rank">
          <Tag mt={2}>Rank {rank}</Tag>
        </Tooltip>
      </Flex>

      <VStack
        ml="auto"
        justify="space-between"
        alignItems={{ base: 'center', lg: 'flex-end' }}
      >
        <Button alignItems="center">
          <Link
            href={permalink}
            _hover={{
              textDecoration: 'none',
            }}
            isExternal
            mr={1}
          >
            Buy on OpenSea
          </Link>
          <ExternalLinkIcon mx="2px" />
        </Button>
        <Text fontSize="sm" mt="auto">
          Listed <TimeAgo datetime={`${eventTimestamp}Z`} />
        </Text>
      </VStack>
    </Flex>
  )
}
