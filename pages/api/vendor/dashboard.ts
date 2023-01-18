// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import UnitOfWork from "database/unit-of-work";
import { checkIsVendor } from "@utils/check-role";
import { PRODUCT_ITEM_TYPES, ORDER_STATUS } from "common/constants";
import { startOfMonth } from "date-fns";
import { MoreThanOrEqual } from "typeorm";
import { groupBy } from "lodash";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  const isVendor = checkIsVendor(session);
  if (!isVendor) {
    return res.status(401).json({ message: "Acction denied." });
  }
  const uow = new UnitOfWork();
  await uow.initialize();

  try {
    if (req.method === "GET") {
      let result = {
        totalCustomer: 0,
        totalCustomerCurrentMonth: 0,
        totalOrderOnAccountGame: 0,
        totalOrderOnCardGame: 0,
        totalRevenue: 0,
        totalOrdersInProgress: 0,
        latestSales: <any>[],
      };
      // return res.status(200).json(result);
      // result.totalCustomer = await uow.UserRepository.count();
      // result.totalCustomerCurrentMonth = await uow.UserRepository.countBy({
      //   createdAt: MoreThanOrEqual(startOfMonth(new Date())),
      // });

      // result.totalOrderOnAccountGame = await uow.OrderRepository.countBy({
      //   productItem: {
      //     type: PRODUCT_ITEM_TYPES.ACCOUNT_GAME,
      //   },
      // });
      // result.totalOrderOnCardGame = await uow.OrderRepository.countBy({
      //   productItem: {
      //     type: PRODUCT_ITEM_TYPES.CARD_GAME,
      //   },
      // });

      result.totalOrdersInProgress = await uow.OrderRepository.countBy({
        status: ORDER_STATUS.PENDING,
        sellerId: String(session.userId || ""),
      });

      const { totalRevenue } = await uow.OrderRepository.createQueryBuilder()
        .select("SUM(amount)", "totalRevenue")
        .where("status = :status", {
          status: ORDER_STATUS.SUCCESS,
          sellerId: String(session.userId || ""),
        })
        .getRawOne();
      result.totalRevenue = totalRevenue ? totalRevenue * 1 : 0;

      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() - 7);
      let latestSalesEntity = await uow.OrderRepository.find({
        where: {
          createdAt: MoreThanOrEqual(end),
          sellerId: String(session.userId || ""),
        },
        select: ["id", "createdAt"],
      });
      let latestSales = latestSalesEntity.map((i) => {
        return {
          date: i.createdAt.toISOString().slice(0, 10),
        };
      });

      const salesGroupByDay = groupBy(latestSales, "date");
      result.latestSales = Object.keys(salesGroupByDay).map((i) => {
        return {
          date: i,
          totalSales: salesGroupByDay[i].length,
        };
      });
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
