// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { plainToInstance } from "class-transformer";
import UnitOfWork from "../../../interfaces/database/unit-of-work";
import { ProductItem } from "../../../interfaces/entity/product_item";
import { Product } from "../../../interfaces/entity/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uow = new UnitOfWork();
  await uow.initialize();

  try {
    if (req.method === "POST") {
      const productItemEntity = plainToInstance(ProductItem, req.body);
      const productEntity = plainToInstance(Product, {
        id: req.body.productId,
      });
      productItemEntity.product = productEntity;
      const data = await uow.ProuductItemRepository.upsert(productItemEntity, [
        "id",
      ]);
      res.status(200).json(data);
      // } else if (req.method === "DELETE") {
      //   const data = await uow.ProuductItemRepository.delete({
      //     id: req.body.id,
      //   });
      //   return res.status(200).json(data);
    } else if (req.method === "GET") {
      let where = {};
      if (req.query["productId"]) {
        where = {
          id: req.query["productId"] as string,
        };
      }
      const data = await uow.ProuductItemRepository.find({
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
