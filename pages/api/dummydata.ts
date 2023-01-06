// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import UnitOfWork from "database/unit-of-work";

import { faker } from "@faker-js/faker";
import ProductItemEntity from "database/entity/product_item";
import ProductEntity from "database/entity/product";
import { generateCode } from "@utils/generate-code";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let PRODUCT_ITEMS: ProductItemEntity[] = [];
  const uow = new UnitOfWork();
  await uow.initialize();

  // const product = {
  //   id: faker.datatype.uuid(),
  //   name: faker.name.firstName(),
  //   type: "ACCOUNT",
  //   thumbnail: faker.image.abstract(500, 300, true),
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // };

  // await uow.ProuductRepository.save(product);

  // Array.from({ length: 100 }).forEach(() => {
  //   let productItem = {
  //     id: faker.datatype.uuid(),
  //     name: faker.name.firstName(),
  //     price: faker.datatype.number({ min: 150, max: 2000 }) * 1000,
  //     currency: "VND",
  //     status: faker.helpers.arrayElement(["SELLING"]),
  //     thumbnail: faker.image.abstract(500, 300, true),
  //     image: faker.image.abstract(500, 300, true),
  //     description: faker.lorem.sentence(),
  //     type: "ACCOUNT_GAME",
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     productId: "bef960f7-5a09-44d2-a7cd-cf67f8660a1c",
  //   };
  //   PRODUCT_ITEMS.push(productItem as ProductItemEntity);
  // });

  // const rs = await uow.ProuductItemRepository.save(PRODUCT_ITEMS);

  // const rows = await uow.ProuductItemRepository.find();
  // for (var i = 0; i < rows.length; i++) {
  //   if (!rows[i].referenceNumber) {
  //     await uow.ProuductItemRepository.update(
  //       {
  //         id: rows[i].id as string,
  //       },
  //       {
  //         referenceNumber: generateCode(10),
  //       }
  //     );
  //   }
  // }
  // res.status(200).json(rows);
  // res.status(200).json(rs);
}
