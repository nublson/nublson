import type { NextApiRequest, NextApiResponse } from "next";
import { subscribeNewsletter } from "../../services/sendgrid";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    subscribeNewsletter(req, res);
  }
}
