import React from 'react'
import { resolveUrl, shortenString, parseHex } from '../helpers/formatting'
import { Flex, Avatar, Text, Box, Image, Icon, Tooltip } from '@chakra-ui/react'
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react'

import { InfoIcon } from '@chakra-ui/icons'
import { EthIcon } from '../assets/myIcons'

export default function CollectionInfo({ data, selectedCollection }) {
  try {
    console.log(data)
    console.log(selectedCollection)
    console.log(data.collectionStats)

    const { collectionInsights, collectionStats } = data || {}

    // destructure desired infomation

    const { name, address, imageUrl, isVerified, totalSupply } =
      selectedCollection

    let floorPrice = parseHex(collectionStats.smartFloorPrice.attributes.price)
    let floorPricePaymentAsset =
      collectionStats.smartFloorPrice.attributes.payment_asset || {}

    const { traitFloorPrices } = collectionStats || {}
    const insightsOverview = collectionInsights?.included[0].attributes
    const insightsHistory = collectionInsights?.included[1].attributes
    let {
      avg_price,
      max_price,
      min_price,
      period,
      trades,
      unique_buyers,
      volume,
    } = insightsOverview

    console.log(traitFloorPrices, insightsOverview, insightsHistory)

    function EthIcon2() {
      return (
        <Tooltip label="eth">
          <EthIcon boxSize={3} />
        </Tooltip>
      )
    }

    function MyEthStatValue(props) {
      return (
        <Flex alignItems="center" fontSize="2xl">
          <EthIcon2 />
          {props.children}
        </Flex>
      )
    }

    function MyStat(props) {
      return (
        <Flex direction="column" bg="gray.100" p={2} borderRadius="10px">
          <Flex align="baseline">
            <Text fontSize="sm">{props.label}</Text>
            {props.showInfoIcon && (
              <Tooltip label={props.tooltipLabel}>
                <InfoIcon boxSize={'.7rem'} mx={2} />
              </Tooltip>
            )}
          </Flex>

          <Flex alignItems="center" fontSize="2xl">
            {props.showEthIcon && <EthIcon2 />}
            {props.children}
          </Flex>
        </Flex>
      )
    }

    return (
      <Box mb={'4em'}>
        <Flex direction="column" gap={4}>
          <Flex align="center" gap={4}>
            <Avatar size="2xl" src={resolveUrl(imageUrl)} />
            <Flex direction="column">
              <Text fontSize="xl">{name}</Text>
              <Text>{shortenString(address)}</Text>
            </Flex>
          </Flex>

          <Flex p={2} gap={4} wrap="wrap">
            <MyStat
              label="floor price"
              showInfoIcon="true"
              showEthIcon="true"
              tooltipLabel="estimated min price NFT will sell for calculated by an algorithm that ignores outliers and wash trading amongst other factors"
            >
              {floorPrice}
            </MyStat>

            <MyStat label="min price" showEthIcon="true">
              {parseHex(min_price, 18, 0)}
            </MyStat>

            <MyStat label="avg price" showEthIcon="true">
              {parseHex(avg_price, 18, 0)}
            </MyStat>

            <MyStat label="max price" showEthIcon="true">
              {parseHex(max_price, 18, 0)}
            </MyStat>

            <MyStat label="total trades">{trades}</MyStat>
            <MyStat label="total volume" showEthIcon="true">
              {parseHex(volume, 18, 0)}
            </MyStat>

            <MyStat label="unique buyers">{unique_buyers}</MyStat>
          </Flex>
        </Flex>
      </Box>
    )
  } catch (err) {
    console.log(err)
  }
}
