import Hero from "@/sections/hero";
import PostsSection from "@/sections/posts";
import { Fragment } from "react";

export default function BlogPage() {
  return (
    <Fragment>
      <Hero
        title="My Blog"
        description="Here’s where I share stories from the road, reflections on creativity, and insights from the ever-evolving adventure of building, exploring, and growing. Whether it's lessons from the wild or thoughts sparked by late-night brainstorming sessions, this space captures the journey in motion."
        thumbnail={{
          src: "https://avatar.vercel.sh/nublson",
          alt: "Blog Thumbnail",
        }}
      />
      <PostsSection title="Latest Posts" id="blog" />
    </Fragment>
  );
}
