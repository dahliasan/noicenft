import { useState } from 'react'
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
  Stack,
  Checkbox,
  CheckboxGroup,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  ButtonGroup,
  Button,
  Spinner,
} from '@chakra-ui/react'

import { InfoIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { EthIcon } from '../assets/myIcons'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RcTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  BarChart,
} from 'recharts'
import moment from 'moment'

export default function CollectionInfo({
  data,
  selectedCollection,
  setInsightsPeriod,
  insightsPeriod,
  insightsIsLoading,
}) {
  try {
    const [checkedItems, setCheckedItems] = useState([
      'min_price',
      'avg_price',
      'volume',
    ])
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
        max_price: Number(parseHex(row.max_price)),
        avg_price: Number(parseHex(row.avg_price)),
        min_price: Number(parseHex(row.min_price)),
        time: row.time,
        volume: Number(parseHex(row.volume)),
      })
    })

    console.log('prepared historical data', historicalData)

    function MyChart() {
      const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <Box
              bg="#fff"
              borderRadius="15px"
              border="1px solid black"
              p="10px"
            >
              <Text>{moment.utc(label).format('D MMM YYYY')}</Text>
              {Object.keys(payload[0].payload).map((key) => {
                if (key === 'time') return
                return (
                  <Flex justifyContent="space-between">
                    <Text fontSize="sm">{key}</Text>
                    <Text fontSize="sm" pl="1em">
                      {' '}
                      {payload[0].payload[key]}
                    </Text>
                  </Flex>
                )
              })}
            </Box>
          )
        }

        return null
      }

      // const CustomizedDot = (props) => {
      //   const { cx, cy, stroke, payload, value } = props

      //   if (payload.trades / payload.unique_buyers > 1)
      //     return (
      //       <circle
      //         r="3"
      //         type="monotone"
      //         stroke="#000"
      //         // stroke-width="1"
      //         fill="#FD5200"
      //         cx={cx}
      //         cy={cy}
      //       ></circle>
      //     )

      // }

      const handleChange = (e) => {
        try {
          const { value } = e.target

          // toggle item in checked items array
          if (checkedItems.includes(value)) {
            const index = checkedItems.indexOf(value)
            console.log(index)
            let array = [...checkedItems]
            array.splice(index, 1)
            setCheckedItems(array)
          } else {
            setCheckedItems((prevArray) => {
              return [...prevArray, value]
            })
          }
        } catch (err) {
          console.log(err)
        }
      }

      const handleButtonClick = (e) => {
        setInsightsPeriod(e.target.value)
      }

      const isButtonActive = (value) => value === insightsPeriod

      return (
        <Flex direction="column" gap={5}>
          <ButtonGroup variant="outline" spacing={3} size="xs">
            <Button
              value="7d"
              isActive={isButtonActive('7d')}
              onClick={handleButtonClick}
            >
              7d
            </Button>
            <Button
              value="30d"
              isActive={isButtonActive('30d')}
              onClick={handleButtonClick}
            >
              30d
            </Button>
            <Button
              value="90d"
              isActive={isButtonActive('90d')}
              onClick={handleButtonClick}
            >
              90d
            </Button>
            <Button
              value="365d"
              isActive={isButtonActive('365d')}
              onClick={handleButtonClick}
            >
              365d
            </Button>
            <Button
              value="all_time"
              isActive={isButtonActive('all_time')}
              onClick={handleButtonClick}
            >
              all time
            </Button>
          </ButtonGroup>
          <CheckboxGroup
            size="sm"
            defaultValue={checkedItems}
            value={checkedItems}
          >
            <Flex gap={5}>
              <Checkbox value="min_price" onChange={handleChange}>
                min price
              </Checkbox>
              <Checkbox value="avg_price" onChange={handleChange}>
                avg price
              </Checkbox>
              <Checkbox value="max_price" onChange={handleChange}>
                max price
              </Checkbox>
              <Checkbox value="volume" onChange={handleChange}>
                volume
              </Checkbox>
              <Checkbox value="trades" onChange={handleChange}>
                trades
              </Checkbox>
            </Flex>
          </CheckboxGroup>

          {insightsIsLoading ? (
            <Flex justifyContent="center" p={10}>
              <Spinner thickness={4} />
            </Flex>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart
                data={historicalData}
                margin={{ top: 10, right: 50, left: 0, bottom: 10 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis
                  dataKey="time"
                  padding={{ left: 30, right: 30 }}
                  tickFormatter={(v) => moment.utc(v).format('D/M')}
                />
                <YAxis orientation="left" padding={{ bottom: 30 }} />
                <YAxis yAxisId="right" orientation="right" hide={true} />
                <RcTooltip
                  labelFormatter={(v) => moment.utc(v).format('D MMM YYYY')}
                  content={<CustomTooltip />}
                />
                <Legend />

                {checkedItems.includes('volume') && (
                  <Bar
                    barSize={10}
                    yAxisId="right"
                    dataKey="volume"
                    style={{ opacity: 0.5 }}
                    fill="#00CFC1"
                  />
                )}

                {checkedItems.includes('trades') && (
                  <Bar
                    barSize={10}
                    yAxisId="right"
                    dataKey="trades"
                    style={{ opacity: 0.5 }}
                    fill="#FD5200"
                  />
                )}

                {checkedItems.includes('avg_price') && (
                  <Line
                    dot={false}
                    type="monotone"
                    dataKey="avg_price"
                    stroke="#000"
                    strokeWidth={3}
                  />
                )}
                {checkedItems.includes('min_price') && (
                  <Line
                    dot={false}
                    type="monotone"
                    dataKey="min_price"
                    stroke="#000"
                    strokeWidth={2}
                    strokeDasharray="9 3"
                  />
                )}

                {checkedItems.includes('max_price') && (
                  <Line
                    dot={false}
                    type="monotone"
                    dataKey="max_price"
                    stroke="#000"
                    strokeWidth={2}
                    strokeDasharray="9 3"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          )}
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

          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Text textTransform="uppercase" letterSpacing="1px">
                    Sales History
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <MyChart />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
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
