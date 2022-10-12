import { useState } from "react";
import Link from "next/link";

export default function SidebarItem({ item }) {
  const [open, setOpen] = useState(false);

  if (item.childrens) {
    return (
      <div className="main-item">
        <span className="menu" onClick={() => setOpen(!open)}>
          {item.icon && <i className={item.icon}></i>}
          <span className="item-title">
            {item.title}
            {/* <i className="fa fa-chevron-up toggle-btn toggle-down"></i> */}
            
            <i className={`fa fa-chevron-up toggle-btn ${open ? 'toggle-up' : 'toggle-down'}`}></i>
          </span>
        </span>
        <div className={open ? "sub-item" : "sub-item-close"}>
          {item.childrens.map((child, index) => (
            <SidebarItem key={index} item={child} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      // <Link href="/" ><a className={`item-list-link ${active ? '' : 'item-list-padding-left'}`}>

      <Link href={item.path || "#"}>
        <div className="main-item">
          <span className="menu" onClick={() => setOpen(!open)}>
            {item.icon && <i className={item.icon}></i>}
            <span className="item-title">
              {item.title}
            </span>
          </span>
         
        </div>
      </Link>
    );
  }
}
