import React from 'react'
import { nanoid } from 'nanoid'
import {
  resolveUrl,
  shortenString,
  parseHex,
  formatNumber,
} from '../helpers/formatting'
import {
  Flex,
  Avatar,
  Text,
  Box,
  Image,
  Icon,
  Tooltip,
  SimpleGrid,
  Grid,
} from '@chakra-ui/react'

import { InfoIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { EthIcon } from '../assets/myIcons'

import {
  ScatterPlot,
  LineChart,
  LineSeries,
  ChartZoomPan,
  LinearYAxis,
} from 'reaviz'

export default function CollectionInfo({ data, selectedCollection }) {
  try {
    console.log(data)
    console.log(selectedCollection)

    const { collectionInsights, collectionStats } = data || {}

    // destructure desired infomation

    const { name, address, imageUrl, isVerified, totalSupply } =
      selectedCollection

    let smartFloorPrice = formatNumber(
      parseHex(collectionStats.smartFloorPrice.attributes.price),
      { maximumFractionDigits: 2 }
    )
    let floorPricePaymentAsset =
      collectionStats.smartFloorPrice.attributes.payment_asset || {}

    const { traitFloorPrices, salesStats } = collectionStats || {}
    const insightsOverview = collectionInsights?.included.filter(
      (item) => item.type === 'insights-overview'
    )[0].attributes
    const insightsHistory = collectionInsights?.included.filter(
      (item) => item.type === 'insights-history'
    )[0].attributes

    let {
      avg_price,
      max_price,
      min_price,
      period,
      trades,
      unique_buyers,
      volume,
    } = insightsOverview

    let {
      floor_price,
      floor_price_historic_one_day,
      floor_price_historic_seven_day,
      floor_price_historic_thirty_day,
      market_cap,
      num_owners,
      one_day_average_price,
      one_day_change,
      one_day_sales,
      one_day_volume,
      seven_day_average_price,
      seven_day_change,
      seven_day_sales,
      seven_day_volume,
      thirty_day_average_price,
      thirty_day_change,
      thirty_day_sales,
      thirty_day_volume,
      total_minted,
      total_sales,
      total_supply,
      total_volume,
    } = salesStats

    console.log('trait floor prices -- ', traitFloorPrices)
    console.log('sales stats -- ', salesStats)
    console.log('insights overview -- ', insightsOverview)
    console.log('insights history -- ', insightsHistory)

    // Prepare historical data for plotting
    let historicalData = []
    insightsHistory.history.map((row) => {
      historicalData.push({
        ...row,
        avg_price: Number(parseHex(row.avg_price)),
        max_price: Number(parseHex(row.max_price)),
        min_price: Number(parseHex(row.min_price)),
        time: new Date(row.time),
        volume: parseHex(row.volume),
      })
    })

    console.log('prepared historical data', historicalData)

    let plotData = [
      {
        key: 'max price',
        data: [],
      },
      {
        key: 'avg price',
        data: [],
      },
      {
        key: 'min price',
        data: [],
      },
    ]

    historicalData.map((row) => {
      plotData[0].data.push({
        key: row.time,
        data: row.max_price,
      })

      plotData[1].data.push({
        key: row.time,
        data: row.avg_price,
      })

      plotData[2].data.push({
        key: row.time,
        data: row.min_price,
      })
    })

    console.log(plotData)

    // Test Realviz package
    const MyChart = () => (
      <LineChart
        height={300}
        width={'auto'}
        data={plotData}
        series={<LineSeries type="grouped" />}
        zoomPan={<ChartZoomPan />}
      />
    )

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

          <MyChart />

          <Flex p={2} gap={4} wrap="wrap" alignItems="flex-start">
            <MyGroupStatV2
              label="floor price"
              showEthIcon="true"
              statLabels={['smart', 'now', '1d', '7d', '30d']}
              statsByPeriods={[
                {
                  value: smartFloorPrice,
                  tooltipLabel:
                    'estimated min price NFT will sell for calculated by an algorithm that ignores outliers and wash trading amongst other factors',
                },
                {
                  value: formatNumber(floor_price, {
                    maximumFractionDigits: 2,
                  }),
                },
                {
                  value:
                    floor_price_historic_one_day &&
                    formatNumber(floor_price_historic_one_day, {
                      maximumFractionDigits: 2,
                    }),
                },
                {
                  value:
                    floor_price_historic_seven_day &&
                    formatNumber(floor_price_historic_seven_day, {
                      maximumFractionDigits: 2,
                    }),
                },
                {
                  value:
                    floor_price_historic_thirty_day &&
                    formatNumber(floor_price_historic_thirty_day, {
                      maximumFractionDigits: 2,
                    }),
                },
              ]}
            />

            <MyGroupStatV2
              label="avg sales price"
              showEthIcon="true"
              statLabels={['1d', '7d', '30d', 'all time']}
              statsByPeriods={[
                {
                  value: formatNumber(one_day_average_price),
                },
                {
                  value: formatNumber(seven_day_average_price),
                },
                {
                  value: formatNumber(thirty_day_average_price),
                },
                {
                  value: formatNumber(parseHex(avg_price, 18, 2)),
                },
              ]}
            />

            <MyGroupStatV2
              label="num sales"
              statLabels={['1d', '7d', '30d', 'total']}
              statsByPeriods={[
                {
                  value: formatNumber(one_day_sales),
                },
                {
                  value: formatNumber(seven_day_sales),
                },
                {
                  value: formatNumber(thirty_day_sales),
                },
                {
                  value: formatNumber(total_sales),
                },
              ]}
            />

            <MyGroupStatV2
              label="sales volume"
              showEthIcon="true"
              statLabels={['1d', '7d', '30d', 'total']}
              statsByPeriods={[
                {
                  value: formatNumber(one_day_volume),
                  change: one_day_change,
                },
                {
                  value: formatNumber(seven_day_volume),
                  change: seven_day_change,
                },
                {
                  value: formatNumber(thirty_day_volume),
                  change: thirty_day_change,
                },
                {
                  value: formatNumber(total_volume),
                },
              ]}
            />
            <MyStat label="marketcap" showEthIcon="true">
              {formatNumber(market_cap)}
            </MyStat>

            <MyStat label="total supply">{total_supply}</MyStat>
            <MyStat label="unique owners">
              {formatNumber(num_owners)}{' '}
              {`(${((num_owners / total_supply) * 100).toFixed(0)}%)`}
            </MyStat>
          </Flex>
        </Flex>
      </Box>
    )
  } catch (err) {
    console.log(err)
  }
}

