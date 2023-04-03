import { getBaseUrl } from '@/utils/urls'
import { db } from '@nextjs-discord-forum/db/node'

const generateSiteMap = async () => {
  const posts = await db
    .selectFrom('posts')
    .select('snowflakeId')
    .limit(50_000) // we will probably need to chunk the sitemap in the future
    .execute()

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${getBaseUrl()}</loc>
       <changefreq>daily</changefreq>
       <priority>1</priority>
     </url>
     ${posts
       .map((p) => {
         return `
       <url>
           <loc>${getBaseUrl()}/post/${p.snowflakeId}</loc>
           <changefreq>weekly</changefreq>
          <priority>0.9</priority>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

export const GET = async () => {
  const sitemap = await generateSiteMap()

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
