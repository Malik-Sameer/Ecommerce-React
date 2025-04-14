import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newletter'>
        <h1>Get Exculsive Offers On Your Email</h1>
        <p>Subscribe to our newletter and stay updated.</p>
        <div>
            <input type="email"  placeholder='Your Email id' required/>
            <button type='submit'>Subscribe</button>
        </div>
    </div>
  )
}

export default NewsLetter