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
        userId: isAdmmin ? (session.userId as string) : undefined,
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
      req.body["userId"] = session.userId;
      req.body["referenceNumber"] = generateCode(10);
      const data = await uow.OrderRepository.save(req.body);
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
