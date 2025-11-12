import { chakra, HTMLChakraProps } from '@chakra-ui/react'

export const Logo: React.FC<HTMLChakraProps<'img'>> = (props) => {
  return (
    <chakra.img
      src="https://res.cloudinary.com/dvohrn0zf/image/upload/v1762778172/241_elpdmc.jpg"
      alt="River House Belgrade"
      {...props}
    />
  )
}
