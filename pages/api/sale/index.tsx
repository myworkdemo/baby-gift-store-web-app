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
    productName: string;
    productQty: number;
    totalCost: number;
    costPerUnit: number;
    saleDate: string;
    saleTime: string;
    productTypeId_fk: number;
    productType: string;
    productPrice: number;
    discountPercentage: number;
    discountPrice: number;

    customerName: string;
    customerAddress: string;
    customerMobileNo: string;
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
    productName,
    productQty,
    totalCost,
    costPerUnit,
    saleDate,
    saleTime,
    productTypeId_fk,
    productType,
    productPrice,
    discountPercentage,
    discountPrice,

    customerName,
    customerAddress,
    customerMobileNo,
  } = req.body;

  try {
    const customerDetailsData = await prisma.customerDetails.create({
      data: {
        customerName,
        customerAddress,
        customerMobileNo,
      },
    });

    if (customerDetailsData) {
      const customerDetailsId_fk = customerDetailsData.customerDetailsId;

      await prisma.saleProduct.create({
        data: {
          category,
          productName,
          productQty,
          totalCost,
          costPerUnit,
          saleDate,
          saleTime,
          productTypeId_fk,
          productType,
          productPrice,
          discountPercentage,
          discountPrice,
          customerDetailsId_fk,
        },
      });
    }

    res.status(200).json({ message: "Sale record successfully created" });
  } catch (error) {
    console.log(error);
  }
};

const updateRecord = async (req, res) => {
  console.log("updateRecord");

  let addStock = req.body;
  const {
    saleProductId,
    category,
    productName,
    productQty,
    totalCost,
    costPerUnit,
    saleDate,
    saleTime,
    productTypeId_fk,
    productType,
    productPrice,
    discountPercentage,
    discountPrice,
    customerDetailsId_fk,
  } = req.body;

  try {
    await prisma.saleProduct.update({
      where: {
        saleProductId: saleProductId,
      },
      data: {
        saleProductId,
        category,
        productName,
        productQty,
        totalCost,
        costPerUnit,
        saleDate,
        saleTime,
        productTypeId_fk,
        productType,
        productPrice,
        discountPercentage,
        discountPrice,
        customerDetailsId_fk,
      },
    });

    res.status(200).json({ message: "Sale record successfully updated" });
  } catch (error) {
    console.log(error);
  }
};

const getRecord = async (req, res) => {
  const { saleProductId } = req.query;

  let saleProductList = null;
  if (req && saleProductId) {
    saleProductList = await prisma.saleProduct.findFirst({
      where: {
        saleProductId: parseInt(saleProductId),
      },
    });
  } else {
    saleProductList = await prisma.saleProduct.findMany();
  }

  res.status(200).json(saleProductList);
};

const deleteRecord = async (req, res) => {
  const { saleProductId } = req.query;

  const saleProduct = await prisma.saleProduct.delete({
    where: {
      saleProductId: parseInt(saleProductId),
    },
  });
  res
    .status(200)
    .json(`record deleted sucussefully for ${saleProductId} saleProductId`);
};
