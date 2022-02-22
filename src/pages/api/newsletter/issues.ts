import type { NextApiRequest, NextApiResponse } from "next";
import { getIssues } from "../../../services/getRevue";
import { IIssueItem } from "../../../utils/types";

type Data = {
  issues: IIssueItem[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response = await getIssues();

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1200, stale-while-revalidate=600"
  );

  return res.status(200).json({
    issues: response.data,
  });
}
