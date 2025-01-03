import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import analysisLogo from "../assets/analysis.png";
import dashboardLogo from "../assets/dashboard.png";
import ingestionLogo from "../assets/ingestion.png";
import indicatorLogo from "../assets/indicator.png";
import libraryLogo from "../assets/library.png";
import nkLogo from "../assets/nk.png";
import reportsLogo from "../assets/reports.png";
import settingsLogo from "../assets/setting.png";
import cosmoLogo from "../assets/cosmo.png";
import gptLogo from '../assets/gpt.png'


const Sidebar = () => {
  const location = useLocation();
  const elements = [
    { elementName: "Dashboard", elementLogo: dashboardLogo, elementNav: "/" },
    { elementName: "Product Management", elementLogo: ingestionLogo, elementNav: "/product_management" },
    { elementName: "Order Management", elementLogo: reportsLogo, elementNav: "/order_management" },
    { elementName: "User Management", elementLogo: indicatorLogo, elementNav: "/user_management" },
    { elementName: "Sales Reports", elementLogo: analysisLogo, elementNav: "/sales_reports" },
    { elementName: "Discount Management", elementLogo: libraryLogo, elementNav: "/discount_management" },
    { elementName: "Product Recommendations", elementLogo: gptLogo, elementNav: "/product_recommendation" },
    { elementName: "Shipping Management", elementLogo: nkLogo, elementNav: "/shipping_management" },
    { elementName: "Settings", elementLogo: settingsLogo, elementNav: "/settings" },
  ];

  const [activeElement, setActiveElement] = useState(location.pathname);

  useEffect(() => {
    setActiveElement(location.pathname);
  }, [location.pathname]);

  return (
    <div className="sidebar w-1/5 md:h-[100vh] bg-gradient-to-b from-[#1F2937] to-[#4B5563] sticky top-0 h-[500px]">
      <img src={cosmoLogo} alt="Cosmo Logo" className="cosmoImg md:m-8 m-2 w-12 md:w-24" />

      <ul className="flex flex-col p-2 items-center md:items-start">
        {elements.map((element, index) => (
          <li
            key={index}
            className={`p-2.5 md:w-full ${activeElement === element.elementNav ? "bg-[#FF7849] text-white font-medium rounded-lg" : ""}`}
          >
            <NavLink
              to={element.elementNav}
              className={`text-sm flex text-center items-center ${activeElement === element.elementNav ? "text-white" : "text-[#9CA3AF]"}`}
            >
              <img src={element.elementLogo} alt={element.elementName} className="mr-2" />
              <p className="md:block hidden">{element.elementName}</p>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
