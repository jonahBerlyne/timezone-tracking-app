import React, { useState, useEffect } from 'react';
import fireDB from "../../firebaseConfig";
import { getDocs, query, collection } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { formatAMPM } from '../Time';

export default function TeamPage() {

 const user = JSON.parse(localStorage.getItem("currentUser"));
 const team = useParams();
 const [timezones, setTimezones] = useState([]);

 const getTeamMembers = async () => {
  try {
   const membersCollection = query(collection(fireDB, "users", `${user.uid}`, "teams", `${team.id}`, "team_members"));
   const membersSnapshot = await getDocs(membersCollection);
   let tempArr = [];
   membersSnapshot.forEach(member => {
    tempArr.push(member.data());
   });
   let membersArr = [];
   const arrConst = [...tempArr];
   for (let i = -12; i <= 14; i+=0.25) {
    tempArr = tempArr.filter(member => member.timezoneData.utcOffset === i);
    if (tempArr.length > 0) membersArr.push([i, tempArr]);
    tempArr = arrConst;
   }
   console.clear();
   console.log(membersArr);
   setTimezones(membersArr);
  } catch (err) {
   alert(`Team members retrieval error: ${err}`);
  }
 }

 useEffect(() => {
  getTeamMembers();
 }, []);

 return (
  <div>
   <h1 style={{textAlign: "center"}}>Your team:</h1>
   <br/>
   <div style={{display: "flex", gap: "5px", flexWrap: "wrap"}}>
    {timezones.map(timezone => {
     // console.log(Math.floor(timezone[0]) < timezone[0] < Math.ceil(timezone[0]));
     return (
      <div key={timezone[0]}>
      <h3>UTC {timezone[0] > -1 ? `+${Math.floor(timezone[0])}` : Math.ceil(timezone[0])}:{timezone[0] % 1 !== 0 ? `${Math.abs((timezone[0] % 1)*60)}` : "00"}</h3>
       <h2>{formatAMPM(timezone[0])}</h2>
       <br/>
       {timezone[1].map(member => {
        const locationData = member.timezoneData.zoneName;
        const location = locationData.substring(locationData.indexOf("/") + 1, locationData.length).replace(/_+/g, ' ');
        return (
         <div key={member.id}>
          <h4>{member.name}</h4>
          <h5>{location}</h5>
         </div>
        );
       })}
      </div>
     );
    })}
   </div>
  </div>
 );
}