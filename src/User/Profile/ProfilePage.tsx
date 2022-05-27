import React, { useState, useEffect, ChangeEvent } from 'react';
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import fireDB, { auth } from '../../firebaseConfig';
import { collection, deleteDoc, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { findUTCOffset } from '../Time';
import { useAppDispatch, useAppSelector } from '../../Redux/hooks';
import { logout, selectUser } from '../../Redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { deleteUser, EmailAuthCredential, EmailAuthProvider, reauthenticateWithCredential, reload, updateEmail, updateProfile, User } from 'firebase/auth';

interface Values {
 name: any;
 country: string;
 timezone: string;
 email: any;
 password: string;
 delete: string;
 reason: string;
};

export default function ProfilePage() {

 const user = useAppSelector(selectUser);

 const [showProfile, setShowProfile] = useState<boolean>(true);
 const [editProfile, setEditProfile] = useState<boolean>(false);

 const goToEditProfile = (): void => {
  setShowProfile(false);
  setEditProfile(true);
 }

 const goToProfile = (): void => {
  setEditProfile(false);
  setShowProfile(true);
  setValues(initialValues);
  setShowZones(false);
  setImgFile(null);
  setFormat(user?.format);
 }

 const initialValues = { name: auth.currentUser?.displayName, country: "", timezone: "", email: auth.currentUser?.email, password: '', delete: '', reason: '' };

 const [values, setValues] = useState<Values>(initialValues);

 const [profileZone, setProfileZone] = useState<string>("");
 const [format, setFormat] = useState<any>(null);

 const [userInfo, setUserInfo] = useState<any>(null);

 useEffect(() => {
  if (user) {
   let zoneStr = user?.timezoneData.zoneName;
   zoneStr = zoneStr.substring(zoneStr.indexOf("/") + 1, zoneStr.length).replace(/_+/g, ' ');
   setProfileZone(zoneStr);
   fetchAPI();
   setFormat(user?.format);
   setUserInfo(user);
  }
 }, [user]);

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

 const isRadioSelected = (value: string): boolean => format === value;

 const onRadioChange = (e: ChangeEvent<HTMLInputElement>): void => setFormat(e.target.value);

 const saveChanges = async (): Promise<any> => {
  if (values.password === '') {
   alert("You have to enter your password in the password field to save your changes");
   return;
  }
  if (!auth.currentUser?.photoURL && values.name === "" && values.country === "") {
   alert(`You haven't made any changes, ${auth.currentUser?.displayName}.`);
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
   let utcOffset: number = NaN;
   if (userZoneData.length > 0 || format !== userInfo?.format) {
    if (userZoneData.length > 0) utcOffset = findUTCOffset(userZoneData[0].gmtOffset);
    const userDoc = {
     ...userInfo,
     timezoneData: values.country !== "" && values.timezone !== "" ? {...userZoneData[0], utcOffset} : userInfo?.timezoneData,
     format
    };
    await setDoc(docRef, userDoc);
   }
   const currentUser: User | null = auth.currentUser;
   if (currentUser) {
    if (values.email !== currentUser?.email) {
     const credential: EmailAuthCredential = EmailAuthProvider.credential(
      currentUser.email!,
      values.password
     );
     await reauthenticateWithCredential(currentUser, credential);
     await updateEmail(currentUser, `${values.email}`);
    }
    if (values.name !== currentUser.displayName) {
     await updateProfile(currentUser, {
      displayName: values.name
     });
    }
   }
   alert("Changes saved");
   window.location.reload();
  } catch (err) {
   alert(`Change saving error: ${err}`);
  }
 }

 const dispatch = useAppDispatch();

 const deleteAccount = async (): Promise<any> => {
  if (values.delete !== "DELETE") {
   alert("Type in DELETE to delete your account");
   return;
  }
  if (values.password === '') {
   alert("Please enter your password in the password field to delete your account");
   return;
  }
  try {
   const deletedUserRef = doc(fireDB, "deleted", `${auth.currentUser?.uid}`);
   if (values.reason === '') values.reason = "No reason given";
   const deletedUser = {
    name: auth.currentUser?.displayName,
    email: auth.currentUser?.email,
    reason: values.reason
   }
   await setDoc(deletedUserRef, deletedUser);
   if (auth.currentUser?.photoURL) {
    const deletedPicRef = ref(storage, `${auth.currentUser?.uid}/profilePic`);
    await deleteObject(deletedPicRef);
   }
   const userDocRef = doc(fireDB, "users", `${auth.currentUser?.uid}`);
   await deleteDoc(userDocRef);
   const currentUser: User | null = auth.currentUser;
   if (currentUser) {
    const credential = EmailAuthProvider.credential(
     currentUser.email!,
     values.password
    );
    await reauthenticateWithCredential(currentUser, credential);
    await deleteUser(currentUser);
   } else {
    return;
   }
   alert("Account deleted");
   dispatch(logout());
  } catch (err) {
   alert(`Account deletion error: ${err}`);
  }
 }

 const editProps = { values, handleChange, choosePic, imgFileErr, countries, zones, showZones, isRadioSelected, onRadioChange };

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
     <EditProfile {...editProps} />
     <button onClick={goToProfile}>Go back</button>
     <button onClick={saveChanges}>Save</button>
     <button onClick={deleteAccount}>Delete my account</button>
    </div>
   }
  </div>
 );
}