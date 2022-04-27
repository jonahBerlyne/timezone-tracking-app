import React from 'react';

interface Register {
 values: {
  email: string;
  password: string;
  confirmPassword: string;
 };
 handleChange: (e: any) => void;
}

export default function RegisterForm({ values, handleChange }: Register) {
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