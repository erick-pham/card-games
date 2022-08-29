// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import UnitOfWork from "../../interfaces/database/unit-of-work";

type Data = {
  name: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uow = new UnitOfWork();
  await uow.initialize();
  const data = await uow.ProuductRepository.find({
    relations: {
      productItems: true,
    },
  });
  res.status(200).json(data);
}
