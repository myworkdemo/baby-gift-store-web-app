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
    userName: string;
    userEmailId: string;
    userPassword: string;
    userRole: string;
    isActive: Boolean;
    createdDate: Date;
    profilePhoto: Blob;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    userName,
    userEmailId,
    userPassword,
    userRole,
    isActive,
    createdDate,
    profilePhoto,
  } = req.body;

  console.log(
    "REQUEST: ",
    userName,
    userEmailId,
    userPassword,
    userRole,
    isActive,
    createdDate,
    profilePhoto
  );
  console.log("##REQ : ", profilePhoto);

  try {
    await prisma.user.create({
      data: {
        userName,
        userEmailId,
        userPassword,
        userRole,
        isActive,
        createdDate,
        profilePhoto,
      },
    });

    res.status(200).json({ message: "User Created" });
  } catch (error) {
    console.log(error);
  }
}
