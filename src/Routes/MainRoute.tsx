import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import fireDB, { auth } from "../firebaseConfig";
import UserNavbar from '../User/UserNavbar';
import AuthNavbar from '../Auth/AuthNavbar';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { login, selectUser } from '../Redux/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import { store } from '../Redux/Store';
import Footer from '../Main/Footer';
import "../Styles/App.css";

export default function MainRoute ({ children }: {children: any}) {
 const [pending, setPending] = useState<boolean>(true);
 const [currentUser, setCurrentUser] = useState<User | null>(null);
 
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

 return (
  <div className='app-container'>
   {currentUser && user &&
    <div className="app-body"> 
     <UserNavbar />
     {children}
     <Footer />
    </div>
   }
   {!currentUser && 
    <div className="app-body"> 
     <AuthNavbar />
     {children}
     <Footer />
    </div>
   }
  </div>
 );
}