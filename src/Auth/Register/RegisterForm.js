import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import fireDB from "../../firebaseConfig";

export default function RegisterForm() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const auth = getAuth();

 const register = async () => {
  if (password !== confirmPassword) return;
  try {
   const result = await createUserWithEmailAndPassword(auth, email, password);
   localStorage.setItem("currentUser", JSON.stringify(result));
   alert("Registered");
   window.location.href = '/';
  } catch (err) {
   alert(`Registration error: ${err}`);
  }
 }
 return (
  <div>
   <h2>Register:</h2>
   <input 
    type="email" 
    className='form-control' placeholder='Email' 
    value={email} 
    onChange={(e) => {setEmail(e.target.value)}}
   />
   <input 
    type="password" 
    className='form-control' placeholder='Password' 
    value={password} 
    onChange={(e) => {setPassword(e.target.value)}}
   />
   <input 
    type="password" 
    className='form-control' placeholder='Confirm Password' 
    value={confirmPassword} 
    onChange={(e) => {setConfirmPassword(e.target.value)}}
   />
   <button className='my-3' onClick={register}>Register</button>
   <hr/>
   <Link to="/login">Click Here to Login</Link>
  </div>
 );
}