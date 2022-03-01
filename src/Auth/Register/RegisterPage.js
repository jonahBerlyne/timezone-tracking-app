import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import fireDB from "../../firebaseConfig";
import ProfileSetUpForm from './ProfileSetUpForm';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {

 const [registerForm, setRegisterForm] = useState(true);
 const [profileSetUpForm, setProfileSetUpForm] = useState(false);

 const initialValues = {email: '', password: '', confirmPassword: '', name: '', location: ''};
 const [values, setValues] = useState(initialValues);
 const auth = getAuth();

 const register = async () => {
  try {
   const userAuth = await createUserWithEmailAndPassword(auth, values.email, values.password);
   const docRef = doc(fireDB, "users", `${userAuth.user.uid}`);
   const userInfo = {
    id: userAuth.user.uid,
    name: values.name,
    location: values.location
   };
   await setDoc(docRef, userInfo);
   localStorage.setItem("currentUser", JSON.stringify({...userAuth.user, userInfo}));
   localStorage.setItem("teams", JSON.stringify([]));
   alert("Registered");
   window.location.href = '/';
  } catch (err) {
   alert(`Registration error: ${err}`);
  }
 }

 const goToProfileInputs = () => {
  if (values.password !== values.confirmPassword) {
   alert("Password fields must be the same");
   return;
  } 
  setRegisterForm(false);
  setProfileSetUpForm(true);
 }

 const goToRegisterInputs = () => {
  setProfileSetUpForm(false);
  setRegisterForm(true);
 }

 const handleChange = e => {
  setValues({
   ...values,
   [e.target.name]: e.target.value
  });
 }

 const formProps = {values, handleChange};

 return (
  <div>
   {registerForm && 
    <div>
     <RegisterForm {...formProps}/>
     <button onClick={goToProfileInputs}>Get Started</button>
    </div>
   }
   {profileSetUpForm && 
    <div>
     <ProfileSetUpForm {...formProps}/>
     <button onClick={goToRegisterInputs}>Go Back</button>
     <button onClick={register}>Register</button>
    </div>
   }
   <Link to="/login">Click Here to Login</Link>
  </div>
 );
}