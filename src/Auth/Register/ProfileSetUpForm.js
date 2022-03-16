import React from 'react';

export default function ProfileSetUpForm({ values, handleChange, countries, zones, showZones }) {

 return (
  <div>
   <h2>Get Started:</h2>
   <input 
    type="text"
    name="name" 
    className='form-control' placeholder='Name' 
    value={values.name} 
    onChange={handleChange}
    required
   />
   <h4>Select Your Country:</h4>
   <select name="country" onChange={handleChange} required>
    <option defaultValue="" key=""></option>
    {countries.map(country => {
     return (
      <option key={countries.indexOf(country)}>{country}</option>
     );
    })}
   </select>
   <br/>
   <br/>
   {showZones &&
    <div>
     <h4>Select Your Timezone:</h4>
     <select id="timezoneBox" name="timezone" onChange={handleChange} required>
      <option defaultValue="" key=""></option>
      {zones.map(zone => {
       return (
        <option key={zones.indexOf(zone)}>{zone}</option>
       );
      })}
     </select>
     <h4>Select A Time Format:</h4>
     <div values={values.format} onChange={handleChange}>
      <input type="radio" name="format" value="ampm"/>AMPM
      <input type="radio" name="format" value="MT"/>MT
     </div>
    </div>
   }
   <hr/>
  </div>
 );
}