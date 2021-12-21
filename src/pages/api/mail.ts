import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../services/sendgrid";

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
      .then((response) => {
        console.log(response);
        res.status(200).send({
          message: "You have successfully subscribed to my newsletter",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
            "Oops, there was a problem with your subscription, please try again.",
        });
      });
  }
}
