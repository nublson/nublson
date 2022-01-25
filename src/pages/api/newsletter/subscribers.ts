import type { NextApiRequest, NextApiResponse } from "next";
import { getSubscribers } from "../../../services/getRevue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await getSubscribers();

  if (!response.data) {
    return res.status(500).json({ error: "Error retrieving subscribers" });
  }

  return res.status(200).json({
    subscribers: response.data,
  });
}
