import React, { useEffect, useState } from "react";
import { MainLayout } from "../../components/layout";
import MainCard from "../../components/cards/MainCard";
import DataTable from "../../components/datatable/DataTable";
import { PrismaClient } from "@prisma/client";
import CunformationDialogBox from "../../components/alerts/CunformationDialogBox";
import { useForm } from "react-hook-form";

interface UserFormData {
  productTypeName: string;
}

// const prisma = new PrismaClient();

const AddMaster = () => {
  const { register, handleSubmit, reset } = useForm<UserFormData>();

  // const [headers, setHeaders] = useState(["productTypeId", "productTypeName"]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [userForm, setUserForm] = useState<UserFormData>();
  const [msg, setMsg] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [productTypeId, setProductTypeId] = useState(0);

  const headers = [
    {
      headerId: "productTypeId",
      header: "ProductTypeId",
      isVisible: true
    },
    {
      headerId: "productTypeName",
      header: "ProductTypeName",
      isVisible: true
    },
    {
      headerId: "action",
      header: "Action",
      isVisible: true
    },
  ]

  const onSubmit = handleSubmit(async (data: UserFormData) => {
    try {
      await create(data);
      await list();

      setMsg("Product Type saved successfully!");
      reset();
    } catch (error) {
      console.log(error);
      setMsg("Couldn't save Product Type");
    }
  });

  const handleSubmit2 = async (data: UserFormData) => {
    console.log("## handleSubmit() : ");
    try {
      await create(data);
      await list();

      setMsg("Product Type saved successfully!");
    } catch (error) {
      console.log(error);
      setMsg("Couldn't save Product Type");
    }
  };

  async function create(data: UserFormData) {
    try {
      await fetch("/api/masters", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      // list();
    } catch (error) {
      console.log(error);
    }
  }

  const list = async () => {
    try {
      const response = await fetch("/api/masters");
      const resp = await response.json();
      setProductTypeList(resp);
      console.log("##resp : ", resp);
      console.log("##list() : ", productTypeList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // setProductTypeList(data)
    list();
    console.log(productTypeList);
  }, []);

  const deleteRecord = async (productTypeId) => {
    // alert("deleteRecord() : " + productTypeId);
    try {
      const response = await fetch(
        `/api/masters?productTypeId=${productTypeId}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "DELETE",
        }
      );
      const resp = await response.json();
      await list();
      // alert(resp);
    } catch (error) {
      console.log(error);
    }
    setIsDialogOpen(false);
    setProductTypeId(0);
  };

  const confirmToDelete = (productTypeId) => {
    setProductTypeId(productTypeId);
    setIsDialogOpen(true);
  };

  return (
    <>
      <MainCard title="Add Master">
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="input-box">
              <label htmlFor="productTypeName">Product Type</label>
              <input
                type="text"
                id="productTypeName"
                name="productTypeName"
                placeholder="please enter product type"
                {...register("productTypeName")}
                required
              />
            </div>
          </div>

          <div className="form-row">
            {/* <input type="submit" name="Save" className="btn submitBtn" /> */}

            <button type="submit" className="btn submitBtn">
              <i className="fas fa-plus-square"></i>
              Save
            </button>

            <button type="reset" className="btn">
              <i className="fas fa-broom"></i>
              Clear
            </button>
            {/* <input type="reset" name="Clear" className="btn" /> */}
          </div>

          <label htmlFor="msg">{msg}</label>
        </form>

        <DataTable
          headers={headers}
          records={productTypeList}
          deleteRecord={confirmToDelete}
        ></DataTable>

        <CunformationDialogBox
          show={isDialogOpen}
          close={() => setIsDialogOpen(false)}
          deleteRecord={() => deleteRecord(productTypeId)}
        />
      </MainCard>
    </>
  );
};

export default AddMaster;

AddMaster.Layout = MainLayout;

// export async function getServerSideProps() {
//   const productTypeList = await prisma.productType.findMany();
//   console.log("USER LIST : ", productTypeList);
//   return {
//     props: {
//       data: JSON.parse(JSON.stringify(productTypeList)),
//     },
//   };
// }
