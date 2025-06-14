import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../../Assets/star_icon.png';
import star_dull_icon from '../../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("S"); // Default size set to "S"

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  // Prevent crash when product is still loading
  if (!product || !product.image) {
    return <div className="loading">Loading product details...</div>;
  }

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="Product thumbnail 1" />
          <img src={product.image} alt="Product thumbnail 2" />
          <img src={product.image} alt="Product thumbnail 3" />
          <img src={product.image} alt="Product thumbnail 4" />
        </div>
        <div className="productdisplay-img">
          <img src={product.image} alt={product.name} className="productdisplay-main-img" />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_dull_icon} alt="star" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.old_price}</div>
          <div className="productdisplay-right-price-new">${product.new_price}</div>
        </div>

        <div className="productdisplay-right-description">
          A lightweight yet cozy hoodie perfect for those crisp winter days. Made with premium breathable cotton blend fabric that provides warmth without bulk.
        </div>

        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div
                key={size}
                className={`size-box ${selectedSize === size ? 'active' : ''}`}
                onClick={() => handleSizeClick(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => addToCart(product.id)}>ADD TO CART</button>

        <p className="productdisplay-right-category">
          <span>Category :</span> Women , T-Shirt , Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tag :</span> Modern , Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
