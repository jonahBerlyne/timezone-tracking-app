import React, { useState, useEffect } from 'react';
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import fireDB from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';

export default function ProfilePage() {

 const user = JSON.parse(localStorage.getItem("currentUser"));

 const [showProfile, setShowProfile] = useState(true);
 const [editProfile, setEditProfile] = useState(false);

 const goToEditProfile = () => {
  setShowProfile(false);
  setEditProfile(true);
 }

 const goToProfile = () => {
  setEditProfile(false);
  setShowProfile(true);
 }

 const [values, setValues] = useState({name: user.userInfo.name, location: user.userInfo.location});

 const handleChange = e => {
  setValues({
   ...values,
   [e.target.name]: e.target.value
  });
 }

 const [imgFile, setImgFile] = useState(null);

 const choosePic = e => {
  const image = e.target.files[0];
  if (image) setImgFile(image);
 }

 const handleUpload = async () => {
  if (imgFile === null) return;
  try {
   const uploadTask = ref(storage, `${user.uid}/profilePic`);
   await uploadBytes(uploadTask, imgFile);
  } catch (err) {
   alert(`Upload error: ${err}`);
  }
 }

 const [refresh, setRefresh] = useState(false);

 const saveChanges = async () => {
  try {
   const docRef = doc(fireDB, "users", `${user.uid}`);
   const userInfo = {
    id: user.uid,
    name: values.name,
    location: values.location
   };
   await setDoc(docRef, userInfo);
   await handleUpload();
   alert("Changes saved");
   localStorage.setItem("currentUser", JSON.stringify({...user, userInfo}));
   setRefresh(!refresh);
  } catch (err) {
   alert(`Change saving error: ${err}`);
  }
 }

 return (
  <div>
   {showProfile &&
    <div>
     <Profile name={user.userInfo.name} location={user.userInfo.location}/>
     <button onClick={goToEditProfile}>Edit your profile or location</button>
    </div> 
   }
   {editProfile &&
    <div>
     <EditProfile values={values} handleChange={handleChange} choosePic={choosePic}/>
     <button onClick={goToProfile}>Go back</button>
     <button onClick={saveChanges}>Save</button>
    </div>
   }
  </div>
 );
}