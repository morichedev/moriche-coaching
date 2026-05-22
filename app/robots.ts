import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://morichecoaching.gg"
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/player", "/team", "/admin", "/api/"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
