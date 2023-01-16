// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { PRODUCT_STATUS } from "common/constants";
import UnitOfWork from "database/unit-of-work";
import { checkIsVendor } from "@utils/check-role";

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
      const data = await uow.ProuductRepository.find({
        where: {
          status: PRODUCT_STATUS.ACTIVE,
        },
      });
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
