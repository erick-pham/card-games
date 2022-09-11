// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { FindOptionsWhere, Like } from "typeorm";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import UnitOfWork from "../../interfaces/database/unit-of-work";
import { checkIsAdmin } from "../../utils/check-role";
import { paginateRequest, paginateResponse } from "../../utils/paginate";
import { OrderEntity } from "../../interfaces/entity/order";
import { generateCode } from "../../utils/generate-code";
import { plainToInstance } from "class-transformer";
import {
  PRODUCT_ITEM_TYPES,
  PRODUCT_ITEM_STATUS,
} from "../../common/constants";

interface OrderRequestBody {
  productItemId: string;
  email: string;
  name: string;
  description: string;
  phoneNumber: string;
}
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
  const uow = new UnitOfWork();
  await uow.initialize();

  try {
    if (req.method === "GET") {
      const { take, page, skip, keyword } = paginateRequest(req);
      let where = {
        referenceNumber: Like(`%${keyword}%`),
        userId: !isAdmmin ? (session.userId as string) : undefined,
      };

      const data = await uow.OrderRepository.findAndCount({
        where: where as FindOptionsWhere<OrderEntity>,
        take: take,
        skip: skip,
        select: {
          user: {
            name: true,
          },
          productItem: {
            name: true,
            type: true,
            price: true,
          },
        },
        relations: {
          user: true,
          productItem: true,
        },
        order: {
          updatedAt: "DESC",
        },
      });

      const result = paginateResponse(data, page, take);
      res.status(200).json(result);
    } else if (req.method === "POST") {
      const input: OrderRequestBody = req.body;

      const item = await uow.ProuductItemRepository.findOneBy({
        id: input.productItemId,
      });

      if (!item) {
        return res.status(400).json({
          error: true,
          message: "Product not found.",
        });
      }

      if (item.type === PRODUCT_ITEM_TYPES.ACCOUNT) {
        await uow.ProuductItemRepository.update(input.productItemId, {
          status: PRODUCT_ITEM_STATUS.SELLING,
        });
      }

      if (input.phoneNumber || input.name) {
        await uow.UserRepository.update(session.userId as string, {
          phoneNumber: input.phoneNumber ? input.phoneNumber : undefined,
          name: input.name ? input.name : undefined,
        });
      }

      const orderEntity = plainToInstance(OrderEntity, {
        ...input,
        userId: session.userId,
        amount: item.price,
        referenceNumber: generateCode(10),
      });

      const data = await uow.OrderRepository.save(orderEntity);
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
