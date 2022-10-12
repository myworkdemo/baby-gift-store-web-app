import React from "react";

const MainCard = ({ title, children }) => {
  return (
    <div className="main-card-container">
      <div className="main-card-title">{title}</div>
      <div className="main-card-body">{children}</div>
    </div>
  );
};

export default MainCard;
