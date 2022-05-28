import React, { useState, useEffect } from 'react';
import fireDB, { auth } from "../../firebaseConfig";
import { getDocs, query, collection } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { formatAMPM, formatMT } from '../Time';
import { useAppSelector } from '../../Redux/hooks';
import { selectUser } from '../../Redux/userSlice';
import TimeZone from "./TimeZone";

export default function TeamPage() {

 const user = useAppSelector(selectUser);
 const team = useParams()
 const [timezones, setTimezones] = useState<any[]>([]);
 const [noMembers, setNoMembers] = useState<boolean>(false);

 const getTeamMembers = async (): Promise<any> => {
  try {
   const membersCollection = query(collection(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${team.id}`, "team_members"));
   const membersSnapshot = await getDocs(membersCollection);
   let tempArr: any[] = [];
   membersSnapshot.forEach(member => {
    tempArr.push(member.data());
   });
   if (tempArr.length === 0) {
    setNoMembers(true);
    return;
   }
   let membersArr: any[] = [];
   const arrConst = [...tempArr];
   for (let i = -12; i <= 14; i+=0.25) {
    tempArr = tempArr.filter(member => member.timezoneData.utcOffset === i);
    if (tempArr.length > 0) membersArr.push([i, tempArr]);
    tempArr = arrConst;
   }
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
   {noMembers && <h1 style={{textAlign: "center"}}>You haven't added any members to your team, yet.</h1>}
   {timezones.length > 0 && <h1 style={{textAlign: "center"}}>Your team:</h1>}
   <br/>
   <div style={{display: "flex", gap: "5px", flexWrap: "wrap"}}>
    {timezones.length > 0 && timezones.map((timezone: any) => {
     console.log(timezone);
     return (
      <TimeZone offset={timezone[0]} members={timezone[1]} />
     );
    })}
   </div>
  </div>
 );
}