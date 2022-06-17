import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig';
import "../Styles/Auth.css";

export default function Login() {
 const [email, setEmail] = useState<string>('');
 const [password, setPassword] = useState<string>('');

 const signIn = async (): Promise<any> => {
  try {
   await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
   alert(`Login error: ${err}`);
  }
 }

 return (
  <div className='auth'>
   <h2 className='auth-header'>Log in</h2>
   <div className="auth-inputs">
    <input
     type="email" 
     data-testid="Email" 
     className='form-control auth-input' placeholder='Email' 
     value={email} 
     onChange={(e) => {setEmail(e.target.value)}}
    />
    <input 
     type="password" 
     data-testid="Password"
     className='form-control auth-input' placeholder='Password' 
     value={password} 
     onChange={(e) => {setPassword(e.target.value)}}
    />
   </div>
   <button 
    className='my-3 btn btn-primary login-btn' onClick={signIn}
    disabled={
     email === "" ||
     password === ""
    }>Log in
   </button>
   <p data-testid="register-link" className='register-link-element'>Don't have an account? <Link to="/register" className='auth-link'>Sign up now!</Link></p>
  </div>
 );
}