import React from 'react';
import "../../Styles/Auth.css";

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
   <h2 className='auth-header'>Register:</h2>
   <div className="auth-inputs">
    <input
     name="email"
     type="email" 
     className='form-control auth-input' 
     placeholder='Email' 
     value={values.email} 
     onChange={handleChange}
     required
    />
    <input
     name="password" 
     type="password" 
     className='form-control auth-input' placeholder='Password' 
     value={values.password} 
     onChange={handleChange}
     required
    />
    <input 
     name="confirmPassword" 
     type="password" 
     className='form-control auth-input' 
     placeholder='Confirm Password' 
     value={values.confirmPassword} 
     onChange={handleChange}
     required
    />
   </div>
  </div>
 );
}