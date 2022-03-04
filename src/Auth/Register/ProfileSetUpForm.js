import React, { useState, useEffect } from 'react';

export default function ProfileSetUpForm({ values, handleChange, countries, changeCategory }) {

 return (
  <div>
   <h2>Get Started:</h2>
   <input 
    type="text"
    name="name" 
    className='form-control' placeholder='Name' 
    value={values.name} 
    onChange={handleChange}
    required
   />
   <h4>Select Your Country:</h4>
   <select id="selectBox" name="country" onChange={handleChange} required>
    <option defaultValue="">Choose a country</option>
    {countries.map(country => {
     return (
      <option value={`${country}`}>{country}</option>
     );
    })}
   </select>
   <hr/>
  </div>
 );
}