import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import TeamMembers from './TeamMembers';
import AddTeamMember from './AddTeamMember';
import EditTeamInfo from './EditTeamInfo';

export default function ManageTeam() {

 const team = useParams();

 const [showMembers, setShowMembers] = useState(true);
 const [showAddMember, setShowAddMember] = useState(false);
 const [showEditTeam, setShowEditTeam] = useState(false);

 const displayMembersDiv = () => {
  setShowAddMember(false);
  setShowEditTeam(false);
  setShowMembers(true);
 }

 const displayAddMemberDiv = () => {
  setShowMembers(false);
  setShowEditTeam(false);
  setShowAddMember(true);
 }

 const displayEditTeamDiv = () => {
  setShowMembers(false);
  setShowAddMember(false);
  setShowEditTeam(true);
 }

 return (
  <div style={{display: "flex", gap: "100px"}}>

   <div style={{display: "flex", flexDirection: "column"}}>
    <p>Edit and add members of your team here.</p>
    <button onClick={displayAddMemberDiv}>Add team member</button>
    <button onClick={displayEditTeamDiv}>Edit team info</button>
    <button><Link to={`/team/${team.id}`} style={{textDecoration: "none", color: "#000"}}>Go back to my team</Link></button>
   </div>

   {showMembers && <TeamMembers/>}

   {showAddMember && <AddTeamMember displayMembersDiv={displayMembersDiv} teamId={team.id}/>}

   {showEditTeam && <EditTeamInfo displayMembersDiv={displayMembersDiv}/>}

  </div>
 );
}