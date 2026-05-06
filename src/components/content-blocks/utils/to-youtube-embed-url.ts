export const toYouTubeEmbedUrl = (src?: string) => {
  if (!src) {
    return "";
  }

  try {
    const url = new URL(src);

    if (url.hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : src;
    }

    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch {
    // Keep fallback behavior for non-standard URLs.
  }

  return src.replace("watch?v=", "embed/");
};
