// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import UnitOfWork from "database/unit-of-work";
import OrderEntity from "database/entity/order";
import OrderDetailEntity from "database/entity/order-details";
import { plainToInstance } from "class-transformer";

interface OrderRequestBody {
  accountCharacterName: string;
  accountName: string;
  accountPassword: string;
  accountServer: string;
  accountUserId: string;
  contactEmail: string;
  contactName: string;
  contactPhoneNumber: string;
  description: string;
  productItemId: string;
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

      const orderEntity = plainToInstance(OrderEntity, {
        ...input,
        userId: session?.userId,
        amount: item.price,
      });

      const orderData = await uow.OrderRepository.save(orderEntity);

      const orderDetailEntity = plainToInstance(OrderDetailEntity, {
        ...input,
        orderId: orderData.id,
      });
      console.log("orderDetailEntity", orderDetailEntity);
      const orderDetailData = await uow.OrderDetailsRepository.save(
        orderDetailEntity
      );
      console.log(orderDetailData);
      // orderData.orderDetails = orderDetailData;
      res.status(200).json(orderData);
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
