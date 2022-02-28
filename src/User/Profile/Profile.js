export default function Profile({ name, location }) {
  const formatAMPM = date => {
   let hours = date.getHours();
   let minutes = date.getMinutes();
   const ampm = hours >= 12 ? 'pm' : 'am';
   hours = hours % 12;
   hours = hours ? hours : 12;
   minutes = minutes < 10 ? '0' + minutes : minutes;
   const strTime = `${hours}:${minutes} ${ampm}`;
   return strTime;
 }

 return (
  <div>
   <h2>{name}</h2>
   <p><strong>{location}</strong> {formatAMPM(new Date())}</p>
  </div>
 );
}