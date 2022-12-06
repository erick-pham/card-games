// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import UnitOfWork from "database/unit-of-work";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uow = new UnitOfWork();
  await uow.initialize();

  try {
    if (req.method === "GET") {
      const { id } = req.query;

      const where = {
        id: id as string,
      };

      const data = await uow.ProuductItemRepository.findOne({
        where: where,
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
