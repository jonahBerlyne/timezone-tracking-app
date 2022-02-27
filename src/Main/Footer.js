import { Link } from "react-router-dom";

export default function Footer() {
 return (
  <div className="text-center p-3" style={{backgroundColor: "rgba(0, 0, 0, 0.2)", bottom: "0", width: "100%", position: "absolute", height: "1px"}}>
   <ul style={{listStyle: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: "30px", height: "1px"}}>
    <li><Link to="/about" style={{textDecoration: "none", color: "rgba(0, 0, 0, 0.6)"}}>About</Link></li>
    <li><Link to="/contact" style={{textDecoration: "none", color: "rgba(0, 0, 0, 0.6)"}}>Contact</Link></li>
    <li><Link to="/privacy" style={{textDecoration: "none", color: "rgba(0, 0, 0, 0.6)"}}>Privacy</Link></li>
    <li><Link to="/terms" style={{textDecoration: "none", color: "rgba(0, 0, 0, 0.6)"}}>Terms</Link></li>
   </ul>
  </div>
 );
}