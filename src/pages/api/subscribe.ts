import type { NextApiRequest, NextApiResponse } from "next";
import { addSubscriber } from "../../services/getRevue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await addSubscriber(req.body.email);

  if (!response.data) {
    return res.status(500).json({ error: "Error adding subscriber!" });
  }

  return res.status(201).send({
    message: "You're in!",
  });
}
