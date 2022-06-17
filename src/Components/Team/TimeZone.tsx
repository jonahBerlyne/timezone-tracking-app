import React from 'react';
import { useAppSelector } from '../../Redux/hooks';
import { selectUser } from '../../Redux/userSlice';
import "../../Styles/TimeZone.css";
import { formatAMPM, formatMT } from "../Time";
import { Avatar } from "@mui/material";

interface Team {
 offset: number;
 members: any[];
};

export default function TeamZone({ offset, members }: Team) {

  const user = useAppSelector(selectUser);

  return (
    <div className='team-zone-container' key={offset}>

     <div className="time-container">
      {!user && <p className='time-element'>{formatAMPM(offset)}</p>}
      {user?.format === "ampm" && <p data-testid={`ampm_${offset}`} className='time-element'>{formatAMPM(offset)}</p>}
      {user?.format === "MT" && <p data-testid={`MT_${offset}`} className='time-element'>{formatMT(offset)}</p>}
      <p data-testid={`offset_${offset}`} className="offset-element">
       {Math.ceil(offset) >= 0 ? "+" : "-"}

       {(Math.ceil(offset) <= -10 || Math.floor(offset) >= 10) ? "" : "0"}

       {offset > 0 ? Math.abs(Math.floor(offset)) : Math.abs(Math.ceil(offset))}

       :
       
       {offset % 1 !== 0 ? `${Math.abs((offset % 1)*60)}` : "00"}
      </p>
     </div>

     <div className="members-container">
      {members.map((member: any, index: number) => {
        const locationData = member.timezoneData.zoneName;
        const location = locationData.substring(locationData.indexOf("/") + 1, locationData.length).replace(/_+/g, ' ');
        return (
         <div className='member-container' key={member.id}>
          <Avatar src={member.profilePic} alt={member.name} className="member-avatar" />
          <div className="member-info">
           <h4 data-testid={`name_${index}_${offset}`}>{member.name}</h4>
           <h5 data-testid={`location_${index}_${offset}`}>{location}</h5>
          </div>
         </div>
        );
       })}
     </div>

    </div>
  )
}