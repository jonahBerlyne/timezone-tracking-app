import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import Home from "./Main/Home";
import About from "./Main/About";
import Contact from "./Main/Contact";
import Privacy from "./Main/Privacy";
import Terms from "./Main/Terms";
import Footer from "./Main/Footer";
import AuthNavbar from "./Auth/AuthNavbar";
import RegisterPage from "./Auth/Register/RegisterPage";
import Login from "./Auth/Login";
import ResetPassword from "./Auth/ResetPassword";
import UserNavbar from "./User/UserNavbar";
import ProfilePage from "./User/Profile/ProfilePage";
import ChangePassword from "./User/Account/ChangePassword";
import TeamNavbar from "./User/Team/TeamNavbar";
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
import { getAuth, signOut } from "firebase/auth";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainRoute><Home/></MainRoute>}></Route>
        <Route path="/about" element={<MainRoute><About/></MainRoute>}></Route>
        <Route path="/contact" element={<MainRoute><Contact/></MainRoute>}></Route>
        <Route path="/privacy" element={<MainRoute><Privacy/></MainRoute>}></Route>
        <Route path="/terms" element={<MainRoute><Terms/></MainRoute>}></Route>
        <Route path="/register" element={<AuthRoute><RegisterPage/></AuthRoute>}></Route>
        <Route path="/login" element={<AuthRoute><Login/></AuthRoute>}></Route>
        <Route path="/reset_password" element={<AuthRoute><ResetPassword/></AuthRoute>}></Route>
        <Route path="/profile/:id" element={<AppRoute><ProfilePage/></AppRoute>}></Route>
        <Route path="/change_password" element={<AppRoute><ChangePassword/></AppRoute>}></Route>
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

// const MainRoutes = ({children}) => {
//   return (
//     <div>
//       {localStorage.getItem("currentUser") && <UserNavbar/>}
//       {!localStorage.getItem("currentUser") && <AuthNavbar/>}
//       {children}
//       {/* <Footer/> */}
//     </div>
//   );
// }

// const AuthRoutes = ({children}) => {
//   if (!localStorage.getItem("currentUser")) {
//     return (
//       <div>
//         <AuthNavbar/>
//         {children}
//         {/* <Footer/> */}
//       </div>
//     );
//   } else {
//     return <Navigate to="/"/>;
//   }
// }

// const UserRoutes = ({children}) => {
//   if (localStorage.getItem("currentUser")) {
//     return (
//       <div>
//         <UserNavbar/>
//         {children}
//         {/* <Footer/> */}
//       </div>
//     );
//   } else {
//     return <Navigate to="/"/>;
//   }
// }

// const TeamRoute = ({children}) => {
//   const teams = JSON.parse(localStorage.getItem("teams"));
//   const teamId = useParams();
//   const [teamName] = teams.filter(team => team.id === teamId.id);
//   if (localStorage.getItem("currentUser") && teams.length > 0 && teams.includes(teamName)) {
//     return (
//       <div>
//         <TeamNavbar/>
//         {children}
//         {/* <Footer/> */}
//       </div>
//     );
//   } else {
//     return <Navigate to="/"/>;
//   }
// }

export const logout = async (): Promise<any> => {
  try {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem("teams");
    localStorage.removeItem("currentUser");
  } catch (err) {
    alert(`Sign out error: ${err}`);
  }
}