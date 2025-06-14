import React, { createContext, useEffect, useState } from "react";


export const ShopContext = createContext(null);

const getDefaultCart=()=>{
  let cart={};
  for(let index=0;index< 300+1;index++){
    cart[index]=0;
  }
  return cart;
}

export const ShopContextProvider = (props) => {
  // Add this function inside ShopContextProvider

const clearCart = () => {
  // Reset frontend cart state
  setCartItems(getDefaultCart());

  // Clear cart on backend if user logged in
  if (localStorage.getItem('auth-token')) {
    fetch("http://localhost:4000/clearcart", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem('auth-token')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({}) // no body needed or empty object
    })
    .then((response) => response.json())
    .then((data) => console.log('Backend cart cleared:', data))
    .catch(err => console.error('Error clearing cart on backend:', err));
  }
}


  const [all_product, setAll_Product] = useState([])
  const [cartItems, setCartItems] = useState(getDefaultCart())   
  useEffect(()=>{
      fetch('http://localhost:4000/allproducts').then((response)=>response.json()).then((data)=>setAll_Product(data));
      if(localStorage.getItem('auth-token'))
        {
        fetch('http://localhost:4000/cartitem',{
          method:"POST",
          headers:{
            Accept:'application/form-data',
            'auth-token':`${localStorage.getItem('auth-token')}`,
            "Content-Type":"application/json"
          },
          body:""
        }).then((response)=>response.json()).then((data)=>setCartItems(data));
      }
  },[])


     const addToCart=(itemId)=>{
      setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
      if(localStorage.getItem('auth-token')){
        fetch("http://localhost:4000/addtocart",{
          method:"POST",
          headers:{
            Accept:"application/form-data",
            "auth-token":`${localStorage.getItem('auth-token')}`,
            "Content-Type":"application/json"
          },
          body:JSON.stringify({"itemId":itemId})
        }).then((response)=>response.json())
        .then((data)=>console.log(data))
      }
     }

     const removeFromCart=(itemId)=>{
      setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
      if(localStorage.getItem('auth-token')){
          fetch("http://localhost:4000/removefromcart",{
          method:"POST",
          headers:{
            Accept:"application/form-data",
            "auth-token":`${localStorage.getItem('auth-token')}`,
            "Content-Type":"application/json"
          },
          body:JSON.stringify({"itemId":itemId})
        }).then((response)=>response.json())
        .then((data)=>console.log(data))
      }
     }
     const getTotalCartAmount=()=>{
      let totalAmount=0;
      for(const item in cartItems){
        if(cartItems[item]>0){
              let itemInfo = all_product.find((product)=>product.id===Number(item))
              totalAmount += itemInfo.new_price * cartItems[item]
        }
        
      }
      return totalAmount;
     }

     const getTotalCartItems=()=>{
      let totalItems=0;
      for(const item in cartItems){
        if(cartItems[item]>0){
          totalItems+=cartItems[item]
        }
      }
      return totalItems
     }

     const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart ,clearCart};

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
