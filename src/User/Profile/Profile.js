export default function Profile({ name, zoneName, imgUrl }) {
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
   {imgUrl && <img src={imgUrl} alt={imgUrl} height="100" width="200"/>}
   <h2>{name}</h2>
   <p><strong>{zoneName}</strong> {formatAMPM(new Date())}</p>
  </div>
 );
}