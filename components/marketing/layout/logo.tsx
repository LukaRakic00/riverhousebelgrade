import { Box, Flex, Heading, Text, VisuallyHidden } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import Image from 'next/image'

import * as React from 'react'

import siteConfig from '#data/config'

export interface LogoProps {
  href?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const Logo = ({ href = '/', onClick }: LogoProps) => {
  const logoUrl = '/static/favicons/s25-removebg-preview.png'
  
  const logo = (
    <Image
      src={logoUrl}
      alt={siteConfig.seo?.title || 'Belgrade River House'}
      width={180}
      height={90}
      style={{ height: 'auto', maxHeight: '90px', width: 'auto' }}
      priority
    />
    )

  return (
    <Flex 
      h={{ base: 'auto', md: '20' }}
      minH={{ base: 'auto', md: '20' }}
      flexShrink="0" 
      alignItems="center"
      flexDirection={{ base: 'column', md: 'row' }}
      gap={{ base: 2, md: 0 }}
      justifyContent="center"
    >
      <Link
        href={href}
        display="flex"
        p="1"
        borderRadius="sm"
        onClick={onClick}
      >
        {logo}
        <VisuallyHidden>{siteConfig.seo?.title}</VisuallyHidden>
      </Link>
      <Text
        fontSize={{ base: "xs", sm: "sm" }}
        color="gray.300"
        fontWeight="400"
        letterSpacing="0.05em"
        textAlign="center"
        display={{ base: 'block', md: 'none' }}
        mt={1}
        lineHeight="1.4"
        opacity={0.9}
        textTransform="uppercase"
      >
        Privatni bazen i relaksacija
      </Text>
    </Flex>
  )
}
