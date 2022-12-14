import React, { useState } from "react";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, createUserWithEmailAndPassword } from "firebase/auth";
import { async } from "@firebase/util";
import { ref, set } from "firebase/database";




const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
    });

    const navigate = useNavigate();

    const { name, email, password, error, loading } = data;


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if (!name || !email || !password) {
            setData({ ...data, error: "All fields are required" });
        }
        if(window.localStorage.getItem('emailForSignIn') != email){
            setData({ ...data, error: "Email didn't match , Kindly Enter the Correct email !!" });
        }
        else{
        try {
            
            
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            ).then(async(userCredential) => {
                // Signed in 
                // const user = userCredential.user;
                // ...
                
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    uid: userCredential.user.uid,
                    name,
                    email,
                    createdAt: Timestamp.fromDate(new Date()),
                    isOnline: true,
                    
                });

                
                setData({
                    name: "",
                    email: "",
                    password: "",
                    error: null,
                    loading: false,
                });
                window.localStorage.removeItem('emailForSignIn');
             
                navigate('/');
                
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                
              })        
            
     

        // Confirm the link is a sign-in with email link.


        
    }
               catch (err) {
        setData({ ...data, error: err.message, loading: false });
    }
        }
};
return (
    <section>
        <h3>Create An Account</h3>
        <form className="form" onSubmit={handleSubmit}>
            <div className="input_container">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={name} onChange={handleChange} />
            </div>
            <div className="input_container">
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={handleChange} />
            </div>
            <div className="input_container">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                />
            </div>
            {error ? <p className="error">{error}</p> : null}
            <div className="btn_container">
                <button className="btn">
                    {loading ? 'Creating ...' : "Register"}
                </button>
                <p>Already have an account?
                    <>
                        <Link to='/login'>Login</Link>
                    </>
                </p>
            </div>
        </form>
    </section>
);
};

export default Register;