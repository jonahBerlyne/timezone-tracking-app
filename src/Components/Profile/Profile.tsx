import { formatAMPM, formatMT } from "../Time";
import "../../Styles/Profile.css";
import { LocationOn } from "@mui/icons-material";
import { Avatar } from "@mui/material";

interface ProfileInterface {
 name: string | null | undefined;
 imgUrl: any;
 zoneName: string;
 format: string;
 utcOffset: number;
};

export default function Profile({ name, imgUrl, zoneName, format, utcOffset }: ProfileInterface) {

 return (
  <div className="profile">
    {imgUrl && <Avatar src={imgUrl} alt={`${name} profile pic`} />}
    <h2 data-testid="name">{name}</h2>
    <div className="profile-info-container">
     <LocationOn />
     <div className="profile-info">
      <p data-testid="zoneName" className="profile-location">{zoneName}</p> 
      <p data-testid="time" className="profile-time">{format === "ampm" && formatAMPM(utcOffset)}{format === "MT" && formatMT(utcOffset)}</p>
     </div>
    </div>
  </div>
 );
}