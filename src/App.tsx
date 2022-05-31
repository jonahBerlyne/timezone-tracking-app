import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Main/Home";
import RegisterPage from "./Auth/Register/RegisterPage";
import Login from "./Auth/Login";
import ProfilePage from "./User/Profile/ProfilePage";
import TeamsPage from "./User/Team/TeamsPage";
import TeamPage from "./User/Team/TeamPage";
import ManageTeam from "./User/Team/Manage/ManageTeam";
import AddTeamMember from "./User/Team/Manage/AddTeamMember";
import EditTeamInfo from "./User/Team/Manage/EditTeamInfo";
import CreateTeam from "./User/Team/CreateTeam";
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