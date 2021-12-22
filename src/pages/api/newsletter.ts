import { Client } from "@sendgrid/client";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new Client();
client.setApiKey(process.env.SENDGRID_API_KEY);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    client
      .request({
        method: "PUT",
        url: "v3/marketing/contacts",
        body: {
          contacts: [{ email: req.body.email }],
          list_ids: [process.env.SENDGRID_LIST_KEY],
        },
      })
      .then(() => {
        res.status(200).send({
          message: "You have successfully subscribed to my newsletter",
        });
      })
      .catch(() => {
        res.status(500).send({
          message:
            "Oops, there was a problem with your subscription, please try again.",
        });
      });
  }
}
