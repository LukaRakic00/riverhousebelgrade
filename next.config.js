/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'api.qrserver.com' },
      { protocol: 'https', hostname: 'cf.bstatic.com' }
    ],
    // Povećaj timeout za Cloudinary slike
    minimumCacheTTL: 60,
    // Omogući SVG samo za data URI
    dangerouslyAllowSVG: false,
  }
};

module.exports = nextConfig;


