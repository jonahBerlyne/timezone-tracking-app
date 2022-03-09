import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import uniqid from "uniqid";
import fireDB, { storage } from '../../../firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { findUTCOffset } from '../../../App';

export default function AddTeamMember({ displayMembersDiv, teamId }) {

 const user = JSON.parse(localStorage.getItem("currentUser"));

 const initialValues = { id: uniqid(), email: '', name: '', country: '', timezone: '' };

 const [values, setValues] = useState(initialValues);

 useEffect(() => {
  fetchAPI();
 }, []);

 const [countries, setCountries] = useState([]);
 const [zones, setZones] = useState([]);
 const [zonesConst, setZonesConst] = useState([]);
 const [zoneData, setZoneData] = useState([]);

 const fetchAPI = async () => {
  try {
   const apiKey = process.env.REACT_APP_TIMEZONE_API_KEY;
   const data = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key=${apiKey}&format=json`);
   const dataJSON = await data.json();
   setZoneData(dataJSON.zones);
   let countriesArr = [];
   let zonesArr = [];
   dataJSON.zones.forEach(zone => {
    countriesArr.push(zone.countryName);
    zonesArr.push(zone);
   });
   setZonesConst(zonesArr);
   setCountries([...new Set(countriesArr)].sort());
  } catch (err) {
   alert(`Fetching error: ${err}`);
  }
 }

 const [showZones, setShowZones] = useState(false);

 const handleChange = e => {
  if (e.target.name === "country") {
   setValues({
    ...values,
    [e.target.name]: e.target.value,
    timezone: ""
   });
   setShowZones(false);
   if (e.target.value !== "") {
    setTimeout(() => {
     setShowZones(true);
    }, 0.0000000000000000001);
   }
  } else {
   setValues({
    ...values,
    [e.target.name]: e.target.value
   });
  }
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
 // const [saveClicked, setSaveClicked] = useState(false);

 const handleUpload = async () => {
  try {
   const uploadTask = ref(storage, `${user.uid}/teams/${teamId}/members/${values.id}`);
   await uploadBytes(uploadTask, imgFile);
   const url = await getDownloadURL(uploadTask);
   setImgUrl(url);
   // setSaveClicked(true);
  } catch (err) {
   alert(`Upload error: ${err}`);
  }
 }

 // useEffect(() => {
 //  if (saveClicked) saveChanges();
 // }, [saveClicked]);

 const saveChanges = async () => {
  try {
   await handleUpload();
   // setSaveClicked(false);
   const docRef = doc(fireDB, "users", `${user.uid}`, "teams", `${teamId}`, "team_members", `${values.id}`);
   const userZoneData = zoneData.filter(zone => zone.zoneName === values.timezone);
   const utcOffset = findUTCOffset(userZoneData[0].gmtOffset);
   const memberInfo = {
    id: values.id,
    name: values.name,
    timezoneData: {...userZoneData[0], utcOffset},
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

 useEffect(() => {
  if (values.country !== "") {
   const zonesCopy = zonesConst;
   const timezones = zonesCopy.filter(zone => zone.countryName === values.country);
   let timezonesArr = [];
   timezones.forEach(timezone => {
    timezonesArr.push(timezone.zoneName);
   });
   setZones(timezonesArr);
  }
  console.clear();
  console.log(values);
 }, [values]);

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
     <h4>Name:</h4>
     <input type="text" name="name" value={values.name} onChange={handleChange} required/>
     <h4>Country:</h4>
     <select name="country" onChange={handleChange} required>
      <option defaultValue="" key=""></option>
      {countries.map(country => {
       return (
        <option key={countries.indexOf(country)}>{country}</option>
       );
      })}
     </select>
     {showZones && 
      <div>
       <h4>Timezone:</h4>
       <select name="timezone" onChange={handleChange} required>
        <option defaultValue="" key=""></option>
        {zones.map(zone => {
         return (
          <option key={zones.indexOf(zone)}>{zone}</option>
         );
        })}
       </select>
      </div>
     }
     <br/>
     <br/>
     <button onClick={showEmailDiv}>Back</button>
     <button onClick={saveChanges}>Save</button>
    </div>
   }


  </div>
 );
}