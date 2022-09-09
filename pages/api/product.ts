// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import UnitOfWork from "../../interfaces/database/unit-of-work";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const uow = new UnitOfWork();
  await uow.initialize();

  console.log(`${req.method} ${req.url}`);
  try {
    if (req.method === "POST") {
      const data = await uow.ProuductRepository.upsert(req.body, ["id"]);
      res.status(200).json(data);
    } else if (req.method === "DELETE") {
      const productItems = await uow.ProuductItemRepository.findBy({
        product: {
          id: req.body.id,
        },
      });
      if (productItems && productItems.length > 0) {
        return res.status(400).json({
          error: true,
          message: "There are product items related to this product",
        });
      }
      const data = await uow.ProuductRepository.delete({
        id: req.body.id,
      });
      return res.status(200).json(data);
    } else if (req.method === "GET") {
      let where = {};
      if (req.query["productId"]) {
        where = {
          id: req.query["productId"] as string,
        };
      }
      const data = await uow.ProuductRepository.find({
        where: where,
        relations: {
          productItems: true,
        },
      });
      res.status(200).json(data);
    } else {
      return res.status(405).json({
        error: true,
        message: "The method not allowed.",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
}
