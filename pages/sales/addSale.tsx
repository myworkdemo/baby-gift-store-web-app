import React, { useEffect, useState } from "react";
import { MainLayout } from "../../components/layout";
import MainCard from "../../components/cards/MainCard";
import DataTable from "../../components/datatable/DataTable";
import { PrismaClient } from "@prisma/client";
import CunformationDialogBox from "../../components/alerts/CunformationDialogBox";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SaleProduct {
  saleProductId: number;
  category: string;
  productName: string;
  productQty: number;
  totalCost: number;
  netCost: number;
  costPerUnit: number;
  saleDate: Date;
  saleTime: string;
  productTypeId_fk: number;
  productType: string;
  productPrice: number;
  discount: number;
  totalDiscount: number;
  discountPercentage: number;
  discountPrice: number;

  // customerDetailsId: number;
  // customerName: string;
  // customerAddress: string;
  // customerMobileNo: string;
}

interface CustomerDetails {
  customerDetailsId: number;
  customerName: string;
  customerAddress: string;
  customerMobileNo: string;
}

interface FormData extends SaleProduct, CustomerDetails {}

// const prisma = new PrismaClient();

const AddSale = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    resetField,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      costPerUnit: 0,
    },
  });

  const discountPercentage = watch("discountPercentage");
  const discountPrice = watch("discountPrice");
  const saleDate = watch("saleDate");
  const saleTime = watch("saleTime");
  const customerName = watch("customerName");

  const headers = [
    {
      headerId: "category",
      header: "Category",
      isVisible: true,
    },
    {
      headerId: "productName",
      header: "ProductName",
      isVisible: true,
    },
    {
      headerId: "productQty",
      header: "ProductQty",
      isVisible: true,
    },
    {
      headerId: "totalCost",
      header: "TotalCost",
      isVisible: true,
    },
    {
      headerId: "costPerUnit",
      header: "CostPerUnit",
      isVisible: true,
    },
    {
      headerId: "saleDate",
      header: "SaleDate",
      isVisible: true,
    },
    {
      headerId: "productTypeId_fk",
      header: "ProductTypeId_fk",
      isVisible: false,
    },
    {
      headerId: "action",
      header: "Action",
      isVisible: true,
    },
  ];

  const [isEditOpretion, setIsEditOpretion] = useState(false);
  const [saleProductList, setSaleProductList] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [autocompleteList, setAutocompleteList] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const [productTypeList, setProductTypeList] = useState([]);
  const [userForm, setUserForm] = useState<FormData>();
  const [msg, setMsg] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [saleProductId, setSaleProductId] = useState(0);
  const [discountType, setDiscountType] = useState(true);

  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [filteredCustomerList, setFilteredCustomerList] = useState([]);
  const [showCustomerList, setShowCustomerList] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState({
    saleDrawer: true,
    custDrawer: true,
  });

  const onSubmit = handleSubmit(async (data: FormData) => {
    try {
      await create(data);
      await getSaleProductList();
      await handleReset();
      setMsg("Product Type saved successfully!");
    } catch (error) {
      console.log(error);
      setMsg("Couldn't save Product Type");
    }
  });

  const handleSubmit2 = async (data: FormData) => {
    console.log("## handleSubmit() : ");

    if (isEditOpretion) {
      await update(data);
    } else {
      await create(data);
    }

    await getSaleProductList();
    await getExistingCustomerList();
  };

  async function update(data: FormData) {
    try {
      console.log("##update() : ", data);
      const saleResp = await updateSaleProduct(data);
      const custResp = await updateCustomerDetails(data);
      // await getSaleProductList();
      // if (saleResp) {
      //   console.log("##update() : ", data);
      //   await updateCustomerDetails(data);
      // }
    } catch (error) {
      console.log(error);
    }
  }

  const updateSaleProduct = async (data: SaleProduct) => {
    try {
      console.log("##updateSaleProduct() : ", data);
      const saleResp = await fetch("/api/sale", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      setMsg("Sale Product saved successfully!");
      return saleResp;
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  const updateCustomerDetails = async (data: CustomerDetails) => {
    try {
      console.log("##updateCustomerDetails() : ", data);
      const customerResp = await fetch("/api/customer", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      setMsg("Customer Details saved successfully!");
      return customerResp;
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  async function create(data: FormData) {
    try {
      await fetch("/api/sale", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      // getSaleProductList();
    } catch (error) {
      console.log(error);
    }
  }

  const getSaleProductList = async () => {
    if (saleProductList.length > 0) {
      setSaleProductList([]);
    }

    try {
      console.log("##getSaleProductList() : ");
      const response = await fetch("/api/sale", {
        method: "GET",
      });
      const resp = await response.json();

      setSaleProductList(resp);

      console.log("##getSaleProductList() : ", resp);
      console.log("##getSaleProductList() : ", saleProductList);
    } catch (error) {
      console.log(error);
    }
  };

  const getStockList = async () => {
    try {
      const response = await fetch("/api/stock", {
        method: "GET",
      });
      const resp = await response.json();
      setStockList(resp);
      setAutocompleteList(resp);
      console.log("##resp : ", resp);
      console.log("##getStockList() : ", stockList);
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
      console.log("##getProductTypeList() : ", productTypeList);
    } catch (error) {
      console.log(error);
    }
  };

  const updateDateTime = async () => {
    const currentDate = new Date();
    const currentTime =
      currentDate.getHours() +
      ":" +
      currentDate.getMinutes() +
      ":" +
      currentDate.getSeconds();
    setValue("saleDate", currentDate);
    setValue("saleTime", currentTime);
  };

  useEffect(() => {
    updateDateTime();
    getSaleProductList();
    getProductTypeList();
    getStockList();
    getExistingCustomerList();
    const saleProductId = sessionStorage.getItem("saleProductId");
    if (saleProductId) {
      handleEdit(saleProductId);
    }
    // console.log("##saleDate: ", saleDate);
    console.log("##saleTime: ", saleTime);
    console.log("##useEffect() : ", customerList);
  }, []);

  const deleteRecord = async (saleProductId) => {
    // alert("deleteRecord() : " + saleProductId);
    try {
      const response = await fetch(
        `/api/sale?saleProductId=${saleProductId}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "DELETE",
        }
      );
      const resp = await response.json();
      await getSaleProductList();
    } catch (error) {
      console.log(error);
    }
    setIsDialogOpen(false);
    setSaleProductId(0);
  };

  const confirmToDelete = (saleProductId) => {
    setSaleProductId(saleProductId);
    setIsDialogOpen(true);
  };

  const autocomplete = (productName) => {
    setValue("productName", productName);
    const filtered = stockList.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(productName.toLowerCase())
      )
    );

    if (productName) {
      setShowAutocomplete(true);
    }

    setAutocompleteList(filtered);
  };

  const getProductTypeById = async (productTypeId_fk: number) => {
    try {
      const response = await fetch(
        `/api/masters?productTypeId=${productTypeId_fk}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        }
      );
      const resp = await response.json();

      setValue("productType", resp.productTypeName);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductDetails = async (productName) => {
    setValue("productName", productName);

    const filtered = stockList.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(productName.toLowerCase())
      )
    );

    await getProductTypeById(filtered[0].productTypeId_fk);

    setValue("productTypeId_fk", filtered[0].productTypeId_fk);
    setValue("category", filtered[0].category);
    setValue("productPrice", filtered[0].costPerUnit);

    setValue("costPerUnit", 10);

    console.log("getProductDetails() : ", getValues("productName"));
  };

  const calculateTotalCost = () => {
    const productQty =
      getValues("productQty") && getValues("productQty") > 0
        ? getValues("productQty")
        : 0;

    const productPrice =
      getValues("productPrice") && getValues("productPrice") > 0
        ? getValues("productPrice")
        : 0;

    const discount = discountType
      ? getValues("discountPercentage")
      : getValues("discountPrice");

    console.log(
      discount,
      ", ",
      getValues("discountPercentage"),
      ", ",
      getValues("discountPrice")
    );

    if (discountType) {
      const price = Math.ceil(
        (productPrice / 100) * getValues("discountPercentage")
      );
      setValue("discountPrice", price);
    } else {
      const percentage = Math.floor(
        (getValues("discountPrice") / productPrice) * 100
      );
      setValue("discountPercentage", percentage);
    }

    const totalCost = productQty * productPrice;
    setValue("totalCost", totalCost);

    const netCost =
      productQty * productPrice -
      (getValues("discountPrice")
        ? getValues("discountPrice") * productQty
        : 0);
    setValue("netCost", netCost);

    const totalDiscount =
      productQty *
      (getValues("discountPrice") ? getValues("discountPrice") : 0);
    setValue("totalDiscount", totalDiscount);

    if (productQty === 0) {
      setValue("discountPercentage", 0);
      setValue("discountPrice", 0);
    }
  };

  const handleReset = async () => {
    reset();
    setIsEditOpretion(false);
    setIsExistingCustomer(false);
    setShowCustomerList(false);
    await updateDateTime();
  };

  const getCustomerDetailsById = async (customerId: number) => {
    try {
      const response = await fetch(`/api/customer?customerId=${customerId}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });
      const customerResp = await response.json();

      return customerResp;
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (saleProductId) => {
    try {
      const response = await fetch(`/api/sale?saleProductId=${saleProductId}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });
      const saleResp = await response.json();
      let customerResp = null;
      if (saleResp) {
        customerResp = await getCustomerDetailsById(saleResp.productTypeId_fk);

        if (saleResp && customerResp) {
          setValue("saleProductId", saleResp.saleProductId);
          setValue("productName", saleResp.productName);
          setValue("productType", saleResp.productType);
          setValue("category", saleResp.category);
          setValue("productPrice", saleResp.productPrice);
          setValue("productQty", saleResp.productQty);
          setValue("discountPercentage", saleResp.discountPercentage);
          setValue("discountPrice", saleResp.discountPrice);
          setValue("totalCost", saleResp.totalCost);
          setValue("saleDate", new Date(saleResp.saleDate));
          setValue("saleTime", saleResp.saleTime);

          setValue("customerDetailsId", customerResp.customerDetailsId);
          setValue("customerName", customerResp.customerName);
          setValue("customerAddress", customerResp.customerAddress);
          setValue("customerMobileNo", customerResp.customerMobileNo);
        }
      }

      console.log("handleEdit(): ", saleResp);
      setIsEditOpretion(true);
    } catch (error) {
      console.log(error);
    }

    sessionStorage.removeItem("saleProductId");
  };

  const getExistingCustomerList = async () => {
    try {
      const response = await fetch("/api/customer", {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });
      const resp = await response.json();
      setCustomerList([...resp]);
      console.log("##resp : ", resp);
      console.log("##getExistingCustomerList() : ", customerList);
    } catch (error) {
      console.log(error);
    }
  };

  const findExistingCustomer = async (customerName: string) => {
    // alert(customerName)
    console.log("findExistingCustomer : ", customerName);
    const customers = customerList.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(customerName.toLowerCase())
      )
    );
    setFilteredCustomerList([...customers]);
  };

  const handleSelectCustomer = (data) => {
    setValue("customerName", data.customerName);
    setValue("customerAddress", data.customerAddress);
    setValue("customerMobileNo", data.customerMobileNo);

    if (data.customerName && data.customerAddress && data.customerMobileNo) {
      setShowCustomerList(false);
    }
    console.log("handleSelectCustomer()  : ", showCustomerList);
  };

  useEffect(() => {
    if (isExistingCustomer && showCustomerList && customerName) {
      findExistingCustomer(customerName);
    } else {
      setFilteredCustomerList([]);
    }
  }, [isExistingCustomer, showCustomerList, customerName]);

  return (
    <section
      onClick={() => {
        setShowAutocomplete(false);
        setShowCustomerList(false);
      }}
    >
      <MainCard title={`${isEditOpretion ? "Edit" : "Add"} Sale`}>
        <form onSubmit={handleSubmit(handleSubmit2)}>
          <div className="drawer-container">
            <span
              className="drawer-header"
              onClick={() => {
                setIsDrawerOpen((isDrawerOpen) => ({
                  ...isDrawerOpen,
                  ...{ saleDrawer: !isDrawerOpen.saleDrawer },
                }));
              }}
            >
              Sale Details
              <i
                className={`fa fa-chevron-down ${
                  isDrawerOpen.saleDrawer
                    ? "drawer-icon-up"
                    : "drawer-icon-down"
                }`}
              ></i>
            </span>

            <div
              className={isDrawerOpen.saleDrawer ? "drawer" : "drawer-close"}
            >
              <div className="drawer-body">
                <div className="form-row">
                  <div className="input-box">
                    <label htmlFor="productName">Product Name</label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      placeholder="please enter product name"
                      onChange={(e) => autocomplete(e.target.value)}
                      value={getValues("productName")}
                      autoComplete="off"
                      required
                    />
                    {/* hidden={(getValues('productName')) ? false : true} */}
                    <div
                      className={`autocomplete ${
                        autocompleteList.length >= 8
                          ? "autocomplete-scroll"
                          : ""
                      }`}
                      hidden={!showAutocomplete}
                    >
                      <ul>
                        {autocompleteList.map((val, idx) => (
                          <li
                            onClick={() => getProductDetails(val.productName)}
                            key={idx}
                          >
                            {val.productName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="input-box">
                    <label htmlFor="productType">Product Type</label>
                    <input
                      type="text"
                      id="productType"
                      name="productType"
                      placeholder="please enter product type"
                      className="input-box-read-only"
                      {...register("productType")}
                      required
                      readOnly
                    />
                  </div>

                  <div className="input-box">
                    <label htmlFor="productCategory">Product Category</label>
                    <input
                      type="text"
                      id="productCategory"
                      name="productCategory"
                      placeholder="please enter product category"
                      className="input-box-read-only"
                      {...register("category")}
                      required
                      readOnly
                    />
                  </div>
                </div>
                {/* form-row end */}

                <div className="form-row">
                  <div className="input-box">
                    <label htmlFor="productPrice">Product Price</label>
                    <input
                      type="text"
                      id="productPrice"
                      name="productPrice"
                      placeholder="please enter product price"
                      className="input-box-read-only"
                      {...register("productPrice", { valueAsNumber: true })}
                      min={0}
                      required
                      readOnly
                    />
                  </div>

                  <div className="input-box">
                    <label htmlFor="productQty">Product Quantity</label>
                    <input
                      type="number"
                      id="productQty"
                      name="productQty"
                      placeholder="please enter product quantity"
                      onChange={(e) => {
                        setValue("productQty", parseInt(e.target.value));
                        calculateTotalCost();
                      }}
                      value={getValues("productQty")}
                      // {...register("productQty", { valueAsNumber: true })}
                      required
                      min={0}
                    />
                  </div>

                  <div className="input-box">
                    <label
                      htmlFor="discount"
                      onClick={() => {
                        setDiscountType(!discountType);
                        // calculateTotalCost();
                      }}
                    >
                      Discount{" "}
                      {discountType ? (
                        <label className="discount-type">(in %)</label>
                      ) : (
                        <label className="discount-type">(in RS)</label>
                      )}{" "}
                      <label style={{ fontSize: "11px" }}>(per unit)</label>
                    </label>
                    <input
                      type="number"
                      id={discountType ? "discountPercentage" : "discountPrice"}
                      name={
                        discountType ? "discountPercentage" : "discountPrice"
                      }
                      placeholder={`please enter discount ${
                        discountType ? "Percentage" : "Price"
                      }`}
                      onChange={(e) => {
                        setValue(
                          discountType ? "discountPercentage" : "discountPrice",
                          parseInt(e.target.value)
                        );
                        calculateTotalCost();
                      }}
                      value={
                        discountType ? discountPercentage : discountPrice ?? ""
                      }
                      min={0}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <label
                      htmlFor="discount"
                      onClick={() => setDiscountType(!discountType)}
                    >
                      Discount{" "}
                      {discountType ? (
                        <label className="discount-type">(in RS)</label>
                      ) : (
                        <label className="discount-type">(in %)</label>
                      )}{" "}
                      <label style={{ fontSize: "11px" }}> (per unit)</label>
                    </label>
                    <input
                      type="number"
                      id={discountType ? "discountPrice" : "discountPercentage"}
                      name={
                        discountType ? "discountPrice" : "discountPercentage"
                      }
                      placeholder={`please enter discount ${
                        discountType ? "Price" : "Percentage"
                      }`}
                      value={
                        !discountType ? discountPercentage : discountPrice ?? ""
                      }
                      min={0}
                      className="input-box-read-only"
                      required
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-box">
                    <label htmlFor="totalCost">Total Cost</label>
                    <input
                      type="number"
                      id="totalCost"
                      name="totalCost"
                      placeholder="please enter total cost"
                      className="input-box-read-only"
                      {...register("totalCost", { valueAsNumber: true })}
                      min={0}
                      required
                      readOnly
                    />
                  </div>

                  <div className="input-box">
                    <label htmlFor="totalDiscount">Total Discount (RS)</label>
                    <input
                      type="number"
                      id="totalDiscount"
                      name="totalDiscount"
                      placeholder="please enter total discount"
                      className="input-box-read-only"
                      {...register("totalDiscount", { valueAsNumber: true })}
                      min={0}
                      required
                      readOnly
                    />
                  </div>

                  <div className="input-box">
                    <label htmlFor="netCost">Net Cost</label>
                    <input
                      type="number"
                      id="netCost"
                      name="netCost"
                      placeholder="please enter net cost"
                      className="input-box-read-only"
                      {...register("netCost", { valueAsNumber: true })}
                      min={0}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="drawer-container">
            <span
              className="drawer-header"
              onClick={() => {
                setIsDrawerOpen((isDrawerOpen) => ({
                  ...isDrawerOpen,
                  ...{ custDrawer: !isDrawerOpen.custDrawer },
                }));
              }}
            >
              Customer Details
              <i
                className={`fa fa-chevron-down ${
                  isDrawerOpen.custDrawer
                    ? "drawer-icon-up"
                    : "drawer-icon-down"
                }`}
              ></i>
            </span>

            <div
              className={isDrawerOpen.custDrawer ? "drawer" : "drawer-close"}
            >
              <div className="drawer-body">
                <div className="form-row">
                  <div
                    className="input-box"
                    style={{ width: "15%", height: "56px" }}
                  >
                    <label htmlFor="isExistingCustomer">
                      Is Existing Customer
                    </label>
                    <input
                      type="checkbox"
                      id="isExistingCustomer"
                      name="isExistingCustomer"
                      checked={isExistingCustomer}
                      onChange={() => {
                        setIsExistingCustomer(!isExistingCustomer);
                        setShowCustomerList(true);
                      }}
                    />
                  </div>

                  <div className="input-box">
                    <label htmlFor="customerName">Customer Name</label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      placeholder="please enter customer name"
                      onChange={(e) => {
                        setValue("customerName", e.target.value);
                        setShowCustomerList(true);
                      }}
                      value={customerName}
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div
                    className="customers-list-container"
                    hidden={
                      filteredCustomerList.length === 0 || !showCustomerList
                    }
                  >
                    <table className="customers-list-table">
                      <thead>
                        <tr>
                          <th>Customer Name</th>
                          <th>Address</th>
                          <th>Mobile No</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomerList.map((val, idx) => (
                          <tr onClick={() => handleSelectCustomer(val)}>
                            <td>{val.customerName}</td>
                            <td>{val.customerAddress}</td>
                            <td>{val.customerMobileNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="input-box">
                    <label htmlFor="customerMobileNo">
                      Customer Mobile No.
                    </label>
                    <input
                      type="text"
                      id="customerMobileNo"
                      name="customerMobileNo"
                      placeholder="please enter customer mobile no."
                      {...register("customerMobileNo")}
                      required
                    />
                  </div>

                  <div className="input-box">
                    <label htmlFor="customerAddress">Customer Address</label>
                    <textarea
                      id="customerAddress"
                      name="customerAddress"
                      placeholder="please enter customer address"
                      {...register("customerAddress")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            {/* <input type="submit" name="Save" className="btn submitBtn" /> */}

            {isEditOpretion ? (
              <button type="submit" className="btn submitBtn">
                <i className="fas fa-plus-square"></i>
                Edit
              </button>
            ) : (
              <button type="submit" className="btn submitBtn">
                <i className="fas fa-plus-square"></i>
                Save
              </button>
            )}

            <button type="reset" className="btn" onClick={() => handleReset()}>
              <i className="fas fa-broom"></i>
              Clear
            </button>
            {/* <input type="reset" name="Clear" className="btn" /> */}
          </div>

          <label htmlFor="msg">{msg}</label>
        </form>

        <DataTable
          headers={headers}
          records={saleProductList}
          deleteRecord={confirmToDelete}
          editRecord={handleEdit}
        ></DataTable>

        <CunformationDialogBox
          show={isDialogOpen}
          close={() => setIsDialogOpen(false)}
          deleteRecord={() => deleteRecord(saleProductId)}
        />
      </MainCard>
    </section>
  );
};

export default AddSale;

AddSale.Layout = MainLayout;

// export async function getServerSideProps() {
//   const stockList = await prisma.productType.findMany();
//   console.log("USER LIST : ", stockList);
//   return {
//     props: {
//       data: JSON.parse(JSON.stringify(stockList)),
//     },
//   };
// }
