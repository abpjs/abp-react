import { Center } from '@chakra-ui/react'
import { BsImage } from 'react-icons/bs'

export const ImagePlaceholder = () => (
  <Center w="full" h="full" bg="colorPalette.solid" color="colorPalette.contrast/60">
    <BsImage size="40px" />
  </Center>
)
