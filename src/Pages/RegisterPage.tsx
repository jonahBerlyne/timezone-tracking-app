import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../Components/Register/RegisterForm';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import fireDB, { auth } from "../firebaseConfig";
import ProfileSetUpForm from '../Components/Register/ProfileSetUpForm';
import { doc, setDoc } from 'firebase/firestore';
import { findUTCOffset } from '../time';
import "../Styles/Auth.css";

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
 
 const [showZones, setShowZones] = useState<boolean>(false);

 useEffect(() => {
  fetchAPI();

  return () => {
   setShowZones(false);
  }
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

 const register = async (): Promise<any> => {
  try {
   const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
   const docRef = doc(fireDB, "users", `${userCredential.user.uid}`);
   const userZoneData = zoneData.filter(zone => zone.zoneName === values.timezone);
   const utcOffset = findUTCOffset(userZoneData[0].gmtOffset);
   const userInfo = {
    format,
    id: userCredential.user.uid,
    password: values.password,
    timezoneData: {...userZoneData[0], utcOffset}
   };
   await setDoc(docRef, userInfo);
   await updateProfile(userCredential.user, {
    displayName: values.name,
    photoURL: "/Images/default_pic.png"
   });
   alert("Registered");
  } catch (err) {
   alert(`Registration error: ${err}`);
  }
 }

 const goToProfileInputs = (): void => {
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

 const onRadioChange = (e: ChangeEvent<HTMLInputElement>): void => setFormat(e.target.value);

 const isRadioSelected = (value: string): boolean => format === value;

 const formProps = { values, handleChange, onRadioChange, isRadioSelected };

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
 }, [values, zonesConst]);

 return (
  <div>
   {registerForm && 
    <div className='auth'>
     <RegisterForm {...formProps}/>
     <button
      data-testid="profileBtn" 
      className="btn btn-primary get-started-btn" 
      onClick={goToProfileInputs}
      disabled={
       values.email === '' ||
       values.password === '' ||
       values.confirmPassword === '' ||
       values.password !== values.confirmPassword
      }
     >Get Started
     </button>
     <p data-testid="login-link" className='login-link-element'>Already have an account? <Link to="/login" className='auth-link'>Log in here!</Link></p>
    </div>
   }
   {profileSetUpForm && 
    <div className='auth get-started-container'>
     <ProfileSetUpForm {...formProps} countries={countries} zones={zones} showZones={showZones} />
     <div className="profile-set-up-btns">
      <button 
       className="btn btn-primary go-back-btn" 
       onClick={goToRegisterInputs}
      >Go Back
      </button>
      <button
       data-testid="registerBtn" 
       className="btn btn-primary register-btn" 
       onClick={register}
       disabled={
        values.name === '' ||
        values.country === '' ||
        values.timezone === '' ||
        format === ''
       }
      >Register
      </button>
     </div>
    </div>
   }
  </div>
 );
}