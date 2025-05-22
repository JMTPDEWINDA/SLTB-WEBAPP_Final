import React from 'react'
import "./Banner.css"
import bw1 from "../../assets/bw1.jpg"

const banner = () => {
  return (
    <div>
      <img src={bw1} alt="Banner" className="banner-image" />
    </div>
  )
}

export default banner
