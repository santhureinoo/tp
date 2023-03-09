/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/Reports',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
