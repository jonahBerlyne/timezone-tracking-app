import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

export default function UserNavbar() {

 const { user } = JSON.parse(localStorage.getItem("currentUser"));

 const logout = () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/";
 }

 return (
    <div className='header'>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <h1 className="navbar-brand">Welcome {user.email}!</h1>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span>
                <FaBars size={25} color="gray"/>
              </span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile/:id">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/account">Account Settings</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/team/:teamname">Team</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create_team">Add New Team</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={logout}>Log Out</Link>
                </li>
              </ul>
            </div>
          </div>
    </nav>
   </div>
  );
}