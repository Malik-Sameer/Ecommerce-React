import React from 'react'
import './NewCollection.css'
import new_collection from '../../Assets/new_collections'
import Items from '../Items/Items'

const NewCollection = () => {
  return (
    <div className='new-collection'>
        <h1>New Collection</h1>
        <hr />
        <div className="collections">
{new_collection.map((item,i)=>{
    return <Items key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
})

}
        </div>
        </div>
  )
}

export default NewCollection