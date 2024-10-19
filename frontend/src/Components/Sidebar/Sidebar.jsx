import React, { useEffect, useState } from 'react'
import alertLogo from '../../assets/alert.png'
import analysisLogo from '../../assets/analysis.png'
import dashboardLogo from '../../assets/dashboard.png'
import gptLogo from '../../assets/gpt.png'
import indicatorLogo from '../../assets/indicator.png'
import ingestionLogo from '../../assets/ingestion.png'
import libraryLogo from '../../assets/library.png'
import nkLogo from '../../assets/nk.png'
import reportsLogo from '../../assets/reports.png'
import settingsLogo from '../../assets/setting.png'
import cosmoLogo from '../../assets/cosmo.png'
import { NavLink , useLocation } from 'react-router-dom'

const Sidebar = () => {

  const location = useLocation()
  
  const elements = [
    {
      elementName: "Dashboard",
      elementLogo: dashboardLogo,
      elementNav: "/"
    },
    {
      elementName: "Product Management",
      elementLogo: ingestionLogo, 
      elementNav: "/product_management"
    },
    {
      elementName: "Order Management",
      elementLogo: reportsLogo, 
      elementNav: "/order_management"
    },
    {
      elementName: "Customer Management",
      elementLogo: indicatorLogo, 
      elementNav: "/customer_management"
    },
    {
      elementName: "Sales Reports",
      elementLogo: analysisLogo, 
      elementNav: "/sales_reports"
    },
    {
      elementName: "Discount Management",
      elementLogo: libraryLogo, 
      elementNav: "/discount_management"
    },
    {
      elementName: "Notifications",
      elementLogo: alertLogo, 
      elementNav: "/notifications"
    },
    {
      elementName: "Product Recommendations",
      elementLogo: gptLogo, 
      elementNav: "/product_recommendations"
    },
    {
      elementName: "Shipping Management",
      elementLogo: nkLogo, 
      elementNav: "/shipping_management"
    },
    {
      elementName: "Settings",
      elementLogo: settingsLogo,
      elementNav: "/settings"
    },
  ];
  
  const [activeElement , setActiveElement] = useState(location.pathname);

  useEffect(()=>{
    setActiveElement(location.pathname)
  } , [location.pathname])

  return (
    <div className='sideba w-1/5 md:h-[100vh] bg-gradient-to-b from-[#000D51] to-black sticky top-0 h-[500px]'>
    <img src={cosmoLogo} alt="Cosmo Logo" className='cosmoImg md:m-8 m-2 w-12 md:w-24' />

    <ul className='flex flex-col p-2 items-center md:items-start'>
      {elements.map((element , index) => (
        <li key={index} className={`p-2.5 md:w-full ${activeElement===element.elementNav ? 'bg-orange-500 text-white font-medium rounded-lg' : ''}` }
        >
          <NavLink to={element.elementNav} className={`text-sm flex text-center ${activeElement===element.elementNav ? 'bg-orange-500 text-white font-medium' : ' font-light text-[#858EB3]'}`}>
          <img src={element.elementLogo} alt={element.elementName} className='mr-2' />
          <p className='md:block hidden'>{element.elementName}</p>
          </NavLink>
        </li>
      ))}
    </ul>
    
    </div>
  )
}

export default Sidebar