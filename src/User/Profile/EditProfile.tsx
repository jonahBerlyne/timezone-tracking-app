import React, { ChangeEvent } from "react";

interface EditProfileInterface {
 values: any;
 handleChange: (e: any) => void;
 choosePic: (e: any) => void;
 imgFileErr: string | null;
 countries: any[];
 zones: any[];
 showZones: boolean;
 isRadioSelected: (value: string) => boolean;
 onRadioChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function EditProfile({ values, handleChange, choosePic, imgFileErr, countries, zones, showZones, isRadioSelected, onRadioChange }: EditProfileInterface) {

 return (
  <div>
   <div>
    <h4>Upload a new profile pic:</h4>
    <input onChange={choosePic} type="file"/>
    {imgFileErr && <h6>{imgFileErr}</h6>}
   </div>
   <div>
    <h4>Type a new name:</h4>
    <input type="text" name="name" value={values.name} onChange={handleChange} placeholder={values.name}/>
   </div>
   <div style={{display: "flex", flexDirection: "column"}}>
    <h4>Time format:</h4>
    <div>
     <input 
      type="radio" 
      name="format" 
      value="ampm"
      checked={isRadioSelected("ampm")} 
      onChange={onRadioChange}
     />
     <label>AM/PM Format</label>
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
   <div style={{display: "flex", flexDirection: "column"}}>
    <h3>Change your account and privacy information:</h3>
    <label>Email:</label>
    <input type="email" name="email" value={values.email} onChange={handleChange} />
   </div>
   <div>
    <h4>Select a new country:</h4>
    <select id="countryBox" name="country" onChange={handleChange}>
     <option defaultValue="" key=""></option>
     {countries.map(country => {
      return (
       <option key={countries.indexOf(country)}>{country}</option>
      );
     })}
    </select>
    <br/>
    {showZones &&
     <div>
      <h4>Select a new timezone:</h4>
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
   <div style={{display: "flex", flexDirection: "column"}}>
    <h4>Delete account:</h4>
    <label>Type DELETE to confirm:</label>
    <input type="text" name="delete" value={values.delete} onChange={handleChange}/>
    <label>Why are you deleting your account? (Optional)</label>
    <textarea rows={10} cols={10} name="reason" value={values.reason} onChange={handleChange}/>
   </div>
   <div style={{display: "flex", flexDirection: "column"}}>
    <label>Please enter your password to save any changes or to delete your account:</label>
    <input type="password" name="password" value={values.password} onChange={handleChange} required />
   </div>
  </div>
 );
}