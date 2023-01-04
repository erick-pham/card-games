// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { FindOptionsWhere, Like } from "typeorm";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

import UnitOfWork from "database/unit-of-work";
import { checkIsAdmin } from "utils/check-role";
import { paginateRequest, paginateResponse } from "utils/paginate";
import { UserEntity } from "database/entity/entities";

type UserProfileUpdate = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  image: string;
  gender: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: true, message: "You must be logged in." });
    return;
  }

  const uow = new UnitOfWork();
  await uow.initialize();

  try {
    if (req.method === "PUT") {
      const payload = req.body as UserProfileUpdate;

      const result = await uow.UserRepository.update(
        {
          id: session.userId as string,
        },
        payload
      );
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
