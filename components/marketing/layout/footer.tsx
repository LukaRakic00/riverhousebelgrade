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
  const logoUrl = '/static/favicons/s25-removebg-preview.png'
  const contactLinks = [
    { href: 'mailto:dunavkuca@gmail.com', label: 'dunavkuca@gmail.com', icon: FiMail },
    { href: 'tel:+381644404044', label: '+381 64 440 4044', icon: FiPhone },
    {
      href: 'https://maps.google.com/?q=Zapadnomoravska%2046a,%20Beograd',
      label: 'Zapadnomoravska 46a, Beograd',
      icon: FiMapPin,
    },
  ]
  const infoLinks = [
    {
      label: 'Booking ponuda',
      href: 'https://www.booking.com/hotel/rs/belgrade-river-house.sr.html?aid=356980&label=gog235jc-10CAsowQFCFGJlbGdyYWRlLXJpdmVyLWhvdXNlSCRYA2jBAYgBAZgBM7gBF8gBDNgBA-gBAfgBAYgCAagCAbgCldLbyAbAAgHSAiQ1ZWJhYjNlMy03NmVkLTQ5ZjAtOTA0OS01ZjViYTc0OTdjMzLYAgHgAgE&sid=8b17b64546e8e62162533a4a6ef0474a&age=5&age=7&dest_id=-74897&dest_type=city&dist=0&group_adults=2&group_children=2&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_age=5&req_age=7&req_children=2&room1=A%2CA%2C5%2C7&sb_price_type=total&sr_order=popularity&srepoch=1763109148&srpvid=60e33c0ba552016c&type=total&ucfs=1&',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/belgrade.river.house/?igsh=cHk2Nnhsa3AyZDg0#',
    },
    { label: 'Galerija', href: '/galerija' },
  { label: 'Rezervacije', href: '#kontakt' },
  ]
  
  return (
    <Box bg="black" color="white" borderTop="1px solid" borderColor="gray.800" {...rest}>
      <Container maxW="container.2xl" px={{ base: 4, md: 8 }} py={{ base: 12, md: 16 }}>
        <SimpleGrid columns={{ base: 1, md: columns }} spacing={{ base: 8, md: 12 }}>
          {/* Logo i opis */}
          <VStack spacing="6" align={{ base: "center", md: "flex-start" }}>
            <Box>
              <Image
                src={logoUrl}
                alt={siteConfig.seo?.title || 'Belgrade River House'}
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
              {contactLinks.map(({ href, label, icon }) => (
                <FooterLink key={href} href={href} display="flex" alignItems="center" gap="3">
                  <Icon as={icon} fontSize="lg" color="gray.400" />
                  <Text>{label}</Text>
                </FooterLink>
              ))}
            </Stack>
          </VStack>

          {/* Social media / linkovi */}
          <VStack spacing="4" align={{ base: "center", md: "flex-start" }}>
            <Text fontSize="lg" fontWeight="500" mb={2}>
              Rezervisi i prati
            </Text>
            <Stack spacing="3" w="100%">
              {infoLinks.map(({ href, label }) => (
                <FooterLink key={href} href={href}>
                  {label}
                </FooterLink>
              ))}
            </Stack>
            <IconButton
              as="a"
              href="https://www.instagram.com/belgrade.river.house/?igsh=cHk2Nnhsa3AyZDg0#"
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
          </VStack>
        </SimpleGrid>
        
        <Divider borderColor="gray.800" mt={{ base: 8, md: 12 }} />
        
        <Flex
          justify="center"
          align="center"
          pt={6}
        >
          <Text fontSize="xs" color="gray.500" textAlign="center">
            © {new Date().getFullYear()} Belgrade River House. Sva prava zadržana.
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
