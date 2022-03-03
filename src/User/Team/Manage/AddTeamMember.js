import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import uniqid from "uniqid";
import fireDB, { storage } from '../../../firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AddTeamMember({ displayMembersDiv, teamId }) {

 const user = JSON.parse(localStorage.getItem("currentUser"));

 const initialValues = { id: uniqid(), email: '', name: '', location: '' };

 const [values, setValues] = useState(initialValues);

 const handleChange = e => {
  setValues({
   ...values,
   [e.target.name]: e.target.value
  });
 }

 const [emailDiv, setEmailDiv] = useState(true);
 const [profileDiv, setProfileDiv] = useState(false);

 const showProfileDiv = () => {
  setEmailDiv(false);
  setProfileDiv(true);
 }

 const showEmailDiv = () => {
  setProfileDiv(false);
  setEmailDiv(true);
 }

 const [imgFile, setImgFile] = useState("../../default_pic.png");
 const [imgFileErr, setImgFileErr] = useState(null);
 const types = ['image/png', 'image/jpeg'];

 const choosePic = e => {
  const image = e.target.files[0];
  if (image && types.includes(image.type)) {
   setImgFile(image);
   setImgFileErr(null);
  } else {
   setImgFile("../../default_pic.png");
   setImgFileErr("Please choose an image file (png or jpeg)");
  }
 }

 const [imgUrl, setImgUrl] = useState("");
 const [saveClicked, setSaveClicked] = useState(false);

 const handleUpload = async () => {
  try {
   const uploadTask = ref(storage, `${user.uid}/teams/${teamId}/members/${values.id}`);
   await uploadBytes(uploadTask, imgFile);
   const url = await getDownloadURL(uploadTask);
   setImgUrl(url);
   setSaveClicked(true);
  } catch (err) {
   alert(`Upload error: ${err}`);
  }
 }

 useEffect(() => {
  if (saveClicked) saveChanges();
 }, [saveClicked]);

 const saveChanges = async () => {
  try {
   setSaveClicked(false);
   const docRef = doc(fireDB, "users", `${user.uid}`, "teams", `${teamId}`, "team_members", `${values.id}`);
   const memberInfo = {
    id: values.id,
    name: values.name,
    location: values.location,
    profilePic: imgUrl
   };
   await setDoc(docRef, memberInfo);
   alert("Changes saved");
   setValues(initialValues);
   displayMembersDiv();
  } catch (err) {
   alert(`Change saving error: ${err}`);
  }
 }

 return (
  <div>

   <button onClick={displayMembersDiv}>
    <span>
     <FaArrowLeft size={25}/>
    </span>
   </button>

   {emailDiv && 
    <div style={{display: "flex", flexDirection: "column"}}>
     <p>Enter your teammate's email address:</p>
     <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="E-mail" required/>
     <button onClick={showProfileDiv}>Next</button>
    </div>
   }

   {profileDiv &&
    <div style={{display: "flex", flexDirection: "column"}}>
     <input onChange={choosePic} type="file"/>
     {imgFileErr && <h6>{imgFileErr}</h6>}
     <input type="text" name="name" value={values.name} onChange={handleChange} placeholder="Name" required/>
     <input type="text" name="location" value={values.location} onChange={handleChange} placeholder="Location" required/>
     <button onClick={showEmailDiv}>Back</button>
     <button onClick={handleUpload}>Save</button>
    </div>
   }


  </div>
 );
}