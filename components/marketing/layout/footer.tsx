import {
  Box,
  BoxProps,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react'
import { Link, LinkProps } from '@saas-ui/react'
import { FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import Image from 'next/image'

import siteConfig from '#data/config'

export interface FooterProps extends BoxProps {
  columns?: number
}

export const Footer: React.FC<FooterProps> = (props) => {
  const { columns = 3, ...rest } = props
  const logoUrl = 'https://res.cloudinary.com/dvohrn0zf/image/upload/v1762935030/s25-removebg-preview_yquban.png'
  
  return (
    <Box bg="black" color="white" borderTop="1px solid" borderColor="gray.800" {...rest}>
      <Container maxW="container.2xl" px={{ base: 4, md: 8 }} py={{ base: 12, md: 16 }}>
        <SimpleGrid columns={{ base: 1, md: columns }} spacing={{ base: 8, md: 12 }}>
          {/* Logo i opis */}
          <VStack spacing="6" align={{ base: "center", md: "flex-start" }}>
            <Box>
              <Image
                src={logoUrl}
                alt={siteConfig.seo?.title || 'River House Belgrade'}
                width={200}
                height={100}
                style={{ height: 'auto', maxHeight: '100px', width: 'auto' }}
                priority
              />
            </Box>
            <Text fontSize="sm" color="gray.400" maxW="300px" textAlign={{ base: "center", md: "left" }}>
              {siteConfig.seo.description}
            </Text>
          </VStack>

          {/* Kontakt informacije */}
          <VStack spacing="4" align={{ base: "center", md: "flex-start" }}>
            <Text fontSize="lg" fontWeight="500" mb={2}>
              Kontakt
            </Text>
            <Stack spacing="3">
              {siteConfig.footer?.links?.map(({ href, label }) => {
                let icon = FiMail
                if (href.startsWith('tel:')) icon = FiPhone
                if (href.includes('maps.google.com')) icon = FiMapPin
                
                return (
                  <FooterLink key={href} href={href} display="flex" alignItems="center" gap="3">
                    <Icon as={icon} fontSize="lg" color="gray.400" />
                    <Text>{label}</Text>
                  </FooterLink>
                )
              })}
            </Stack>
          </VStack>

          {/* Social media */}
          <VStack spacing="4" align={{ base: "center", md: "flex-start" }}>
            <Text fontSize="lg" fontWeight="500" mb={2}>
              Pratite nas
            </Text>
            <HStack spacing="4">
              <IconButton
                as="a"
                href={siteConfig.footer?.instagramUrl || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                icon={<FiInstagram />}
                size="lg"
                variant="ghost"
                color="gray.400"
                _hover={{
                  color: 'white',
                  bg: 'gray.800',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.2s"
                borderRadius="md"
              />
            </HStack>
          </VStack>
        </SimpleGrid>
        
        <Divider borderColor="gray.800" mt={{ base: 8, md: 12 }} />
        
        <Flex
          justify="center"
          align="center"
          pt={6}
        >
          <Text fontSize="xs" color="gray.500" textAlign="center">
            © {new Date().getFullYear()} River House Belgrade. Sva prava zadržana.
          </Text>
        </Flex>
      </Container>
    </Box>
  )
}

export interface CopyrightProps {
  title?: React.ReactNode
  children: React.ReactNode
}

export const Copyright: React.FC<CopyrightProps> = ({
  title,
  children,
}: CopyrightProps) => {
  let content
  if (title && !children) {
    content = `&copy; ${new Date().getFullYear()} - ${title}`
  }
  return (
    <Text color="muted" fontSize="sm">
      {content || children}
    </Text>
  )
}

export const FooterLink: React.FC<LinkProps> = (props) => {
  const { children, ...rest } = props
  return (
    <Link
      color="gray.400"
      fontSize="sm"
      textDecoration="none"
      _hover={{
        color: 'white',
        transition: 'color .2s ease-in',
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
