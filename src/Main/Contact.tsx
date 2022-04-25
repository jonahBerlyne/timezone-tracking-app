import React, { useState } from 'react';
import fireDB from "../firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';

export default function Contact() {

 const initialValues = {name: "", email: "", subject: "", message: ""};

 const [values, setValues] = useState(initialValues);

 const handleChange = e => {
  setValues({
   ...values,
   [e.target.name]: e.target.value
  });
 }

 const sendForm = async () => {
  const docRef = doc(fireDB, "messages", `${Date()}`);
  await setDoc(docRef, values);
  alert("Message sent");
  window.location.href = "/";
 }

 return (
  <div>
   <h2>Contact us:</h2>
   <form>
    <input type="text" name="name" value={values.name} onChange={handleChange} placeholder="Your name" required></input>
    <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="Your email" required></input>
    <input type="text" name="subject" value={values.subject} onChange={handleChange} placeholder="Your subject" required></input>
    <textarea rows="10" cols="40" name="message" value={values.message} onChange={handleChange} placeholder="Your message" required/>
   </form>
   <button onClick={sendForm}>Send</button>
  </div>
 );
}