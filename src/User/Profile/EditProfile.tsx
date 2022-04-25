export default function EditProfile({ values, handleChange, choosePic, imgFileErr, countries, zones, showZones }) {

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
  </div>
 );
}