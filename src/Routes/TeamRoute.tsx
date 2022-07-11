import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import fireDB, { auth } from '../firebaseConfig';
import TeamNavbar from '../Components/Navbars/TeamNavbar';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import Footer from '../Components/Footer';
import "../Styles/App.css";
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { login, selectUser } from '../Redux/userSlice';
import { store } from '../Redux/Store';

export default function TeamRoute ({ children }: {children: any}) {
 const [pending, setPending] = useState<boolean>(true);
 const [currentUser, setCurrentUser] = useState<User | null>(null);
 
 const [teams, setTeams] = useState<any[]>([]);
 const teamParam = useParams();
 const [team, setTeam] = useState<any>([]);

 const getTeamInfo = async (user: any): Promise<any> => {
  try {
   const q = query(collection(fireDB, "users", `${user.uid}`, "teams"));
   const querySnapshot = await getDocs(q);
   let teamsArr: any[] = [];
   querySnapshot.forEach(doc => {
    teamsArr.push(doc.data());
   });
   if (teamsArr.length > 0) setTeams(teamsArr);
  } catch (err) {
   alert(`Team retrieval error: ${err}`);
  }
 }

 const user = useAppSelector(selectUser);
 const dispatch = useAppDispatch();

 const getUserInfo = async (user: User): Promise<any> => {
  let storeLength = 0;
  try {
    while (storeLength < 2) {
      const docRef = doc(fireDB, "users", `${user.uid}`);
      const docSnapshot = await getDoc(docRef);
      dispatch(
        login({
          ...docSnapshot.data(),
          id: docSnapshot.id
        })
      );
      storeLength = Object.keys(store.getState().user.user).length;
    }
  } catch (err) {
    alert(`User info retrieval error: ${err}`);
  }
 }

 useEffect(() => {
  const unsub = onAuthStateChanged(
   auth,
   _user => {
    if (_user) {
     getTeamInfo(_user);
     getUserInfo(_user);
     setCurrentUser(_user);
    } else {
     setCurrentUser(null);
    }
    setPending(false);
   },
   err => {
    alert(`Error: ${err}`);
    setPending(false);
   }
  );

  return unsub;
 }, []);

 useEffect(() => {
  if (teams.length > 0) {
   const _team = teams.filter(t => t.id === teamParam.id);
   if (_team) setTeam(_team[0]);
  }
  return () => {
   setTeam([]);
  }
 }, [teams]);

 if (pending) return null;

 if (currentUser) {
  return (
   <div className='app-container'>
    {teams.length > 0 && teams.includes(team) && user &&
      <div className="app-body">
       <TeamNavbar />
       {children}
       <Footer />
      </div>
    }
   </div>
  );
 } else {
  return <Navigate to="/"/>;
 }
}