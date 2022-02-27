import React from 'react';

export default function RegisterForm({ values, handleChange }) {
 return (
  <div>
   <h2>Register:</h2>
   <input 
    type="email"
    name="email" 
    className='form-control' placeholder='Email' 
    value={values.email} 
    onChange={handleChange}
    required
   />
   <input 
    type="password"
    name="password" 
    className='form-control' placeholder='Password' 
    value={values.password} 
    onChange={handleChange}
    required
   />
   <input 
    type="password"
    name="confirmPassword" 
    className='form-control' placeholder='Confirm Password' 
    value={values.confirmPassword} 
    onChange={handleChange}
    required
   />
   <hr/>
  </div>
 );
}