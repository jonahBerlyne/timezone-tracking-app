export default function EditProfile({ values, handleChange }) {
 return (
  <div>
   <div>
    <label>Name:</label>
    <input type="text" name="name" value={values.name} onChange={handleChange}></input>
   </div>
   <div>
    <label>Type here to search for your location:</label>
    <input type="text" name="location" value={values.location} onChange={handleChange}></input>
   </div>
  </div>
 );
}