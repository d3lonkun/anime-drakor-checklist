/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // MyAnimeList / Jikan
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
      // TMDB (film/drakor)
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      // Google user content
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // Imgur
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      // Wikipedia
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      // Semua domain lain (paling fleksibel)
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
