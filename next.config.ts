import type { NextConfig } from "next";

/** Supabase Storage host, so next/image can optimise CMS images from the public media bucket. */
function supabaseImagePattern() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) return [];
  const url = new URL(value);
  return [
    {
      protocol: url.protocol === "http:" ? ("http" as const) : ("https" as const),
      hostname: url.hostname,
      port: url.port,
      pathname: "/storage/v1/object/public/**",
    },
  ];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseImagePattern(),
  },
  experimental: {
    serverActions: {
      // Admin image uploads are capped at 5 MB; leave headroom for the rest of the form.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
