import { getAllPublishedPostsForFeed } from "@/services/notion";

export const revalidate = 10;

function formatSection(
  base: string,
  pathPrefix: "/blog" | "/work",
  posts: Awaited<ReturnType<typeof getAllPublishedPostsForFeed>>,
): string {
  if (posts.length === 0) return "";

  const lines = posts.map((post) => {
    const url = `${base}${pathPrefix}/${post.slug}`;
    const description = post.description ? `: ${post.description}` : "";
    return `- [${post.title}](${url})${description}`;
  });

  return lines.join("\n");
}

export async function GET() {
  const base = process.env.BASE_URL!.replace(/\/$/, "");
  const databaseId = process.env.NOTION_DATABASE_CONTENT_ID!;

  const [blogPosts, workPosts] = await Promise.all([
    getAllPublishedPostsForFeed(databaseId, "Blog"),
    getAllPublishedPostsForFeed(databaseId, "Project"),
  ]);

  const sections = [
    "# Nubelson Fernandes",
    "> Designer and developer sharing work, writing, and tools.",
    "",
    "## Blog",
    formatSection(base, "/blog", blogPosts),
    "",
    "## Work",
    formatSection(base, "/work", workPosts),
  ];

  return new Response(`${sections.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
    },
  });
}
