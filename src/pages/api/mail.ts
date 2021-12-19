// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import mail from "../../services/mail";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    mail
      .put("/marketing/contacts", {
        contacts: [{ email: req.body.email }],
        list_ids: [process.env.SENDGRID_LIST_KEY],
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
