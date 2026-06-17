
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* Configuración para despliegue estático en GitHub Pages */
  output: 'export',
  // Si despliegas en GitHub Pages, configura la variable de entorno
  // NEXT_PUBLIC_REPO_NAME con el nombre del repo (por ejemplo: 'mi-repo').
  // Si no está definida, no se aplica `basePath` ni `assetPrefix`.
  basePath: process.env.NEXT_PUBLIC_REPO_NAME ? `/${process.env.NEXT_PUBLIC_REPO_NAME}` : '',
  assetPrefix: process.env.NEXT_PUBLIC_REPO_NAME ? `/${process.env.NEXT_PUBLIC_REPO_NAME}/` : '',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
