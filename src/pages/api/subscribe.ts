import type { NextApiRequest, NextApiResponse } from "next";
import { revue } from "../../services/getRevue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await revue
    .post("/subscribers", {
      email: req.body.email,
    })
    .then((response) => console.log(response.data))
    .catch((error) => console.log({ error }));

  return res.status(201).send({
    message: "You're in!",
  });
}
