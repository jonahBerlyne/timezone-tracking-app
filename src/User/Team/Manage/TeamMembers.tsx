import React, { useState, useEffect } from 'react';
import fireDB, { auth } from '../../../firebaseConfig';
import { getDocs, query, collection, doc, deleteDoc } from 'firebase/firestore';
import { FaTimes } from "react-icons/fa";
import "../../../Styles/Manage.css";

export default function TeamMembers({ teamId }: { teamId: string | undefined }) {

 const [refresh, setRefresh] = useState<boolean>(false);

 useEffect(() => {
  renderMembers();
 }, [refresh]);

 const [members, setMembers] = useState<any[]>([]);

 const renderMembers = async (): Promise<any> => {
  try {
   const membersCollection = query(collection(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamId}`, "team_members"));
   const membersSnapshot = await getDocs(membersCollection);
   let membersArr: any[] = [];
   membersSnapshot.forEach(member => {
    membersArr.push(member.data());
   });
   setMembers(membersArr);
  } catch (err) {
   alert(`Render error: ${err}`);
  }
 }

 const deleteMember = async (memberId: any): Promise<any> => {
  try {
   const docRef = doc(fireDB, "users", `${auth.currentUser?.uid}`, "teams", `${teamId}`, "team_members", `${memberId}`);
   await deleteDoc(docRef);
   setRefresh(!refresh);
  } catch (err) {
   alert(`Deletion error: ${err}`);
  }
 }

 return (
  <div style={{display: "flex", flexDirection: "column"}}>
   {members.map(member => {
    return (
     <div key={member.id} style={{display: "flex"}}>
      <img src={member.profilePic} alt={member.name} height="50px" width="100px"/>
      <p>{member.name} {member.location}</p>
      <button onClick={() => deleteMember(member.id)}>
       <span>
        <FaTimes size={15}/>
       </span>
      </button>
      <br/>
      <br/>
      <br/>
     </div>
    );
   })}
  </div>
 );
}