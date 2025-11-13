
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { hostname: 'placehold.co' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'picsum.photos' },
      { hostname: 'img.freepik.com' },
      { hostname: 'pix10.agoda.net' },
      { hostname: '**.com' },
      { hostname: '**.in' },
      { hostname: '**.org' },
      { hostname: '**.au' },
      { hostname: '**.hk' },
      { hostname: '**.uk' },
      { hostname: '**.dev' },
      { hostname: 'd3e1m60cq1m76d.cloudfront.net' },
      { hostname: 'image-tc.galaxy.tf' },
      { hostname: 'cf.bstatic.com' },
      { hostname: 'cbey.yale.edu' },
      { hostname: 'media-cdn.tripadvisor.com' },
      { hostname: 'imgcld.yatra.com' },
      { hostname: 'res.klook.com' },
      { hostname: 'cdn.kimkim.com' },
      { hostname: 'gos3.ibcdn.com' },
      { hostname: 'akm-img-a-in.tosshub.com' },
    ],
  },

};

export default nextConfig;

    