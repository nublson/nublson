import { HeadingTop } from "@/components/heading-top";
import Hero from "@/sections/hero";
import { Fragment } from "react";

export default function WorkPostPage() {
  return (
    <Fragment>
      <Hero
        top={
          <HeadingTop
            title="My Framer template empire"
            date="Jul 12, 2025"
            postsPath="/work"
            postType="Projects"
          />
        }
        title="My Framer template empire"
        description="Here’s where I share stories from the road, reflections on creativity, and insights from the ever-evolving adventure of building, exploring, and growing. Whether it's lessons from the wild or thoughts sparked by late-night brainstorming sessions, this space captures the journey in motion."
        thumbnail="https://github.com/nublson.png"
        size="small"
      />
    </Fragment>
  );
}
