import { formatAMPM, formatMT } from "../Time";

export default function Profile({ name, zoneName, imgUrl, format, utcOffset }) {

 return (
  <div>
   {imgUrl && <img src={imgUrl} alt={imgUrl} height="100" width="200"/>}
   <h2>{name}</h2>
   <p><strong>{zoneName}</strong> {format === "ampm" && formatAMPM(utcOffset)} {format === "MT" && formatMT(utcOffset)}</p>
  </div>
 );
}