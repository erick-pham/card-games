// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import UnitOfWork from "../../../interfaces/database/unit-of-work";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uow = new UnitOfWork();
  await uow.initialize();

  console.log(`${req.method} ${req.url}`);
  try {
    if (req.method === "GET") {
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