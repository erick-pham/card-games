// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { FindOptionsWhere, ILike } from "typeorm";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import UnitOfWork from "database/unit-of-work";
import { checkIsVendor } from "@utils/check-role";
import { paginateRequest, paginateResponse } from "@utils/paginate";
import ProductItemEntity from "database/entity/product_item";
import { plainToInstance } from "class-transformer";
import { PRODUCT_ITEM_TYPES } from "common/constants";

interface CreateProductItem {
  name: string;
}

interface UpdateProductItem {
  id: string;
  name: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }
  if (!checkIsVendor(session)) {
    return res.status(403).json({ message: "You DO NOT have access." });
  }

  const uow = new UnitOfWork();
  await uow.initialize();
  try {
    if (req.method === "GET") {
      const { take, page, skip, keyword } = paginateRequest(req);
      let where = {
        createdBy: String(session.userId || ""),
        productId: req.query.productId
          ? (req.query.productId as string)
          : undefined,
        type: PRODUCT_ITEM_TYPES.ACCOUNT_GAME,
        status: req.query.status || undefined,
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
      delete req.body.type;
      req.body.updatedBy = String(session.userId || "");
      const result = await uow.ProuductItemRepository.update(
        {
          id: req.body.id,
          createdBy: String(session.userId || ""),
        },
        {
          ...req.body,
        }
      );
      res.status(200).json({ affected: result.affected });
    } else if (req.method === "POST") {
      const productItemEntity = plainToInstance(ProductItemEntity, req.body);
      productItemEntity.type = PRODUCT_ITEM_TYPES.ACCOUNT_GAME;
      productItemEntity.createdBy = String(session.userId || "");
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
