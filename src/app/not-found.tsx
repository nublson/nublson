import page from "@/data/page.json";
import Hero from "@/sections/hero";

export default function NotFound() {
  const { title, description, thumbnail } = page.notFound;

  return <Hero title={title} description={description} thumbnail={thumbnail} />;
}
