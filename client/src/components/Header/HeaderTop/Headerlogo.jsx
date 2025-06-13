import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../../../assets/img/logokma.jpg"
const Headerlogo = () => {
  return (
    <>
      <div className='w-24'>
        <Link to={"/"}>
            <img src={logo} alt="logo qda" srcset="" />
        </Link>
      </div>
    </>
  )
}

export default Headerlogo
