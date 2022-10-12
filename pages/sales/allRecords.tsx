import React, { useEffect, useState } from "react";
import MainCard from "../../components/cards/MainCard";
import DataTable from "../../components/datatable/DataTable";
import { MainLayout } from "../../components/layout";
import Router from "next/router";

const AllRecords = () => {
  const [isEditOpretion, setIsEditOpretion] = useState(false);
  const [saleProductList, setSaleProductList] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [productTypeId, setProductTypeId] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  useEffect(() => {
    getSaleProductList();
  }, []);

  const getSaleProductList = async () => {
    try {
      const response = await fetch("/api/sale", {
        method: "GET",
      });
      const resp = await response.json();
      setSaleProductList(resp);

      console.log("##getSaleProductList() : ", saleProductList);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmToDelete = (productTypeId) => {
    setProductTypeId(productTypeId);
    setIsDialogOpen(true);
  };

  const handleEdit = async (saleProductId) => {
    sessionStorage.setItem("saleProductId", saleProductId);
    Router.push("/sales/addSale");
  };

  return (
    <section onClick={() => setShowAutocomplete(false)}>
      <MainCard title="Sale All Records">
        <DataTable
          headers={headers}
          records={saleProductList}
          deleteRecord={confirmToDelete}
          editRecord={handleEdit}
        ></DataTable>
      </MainCard>
    </section>
  );
};

export default AllRecords;

AllRecords.Layout = MainLayout;
