import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import fireDB from "../../firebaseConfig";
import ProfileSetUpForm from './ProfileSetUpForm';
import { doc, setDoc } from 'firebase/firestore';
import { findUTCOffset } from '../../User/Time';

interface Values {
 email: string;
 password: string; 
 confirmPassword: string; 
 name: string; 
 country: string; 
 timezone: string;
}

export default function RegisterPage() {

 const apiKey: string | undefined = process.env.REACT_APP_TIMEZONE_API_KEY;

 useEffect(() => {
  fetchAPI();
 }, []);

 const [countries, setCountries] = useState<any[]>([]);
 const [zones, setZones] = useState<any[]>([]);
 const [zonesConst, setZonesConst] = useState<any[]>([]);
 const [zoneData, setZoneData] = useState<any[]>([]);

 const fetchAPI = async (): Promise<any> => {
  try {
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

 const [registerForm, setRegisterForm] = useState<boolean>(true);
 const [profileSetUpForm, setProfileSetUpForm] = useState<boolean>(false);

 const initialValues = { email: '', password: '', confirmPassword: '', name: '', country: '', timezone: '' };
 const [values, setValues] = useState<Values>(initialValues);
 const [format, setFormat] = useState<string>("");
 const auth = getAuth();

 const register = async (): Promise<any> => {
  if (format === "") return;
  try {
   const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
   const docRef = doc(fireDB, "users", `${userCredential.user.uid}`);
   const userZoneData = zoneData.filter(zone => zone.zoneName === values.timezone);
   const utcOffset = findUTCOffset(userZoneData[0].gmtOffset);
   const userInfo = {
    format,
    id: userCredential.user.uid,
    timezoneData: {...userZoneData[0], utcOffset},
    utcOffset: utcOffset
   };
   await setDoc(docRef, userInfo);
   await updateProfile(userCredential.user, {
    displayName: values.name
   });
   alert("Registered");
  } catch (err) {
   alert(`Registration error: ${err}`);
  }
 }

 const goToProfileInputs = (): void => {
  if (values.password !== values.confirmPassword) {
   alert("Password fields must be the same");
   return;
  } 
  setRegisterForm(false);
  setProfileSetUpForm(true);
 }

 const goToRegisterInputs = (): void => {
  setProfileSetUpForm(false);
  setRegisterForm(true);
  setShowZones(false);
  setValues({
   ...values,
   name: "",
   country: "",
   timezone: ""
  });
  setFormat("");
 }
 const [showZones, setShowZones] = useState<boolean>(false);

 const handleChange = (e: any): void => {
  if (e.target.name === "country") {
   setValues({
    ...values,
    [e.target.name]: e.target.value,
    timezone: ""
   });
   setFormat("");
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

 const onRadioChange = (e: ChangeEvent<HTMLInputElement>): void => {
  setFormat(e.target.value);
 }

 const isRadioSelected = (value: string): boolean => format === value;

 const formProps = {values, handleChange, onRadioChange, isRadioSelected};

 // useEffect(() => {
 //  console.log(zones);
 // }, [zones]);


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
  console.clear();
  console.log(values);
 }, [values]);

 return (
  <div>
   {registerForm && 
    <div>
     <RegisterForm {...formProps}/>
     <button onClick={goToProfileInputs}>Get Started</button>
    </div>
   }
   {profileSetUpForm && 
    <div>
     <ProfileSetUpForm {...formProps} countries={countries} zones={zones} showZones={showZones}/>
     <button onClick={goToRegisterInputs}>Go Back</button>
     <button onClick={register}>Register</button>
    </div>
   }
   <Link to="/login">Click Here to Login</Link>
  </div>
 );
}