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
  switch (req.method) {
    case "POST":
      return await saveRecord(req, res);
      break;
    case "PUT":
      return await updateRecord(req, res);
      break;
    case "GET":
      return await getRecord(req, res);
      break;
    case "DELETE":
      return await deleteRecord(req, res);
      break;
    default:
      return res.status(405).end();
      break;
  }
}

const saveRecord = async (req, res) => {
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
};

const updateRecord = async (req, res) => {
  console.log("updateRecord");
};

const getRecord = async (req, res) => {
  const { productTypeId } = req.query;

  let productTypeList = null;
  if (req && productTypeId) {
    productTypeList = await prisma.productType.findFirst({
      where: {
        productTypeId: parseInt(productTypeId),
      },
    });
  } else {
    productTypeList = await prisma.productType.findMany();
  }

  res.status(200).json(productTypeList);
};

const deleteRecord = async (req, res) => {
  const { productTypeId } = req.query;

  const deleteUser = await prisma.productType.delete({
    where: {
      productTypeId: parseInt(productTypeId),
    },
  });
  res
    .status(200)
    .json(`record deleted sucussefully for ${productTypeId} productTypeId`);
};
