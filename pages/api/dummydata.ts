// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import "reflect-metadata";
import UnitOfWork from "../../interfaces/database/unit-of-work";

import { faker } from "@faker-js/faker";
import { ProductItem } from "../../interfaces/entity/product_item";
import { Product } from "../../interfaces/entity/product";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let PRODUCT_ITEMS: ProductItem[] = [];
  // const uow = new UnitOfWork();
  // await uow.initialize();

  // const product = {
  //   id: faker.datatype.uuid(),
  //   name: faker.name.firstName(),
  //   type: "ACCOUNT",
  //   thumbnail: faker.image.abstract(500, 300, true),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // };

  // await uow.ProuductRepository.save(product);

  // Array.from({ length: 10 }).forEach(() => {
  //   let productItem = {
  //     id: faker.datatype.uuid(),
  //     name: faker.name.firstName(),
  //     price: faker.datatype.number({ min: 150000, max: 500000 }),
  //     currency: faker.finance.currencyCode(),
  //     status: faker.helpers.arrayElement(["NEW"]),
  //     thumbnail: faker.image.abstract(500, 300, true),
  //     image: faker.image.abstract(500, 300, true),
  //     description: faker.lorem.sentence(),
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     product: product,
  //   };
  //   PRODUCT_ITEMS.push(productItem as ProductItem);
  // });

  // const rs = await uow.ProuductItemRepository.save(PRODUCT_ITEMS);

  // res.status(200).json(rs);
}
