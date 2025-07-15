import { PostCardItemProps } from "@/utils/types";
import axios from "axios";
import he from "he";
import { unstable_cache } from "next/cache";

interface YoutubePlaylistVideoRequestProps {
  playlistId: string;
  maxResults?: number;
}

export const getPlaylistVideos = unstable_cache(
  async ({
    playlistId,
    maxResults = 2,
  }: YoutubePlaylistVideoRequestProps): Promise<PostCardItemProps[]> => {
    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          params: {
            key: process.env.YOUTUBE_API_KEY,
            playlistId,
            part: "snippet",
            maxResults,
          },
        }
      );

      return (
        data.items.map((item: any) => {
          const snippet = item.snippet;
          const thumbnails = snippet.thumbnails;
          const thumbnailUrl =
            thumbnails.maxres?.url ||
            thumbnails.high?.url ||
            thumbnails.medium?.url ||
            thumbnails.default?.url;

          return {
            id: snippet.resourceId.videoId,
            title: he.decode(snippet.title),
            thumbnail: thumbnailUrl,
            publish_date: snippet.publishedAt,
            path: `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`,
          };
        }) || []
      );
    } catch (error: any) {
      console.error(
        "Erro ao buscar vídeos da playlist:",
        error?.response?.data || error.message
      );
      return [];
    }
  },
  ["youtube-playlist-videos"],
  { revalidate: 1800 }
);
