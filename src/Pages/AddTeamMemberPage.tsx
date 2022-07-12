import React, { useState, useEffect } from 'react';
import uniqid from "uniqid";
import fireDB, { auth, storage } from '../firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { findUTCOffset } from '../time';
import "../Styles/Manage.css";
import { Avatar } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

interface Values {
 id: string | undefined;
 email: string;
 name: string;
 country: string;
 timezone: string;
};

export default function AddTeamMemberPage() {

 const teamParam = useParams();

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
   console.error(`Fetching error: ${err}`);
   window.location.reload();
   console.clear();
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

 const [imgFile, setImgFile] = useState<any>(null);
 const [imgFileErr, setImgFileErr] = useState<string | null>(null);
 const types: string[] = ['image/png', 'image/jpeg'];
 const [imgPreview, setImgPreview] = useState<string>("/Images/default_pic.png");

 const choosePic = (e: any): void => {
  const image = e.target.files[0];
  if (image && types.includes(image.type)) {
   setImgFile(image);
   setImgFileErr(null);
  } else {
   setImgFile(null);
   setImgPreview("/Images/default_pic.png");
   setImgFileErr("Please choose an image file (png or jpeg)");
  }
 }

 useEffect(() => {
  if (imgFile) setImgPreview(URL.createObjectURL(imgFile));
 }, [imgFile]);

 const [imgUrl, setImgUrl] = useState<string>("");

 const handleUpload = async (): Promise<any> => {
  if (imgFile === null) {
   setImgUrl("/Images/default_pic.png");
   return;
  }
  try {
   const uploadTask = ref(storage, `${auth.currentUser?.uid}/teams/${teamParam.id}/members/${values.id}`);
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

 const navigate = useNavigate();

 const saveChanges = async (): Promise<any> => {
  try {
   const docRef = doc(fireDB, "users", `${getAuth().currentUser?.uid}`, "teams", `${teamParam.id}`, "team_members", `${values.id}`);
   const userZoneData = zoneData.filter(zone => zone.zoneName === values.timezone);
   const utcOffset = findUTCOffset(userZoneData[0].gmtOffset);
   const memberInfo = {
    id: values.id,
    email: values.email,
    name: values.name,
    timezoneData: {...userZoneData[0], utcOffset},
    profilePic: imgUrl
   };
   await setDoc(docRef, memberInfo);
   alert("Changes saved");
   setValues(initialValues);
   navigate(`/team/${teamParam.id}/manage`);
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
  <div className='add-member-container'>
  
   {countries.length > 0 && 
    <>    
      <div className="add-member-profile-pic-container">
        <Avatar src={imgPreview} alt={`${values.email} profile pic`} />
        <input data-testid="imgInput" onChange={choosePic} type="file"/>
        {imgFileErr && <p data-testid="imgFileErr">{imgFileErr}</p>}
      </div>
      <div className="add-member-name-container">
        <p>Name</p>
        <input data-testid="nameInput" type="text" name="name" value={values.name} onChange={handleChange} placeholder='Name' maxLength={23} required />
      </div>
      <div className='add-member-email-container'>
        <p>Email address</p>
        <input data-testid="emailInput" type="email" name="email" value={values.email} onChange={handleChange} placeholder="E-mail" maxLength={30} required />
      </div>
      <div className="add-member-time-container">
        <div className="add-member-country-container">
        <p>Country</p>
        <select data-testid="countrySelect" name="country" onChange={handleChange} required>
          <option defaultValue="" key=""></option>
          {countries.map(country => {
          return (
            <option key={countries.indexOf(country)}>{country}</option>
            );
            })}
        </select>
        </div>
        {showZones && 
        <div className="add-member-timezone-container">
          <p>Timezone</p>
          <select data-testid="zoneSelect" name="timezone" onChange={handleChange} required>
          <option defaultValue="" key=""></option>
          {zones.map(zone => {
            return (
            <option key={zones.indexOf(zone)}>{zone}</option>
            );
          })}
          </select>
        </div>
        }
      </div>
      <div className="add-team-member-btns">
        <button className='btn btn-primary' onClick={() => navigate(`/team/${teamParam.id}/manage`)}>Go Back</button>
        <button data-testid="saveBtn" className='btn btn-success' onClick={handleUpload}>Save</button>
      </div>
    </>
   }
  </div>
 );
}