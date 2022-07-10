import db from "../../../services/firebase";
import type { NextApiRequest, NextApiResponse } from "next";

interface NextApiProps extends NextApiRequest {
  query: {
    slug: string;
  };
}

export default async function handler(req: NextApiProps, res: NextApiResponse) {
  if (req.method === "POST") {
    const ref = db.ref("views").child(req.query.slug.toString());
    const { snapshot } = await ref.transaction((currentViews: number) => {
      if (currentViews === null) {
        return 1;
      }

      return currentViews + 1;
    });

    return res.status(200).json({
      views: snapshot.val(),
    });
  }

  if (req.method === "GET") {
    const snapshot = await db
      .ref("views")
      .child(req.query.slug.toString())
      .once("value");

    const views = snapshot.val();

    return res.status(200).json({ views });
  }
}
