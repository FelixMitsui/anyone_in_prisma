/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    BASE_URL: `${process.env.MODE === 'production' ? 'https://anyone-in-prisma.vercel.app' : 'http://localhost:3000'}`
  },
  experimental: {
    appDir: true,
  },
}
