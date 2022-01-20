import type { NextApiRequest, NextApiResponse } from "next";
import { revue } from "../../services/getRevue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await revue.get("/subscribers");

  if (!response.data) {
    return res.status(500).json({ error: "Error retrieving subscribers" });
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1200, stale-while-revalidate=600"
  );

  return res.status(200).json({
    subscribers: response.data,
  });
}
