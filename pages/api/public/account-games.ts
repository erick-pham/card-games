// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import UnitOfWork from "database/unit-of-work";
import { paginateRequest, paginateResponse } from "utils/paginate";
import { PRODUCT_ITEM_TYPES, PRODUCT_ITEM_STATUS } from "common/constants";
import { getSortParams } from "utils/typeorm-builder";
import {
  FindOptionsOrder,
  MoreThanOrEqual,
  Between,
  In,
  LessThanOrEqual,
} from "typeorm";
import { ProductItem } from "@database/entity/product_item";
import _ from "lodash";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uow = new UnitOfWork();
  await uow.initialize();

  try {
    if (req.method === "GET") {
      let where = {
        type: PRODUCT_ITEM_TYPES.ACCOUNT_GAME,
        status: PRODUCT_ITEM_STATUS.SELLING,
      } as any;
      let order = {} as any;

      // Handle query params - Where
      if (req.query.price_gte && req.query.price_lte) {
        where.price = Between(req.query.price_gte, req.query.price_lte);
      } else if (req.query.price_gte) {
        where.price = MoreThanOrEqual(req.query.price_gte);
      } else if (req.query.price_lte) {
        where.price = LessThanOrEqual(req.query.price_lte);
      }

      if (req.query.game) {
        let productId = req.query.game as string;
        let productIds = productId.split(",");
        productIds = productIds.filter((item) => item.toLowerCase() !== "all");
        if (productIds.length > 0) {
          where.productId = In(productIds);
        }
      }

      // Handle query params - Order
      order = getSortParams(req);

      const { take, page, skip, keyword } = paginateRequest(req);

      const data = await uow.ProuductItemRepository.findAndCount({
        where: {
          ...where,
          // productItems: {
          //   type: PRODUCT_ITEM_TYPES.ACCOUNT_GAME,
          //   status: PRODUCT_ITEM_STATUS.SELLING,
          // },
          // price: MoreThanOrEqual(10000),
          // price: LessThan(10000),
        },
        // relations: {
        //   productItems: true,
        // },
        order: order as FindOptionsOrder<ProductItem>,
        take: take,
        skip: skip,
      });

      const result = paginateResponse(data, page, take);
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
