import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import uniqid from "uniqid";
import fireDB, { auth, storage } from '../../../firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { findUTCOffset } from '../../Time';

interface AddTeamMemberInterface {
 displayMembersDiv: () => void;
 teamId: string | undefined;
};

interface Values {
 id: string | undefined;
 email: string;
 name: string;
 country: string;
 timezone: string;
};

export default function AddTeamMember({ displayMembersDiv, teamId }: AddTeamMemberInterface) {

 const initialValues = { id: uniqid(), email: '', name: '', country: '', timezone: '' };

 const [values, setValues] = useState<Values>(initialValues);

 useEffect(() => {
  fetchAPI();
 }, []);

 const [countries, setCountries] = useState<any[]>([]);
 const [zones, setZones] = useState<any[]>([]);
 const [zonesConst, setZonesConst] = useState<any[]>([]);
 const [zoneData, setZoneData] = useState<any[]>([]);

 const fetchAPI = async (): Promise<any> => {
  try {
   const apiKey = process.env.REACT_APP_TIMEZONE_API_KEY;
   const data = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key=${apiKey}&format=json`);
   const dataJSON = await data.json();
   setZoneData(dataJSON.zones);
   let countriesArr: any[] = [];
   let zonesArr: any[] = [];
   dataJSON.zones.forEach((zone: any) => {
    countriesArr.push(zone.countryName);
    zonesArr.push(zone);
   });
   setZonesConst(zonesArr);
   setCountries([...new Set(countriesArr)].sort());
  } catch (err) {
   alert(`Fetching error: ${err}`);
  }
 }

 const [showZones, setShowZones] = useState<boolean>(false);

 const handleChange = (e: any): void => {
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

 const [emailDiv, setEmailDiv] = useState<boolean>(true);
 const [profileDiv, setProfileDiv] = useState<boolean>(false);

 const showProfileDiv = (): void => {
  setEmailDiv(false);
  setProfileDiv(true);
 }

 const showEmailDiv = (): void => {
  setProfileDiv(false);
  setEmailDiv(true);
 }

 const [imgFile, setImgFile] = useState<any>(null);
 const [imgFileErr, setImgFileErr] = useState<string | null>(null);
 const types: string[] = ['image/png', 'image/jpeg'];

 const choosePic = (e: any): void => {
  const image = e.target.files[0];
  if (image && types.includes(image.type)) {
   setImgFile(image);
   setImgFileErr(null);
  } else {
   setImgFile(null);
   setImgFileErr("Please choose an image file (png or jpeg)");
  }
 }

 const [imgUrl, setImgUrl] = useState<string>("");

 const handleUpload = async (): Promise<any> => {
  if (imgFile === null) {
   setImgUrl("/Images/default_pic.png");
   return;
  }
  try {
   const uploadTask = ref(storage, `${auth.currentUser?.uid}/teams/${teamId}/members/${values.id}`);
   await uploadBytes(uploadTask, imgFile);
   const url = await getDownloadURL(uploadTask);
   setImgUrl(url);
  } catch (err) {
   alert(`Upload error: ${err}`);
  }
 }

 useEffect(() => {
  if (imgUrl !== "") saveChanges();
 }, [imgUrl]);

 const saveChanges = async (): Promise<any> => {
  try {
   const docRef = doc(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamId}`, "team_members", `${values.id}`);
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
   let timezonesArr: any[] = [];
   timezones.forEach(timezone => {
    timezonesArr.push(timezone.zoneName);
   });
   setZones(timezonesArr);
  }
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
     <button onClick={handleUpload}>Save</button>
    </div>
   }


  </div>
 );
}