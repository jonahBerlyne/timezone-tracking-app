import React, { useState, useEffect } from 'react';
import fireDB from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail, updatePassword } from "firebase/auth";

export default function AccountSettings() {

 const user = JSON.parse(localStorage.getItem("currentUser"));

 const auth = getAuth();

 const initialValues = { name: user.userInfo.name, email: user.email, password: '' };

 const [values, setValues] = useState(initialValues);

 const handleChange = e => {
  setValues({
   ...values,
   [e.target.name]: e.target.value
  });
 }

 const saveChanges = async () => {
  if (values.password === '') {
   alert("You have to enter your password in the password field to save your changes");
   return;
  }
  try {
   const docRef = doc(fireDB, "users", `${user.uid}`);
   const userDoc = await getDoc(docRef);
   const userInfo = {
    ...userDoc.data(),
    name: values.name
   };
   await setDoc(docRef, userInfo);
   localStorage.setItem("currentUser", JSON.stringify({...user, userInfo}));
   const currentUser = auth.currentUser;
   const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    values.password
   );
   await reauthenticateWithCredential(currentUser, credential);
   await updateEmail(currentUser, `${values.email}`);
   localStorage.setItem("currentUser", JSON.stringify({...JSON.parse(localStorage.getItem("currentUser")), email: `${values.email}`}));
   alert("Changes saved");
   window.location = "/account";
  } catch (err) {
   alert(`Change saving error: ${err}`);
  }
 }

 return (
  <div>
   <h1>Account Settings</h1>
   <div style={{display: "flex", flexDirection: "column"}}>
    <h3>Change your account and privacy information:</h3>
    <label>Display name:</label>
    <input type="text" name="name" value={values.name} onChange={handleChange}/>
    <label>Email:</label>
    <input type="email" name="email" value={values.email} onChange={handleChange}/>
   </div>
   <button>Change password</button>
   <div style={{display: "flex", flexDirection: "column"}}>
    <h4>Time format:</h4>
    <input type="radio" name="time"/><label>AM/PM Format</label>
    <input type="radio" name="time"/><label>24 Hr. Format</label>
    <h4>Location privacy:</h4>
    <input type="radio" name="location"/><label>Show my location to anyone</label>
    <input type="radio" name="location"/><label>Show my location to my team only</label>
    <input type="radio" name="location"/><label>Show my location to only me</label>
    <label>Please enter your password to save any changes:</label>
    <input type="password" name="password" value={values.password} onChange={handleChange} required/>
   </div>
   <button onClick={saveChanges}>Save changes</button>
   <div style={{display: "flex", flexDirection: "column"}}>
    <h4>Delete account:</h4>
    <label>Type DELETE to confirm:</label>
    <input type="text"/>
    <label>Why are you deleting your account? (Optional)</label>
    <textarea rows="10" cols="10"/>
   </div>
   <button>Delete my account</button>
  </div>
 );
}