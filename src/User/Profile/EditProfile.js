export default function EditProfile({ values, handleChange, choosePic, imgFileErr }) {
 return (
  <div>
   <div>
    <input onChange={choosePic} type="file"/>
    {imgFileErr && <h6>{imgFileErr}</h6>}
   </div>
   <div>
    <label>Name:</label>
    <input type="text" name="name" value={values.name} onChange={handleChange}/>
   </div>
   <div>
    <label>Type here to search for your location:</label>
    <input type="text" name="location" value={values.location} onChange={handleChange}/>
   </div>
  </div>
 );
}