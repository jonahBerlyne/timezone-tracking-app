export default function Profile({ username, location }) {
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
   <h2>{username}</h2>
   <p><strong>{location}</strong> {formatAMPM(new Date())}</p>
  </div>
 );
}