import page from "@/data/page.json";
import Hero from "@/sections/hero";
import Link from "next/link";

export default function NotFound() {
  const { title, description } = page.notFound;

  return (
    <section className="article-layout">
      <Hero title={title} description={description}>
        <p className="flex gap-4">
          <Link
            href="/"
            className="font-medium text-foreground transition-opacity duration-150 hover:opacity-70"
          >
            Go to homepage
          </Link>
          <Link href="/writings" className="link">
            Browse writing
          </Link>
        </p>
      </Hero>
    </section>
  );
}
