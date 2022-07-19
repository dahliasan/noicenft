import React from 'react'
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
import ListingCard from './ListingCard'

export default function ListingCardDrawer({
  data,
  setSelectedToken,
  selectedToken,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  //   const {
  //     tokenId,
  //     eventTimestamp,
  //     image_url,
  //     permalink,
  //     price,
  //     priceInUSD,
  //     priceSymbol,
  //     details,
  //   } = data || {}

  const handleClick = (tokenId) => {
    console.log(tokenId, 'clicked!')
    setSelectedToken(tokenId)
    onOpen()
  }

  return (
    <>
      <ListingCard
        data={data}
        selectedToken={selectedToken}
        handleClick={handleClick}
      />

      <Drawer onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{`drawer header`}</DrawerHeader>
          <DrawerBody>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Consequat nisl vel pretium lectus quam id. Semper quis lectus
              nulla at volutpat diam ut venenatis. Dolor morbi non arcu risus
              quis varius quam quisque. Massa ultricies mi quis hendrerit dolor
              magna eget est lorem. Erat imperdiet sed euismod nisi porta.
              Lectus vestibulum mattis ullamcorper velit.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
