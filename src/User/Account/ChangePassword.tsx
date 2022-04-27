import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

interface Values {
 current: string;
 new: string;
 confirmNew: string;
};

export default function ChangePassword() {

 const auth = getAuth();

 const initialValues = { current: '', new: '', confirmNew: '' };

 const [values, setValues] = useState<Values>(initialValues);

 const handleChange = (e: any): void => {
  setValues({
   ...values,
   [e.target.name]: e.target.value
  });
 }

 const changeMyPassword = async (): Promise<any> => {
  if (values.new !== values.confirmNew) {
   alert("Make sure to confirm your new password");
   return;
  }
  try {
   const currentUser = auth.currentUser;
   if (currentUser) {
    const credential = EmailAuthProvider.credential(
     currentUser.email!,
     values.current
    );
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, values.new);
    alert("Password updated");
   } else {
    return;
   }
   window.location.href = "/account";
  } catch (err) {
   alert(`Password change error: ${err}`);
  }
 }

 return (
  <div style={{display: "flex", flexDirection: "column"}}>
   <h1>Change your password</h1>
   <label>Type your current password:</label>
   <input type="password" name="current" placeholder='Current password' value={values.current} onChange={handleChange} required/>
   <label>Type your new password:</label>
   <input type="password" name="new" value={values.new} onChange={handleChange} placeholder='New password' required/>
   <label>Please re-type your new password:</label>
   <input type="password" name="confirmNew" value={values.confirmNew} onChange={handleChange} placeholder='Confirm new password' required/>
   <Link to="/account"><button>Go back</button></Link>
   <button onClick={changeMyPassword}>Submit</button>
  </div>
 );
}