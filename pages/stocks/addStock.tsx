import React, { useEffect, useState } from "react";
import { MainLayout } from "../../components/layout";
import MainCard from "../../components/cards/MainCard";
import DataTable from "../../components/datatable/DataTable";
import { PrismaClient } from "@prisma/client";
import CunformationDialogBox from "../../components/alerts/CunformationDialogBox";
import { useForm } from "react-hook-form";

interface UserFormData {
  category: String;
  productSuplier: String;
  productName: String;
  productQty: Number;
  totalCost: Number;
  costPerUnit: Number;
  purchaseDate: Date;
  productTypeId_fk: Number;
}

// const prisma = new PrismaClient();

const AddStock = () => {
  const { register, handleSubmit, reset } = useForm<UserFormData>();

  const [headers, setHeaders] = useState([
    {
      headerId: "category",
      header: "Category",
      isVisible: true
    },
    {
      headerId: "productSuplier",
      header: "ProductSuplier",
      isVisible: true
    },
    {
      headerId: "productName",
      header: "ProductName",
      isVisible: true
    },
    {
      headerId: "productQty",
      header: "ProductQty",
      isVisible: true
    },
    {
      headerId: "totalCost",
      header: "TotalCost",
      isVisible: true
    },
    {
      headerId: "costPerUnit",
      header: "CostPerUnit",
      isVisible: true
    },
    {
      headerId: "purchaseDate",
      header: "PurchaseDate",
      isVisible: true
    },
    {
      headerId: "productTypeId_fk",
      header: "ProductTypeId_fk",
      isVisible: false
    },
    {
      headerId: "action",
      header: "Action",
      isVisible: true
    },
  ]);
  const [stockList, setStockList] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [userForm, setUserForm] = useState<UserFormData>();
  const [msg, setMsg] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [productTypeId, setProductTypeId] = useState(0);

  const onSubmit = handleSubmit(async (data: UserFormData) => {
    try {
      await create(data);
      await list();

      setMsg("Product Type saved successfully!");
      // reset();
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

  const onChangeDate = (e) => {
    var date = new Date(e.target.value);
    setUserForm({ ...userForm, purchaseDate: date });
  };

  async function create(data: UserFormData) {
    try {
      await fetch("/api/stock", {
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
      const response = await fetch("/api/stock", {
        method: "GET",
      });
      const resp = await response.json();
      setStockList(resp);
      console.log("##resp : ", resp);
      console.log("##list() : ", stockList);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductTypeList = async () => {
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
    // setStockList(data)
    getProductTypeList();
    list();
    console.log("##stockList: ", stockList);
  }, []);

  const deleteRecord = async (productTypeId) => {
    // alert("deleteRecord() : " + productTypeId);
    try {
      const response = await fetch(
        `/api/stock?productTypeId=${productTypeId}`,
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
      <MainCard title="Add Stock">
        <form onSubmit={handleSubmit(handleSubmit2)}>
          <div className="form-row">
            <div className="input-box">
              <label htmlFor="productTypeId_fk">Product Type</label>

              <select
                id="productTypeId_fk"
                name="productTypeId_fk"
                {...register("productTypeId_fk", { valueAsNumber: true })}
                required
              >
                <option value="">-select-</option>
                {productTypeList.map((val, idx) => (
                  <option value={val.productTypeId}>
                    {val.productTypeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-box">
              <label htmlFor="productCategory">Category</label>
              <select
                id="productCategory"
                name="productCategory"
                {...register("category")}
                required
              >
                <option value="">-select-</option>
                <option value="Boy">Boy</option>
                <option value="Girl">Girl</option>
                <option value="Common">Common</option>
              </select>
            </div>

            <div className="input-box">
              <label htmlFor="productSuplier">Suplier</label>
              <select
                id="productSuplier"
                name="productSuplier"
                {...register("productSuplier")}
                required
              >
                <option value="">-select-</option>
                <option value="Boy">Boy</option>
                <option value="Girl">Girl</option>
                <option value="Common">Common</option>
              </select>
            </div>

            <div className="input-box">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                name="productName"
                placeholder="please enter product name"
                {...register("productName")}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-box">
              <label htmlFor="productQty">Product Quantity</label>
              <input
                type="number"
                id="productQty"
                name="productQty"
                placeholder="please enter product quantity"
                {...register("productQty", { valueAsNumber: true })}
                required
              />
            </div>

            <div className="input-box">
              <label htmlFor="totalCost">Total Cost</label>
              <input
                type="number"
                id="totalCost"
                name="totalCost"
                placeholder="please enter total cost"
                {...register("totalCost", { valueAsNumber: true })}
                required
              />
            </div>

            <div className="input-box">
              <label htmlFor="costPerUnit">Cost Per Unit</label>
              <input
                type="number"
                id="costPerUnit"
                name="costPerUnit"
                placeholder="please enter cost per unit"
                {...register("costPerUnit", { valueAsNumber: true })}
                required
                // readOnly
              />
            </div>

            <div className="input-box">
              <label htmlFor="purchaseDate">Purchase Date</label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                placeholder="please enter purchase date"
                {...register("purchaseDate", { valueAsDate: true })}
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
          records={stockList}
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

export default AddStock;

AddStock.Layout = MainLayout;

// export async function getServerSideProps() {
//   const stockList = await prisma.productType.findMany();
//   console.log("USER LIST : ", stockList);
//   return {
//     props: {
//       data: JSON.parse(JSON.stringify(stockList)),
//     },
//   };
// }
