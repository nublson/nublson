import type { NextApiRequest, NextApiResponse } from "next";
import { getIssues } from "../../../services/getRevue";
import { IIssueItem } from "../../../utils/types";
import { formatIssues } from "../../../utils/formatter";

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

  const formattedIssues = formatIssues(response.data);

  return res.status(200).json({
    issues: formattedIssues,
  });
}
