import type { NextApiRequest, NextApiResponse } from "next";
import { getMembers } from "../../../services/buyMeACoffee";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await getMembers();

  if (response.data.error) {
    return res.status(500).json({ error: "Error retrieving members" });
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1200, stale-while-revalidate=600"
  );

  return res.status(200).json({
    members: response.data.data.length,
  });
}
