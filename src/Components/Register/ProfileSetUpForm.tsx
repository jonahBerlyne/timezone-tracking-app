import React, { ChangeEvent } from 'react';
import "../../Styles/Auth.css";

interface Profile {
 values: {
  name: string
 };
 handleChange: (e: any) => void;
 countries: any[];
 zones: any[];
 showZones: boolean;
 onRadioChange: (e: ChangeEvent<HTMLInputElement>) => void;
 isRadioSelected: (value: string) => boolean;
};

export default function ProfileSetUpForm({ values, handleChange, countries, zones, showZones, onRadioChange, isRadioSelected }: Profile) {

 return (
  <div>
   <h2 className='auth-header'>Get Started</h2>
   <div className="auth-inputs">
    <h5 className="auth-subheader">First, enter your name</h5>
    <input 
     type="text"
     name="name"
     data-testid="Name" 
     className='form-control auth-input' 
     placeholder='Name' 
     value={values.name} 
     onChange={handleChange}
     required
    />
    <h5 className='auth-subheader'>Now, select your country</h5>
    <select data-testid="Select" className='form-control auth-input' name="country" onChange={handleChange} required>
     <option defaultValue="" key=""></option>
     {countries.map(country => {
      return (
       <option data-testid="Option" key={countries.indexOf(country)}>{country}</option>
      );
     })}
    </select>
    <br/>
    <br/>
    {showZones &&
     <div className='auth-time-container'>
      <h5 className='auth-subheader'>Please select your timezone</h5>
      <select className='form-control auth-input' id="timezoneBox" name="timezone" onChange={handleChange} required>
       <option defaultValue="" key=""></option>
       {zones.map(zone => {
        return (
         <option key={zones.indexOf(zone)}>{zone}</option>
        );
       })}
      </select>
      <h5 className='auth-subheader'>Please select a time format</h5>
      <div className='auth-time-radio-btns'>
       <input 
        type="radio" 
        name="format" 
        value="ampm" 
        onChange={onRadioChange} 
        checked={isRadioSelected("ampm")}
       />
       <label className="auth-time-radio-btn-label">AM/PM Format</label>
       <input 
        type="radio" 
        name="format" 
        value="MT" 
        onChange={onRadioChange} 
        checked={isRadioSelected("MT")}
       />
       <label className="auth-time-radio-btn-label">24 Hr. Format</label>
      </div>
     </div>
    }
   </div>
  </div>
 );
}