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
import AccountSettings from "./User/Account/AccountSettings";
import ChangePassword from "./User/Account/ChangePassword";
import TeamNavbar from "./User/Team/TeamNavbar";
import TeamsPage from "./User/Team/TeamsPage";
import TeamPage from "./User/Team/TeamPage";
import ManageTeam from "./User/Team/Manage/ManageTeam";
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
        <Route path="/" exact element={<MainRoute><Home/></MainRoute>}></Route>
        <Route path="/about" exact element={<MainRoute><About/></MainRoute>}></Route>
        <Route path="/contact" exact element={<MainRoute><Contact/></MainRoute>}></Route>
        <Route path="/privacy" exact element={<MainRoute><Privacy/></MainRoute>}></Route>
        <Route path="/terms" exact element={<MainRoute><Terms/></MainRoute>}></Route>
        <Route path="/register" exact element={<AuthRoute><RegisterPage/></AuthRoute>}></Route>
        <Route path="/login" exact element={<AuthRoute><Login/></AuthRoute>}></Route>
        <Route path="/reset_password" exact element={<AuthRoute><ResetPassword/></AuthRoute>}></Route>
        <Route path="/profile/:id" exact element={<AppRoute><ProfilePage/></AppRoute>}></Route>
        <Route path="/account" exact element={<AppRoute><AccountSettings/></AppRoute>}></Route>
        <Route path="/account/change_password" exact element={<AppRoute><ChangePassword/></AppRoute>}></Route>
        <Route path="/teams" exact element={<AppRoute><TeamsPage/></AppRoute>}></Route>
        <Route path="/team/:id" exact element={<TeamRoute><TeamPage/></TeamRoute>}></Route>
        <Route path="/team/:id/manage" exact element={<TeamRoute><ManageTeam/></TeamRoute>}></Route>
        <Route path="/create_team" exact element={<AppRoute><CreateTeam/></AppRoute>}></Route>
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

export const logout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem("teams");
  } catch (err) {
    alert(`Sign out error: ${err}`);
  }
}