import { Box, Flex, Heading, VisuallyHidden } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import Image from 'next/image'

import * as React from 'react'

import siteConfig from '#data/config'

export interface LogoProps {
  href?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const Logo = ({ href = '/', onClick }: LogoProps) => {
  const logoUrl = 'https://res.cloudinary.com/dvohrn0zf/image/upload/v1762935030/s25-removebg-preview_yquban.png'
  
  const logo = (
    <Image
      src={logoUrl}
      alt={siteConfig.seo?.title || 'River House Belgrade'}
      width={180}
      height={90}
      style={{ height: 'auto', maxHeight: '90px', width: 'auto' }}
      priority
    />
    )

  return (
    <Flex h="20" flexShrink="0" alignItems="center">
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
    </Flex>
  )
}
