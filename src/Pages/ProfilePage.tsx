import React, { useState, useEffect, ChangeEvent } from 'react';
import Profile from "../Components/Profile/Profile";
import EditProfile from "../Components/Profile/EditProfile";
import fireDB, { auth } from '../firebaseConfig';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { findUTCOffset } from '../Components/Time';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { logout, selectUser } from '../Redux/userSlice';
import { deleteUser, EmailAuthCredential, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updateProfile, User, getAuth } from 'firebase/auth';
import "../Styles/Profile.css";
import { Avatar } from '@mui/material';

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
  setImgPreview(auth.currentUser?.photoURL);
  setFormat(user?.format);
 }

 const initialValues = { name: getAuth().currentUser?.displayName, country: "", timezone: "", email: getAuth().currentUser?.email, password: '', delete: '', reason: '' };

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
 const [imgPreview, setImgPreview] = useState<any>(getAuth().currentUser?.photoURL);

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

  useEffect(() => {
   if (imgFile) setImgPreview(URL.createObjectURL(imgFile));
   return () => {
     setImgPreview(getAuth().currentUser?.photoURL);
   }
  }, [imgFile]);

 const handleUpload = async (): Promise<any> => {
  if (imgFile === null) return;
  try {
   const uploadTask = ref(storage, `${getAuth().currentUser?.uid}/profilePic`);
   await uploadBytes(uploadTask, imgFile);
   const url = await getDownloadURL(uploadTask);
   let currentUser: any = null;
   if (getAuth().currentUser !== null) {
     currentUser = getAuth().currentUser;
   }
   if (currentUser !== null) {
    await updateProfile(currentUser, {
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
  if (values.password !== user?.password) {
   alert("You have to enter your password in the password field to save your changes");
   return;
  }
  if (!imgFile && (values.name === getAuth().currentUser?.displayName || values.name === '') && (values.email === getAuth().currentUser?.email || values.email === '') && values.country === "" && format === user?.format) {
   alert(`You haven't made any changes, ${getAuth().currentUser?.displayName}.`);
   return;
  }
  if (showZones && values.timezone === "") {
   alert("Please select a new timezone before saving.");
   return;
  }
  try {
   await handleUpload();
   const docRef = doc(fireDB, "users", `${getAuth().currentUser?.uid}`);
   const userZoneData = zoneData.filter(zone => zone.zoneName === values.timezone);
   let utcOffset: number = NaN;
   const currentUser: User | null = getAuth().currentUser;
   if (userZoneData.length > 0 || format !== userInfo?.format) {
    if (userZoneData.length > 0) utcOffset = findUTCOffset(userZoneData[0].gmtOffset);
    const userDoc = {
     ...userInfo,
     email: values.email,
     displayName: values.name,
     photoUrl: imgFile ? URL.createObjectURL(imgFile) : userInfo?.photoUrl,
     timezoneData: values.country !== "" && values.timezone !== "" ? {...userZoneData[0], utcOffset} : userInfo?.timezoneData,
     format
    };
    await setDoc(docRef, userDoc);
   }
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
   const deletedUserRef = doc(fireDB, "deleted", `${getAuth().currentUser?.uid}`);
   if (values.reason === '') values.reason = "No reason given";
   const deletedUser = {
    name: getAuth().currentUser?.displayName,
    email: getAuth().currentUser?.email,
    reason: values.reason
   }
   await setDoc(deletedUserRef, deletedUser);
   if (getAuth().currentUser?.photoURL !== "/Images/default_pic.png") {
    const deletedPicRef = ref(storage, `${getAuth().currentUser?.uid}/profilePic`);
    await deleteObject(deletedPicRef);
   }
   const userDocRef = doc(fireDB, "users", `${getAuth().currentUser?.uid}`);
   await deleteDoc(userDocRef);
   const currentUser: User | null = getAuth().currentUser;
   if (currentUser) {
    const credential = EmailAuthProvider.credential(
     currentUser.email!,
     values.password
    );
    await reauthenticateWithCredential(currentUser, credential);
    await deleteUser(currentUser);
   }
   alert("Account deleted");
   dispatch(logout());
  } catch (err) {
   alert(`Account deletion error: ${err}`);
  }
 }

 const editProps = { values, handleChange, choosePic, imgPreview, imgFileErr, countries, zones, showZones, isRadioSelected, onRadioChange };

 return (
  <div className='profile-page-container'>
   {showProfile &&
    <div className='profile-container'>
     <Profile name={getAuth().currentUser?.displayName} imgUrl={getAuth().currentUser?.photoURL} zoneName={profileZone} format={userInfo?.format} utcOffset={userInfo?.timezoneData.utcOffset} />
     <button data-testid="editProfileBtn" className='btn btn-primary edit-profile-btn' onClick={goToEditProfile}>Edit your profile</button>
    </div> 
   }
   {editProfile &&
    <div className='edit-profile-container'>
     <EditProfile {...editProps} />
     <div className="edit-profile-btns">
      <button className="btn btn-primary profile-btn" onClick={goToProfile}>Go back</button>
      <button data-testid="saveBtn" className="btn btn-success save-changes-btn" onClick={saveChanges}>Save</button>
      <button className="btn btn-danger delete-acct-btn" onClick={deleteAccount}>Delete my account</button>
     </div>
    </div>
   }
  </div>
 );
}