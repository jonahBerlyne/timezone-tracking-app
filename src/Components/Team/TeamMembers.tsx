import React, { useState, useEffect } from 'react';
import fireDB, { auth, storage } from '../../firebaseConfig';
import { query, collection, doc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { FaTimes } from "react-icons/fa";
import "../../../Styles/Manage.css";
import { deleteObject, ref } from 'firebase/storage';
import { IconButton, Avatar } from "@mui/material";
import { Clear } from "@mui/icons-material";

export default function TeamMembers({ teamId }: { teamId: string | undefined }) {

 const [members, setMembers] = useState<any[]>([]);

 useEffect(() => {
  const q = query(collection(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamId}`, "team_members"));
  const unsub = onSnapshot(q, snapshot => {
   let membersArr: any[] = [];
   snapshot.docs.forEach(member => {
    membersArr.push(member.data());
   });
   setMembers(membersArr);
  });
  return unsub;
 }, []);


 const deleteMember = async (memberId: any): Promise<any> => {
  try {
   const docRef = doc(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamId}`, "team_members", `${memberId}`);
   const memberDoc = await getDoc(docRef);
   if (memberDoc.data()?.profilePic !== "/Images/default_pic.png") {
    const deletedPicRef = ref(storage, `${auth.currentUser?.uid}/teams/${teamId}/members/${memberId}`);
    await deleteObject(deletedPicRef);
   }
   await deleteDoc(docRef);
  } catch (err) {
   alert(`Deletion error: ${err}`);
  }
 }

 return (
  <div className='member-rows-container'>
   <h1>Members:</h1>
   {members.map(member => {
    let zoneStr = member.timezoneData.zoneName;
    zoneStr = zoneStr.substring(zoneStr.indexOf("/") + 1, zoneStr.length).replace(/_+/g, ' ');
    return (
     <div key={member.id} className="member-row">
      <div className="member-row-info">
       <Avatar src={member.profilePic} alt={member.name} />
       <div className="member-row-info-text">
        <p>{member.name}</p>
        <p className='member-row-info-location'>{zoneStr}</p>
       </div>
      </div>
      <IconButton onClick={() => deleteMember(member.id)}>
       <Clear />
      </IconButton>
     </div>
    );
   })}
  </div>
 );
}