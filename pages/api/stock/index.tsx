
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
    category: string;
    productSuplier: string;
    productName: string;
    productQty: number;
    totalCost: number;
    costPerUnit: number;
    purchaseDate: Date;
    productTypeId_fk: number;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
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

const saveRecord = async (req: ExtendedNextApiRequest, res) => {
  let addStock = req.body;
  const {
    category,
    productSuplier,
    productName,
    productQty,
    totalCost,
    costPerUnit,
    purchaseDate,
    productTypeId_fk,
  } = req.body;

  console.log(
    "REQUEST: ",
    category,
    productSuplier,
    productName,
    productQty,
    totalCost,
    costPerUnit,
    purchaseDate,
    productTypeId_fk
  );

  console.log(typeof productQty);

  try {
    await prisma.productStock.create({
      data: {
        category,
        productSuplier,
        productName,
        productQty,
        totalCost,
        costPerUnit,
        purchaseDate,
        productTypeId_fk,
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
  const productTypeList = await prisma.productStock.findMany();
  console.log('getRecord(): ', productTypeList)
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
