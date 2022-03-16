import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import fireDB from "../../firebaseConfig";
import ProfileSetUpForm from './ProfileSetUpForm';
import { doc, setDoc } from 'firebase/firestore';
import { findUTCOffset } from '../../User/Time';

export default function RegisterPage() {

 const apiKey = process.env.REACT_APP_TIMEZONE_API_KEY;

 useEffect(() => {
  fetchAPI();
 }, []);

 const [countries, setCountries] = useState([]);
 const [zones, setZones] = useState([]);
 const [zonesConst, setZonesConst] = useState([]);
 const [zoneData, setZoneData] = useState([]);

 const fetchAPI = async () => {
  try {
   const data = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key=${apiKey}&format=json`);
   const dataJSON = await data.json();
   setZoneData(dataJSON.zones);
   let countriesArr = [];
   let zonesArr = [];
   dataJSON.zones.forEach(zone => {
    console.log();
    countriesArr.push(zone.countryName);
    zonesArr.push(zone);
   });
   setZonesConst(zonesArr);
   setCountries([...new Set(countriesArr)].sort());
  } catch (err) {
   alert(`Fetching error: ${err}`);
  }
 }

 const [registerForm, setRegisterForm] = useState(true);
 const [profileSetUpForm, setProfileSetUpForm] = useState(false);

 const initialValues = { email: '', password: '', confirmPassword: '', name: '', country: '', timezone: '', format: '' };
 const [values, setValues] = useState(initialValues);
 const auth = getAuth();

 const register = async () => {
  try {
   const userAuth = await createUserWithEmailAndPassword(auth, values.email, values.password);
   const docRef = doc(fireDB, "users", `${userAuth.user.uid}`);
   const userZoneData = zoneData.filter(zone => zone.zoneName === values.timezone);
   const utcOffset = findUTCOffset(userZoneData[0].gmtOffset);
   const userInfo = {
    format: values.format,
    id: userAuth.user.uid,
    name: values.name,
    timezoneData: userZoneData[0],
    utcOffset: utcOffset
   };
   console.clear();
   console.log(userInfo);
   await setDoc(docRef, userInfo);
   localStorage.setItem("currentUser", JSON.stringify({...userAuth.user, userInfo}));
   localStorage.setItem("teams", JSON.stringify([]));
   alert("Registered");
   window.location.href = '/';
  } catch (err) {
   alert(`Registration error: ${err}`);
  }
 }

 const goToProfileInputs = () => {
  if (values.password !== values.confirmPassword) {
   alert("Password fields must be the same");
   return;
  } 
  setRegisterForm(false);
  setProfileSetUpForm(true);
 }

 const goToRegisterInputs = () => {
  setProfileSetUpForm(false);
  setRegisterForm(true);
  setShowZones(false);
  setValues({
   ...values,
   name: "",
   country: "",
   timezone: "",
   format: ""
  });
 }
 const [showZones, setShowZones] = useState(false);

 const handleChange = e => {
  if (e.target.name === "country") {
   setValues({
    ...values,
    [e.target.name]: e.target.value,
    timezone: "",
    format: ""
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

 const formProps = {values, handleChange};

 // useEffect(() => {
 //  console.log(zones);
 // }, [zones]);


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