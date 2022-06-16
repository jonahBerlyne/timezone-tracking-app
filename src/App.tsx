import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage";
import RegisterPage from "./Pages/RegisterPage";
import Login from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import TeamsPage from "./Pages/TeamsPage";
import TeamPage from "./Pages/TeamPage";
import ManageTeam from "./Pages/ManageTeamPage";
import AddTeamMember from "./Pages/AddTeamMemberPage";
import EditTeamInfo from "./Pages/EditTeamInfoPage";
import CreateTeam from "./Pages/CreateTeamPage";
import AuthRoute from "./Routes/AuthRoute";
import AppRoute from "./Routes/AppRoute";
import TeamRoute from "./Routes/TeamRoute";
import MainRoute from "./Routes/MainRoute";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainRoute><Home/></MainRoute>}></Route>
        <Route path="/register" element={<AuthRoute><RegisterPage/></AuthRoute>}></Route>
        <Route path="/login" element={<AuthRoute><Login/></AuthRoute>}></Route>
        <Route path="/profile/:id" element={<AppRoute><ProfilePage/></AppRoute>}></Route>
        <Route path="/create_team" element={<AppRoute><CreateTeam/></AppRoute>}></Route>
        <Route path="/teams" element={<AppRoute><TeamsPage/></AppRoute>}></Route>
        <Route path="/team/:id" element={<TeamRoute><TeamPage/></TeamRoute>}></Route>
        <Route path="/team/:id/manage" element={<TeamRoute><ManageTeam/></TeamRoute>}></Route>
        <Route path="/team/:id/manage/add" element={<TeamRoute><AddTeamMember /></TeamRoute>}></Route>
        <Route path="/team/:id/manage/edit" element={<TeamRoute><EditTeamInfo /></TeamRoute>}></Route>
      </Routes>
    </Router>
  );
}