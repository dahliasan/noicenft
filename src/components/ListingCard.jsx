import React from 'react'
import { nanoid } from 'nanoid'
import {
  Flex,
  Image,
  Tooltip,
  Tag,
  Text,
  VStack,
  HStack,
  Box,
  Button,
  Link,
  Badge,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { resolveUrl } from '../helpers/formatting'
import TimeAgo from 'timeago-react'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import TokenDetails from './TokenDetails'

export default function ListingCard({ data, totalSupply }) {
  try {
    const { isOpen, onOpen, onClose } = useDisclosure()

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

    const { rank, last_sale } = details?.asset || {}
    const collection = details?.collection.name || {}

    const priceInUSD_formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(priceInUSD)

    function handleClick() {
      onOpen()
    }

    // Top 1%, 10%, 50% and bottom 50%
    const rankColors = ['special', 'green.200', 'gray.200', 'red.200']
    const rankLabels = ['top 1%', 'top 10%', 'top 50%', 'bottom 50%']
    const rankPercentile = (rank / totalSupply) * 100
    let rankIndex =
      rankPercentile < 1
        ? 0
        : rankPercentile < 10
        ? 1
        : rankPercentile < 50
        ? 2
        : 3

    // Paperhands rating
    let isPaperhand = false
    if (last_sale) {
      const pnl = price - last_sale.total_price / 10 ** 18
      isPaperhand = pnl < 0
    }

    // create object with key metrics to pass to TokenDetails
    const basicInfo = {
      image_url: resolveUrl(image_url),
      price: price,
      price_symbol: priceSymbol,
      price_usd: priceInUSD_formatted,
      token_id: tokenId,
      rank: rank,
      rank_label: rankLabels[rankIndex],
      rank_color: rankColors[rankIndex],
      permalink: permalink,
    }

    return (
      <>
        <Flex
          key={nanoid()}
          justify="space-between"
          border="solid black 2px"
          borderRadius="10px"
          p={3}
          gap={2}
          direction="column"
          bg={isOpen ? 'yellow' : 'white'}
          onClick={() => handleClick(tokenId)}
        >
          <Image
            src={resolveUrl(image_url)}
            alt={`${collection} token id ${tokenId} nft`}
            objectFit="contain"
            w="200px"
            maxH="200px"
            rounded="xl"
          />

          <HStack>
            <Tooltip label="token id">
              <Badge>#{tokenId}</Badge>
            </Tooltip>
            <Tooltip label={`rarity rank (${rankLabels[rankIndex]})`}>
              <Badge bg={rankColors[rankIndex]}>Rank {rank}</Badge>
            </Tooltip>
            {isPaperhand && (
              <Tooltip label={`selling below cost price`}>
                <Badge bg="gray.900">🧻</Badge>
              </Tooltip>
            )}
          </HStack>

          <HStack alignItems="baseline">
            <Text
              fontSize="xl"
              fontWeight="bold"
            >{`${price} ${priceSymbol}`}</Text>
            <Text fontSize="sm">{priceInUSD_formatted}</Text>
          </HStack>

          <Button>
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
          <Text fontSize="sm" textAlign="center">
            Listed <TimeAgo datetime={`${eventTimestamp}Z`} />
          </Text>
        </Flex>

        <Drawer onClose={onClose} isOpen={isOpen} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Token Id #{tokenId}</DrawerHeader>
            <DrawerBody>
              <TokenDetails data={data} basicInfo={basicInfo} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  } catch (err) {
    console.log(err)
  }
}