import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fireDB from "../../firebaseConfig";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail, deleteUser } from "firebase/auth";
import { logout } from '../../App';

export default function AccountSettings() {

 const user = JSON.parse(localStorage.getItem("currentUser"));

 const initialValues = { name: user.userInfo.name, email: user.email, password: '', format: user.userInfo.format, delete: '', reason: '' };

 
 const [values, setValues] = useState(initialValues);
 
 useEffect(() => {
  console.clear();
  console.log(values);
 }, [values]);

 const auth = getAuth();

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
    name: values.name,
    format: values.format
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

 const deleteAccount = async () => {
  if (values.delete !== "DELETE") {
   alert("Type in DELETE to delete your account");
   return;
  }
  if (values.password === '') {
   alert("Please enter your password in the password field to delete your account");
   return;
  }
  try {
   const deletedUserRef = doc(fireDB, "deleted", `${user.uid}`);
   if (values.reason === '') values.reason = "No reason given";
   const deletedUser = {
    name: user.userInfo.name,
    email: user.email,
    reason: values.reason
   }
   await setDoc(deletedUserRef, deletedUser);
   const userDocRef = doc(fireDB, "users", `${user.uid}`);
   await deleteDoc(userDocRef);
   const currentUser = auth.currentUser;
   const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    values.password
   );
   await reauthenticateWithCredential(currentUser, credential);
   await deleteUser(currentUser);
   alert("Account deleted");
   logout();
  } catch (err) {
   alert(`Account deletion error: ${err}`);
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
   <Link to="/account/change_password"><button>Change password</button></Link>
   <div style={{display: "flex", flexDirection: "column"}}>
    <h4>Time format:</h4>
    <div value={values.format} onChange={handleChange}>
     <input type="radio" name="format" checked={values.format === "ampm"} value="ampm"/><label>AM/PM Format</label>
     <input type="radio" name="format" checked={values.format === "MT"} value="MT"/><label>24 Hr. Format</label>
    </div>
    <h4>Location privacy:</h4>
    <input type="radio" name="location"/><label>Show my location to anyone</label>
    <input type="radio" name="location"/><label>Show my location to my team only</label>
    <input type="radio" name="location"/><label>Show my location to only me</label>
   </div>
   <button onClick={saveChanges}>Save changes</button>
   <div style={{display: "flex", flexDirection: "column"}}>
    <label>Please enter your password to save any changes or to delete your account:</label>
    <input type="password" name="password" value={values.password} onChange={handleChange} required/>
   </div>
   <div style={{display: "flex", flexDirection: "column"}}>
    <h4>Delete account:</h4>
    <label>Type DELETE to confirm:</label>
    <input type="text" name="delete" value={values.delete} onChange={handleChange}/>
    <label>Why are you deleting your account? (Optional)</label>
    <textarea rows="10" cols="10" name="reason" value={values.reason} onChange={handleChange}/>
   </div>
   <button onClick={deleteAccount}>Delete my account</button>
  </div>
 );
}