function EthIcon2(props) {
  return (
    <Tooltip label="eth">
      <EthIcon boxSize={props.size || 3} />
    </Tooltip>
  )
}

function MyStat(props) {
  return (
    <Flex direction="column" bg="gray.100" p={2} borderRadius="10px">
      <Flex align="baseline">
        <Text textTransform="uppercase" letterSpacing=".5px" fontSize="sm">
          {props.label}
        </Text>
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

function MyGroupStat(props) {
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

      {props.statsByPeriods && (
        <Grid
          templateColumns="repeat(autofit, 1fr)"
          templateRows="repeat(2, auto)"
          autoFlow="column"
          gap="1px 5px"
        >
          {props.statsByPeriods.map((period, index) => {
            if (!period.value) return

            return (
              <>
                {period.tooltipLabel ? (
                  <Tooltip label={period.tooltipLabel} key={nanoid()}>
                    <Text fontSize="xs">{props.statLabels[index]}</Text>
                  </Tooltip>
                ) : (
                  <Text fontSize="xs" key={nanoid()}>
                    {props.statLabels[index]}
                  </Text>
                )}
                <Flex align="baseline " gap={0.5} key={nanoid()}>
                  <Text fontSize="xs"> {period.value} </Text>
                  {period.change && (
                    <Tooltip label={`change = ${period.change}`}>
                      {period.change > 0 ? (
                        <TriangleUpIcon boxSize={2} color="green.500" />
                      ) : (
                        <TriangleDownIcon boxSize={2} color="red.500" />
                      )}
                    </Tooltip>
                  )}
                </Flex>
              </>
            )
          })}
        </Grid>
      )}
    </Flex>
  )
}

function MyGroupStatV2(props) {
  return (
    <Flex direction="column" bg="gray.100" p={2} borderRadius="10px" gap={1}>
      <Flex align="baseline" gap={2}>
        <Text textTransform="uppercase" letterSpacing=".5px" fontSize="sm">
          {props.label}
        </Text>
        {props.showEthIcon && <EthIcon2 size={3} />}

        {props.showInfoIcon && (
          <Tooltip label={props.tooltipLabel}>
            <InfoIcon boxSize={'.7rem'} mx={2} />
          </Tooltip>
        )}
      </Flex>

      {props.statsByPeriods && (
        <Flex wrap="wrap" gap="1rem 2rem">
          {props.statsByPeriods.map((period, index) => {
            if (!period.value) return

            return (
              <Flex direction="column" key={nanoid()}>
                {period.tooltipLabel ? (
                  <Tooltip label={period.tooltipLabel}>
                    <Flex alignItems="baseline" gap={1}>
                      <Text fontSize="sm">{props.statLabels[index]}</Text>
                      <InfoIcon boxSize={'.5rem'} />
                    </Flex>
                  </Tooltip>
                ) : (
                  <Text fontSize="sm">{props.statLabels[index]}</Text>
                )}
                <Flex align="baseline " gap={1}>
                  <Text fontSize="2xl">{period.value}</Text>

                  {period.change && (
                    <Tooltip label={`change = ${formatNumber(period.change)}`}>
                      {period.change > 0 ? (
                        <TriangleUpIcon boxSize={2.5} color="green.500" />
                      ) : (
                        <TriangleDownIcon boxSize={2.5} color="red.500" />
                      )}
                    </Tooltip>
                  )}
                </Flex>
              </Flex>
            )
          })}
        </Flex>
      )}
    </Flex>
  )
}
