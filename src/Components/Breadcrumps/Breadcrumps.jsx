import React from 'react'
import './Breadcrump.css'
import arrow_icon from '../../Assets/breadcrum_arrow.png'

const Breadcrumps = (props) => {

    const {product}=props;
  if (!product || !product.category || !product.name) {
  return <div className='breadcrum'>Loading...</div>;
}

    return (
    <div className='breadcrum'>
    HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" />{product.category} <img src={arrow_icon} alt="" />
    {product.name}
    </div>
  )
}

export default Breadcrumps