import React, { useState, useEffect } from 'react';
import fireDB from "../../firebaseConfig";
import { doc, getDocs, query, collection } from "firebase/firestore";
import { useParams } from 'react-router-dom';

export default function TeamPage() {

 const user = JSON.parse(localStorage.getItem("currentUser"));
 const team = useParams();

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
   console.log(arrConst);
   for (let i = -12; i <= 14; i++) {
    tempArr = tempArr.filter(member => member.timezoneData.utcOffset === i);
    membersArr.push(tempArr);
    tempArr = arrConst;
   }
   membersArr = membersArr.filter(members => members.length > 0);
   console.log(membersArr);
  } catch (err) {
   alert(`Team members retrieval error: ${err}`);
  }
 }

 useEffect(() => {
  getTeamMembers();
 }, []);

 return (
  <div>
   TeamPage
  </div>
 );
}