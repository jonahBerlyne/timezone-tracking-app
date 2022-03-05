import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import fireDB from "../../firebaseConfig";
import ProfileSetUpForm from './ProfileSetUpForm';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {

 const [registerForm, setRegisterForm] = useState(true);
 const [profileSetUpForm, setProfileSetUpForm] = useState(false);

 const initialValues = { email: '', password: '', confirmPassword: '', name: '', country: '', timezone: '' };
 const [values, setValues] = useState(initialValues);
 const auth = getAuth();

 const register = async () => {
  try {
   const userAuth = await createUserWithEmailAndPassword(auth, values.email, values.password);
   const docRef = doc(fireDB, "users", `${userAuth.user.uid}`);
   const userInfo = {
    id: userAuth.user.uid,
    name: values.name,
    location: values.location
   };
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
 }

 const handleChange = e => {
  if (e.target.name === "country") {
   setValues({
    ...values,
    [e.target.name]: e.target.value
   });
  } else {
   setValues({
    ...values,
    [e.target.name]: e.target.value
   });
  }
 }

 const formProps = {values, handleChange};

 const apiKey = process.env.REACT_APP_TIMEZONE_API_KEY;

 useEffect(() => {
  fetchAPI();
 }, []);

 const [countries, setCountries] = useState([]);
 const [zones, setZones] = useState([]);
 const [zonesConst, setZonesConst] = useState([]);

 const fetchAPI = async () => {
  try {
   const data = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key=${apiKey}&format=json`);
   const dataJSON = await data.json();
   // console.log(dataJSON.zones);
   let countriesArr = [];
   let zonesArr = [];
   dataJSON.zones.forEach(zone => {
    console.log();
    countriesArr.push(zone.countryName);
    zonesArr.push(zone);
   });
   setZonesConst(zonesArr);
   // console.log(zonesArr);
   // console.log(dataJSON.zones.filter(x => x.countryCode === "US"));
   // Countries with multiple time zones are Russia, USA, Canada, Australia, Mexico, Brazil, Indonesia, Kazakhstan, Mongolia, the Democratic Republic of the Congo, Kiribati, Micronesia, Chile, Spain, Portugal, and Ecuador
   // console.log(countriesArr);
   // console.log([...new Set(countriesArr)].sort());
   setCountries([...new Set(countriesArr)].sort());
  } catch (err) {
   alert(`Fetching error: ${err}`);
  }
 }

 // useEffect(() => {
 //  console.log(zones);
 // }, [zones]);

 useEffect(() => {
  if (values.country !== "") {
   console.clear();
   const zonesCopy = zonesConst;
   const timezones = zonesCopy.filter(zone => zone.countryName === values.country);
   // console.log(typeof timezones);
   let timezonesArr = [];
   timezones.forEach(timezone => {
    timezonesArr.push(timezone.zoneName);
   });
   // console.log(timezonesArr);
   setZones(timezonesArr);
  }
  if (values.timezone !== "") {
   const timezoneBox = document.getElementById("timezoneBox");
   const selectedValue = timezoneBox.options[timezoneBox.selectedIndex].value;
   console.log(selectedValue);
   // fix this later
  }
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
     <ProfileSetUpForm {...formProps} countries={countries} zones={zones}/>
     <button onClick={goToRegisterInputs}>Go Back</button>
     <button onClick={register}>Register</button>
    </div>
   }
   <Link to="/login">Click Here to Login</Link>
  </div>
 );
}