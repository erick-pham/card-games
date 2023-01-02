// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { FindOptionsWhere, Like } from "typeorm";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import UnitOfWork from "database/unit-of-work";
import { checkIsAdmin } from "utils/check-role";
import { paginateRequest, paginateResponse } from "utils/paginate";
import { OrderEntity } from "database/entity/order";
import { plainToInstance } from "class-transformer";
import { PRODUCT_ITEM_TYPES, PRODUCT_ITEM_STATUS } from "common/constants";

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
  // if (!session) {
  //   res.status(401).json({ message: "You must be logged in." });
  //   return;
  // }
  // const isAdmmin = checkIsAdmin(session);
  const uow = new UnitOfWork();
  await uow.initialize();

  try {
    if (req.method === "POST") {
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

      if (item.type === PRODUCT_ITEM_TYPES.ACCOUNT_GAME) {
        await uow.ProuductItemRepository.update(input.productItemId, {
          status: PRODUCT_ITEM_STATUS.SOLD,
        });
      }

      const orderEntity = plainToInstance(OrderEntity, {
        ...input,
        userId: session?.userId || null,
        amount: item.price,
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
