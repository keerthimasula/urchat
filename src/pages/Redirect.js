import React, { useState } from "react";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, createUserWithEmailAndPassword } from "firebase/auth";
import { async } from "@firebase/util";
import { ref, set } from "firebase/database";
import { collection, query, where, getDocs } from "firebase/firestore";




const Register = () => {
    const [data, setData] = useState({
        // name: "",
        email: "",
        // password: "",
        error: null,
        loading: false,
    });

    const navigate = useNavigate();

    const { email, error, loading } = data;


    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        let flag = 0;
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if (!email) {
            setData({ ...data, error: "All fields are required" });
        }
        const q = query(collection(db, "users"), where("email", "==", email));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                flag =1;
            });
        if(flag==1){
            setData({ ...data, error: "Account Exists" });
            alert("Account Exists");
            navigate("/Login");
        }
        else{
        try {


            
            const actionCodeSettings = {
                // URL you want to redirect back to. The domain (www.example.com) for this
                // URL must be in the authorized domains list in the Firebase Console.
                url: 'http://localhost:3000/register',
                // This must be true.
                handleCodeInApp: true,
                // dynamicLinkDomain: 'urchat-5ca7a.firebaseapp.com/verify?uid=" + user.getUid()',

            };

            sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
               
                window.localStorage.setItem('emailForSignIn', email);


            });


            alert("Email Sent !!! Check and Verify");







            // Confirm the link is a sign-in with email link.



        } catch (err) {
            setData({ ...data, error: err.message, loading: false });
        }
    }
    };
    return (
        <section>
            <h3>Create An Account</h3>
            <form className="form" onSubmit={handleSubmit}>

                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={handleChange} />
                </div>

                {error ? <p className="error">{error}</p> : null}
                <div className="btn_container">
                    <button className="btn" style={{ color: "black" }}>
                        Send Account Creation Email
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