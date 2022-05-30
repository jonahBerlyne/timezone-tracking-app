import React, { useState, useEffect } from 'react';
import fireDB, { auth, storage } from '../../../firebaseConfig';
import { getDocs, query, collection, doc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { FaTimes } from "react-icons/fa";
import "../../../Styles/Manage.css";
import { deleteObject, ref } from 'firebase/storage';

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