import type { NextApiRequest, NextApiResponse } from "next";
import { getNowPlaying } from "../../../services/spotify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await getNowPlaying();

  if (response.status === 204 || response.status > 400) {
    return res.status(200).json({ isPlaying: false });
  }

  const song = await response.json();
  const isPlaying = song.is_playing;
  const title = song.item.name;
  const songUrl = song.item.external_urls.spotify;

  return res.status(200).json({
    isPlaying,
    title,
    songUrl,
  });
}
