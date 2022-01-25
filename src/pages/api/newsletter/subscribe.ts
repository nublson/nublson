import type { NextApiRequest, NextApiResponse } from "next";
import { addSubscriber, getSubscribers } from "../../../services/getRevue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentSubscribers = await getSubscribers();

  const subscriberExists = currentSubscribers.data.find(
    (subscriber: any) => subscriber.email === req.body.email
  );

  if (subscriberExists) {
    return res
      .status(409)
      .send({ message: "Email already added! Try another address." });
  }

  const result = await addSubscriber(req.body.email)
    .then((response) => {
      return res.status(201).send({
        message: "You're in! Check your inbox to confirm.",
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: "Error adding subscriber! Try again." });
    });

  return result;
}
