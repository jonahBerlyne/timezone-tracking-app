import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, getDocs} from "firebase/firestore";
import fireDB from "../firebaseConfig";

export default function Login() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const auth = getAuth();

 const login = async () => {
  try {
   const userAuth = await signInWithEmailAndPassword(auth, email, password);
   const usersCollection = query(collection(fireDB, "users"));
   const usersSnapshot = await getDocs(usersCollection);
   let usersArr = [];
   usersSnapshot.forEach(doc => {
    usersArr.push(doc.data());
   });
   const user = usersArr.filter(user => user.id === userAuth.user.uid);
   const userInfo = user[0];
   localStorage.setItem("currentUser", JSON.stringify({...userAuth.user, userInfo}));
   const teamsCollection = query(collection(fireDB, "users", `${userAuth.user.uid}`, "teams"));
   const teamsSnapshot = await getDocs(teamsCollection);
   let teamsArr = [];
   teamsSnapshot.forEach(doc => {
    teamsArr.push(doc.data());
   });
   localStorage.setItem("teams", JSON.stringify(teamsArr));
   alert("Logged in");
   window.location.href = '/';
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