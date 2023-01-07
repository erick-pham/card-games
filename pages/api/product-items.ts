// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { FindOptionsWhere, ILike } from "typeorm";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import UnitOfWork from "database/unit-of-work";
import { checkIsAdmin } from "@utils/check-role";
import { paginateRequest, paginateResponse } from "@utils/paginate";
import ProductItemEntity from "database/entity/product_item";
import { plainToInstance } from "class-transformer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  const isAdmmin = checkIsAdmin(session);
  if (!isAdmmin) {
    return res.status(401).json({ message: "Acction denied." });
  }
  const uow = new UnitOfWork();
  await uow.initialize();

  try {
    if (req.method === "GET") {
      const { take, page, skip, keyword } = paginateRequest(req);
      let where = {
        userId: !isAdmmin ? (session.userId as string) : undefined,
        productId: req.query.productId
          ? (req.query.productId as string)
          : undefined,
      } as
        | FindOptionsWhere<ProductItemEntity>
        | FindOptionsWhere<ProductItemEntity>[];

      if (keyword) {
        where = [
          {
            ...where,
            referenceNumber: ILike(`%${keyword}%`),
          },
          {
            ...where,
            name: ILike(`%${keyword}%`),
          },
        ];
      }

      const data = await uow.ProuductItemRepository.findAndCount({
        where: where,
        take: take,
        skip: skip,
        order: {
          updatedAt: "DESC",
        },
      });

      const result = paginateResponse(data, page, take);
      res.status(200).json(result);
    } else if (req.method === "PUT") {
      const result = await uow.ProuductItemRepository.update(
        {
          id: req.body.id,
        },
        {
          ...req.body,
        }
      );
      res.status(200).json({ affected: result.affected });
    } else if (req.method === "POST") {
      const productItemEntity = plainToInstance(ProductItemEntity, req.body);
      const result = await uow.ProuductItemRepository.insert(productItemEntity);
      res.status(200).json(result);
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
