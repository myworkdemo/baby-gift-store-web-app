import React, { useState } from "react";
import Link from "next/link";
import items from "./sidebar.json";
import SidebarItem from "./SidebarItem";

const Sidebar = (props) => {
  const [active, setActive] = useState(true);
  const [open, setOpen] = useState(false);

  const handleActive = () => {
    setActive(!active);
    props.onActive(active);
  };

  return (
    <>
      <div className="header">
        <div className="header-container">
          <div className="app-name">Baby Gift Store</div>

          <div className="desktop-menu-icon">
            <i className="fa fa-bars" onClick={() => handleActive()}></i>
          </div>

          <div className="header-icons">
            <i className="fa fa-bell"></i>
            <i className="fa fa-user-circle"></i>
            <i className="fa fa-bars" onClick={() => handleActive()}></i>
          </div>
        </div>
      </div>

      {/* <div className={active ? "sidebar" : "sidebar sidebar-minimize"}> */}
      <div className={`sidebar ${!active ? "sidebar-minimize" : ""}`}>
        <div className="admin-profile">
          <img
            src="/assets/images/admin-profile.png"
            alt=""
            className={
              active ? "admin-profile-img" : "admin-profile-img-minimize"
            }
          />
          <label className={active ? "admin-name" : "admin-name-minimize"}>
            ADMIN
          </label>
        </div>

        {/* <ul className="item-list">
          <li>
          <Link href="/" ><a className={`item-list-link ${active ? '' : 'item-list-padding-left'}`}>
              <i className="fa fa-user-circle"></i>
              <span className="link-name">Dashboard
              <i class="fa fa-chevron-down"></i>
              </span>
            </a>
            </Link>
          </li>
        </ul> */}

        <div className="item-list">
          {items.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
