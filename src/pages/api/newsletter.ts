import { Client } from "@sendgrid/client";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new Client();
client.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    await client.request({
      method: "PUT",
      url: "v3/marketing/contacts",
      body: {
        contacts: [{ email: req.body.email }],
        list_ids: [process.env.SENDGRID_LIST_KEY],
      },
    });

    return res.status(200).send({
      message: "You're in! Thank you!",
    });
  }

  if (req.method === "GET") {
    const response = await client.request({
      method: "GET",
      url: "v3/marketing/contacts",
      body: {
        list_ids: [process.env.SENDGRID_LIST_KEY],
      },
    });

    return res.status(200).json({
      contact_count: response[1].contact_count,
    });
  }
}
