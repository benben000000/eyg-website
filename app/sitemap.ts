import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://eyg-website.vercel.app';
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/inventory`, lastModified: new Date() },
    { url: `${base}/pos`, lastModified: new Date() },
    { url: `${base}/admin`, lastModified: new Date() },
  ];
}
