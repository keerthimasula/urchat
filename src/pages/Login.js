import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        error: null,
        loading: false,
    });

    const navigate = useNavigate();

    const { email, password, error, loading } = data;

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if (!email || !password) {
            setData({ ...data, error: "All fields are required" });
        }
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            ).then(async(userCredential) => {
                setData({
                    email: "",
                    password: "",
                    error: null,
                    loading: false,
                });
                await updateDoc(doc(db, "users", userCredential.user.uid), {
                    isOnline: true,
                });

                navigate('/');
                
            });
            
            
        } catch (err) {
            setData({ ...data, error: err.message, loading: false });
        }
    };


    

    return (
        <section>
            <h3>Log into your Account</h3>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </div>
                <div className="input_container">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange} />
                </div>
                {error ? <p className="error">{error}</p> : null}
                <div className="btn_container">
                    <button className="btn" disabled={loading}>
                        {loading ? 'Logging in ...' : 'Login'}
                    </button>
                    <p>You don't have an account?
                        <>
                        <Link to='/redirect'>Register</Link>
                        </>
                    </p>
                </div>
            </form>
        </section>
    );
};

export default Login;