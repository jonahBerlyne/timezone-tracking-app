import { FaArrowLeft } from "react-icons/fa"

export default function EditTeamInfo({ displayMembersDiv }) {
 return (
  <div>
   <button onClick={displayMembersDiv}>
    <span>
     <FaArrowLeft size={25}/>
    </span>
   </button>
  </div>
 );
}