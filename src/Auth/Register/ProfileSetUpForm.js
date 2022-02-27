import React from 'react';

export default function ProfileSetUpForm({ values, handleChange }) {
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
   <input 
    type="text"
    name="location" 
    className='form-control' placeholder='Location' 
    value={values.location} 
    onChange={handleChange}
    required
   />
   <hr/>
  </div>
 );
}