import React, { useEffect } from 'react';

export default function ProfileSetUpForm({ values, handleChange }) {

 const apiKey = process.env.REACT_APP_TIMEZONE_API_KEY;

 useEffect(() => {
  fetchAPI();
 }, []);

 const fetchAPI = async () => {
  try {
   console.clear();
   const data = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key=${apiKey}&format=json`);
   const dataJSON = await data.json();
   let zonesArr = [];
   dataJSON.zones.forEach(zone => {
    zonesArr.push(zone.countryName);
   });
   console.log(dataJSON.zones.filter(x => x.countryCode === "US"));
   // Countries with multiple time zones are Russia, USA, Canada, Australia, Mexico, Brazil, Indonesia, Kazakhstan, Mongolia, the Democratic Republic of the Congo, Kiribati, Micronesia, Chile, Spain, Portugal, and Ecuador
   // console.log([...new Set(zonesArr)]);
  } catch (err) {
   alert(`Fetching error: ${err}`);
  }
 }

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
   <input 
    type="search"
    name="location" 
    className='form-control' placeholder='Location' 
    value={values.location} 
    onChange={handleChange}
    required
   />
   <hr/>
  </div>
 );
}