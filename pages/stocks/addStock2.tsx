
import React, { useState } from "react";
import { MainLayout } from "../../components/layout";
import MainCard from "../../components/cards/MainCard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

const AddStock = ({ data }) => {
  const [userForm, setUserForm] = useState<UserFormData>();
  const [imgURL, setImgURL] = useState("");

  async function create(data: UserFormData) {
    console.log("##profilePhoto_2 : ", data);
    console.log("##profilePhoto_stringify : ", JSON.stringify(data));
    try {
      fetch("/api/stock", {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (data: UserFormData) => {
    console.log("## handleSubmit() : ");
    try {
      create(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeDate = (e) => {
    var date = new Date(e.target.value);
    setUserForm({ ...userForm, purchaseDate: date });
  };

  const onChangeFile = async (e) => {
    if (e) {
      let files = e.target.files;
      var imageUrl = URL.createObjectURL(files[0]);
      // setImgURL(imageUrl);
      console.log("imageUrl : ", files[0]);

      const base64String = await convertBlobToBase64(files[0]);
      setImgURL(imageUrl);
      // setUserForm({ ...userForm, profilePhoto: base64String.toString() });
    }
  };

  const convertBlobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  return (
    <div>
      <MainCard title="Add Stock">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(userForm);
          }}
        >
          <table border={1}>
            <tbody>
              <tr>
                <th>category</th>{" "}
                <td>
                  {" "}
                  <input
                    onChange={(e) =>
                      setUserForm({ ...userForm, category: e.target.value })
                    }
                  />{" "}
                </td>
              </tr>
              <tr>
                <th>productSuplier</th>{" "}
                <td>
                  {" "}
                  <input
                    onChange={(e) =>
                      setUserForm({ ...userForm, productSuplier: e.target.value })
                    }
                  />{" "}
                </td>
              </tr>
              <tr>
                <th>productName</th>{" "}
                <td>
                  {" "}
                  <input
                    type="text"
                    onChange={(e) =>
                      setUserForm({ ...userForm, productName: e.target.value })
                    }
                  />{" "}
                </td>
              </tr>
              <tr>
                <th>productQty</th>{" "}
                <td>
                  {" "}
                  <input
                    onChange={(e) =>
                      setUserForm({ ...userForm, productQty: parseInt(e.target.value) })
                    }
                  />{" "}
                </td>
              </tr>
              <tr>
                <th>totalCost</th>{" "}
                <td>
                  {" "}
                  <input
                   onChange={(e) =>
                    setUserForm({ ...userForm, totalCost: parseInt(e.target.value) })
                  }
                  />{" "}
                </td>
              </tr>
              <tr>
                <th>costPerUnit</th>{" "}
                <td>
                  {" "}
                  <input
                   onChange={(e) =>
                    setUserForm({ ...userForm, costPerUnit: parseInt(e.target.value) })
                  }
                  />{" "}
                </td>
              </tr>
              <tr>
                <th>productTypeId_fk</th>{" "}
                <td>
                  {" "}
                  <input
                   onChange={(e) =>
                    setUserForm({ ...userForm, productTypeId_fk: parseInt(e.target.value) })
                  }
                  />{" "}
                </td>
              </tr>
              <tr>
                <th>Date</th>{" "}
                <td>
                  {" "}
                  <input type="date" onChange={onChangeDate} />{" "}
                </td>
               
              </tr>
            </tbody>
          </table>

          <input type="submit" name="Save" />
        </form>

        <table border={1} style={{ marginTop: "40px" }}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email Id</th>
            </tr>
          </thead>

          <tbody>
            {data.map((val, idx) => (
              <tr key={idx}>
                <td>{val.productStockId}</td>
                <td>{val.category}</td>
                <td>{val.productSuplier}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </MainCard>
    </div>
  );
};

export default AddStock;

AddStock.Layout = MainLayout;

export async function getServerSideProps() {
  const userList = await prisma.productStock.findMany();
  console.log("USER LIST : ", userList);
  return {
    props: {
      data: JSON.parse(JSON.stringify(userList)),
    },
  };
}
