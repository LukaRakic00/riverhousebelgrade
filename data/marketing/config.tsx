import { Button } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { Logo } from './logo'

const siteConfig = {
  logo: Logo,
  seo: {
    title: 'Belgrade River House',
    description: 'Vikendica na vodi — mir, komfor i pogled na reku.',
  },
  termsUrl: '#',
  privacyUrl: '#',
  header: {
    links: [
      {
        id: 'o-nama',
        label: 'O nama',
      },
      {
        id: 'galerija',
        label: 'Galerija',
        href: '/galerija',
      },
      {
        id: 'cenovnik',
        label: 'Cenovnik',
        href: '/cenovnik',
      },
      {
        id: 'kontakt',
        label: 'Kontakt',
      },
    ],
  },
  footer: {
    instagramUrl: 'https://www.instagram.com/kuca.na.dunavu?igsh=cHk2Nnhsa3AyZDg0',
    links: [
      {
        href: 'mailto:info@riverhouse.rs',
        label: 'info@riverhouse.rs',
      },
      {
        href: 'tel:+381601234567',
        label: '+381 60 123 4567',
      },
      {
        href: 'https://www.google.com/maps/search/?api=1&query=Belgrade+River+House',
        label: 'Lokacija (Google Maps)',
      },
    ],
  },
  signup: {
    title: 'Rezerviši svoj boravak',
    features: [
      {
        icon: FiCheck,
        title: 'Brza prijava',
        description: 'Popuni formu, mi se javljamo u najkraćem roku.',
      },
      {
        icon: FiCheck,
        title: 'Fleksibilni termini',
        description: 'Odaberi vikend ili radne dane prema želji.',
      },
      {
        icon: FiCheck,
        title: 'Komfor i pogodnosti',
        description: 'Wi‑Fi, terasa na vodi, moderna kuhinja i više.',
      },
      {
        icon: FiCheck,
        title: 'Top lokacija',
        description: 'U srcu grada, a daleko od gužve.',
      },
    ],
  },
}

export default siteConfig
