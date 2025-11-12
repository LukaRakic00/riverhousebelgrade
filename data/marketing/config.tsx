import { Button } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { Logo } from './logo'

const siteConfig = {
  logo: Logo,
  seo: {
    title: 'River House Belgrade',
    description: 'Vikendica na vodi — mir, komfor i pogled na reku.',
  },
  termsUrl: '#',
  privacyUrl: '#',
  header: {
    links: [
      {
        id: 'benefits',
        label: 'O nama',
      },
      {
        id: 'galerija',
        label: 'Galerija',
      },
      {
        id: 'kontakt',
        label: 'Kontakt',
      },
    ],
  },
  footer: {
    instagramUrl: 'https://instagram.com/riverhousebelgrade',
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
        href: 'https://maps.google.com/?q=Belgrade',
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
