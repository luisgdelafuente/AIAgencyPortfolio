import { Metadata } from "next"

interface MetaTagsProps {
  metadata: {
    title: string
    description: string
    keywords: string
    canonical: string
    ogTitle: string
    ogDescription: string
    ogImage: string
  }
  type?: "article" | "website" | "book" | "profile"
  url?: string
}

export function MetaTags({ metadata, type = "website", url = "https://hal149.com" }: MetaTagsProps) {
  console.log("MetaTags rendering with:", { metadata, type, url })
  return null
}

export function generateMetadata({ 
  metadata, 
  type = "website", 
  url = "https://hal149.com" 
}: MetaTagsProps): Metadata {
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: metadata.canonical || url,
    },
    openGraph: {
      title: metadata.ogTitle || metadata.title,
      description: metadata.ogDescription || metadata.description,
      url: url,
      siteName: "HAL149",
      images: metadata.ogImage ? [metadata.ogImage] : [],
      type: type,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.ogTitle || metadata.title,
      description: metadata.ogDescription || metadata.description,
      images: metadata.ogImage ? [metadata.ogImage] : [],
    },
  }
}

export default MetaTags