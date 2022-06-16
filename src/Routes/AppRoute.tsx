import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import fireDB, { auth } from '../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import { login, selectUser } from '../Redux/userSlice';
import { store } from '../Redux/Store';
import UserNavbar from '../Components/Navbars/UserNavbar';
import "../Styles/App.css";
import Footer from '../Components/Footer';

export default function AppRoute ({ children }: {children: any}) {
  const [pending, setPending] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const getUserInfo = async (user: User): Promise<any> => {
    let storeLength = 0;
    console.log(storeLength);
    try {
      while (storeLength < 2) {
        const docRef = doc(fireDB, "users", `${user.uid}`);
        const docSnapshot = await getDoc(docRef);
        console.log(docSnapshot.data());
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

  if (pending) return null;

  if (currentUser) {
    return (
      <div className='app-container'> 
      {user && 
        <div className="app-body">
          <UserNavbar />
          {children}
          <Footer />
        </div>
      }
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}