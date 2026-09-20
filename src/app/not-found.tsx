import { Button } from "@/components/ui/button";
import page from "@/data/page.json";
import Hero from "@/sections/hero";
import Link from "next/link";

export default function NotFound() {
  const { title, description, thumbnail } = page.notFound;

  return (
    <section className="article-layout">
      <Hero title={title} description={description} thumbnail={thumbnail} />
      <div className="flex flex-wrap items-center gap-3 pb-5">
        <Button asChild>
          <Link href="/">Go to homepage</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/writings">Browse writing</Link>
        </Button>
      </div>
    </section>
  );
}
