import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    productTypeName: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productTypeName } = req.body;

  console.log("REQUEST: ", productTypeName);

  try {
    await prisma.productType.create({
      data: {
        productTypeName,
      },
    });

    res.status(200).json({ message: "User Created" });
  } catch (error) {
    console.log(error);
  }
}
