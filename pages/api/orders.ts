// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { FindOptionsWhere, ILike } from "typeorm";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import UnitOfWork from "database/unit-of-work";
import { checkIsAdmin } from "../../utils/check-role";
import { paginateRequest, paginateResponse } from "../../utils/paginate";
import OrderEntity from "database/entity/order";
import { plainToInstance } from "class-transformer";
import { PRODUCT_ITEM_TYPES, PRODUCT_ITEM_STATUS } from "common/constants";

interface OrderRequestBodyPUT {
  id: string;
  status: string;
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
      } as FindOptionsWhere<OrderEntity>;

      if (keyword) {
        where.referenceNumber = ILike(`%${keyword}%`);
      }

      const data = await uow.OrderRepository.findAndCount({
        where: where,
        take: take,
        skip: skip,
        // select: {
        //   user: {
        //     name: true,
        //   },
        //   productItem: {
        //     name: true,
        //     type: true,
        //     price: true,
        //   },
        // },
        relations: {
          // user: true,
          // productItem: true,
          orderDetails: true,
        },
        order: {
          updatedAt: "DESC",
        },
      });

      const result = paginateResponse(data, page, take);
      res.status(200).json(result);
    } else if (req.method === "PUT") {
      const body = req.body as OrderRequestBodyPUT;
      const result = await uow.OrderRepository.update(
        {
          id: body.id,
        },
        {
          status: body.status,
        }
      );
      res.status(200).json({ affected: result.affected });
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
