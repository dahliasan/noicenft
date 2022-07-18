import React from 'react'
import { nanoid } from 'nanoid'
import {
  Flex,
  VStack,
  Text,
  Tooltip,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react'

export default function TokenDetails({ data }) {
  try {
    if (!data?.details) return
    console.log('TokenDetails component', data)

    const { details } = data
    const { last_sale, token_id } = details.asset || {}

    let attributesHtml = []
    // let highestTraitFloorPrice = 0

    if (details) {
      for (const [trait, data] of Object.entries(details.trait_floors)) {
        // console.log(`${trait}`, data)
        const [traitType, value] = trait.split(';')
        const rarityPercentage = (data.ratio * 100).toFixed(2)
        const traitFloorPrice = data.assets_lowest_price[0]?.price / 10 ** 18

        attributesHtml.push(
          <VStack
            key={nanoid()}
            align="flex-start"
            borderRadius="10px"
            p={4}
            background="white"
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
            <Tooltip label="the floor price for this trait">
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                Floor: {traitFloorPrice}Ξ
              </Text>
            </Tooltip>
          </VStack>
        )

        // get highest trait floor price
        // if (traitFloorPrice > highestTraitFloorPrice)
        //   highestTraitFloorPrice = traitFloorPrice
      }
    }

    return (
      <Flex direction="column" gap={1}>
        <Text fontSize="lg" textTransform="uppercase">
          Token Id #{token_id}
        </Text>
        <Text>
          Last sold for {(last_sale.total_price / 10 ** 18).toFixed(2)}
          {' ' + last_sale.payment_symbol}
        </Text>
        <SimpleGrid columns={3} spacing={3} w="full" mt={3}>
          {attributesHtml}
        </SimpleGrid>
      </Flex>
    )
  } catch (err) {
    console.log(err)
    return
  }
}
