import { PostCardItemProps } from "@/utils/types";
import axios from "axios";
import he from "he";
import { unstable_cache } from "next/cache";

interface YoutubePlaylistVideoRequestProps {
  playlistId: string;
  maxResults?: number;
}

interface PlaylistItem {
  snippet: {
    resourceId: {
      videoId: string;
    };
  };
}

interface VideoItem {
  snippet: {
    publishedAt: string;
    title: string;
    thumbnails: {
      [key: string]: { url: string };
    };
  };
  status: {
    privacyStatus: string;
  };
  id: string;
}

export const getPlaylistVideos = unstable_cache(
  async ({
    playlistId,
    maxResults = 2,
  }: YoutubePlaylistVideoRequestProps): Promise<PostCardItemProps[]> => {
    try {
      // First, get the video IDs from the playlistItems endpoint
      const { data: playlistData } = await axios.get(
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

      const videoIds = playlistData.items
        .map((item: PlaylistItem) => item.snippet.resourceId.videoId)
        .filter(Boolean)
        .join(",");

      if (!videoIds) {
        return [];
      }

      // Second, get the video details from the videos endpoint
      const { data: videosData } = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            key: process.env.YOUTUBE_API_KEY,
            id: videoIds,
            part: "snippet,status",
            videoStatus: "public",
          },
        }
      );

      const publicVideos = videosData.items.filter(
        (video: VideoItem) => video.status.privacyStatus === "public"
      );

      return (
        publicVideos.map((video: VideoItem) => {
          const snippet = video.snippet;
          const thumbnails = snippet.thumbnails;
          const thumbnailUrl =
            thumbnails.maxres?.url ||
            thumbnails.high?.url ||
            thumbnails.medium?.url ||
            thumbnails.default?.url;

          return {
            id: video.id,
            title: he.decode(snippet.title),
            thumbnail: thumbnailUrl,
            publish_date: snippet.publishedAt,
            path: `https://www.youtube.com/watch?v=${video.id}`,
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
