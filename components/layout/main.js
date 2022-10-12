import { useState } from "react";
import Sidebar from "../sidebar/Sidebar";

const MainLayout = ({ children }) => {
  const [width, setWidth] = useState("85%");
  const [marginLeft, setMarginLeft] = useState("15%");

  const getProperties = (isActive) => {
    const width = isActive ? "96%" : "85%";
    const margin = isActive ? "4%" : "15%";
    console.log("getData()..", isActive);
    setWidth(width);
    setMarginLeft(margin);
  };

  return (
    <>
      {/* <Sidebar onActive={getProperties} /> */}
      <Sidebar onActive={getProperties} />
      <div
        className="main-container"
        style={{ width: width, marginLeft: marginLeft }}
      >
        <div className="child-container">{children}</div>
      </div>
    </>
  );
};

export default MainLayout;
