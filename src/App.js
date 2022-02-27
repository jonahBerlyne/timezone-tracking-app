import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Main/Home";
import About from "./Main/About";
import Contact from "./Main/Contact";
import Privacy from "./Main/Privacy";
import Terms from "./Main/Terms";
import Footer from "./Main/Footer";
import AuthNavbar from "./Auth/AuthNavbar";
import Register from "./Auth/Register/RegisterForm";
import Login from "./Auth/Login";
import ResetPassword from "./Auth/ResetPassword";
import UserNavbar from "./User/UserNavbar";
import ProfilePage from "./User/Profile/ProfilePage";
import AccountSettings from "./User/AccountSettings";
import TeamPage from "./User/Team/TeamPage";
import ManageTeam from "./User/Team/Manage/ManageTeam";
import CreateTeam from "./User/Team/CreateTeam";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home/>}></Route>
        <Route path="/about" exact element={<About/>}></Route>
        <Route path="/contact" exact element={<Contact/>}></Route>
        <Route path="/privacy" exact element={<Privacy/>}></Route>
        <Route path="/terms" exact element={<Terms/>}></Route>
        <Route path="/register" exact element={<AuthRoutes><Register/></AuthRoutes>}></Route>
        <Route path="/login" exact element={<AuthRoutes><Login/></AuthRoutes>}></Route>
        <Route path="/reset_password" exact element={<AuthRoutes><ResetPassword/></AuthRoutes>}></Route>
        <Route path="/profile/:id" exact element={<UserRoutes><ProfilePage/></UserRoutes>}></Route>
        <Route path="/account" exact element={<UserRoutes><AccountSettings/></UserRoutes>}></Route>
        <Route path="/team/:teamname" exact element={<UserRoutes><TeamPage/></UserRoutes>}></Route>
        <Route path="/team/:teamname/manage" exact element={<UserRoutes><ManageTeam/></UserRoutes>}></Route>
        <Route path="/create_team" exact element={<UserRoutes><CreateTeam/></UserRoutes>}></Route>
      </Routes>
    </Router>
  );
}

const AuthRoutes = ({children}) => {
  if (!localStorage.getItem("currentUser")) {
    return (
      <div>
        <AuthNavbar/>
        {children}
        <Footer/>
      </div>
    );
  } else {
    return <Navigate to="/"/>;
  }
}

const UserRoutes = ({children}) => {
  if (localStorage.getItem("currentUser")) {
    return (
      <div>
        <UserNavbar/>
        {children}
        <Footer/>
      </div>
    );
  } else {
    return <Navigate to="/"/>;
  }
}