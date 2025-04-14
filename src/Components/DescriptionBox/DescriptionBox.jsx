import React from 'react'
import './DescriptionBox.css'
const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">
                Description
            </div>
            <div className="descriptionbox-nav-box fade">
                Reviews (122)
            </div>
        </div>
        <div className="descriptionbox-description">
            <p>Experience the convenience of premium online shopping with our carefully curated collection. We pride ourselves on offering high-quality products at competitive prices, backed by excellent customer service and fast shipping. Our easy-to-navigate website, secure payment system, and hassle-free return policy ensure a smooth shopping experience.</p>
            <p>Whether you're looking for the latest fashion trends or timeless classics, we've got you covered with products that meet our strict quality standards. Shop with confidence knowing that customer satisfaction is our top priority.</p>
        </div>
    </div>
  )
}

export default DescriptionBox