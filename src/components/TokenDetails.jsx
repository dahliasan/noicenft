import React from 'react'
import { nanoid } from 'nanoid'
import {
  Flex,
  VStack,
  Text,
  Tooltip,
  Badge,
  HStack,
  Image,
  Box,
  SimpleGrid,
  Link,
  Button,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { parseDecimals } from '../helpers/formatting'

export default function TokenDetails({ data, basicInfo }) {
  try {
    if (!data?.details) return
    // console.log('TokenDetails component', data)

    const { asset, collection, trait_floors } = data.details || {}
    const { last_sale, token_id } = asset || {}

    let attributesHtml = []
    let highestTraitFloorPrice = 0

    if (trait_floors) {
      // get highest trait floor price

      for (const [trait, info] of Object.entries(trait_floors)) {
        const traitFloorPrice = info.assets_lowest_price[0]?.price / 10 ** 18

        if (traitFloorPrice > highestTraitFloorPrice)
          highestTraitFloorPrice = traitFloorPrice
      }

      for (const [trait, info] of Object.entries(trait_floors)) {
        const [traitType, value] = trait.split(';')
        const rarityPercentage = (info.ratio * 100).toFixed(2)
        const traitFloorPrice = info.assets_lowest_price[0]?.price / 10 ** 18

        attributesHtml.push(
          <VStack
            key={nanoid()}
            align="flex-start"
            borderRadius="10px"
            p={4}
            background={
              traitFloorPrice === highestTraitFloorPrice
                ? 'green.100'
                : 'gray.100'
            }
            spacing={0}
          >
            <Text color="gray.500" casing="uppercase" fontSize="xs">
              {traitType}
            </Text>
            <Tooltip label={value}>
              <Text noOfLines={1}>{value}</Text>
            </Tooltip>
            <Tooltip label={`${rarityPercentage}% have this trait`}>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                {rarityPercentage}% have this trait
              </Text>
            </Tooltip>
            ?
            <Tooltip label="floor price for this trait">
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                Floor: {traitFloorPrice}Ξ
              </Text>
            </Tooltip>
            <Tooltip label="Rarest ranked token for sale with this trait">
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                Rarest rank listed:{' '}
                <Link
                  href={`https://opensea.io/assets/ethereum/${asset.contract_address}/${info.assets_lowest_rank[0].token_id}`}
                  isExternal
                >
                  {info.assets_lowest_rank[0].rank} {' @ '}
                  {(info.assets_lowest_rank[0].price / 10 ** 18).toFixed(0)}Ξ
                  <ExternalLinkIcon mx="2px" />
                </Link>
              </Text>
            </Tooltip>
            <Tooltip
              label={`${info.count_for_sale}/${info.count_total} (${(
                (info.count_for_sale / info.count_total) *
                100
              ).toFixed(0)}%) for sale`}
            >
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                {`${info.count_for_sale}/${info.count_total} (${(
                  (info.count_for_sale / info.count_total) *
                  100
                ).toFixed(0)}%) for sale`}
              </Text>
            </Tooltip>
          </VStack>
        )
      }
    }
    return (
      <Flex direction="column" gap={3}>
        {/* Add image, listed price, buy button, rarity rank, num sales  */}
        <SimpleGrid spacing={3} columns={2}>
          <Image src={basicInfo.image_url} objectFit="contain" rounded="xl" />

          <VStack alignItems="flex-start" spacing={1}>
            <Text textTransform="uppercase" fontSize="xs">
              {collection.name}
            </Text>
            <HStack alignItems="baseline">
              <Text fontSize="3xl" fontWeight="bold">
                {basicInfo.price} {basicInfo.price_symbol}
              </Text>
              <Text fontSize="sm">{basicInfo.price_usd}</Text>
            </HStack>
            <Text fontSize="sm">
              {last_sale ? (
                <>
                  Last sold for {parseDecimals(last_sale.total_price)}
                  {' ' + last_sale.payment_symbol}
                </>
              ) : (
                'No sale history'
              )}
            </Text>

            <Box>
              <Tooltip label={basicInfo.rank_label}>
                <Badge bg={basicInfo.rank_color}>Rank {basicInfo.rank}</Badge>
              </Tooltip>
            </Box>
            <Button>
              <Link
                href={basicInfo.permalink}
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
          </VStack>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={3} w="full" mt={1}>
          {attributesHtml}
        </SimpleGrid>
      </Flex>
    )
  } catch (err) {
    console.log(err)
    return
  }
}
