import React, { useState, useEffect } from 'react';
import fireDB from '../../../firebaseConfig';
import { getDocs, query, collection, doc, deleteDoc } from 'firebase/firestore';
import { FaTimes } from "react-icons/fa";

export default function TeamMembers({ teamId }) {

 const user = JSON.parse(localStorage.getItem("currentUser"));

 const [refresh, setRefresh] = useState(false);

 useEffect(() => {
  renderMembers();
 }, [refresh]);

 const [members, setMembers] = useState([]);

 const renderMembers = async () => {
  try {
   const membersCollection = query(collection(fireDB, "users", `${user.uid}`, "teams", `${teamId}`, "team_members"));
   const membersSnapshot = await getDocs(membersCollection);
   let membersArr = [];
   membersSnapshot.forEach(member => {
    membersArr.push(member.data());
   });
   setMembers(membersArr);
  } catch (err) {
   alert(`Render error: ${err}`);
  }
 }

 const deleteMember = async memberId => {
  try {
   const docRef = doc(fireDB, "users", `${user.uid}`, "teams", `${teamId}`, "team_members", `${memberId}`);
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