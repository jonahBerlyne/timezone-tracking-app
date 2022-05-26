import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Login() {
 const [email, setEmail] = useState<string>('');
 const [password, setPassword] = useState<string>('');

 const navigate = useNavigate();

 const login = async (): Promise<any> => {
  try {
   await signInWithEmailAndPassword(auth, email, password);
   alert("Logged in");
   navigate('/');
  } catch (err) {
   alert(`Error: ${err}`);
  }
 }

 return (
  <div>
   <h2>Login:</h2>
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
   <button className='my-3' onClick={login}>Login</button>
   <hr/>
   <Link to="/register">Click Here to Register</Link>
  </div>
 );
}