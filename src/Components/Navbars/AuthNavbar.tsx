import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { WatchLater } from "@mui/icons-material";

export default function AuthNavbar() {

 return (
    <div className='header' style={{ fontFamily: "Lato, sans-serif" }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <WatchLater color="primary" />
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span>
                <FaBars size={25} color="gray"/>
              </span>
            </button>
            <div className="collapse navbar-collapse" style={{ textAlign: "center", marginRight: "25px" }} id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Sign Up</Link>
                </li>
              </ul>
            </div>
          </div>
    </nav>
   </div>
  );
}