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
   membersSnapshot.forEach(member => {
    console.log(member.data());
   });
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