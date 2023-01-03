// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { plainToInstance } from "class-transformer";
import UnitOfWork from "database/unit-of-work";
import { ProductItem } from "database/entity/product_item";
import { Product } from "database/entity/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uow = new UnitOfWork();
  await uow.initialize();

  try {
    if (req.method === "POST") {
      const productItemEntity = plainToInstance(ProductItem, req.body);

      let data = null;
      if (productItemEntity.id) {
        data = await uow.ProuductItemRepository.createQueryBuilder()
          .update(productItemEntity)
          .where({
            id: productItemEntity.id,
          })
          // .returning("*")
          .execute();
        data = await uow.ProuductItemRepository.findOne({
          where: { id: productItemEntity.id },
        });
      } else {
        const productEntity = plainToInstance(Product, {
          id: req.body.productId,
        });
        productItemEntity.product = productEntity;
        data = await uow.ProuductItemRepository.insert(productItemEntity);
        data = data.generatedMaps[0];
      }

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
    console.error(error);
    return res
      .status(500)
      .send({ error: true, message: "Internal Server Error" });
  }
}
