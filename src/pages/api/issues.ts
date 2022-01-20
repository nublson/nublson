import type { NextApiRequest, NextApiResponse } from "next";
import { revue } from "../../services/getRevue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await revue.get("/issues");

  if (!response.data) {
    return res.status(500).json({ error: "Error retrieving issues" });
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1200, stale-while-revalidate=600"
  );

  return res.status(200).json({
    issues: response.data,
  });
}
