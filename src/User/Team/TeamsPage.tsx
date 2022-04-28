import { Link } from "react-router-dom";

export default function TeamsPage() {

 const teams = JSON.parse(localStorage.getItem("teams") || "{}");
 
 return (
  <div>
   {teams.length === 0 && <h1>You haven't added any teams, yet.</h1>}
   {teams.length > 0 && <h1>Here are your teams:</h1>}
   {teams && teams.map((team: any) => {
    return (
     <div key={team.id}>
      <Link to={`/team/${team.id}`}>{team.name}</Link>
     </div>
    );
   })}
  </div>
 );
}