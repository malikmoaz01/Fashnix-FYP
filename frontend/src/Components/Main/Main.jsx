import React from 'react'
import MyForm from '../MainForm/MyForm'

const Main = (props) => {
  return (
    <div className='main bg-gradient-to-r from-[#000000] to-[#000000] '>
      <h2 className='text-left font-medium md:text-lg text-orange-300 m-2.5 ml-5 text-base'>{props.heading}</h2>
      <MyForm />
    </div>
  )
}

export default Main