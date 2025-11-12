import { HStack } from '@chakra-ui/react'
import { useDisclosure, useUpdateEffect } from '@chakra-ui/react'
import { useScrollSpy } from 'hooks/use-scrollspy'
import { usePathname, useRouter } from 'next/navigation'

import * as React from 'react'

import { MobileNavButton } from '#components/mobile-nav'
import { MobileNavContent } from '#components/mobile-nav'
import { NavLink } from '#components/nav-link'
import siteConfig from '#data/config'

interface NavigationProps {
  position?: 'left' | 'right'
}

const Navigation: React.FC<NavigationProps> = ({ position = 'left' }) => {
  const mobileNav = useDisclosure()
  const router = useRouter()
  const path = usePathname()
  const activeId = useScrollSpy(
    siteConfig.header.links
      .filter(({ id }) => id)
      .map(({ id }) => `[id="${id}"]`),
    {
      threshold: 0.75,
    },
  )

  const mobileNavBtnRef = React.useRef<HTMLButtonElement>()

  useUpdateEffect(() => {
    mobileNavBtnRef.current?.focus()
  }, [mobileNav.isOpen])

  // Levo: samo "O nama"
  // Desno: "Galerija" i "Kontakt"
  const leftLinks = siteConfig.header.links.filter(({ id }) => id === 'benefits')
  const rightLinks = siteConfig.header.links.filter(({ id }) => id === 'galerija' || id === 'kontakt')
  const linksToShow = position === 'left' ? leftLinks : rightLinks

  return (
    <>
      <HStack spacing="6" flexShrink={0} display={['none', null, 'flex']}>
        {linksToShow.map((link, i) => {
        const { id, label } = link;
        const href = 'href' in link ? link.href : `/#${id}`;
        // Za linkove koji vode na druge rute (ne anchor), ne koristi scroll spy
        const isExternalRoute = href && !href.startsWith('#');
        return (
          <NavLink
            href={href}
            key={i}
            isActive={isExternalRoute ? path === href : !!(id && activeId === id)}
              fontSize="lg"
              fontWeight="semibold"
              lineHeight="2rem"
          >
            {label}
          </NavLink>
        )
      })}
      </HStack>

      {position === 'right' && (
        <>
      <MobileNavButton
        ref={mobileNavBtnRef}
        aria-label="Open Menu"
        onClick={mobileNav.onOpen}
            display={['flex', null, 'none']}
      />
      <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} />
        </>
      )}
    </>
  )
}

export default Navigation
