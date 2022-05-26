import React, { useState, useEffect } from 'react';
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import fireDB, { auth } from '../../firebaseConfig';
import { collection, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { findUTCOffset } from '../Time';
import { useAppSelector } from '../../Redux/hooks';
import { selectUser } from '../../Redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { reload, updateProfile } from 'firebase/auth';

interface Values {
 name: string;
 country: string;
 timezone: string;
};

export default function ProfilePage() {

 const user = useAppSelector(selectUser);
 const [userInfo, setUserInfo] = useState<any>(null);

 useEffect(() => {
  const docRef = doc(fireDB, "users", `${auth.currentUser?.uid}`);
  const unsub = onSnapshot(docRef, doc => {
   console.log(doc.data());
   setUserInfo(doc.data());
  });
  return unsub;
 }, []);

 const [showProfile, setShowProfile] = useState<boolean>(true);
 const [editProfile, setEditProfile] = useState<boolean>(false);

 const goToEditProfile = (): void => {
  setShowProfile(false);
  setEditProfile(true);
 }

 const goToProfile = (): void => {
  setEditProfile(false);
  setShowProfile(true);
 }

 const initialValues = { name: "", country: "", timezone: "" };

 const [values, setValues] = useState<Values>(initialValues);

 const [profileZone, setProfileZone] = useState<string>("");

 useEffect(() => {
  if (userInfo) {
   let zoneStr = userInfo?.timezoneData.zoneName;
   zoneStr = zoneStr.substring(zoneStr.indexOf("/") + 1, zoneStr.length).replace(/_+/g, ' ');
   setProfileZone(zoneStr);
   fetchAPI();
  }
 }, [userInfo]);

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
   setCountries([...new Set(countriesArr)].sort());
   setZonesConst(zonesArr);
  } catch (err) {
   alert(`Fetching error: ${err}`);
  }
 }

 const [showZones, setShowZones] = useState(false);

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

 useEffect(() => {
  if (values.country !== "") {
   const zonesCopy = zonesConst;
   const timezones = zonesCopy.filter(zone => zone.countryName === values.country);
   let timezonesArr: any[] = [];
   timezones.forEach((timezone: any) => {
    timezonesArr.push(timezone.zoneName);
   });
   setZones(timezonesArr);
  }
 }, [values]);

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

 const handleUpload = async (): Promise<any> => {
  if (imgFile === null) return;
  try {
   const uploadTask = ref(storage, `${auth.currentUser?.uid}/profilePic`);
   await uploadBytes(uploadTask, imgFile);
   const url = await getDownloadURL(uploadTask);
   if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
     photoURL: url
    });
   }
  } catch (err) {
   alert(`Upload error: ${err}`);
  }
 }

 const [refresh, setRefresh] = useState(false);

 const navigate = useNavigate();

 const saveChanges = async () => {
  if (!auth.currentUser?.photoURL && values.name === "" && values.country === "") {
   alert(`You haven't made any changes, ${userInfo?.name}.`);
   return;
  }
  if (showZones && values.timezone === "") {
   alert("Please select a new timezone before saving.");
   return;
  }
  try {
   await handleUpload();
   const docRef = doc(fireDB, "users", `${auth.currentUser?.uid}`);
   const userZoneData = zoneData.filter(zone => zone.zoneName === values.timezone);
   if (userZoneData.length > 0) {
    const utcOffset = findUTCOffset(userZoneData[0].gmtOffset);
    console.log(utcOffset);
    const userDoc = {
     ...userInfo,
     timezoneData: values.country !== "" && values.timezone !== "" ? {...userZoneData[0], utcOffset} : userInfo?.timezoneData
    };
    await setDoc(docRef, userDoc);
   }
   if (values.name !== "" && auth.currentUser) {
    await updateProfile(auth.currentUser, {
     displayName: values.name
    });
   }
   alert("Changes saved");
   if (values.name !== "" && auth.currentUser) reload(auth.currentUser);
   window.location.reload();
  } catch (err) {
   alert(`Change saving error: ${err}`);
  }
 }

 return (
  <div>
   {showProfile &&
    <div>
     <Profile name={auth.currentUser?.displayName} zoneName={profileZone} imgUrl={auth.currentUser?.photoURL} format={userInfo?.format} utcOffset={userInfo?.timezoneData.utcOffset} />
     <button onClick={goToEditProfile}>Edit your profile or location</button>
    </div> 
   }
   {editProfile &&
    <div>
     <EditProfile values={values} handleChange={handleChange} choosePic={choosePic} imgFileErr={imgFileErr} countries={countries} zones={zones} showZones={showZones}/>
     <button onClick={goToProfile}>Go back</button>
     <button onClick={saveChanges}>Save</button>
    </div>
   }
  </div>
 );
}