import { formatAMPM, formatMT } from "../Time";

interface ProfileInterface {
 name: string | null | undefined;
 zoneName: string;
 imgUrl: string | null | undefined;
 format: string;
 utcOffset: number;
};

export default function Profile({ name, zoneName, imgUrl, format, utcOffset }: ProfileInterface) {

 return (
  <div>
   {imgUrl && <img src={imgUrl} alt={imgUrl} height="100" width="200"/>}
   <h2>{name}</h2>
   <p><strong>{zoneName}</strong> {format === "ampm" && formatAMPM(utcOffset)} {format === "MT" && formatMT(utcOffset)}</p>
  </div>
 );
}