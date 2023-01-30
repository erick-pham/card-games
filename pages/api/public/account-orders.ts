// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import UnitOfWork from "database/unit-of-work";
import OrderEntity from "database/entity/order";
import { plainToInstance } from "class-transformer";
import { PRODUCT_ITEM_STATUS } from "common/constants";
import checkValidSalePrice from "@utils/check-valid-sale-price";
import { getMailOptionsOrderSubmitted } from "lib/email-template";
import transporter from "lib/mailer-transporter";
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
  //   res.status(401).json({ error: true, message: "You must be logged in." });
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
          message: "Item not found.",
        });
      }

      if (item.status === PRODUCT_ITEM_STATUS.SOLD) {
        return res.status(400).json({
          error: true,
          message: "Item sold.",
        });
      }

      const orderEntity = plainToInstance(OrderEntity, {
        ...input,
        userId: session?.userId || null,
        amount: item.price,
        sellerId: item.createdBy,
      });

      if (checkValidSalePrice(item.salePrice, item.salePriceEndDate)) {
        orderEntity.amount = item.salePrice;
        orderEntity.originalPrice = item.price;
      }

      const data = await uow.OrderRepository.save(orderEntity);

      item.status = PRODUCT_ITEM_STATUS.SOLD;
      item.save();

      data.productItem = item;
      const mailOptions = getMailOptionsOrderSubmitted(data);
      await transporter.sendMail(mailOptions);

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
