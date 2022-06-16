import React, { ChangeEvent } from "react";
import "../../Styles/Profile.css";
import { Avatar } from "@mui/material";

interface EditProfileInterface {
 values: any;
 handleChange: (e: any) => void;
 choosePic: (e: any) => void;
 imgPreview: any;
 imgFileErr: string | null;
 countries: any[];
 zones: any[];
 showZones: boolean;
 isRadioSelected: (value: string) => boolean;
 onRadioChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function EditProfile({ values, handleChange, choosePic, imgPreview, imgFileErr, countries, zones, showZones, isRadioSelected, onRadioChange }: EditProfileInterface) {

 return (
  <div className="edit-profile">
   <div className="edit-profile-pic-container">
    <Avatar src={imgPreview} alt={imgPreview} />
    <input name="img_upload" onChange={choosePic} type="file" />
    {imgFileErr && <p className="edit-profile-pic-err">{imgFileErr}</p>}
   </div>
   <div className="edit-profile-name-container">
    <p>Name</p>
    <input type="text" name="name" value={values.name} onChange={handleChange} placeholder={values.name}/>
   </div>
   <div className="edit-profile-email-container">
    <p>Email</p>
    <input type="email" name="email" value={values.email} onChange={handleChange} />
   </div>
   <div className="edit-profile-time-container">
    <p>Time format</p>
    <div className="edit-profile-radio-btns-container">
     <div className="edit-profile-radio-btn">
      <input 
       type="radio" 
       name="format" 
       value="ampm"
       checked={isRadioSelected("ampm")} 
       onChange={onRadioChange}
      />
      <label>AM/PM Format</label>
     </div>
     <div className="edit-profile-radio-btn">
      <input 
       type="radio" 
       name="format" 
       value="MT"
       checked={isRadioSelected("MT")} 
       onChange={onRadioChange}
      />
      <label>24 Hr. Format</label>
     </div>
    </div>
   </div>
   <div className="edit-profile-country-container">
    <p>Select a new country</p>
    <select id="countryBox" name="country" onChange={handleChange}>
     <option defaultValue="" key=""></option>
     {countries.map(country => {
      return (
       <option key={countries.indexOf(country)}>{country}</option>
      );
     })}
    </select>
    {showZones &&
     <div className="edit-profile-timezone-container">
      <p>Select a new timezone</p>
      <select id="timezoneBox" name="timezone" onChange={handleChange} required>
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
   </div>
   <div className="edit-profile-delete-acct-container">
    <h4>Delete account</h4>
    <label>Type DELETE to confirm</label>
    <input type="text" name="delete" value={values.delete} onChange={handleChange}/>
    <label>Why are you deleting your account? (Optional)</label>
    <textarea rows={3} cols={10} name="reason" value={values.reason} onChange={handleChange}/>
   </div>
   <div className="edit-profile-password-container">
    <label>Please enter your password to save any changes or to delete your account</label>
    <input type="password" name="password" value={values.password} onChange={handleChange} required />
   </div>
  </div>
 );
}