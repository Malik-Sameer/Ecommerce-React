import React, { useContext, useState } from 'react'
import './Navbar.css'
import logo from '../../Assets/logo.png'
import cart_icon from '../../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import HamburgerMenu from '../Hamburgur/Hamburgur'
const Navbar = () => {

    const [menu, setMenu] = useState("shop")
    const{getTotalCartItems}=useContext(ShopContext)
  return (
    <div className='navbar'>
      <Link to='/'><div className="nav-logo" onClick={()=>{setMenu("shop")}}>
       <img src={logo} alt="" />
    <p>SHOPPER</p>
</div></Link>
<ul className='nav-menu'>
<li onClick={()=>{setMenu("shop")}}><Link to='/'>Shop</Link>{menu==="shop"?<hr />:<></>} </li>
<li onClick={()=>{setMenu("men")}}><Link to='/mens'>Men</Link> {menu==="men"?<hr />:<></>} </li>
<li onClick={()=>{setMenu("women")}}> <Link to='/womens'>Women</Link> {menu==="women"?<hr />:<></>} </li>
<li onClick={()=>{setMenu("kids")}}> <Link to='/kids'>Kids</Link> {menu==="kids"?<hr />:<></>} </li>
</ul>
<div className="nav-login-cart">
    <Link to='/login' className='login-button'><button>Login</button></Link> 
    <Link to='/cart'> <img src={cart_icon} alt="" /></Link>
    <div className="nav-cart-count">{getTotalCartItems()}</div>
    <HamburgerMenu/>
</div>

    </div>
  )
}

export default Navbar