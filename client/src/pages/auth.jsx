
import React, { useState } from "react";
import '../App.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
function Auth() {
  const [activeTab, setActiveTab] = useState("signup");
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") setSignupData({ ...signupData, [name]: value });
    else setLoginData({ ...loginData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5500/user/signup", signupData);
      setMessage(res.data.message || "Signup successful!");
      //  navigate("/Dashboard");
    } catch (err) {
      setMessage(err.response?.data?.error || err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5500/user/login", loginData);
      console.log(res.data, '--')
      setMessage(res.data.message || "Login successful!");
      const tokens = res.data.data?.Token;
    if (tokens && tokens.length > 0) {
        const latestToken = res.data.data.Token[res.data.data.Token.length - 1].token;
localStorage.setItem("token", latestToken);
  localStorage.setItem("login", JSON.stringify(res.data));
      navigate("/Dashboard"); 
    }
    } catch (err) {
      setMessage(err.response?.data?.error || err.message);
    }
  };


const handleGoogleLogin=async(credentialRes)=>{
  try{
    const token=credentialRes.credential
    const res=await axios.post("http://localhost:5500/api/auth/google",{token})
       localStorage.setItem("token", res.data.jwt);
      localStorage.setItem("login", JSON.stringify(res.data.user));
      navigate("/Dashboard");
  }
  catch(err){
    console.log(err)
  }
}

  return (
    <GoogleOAuthProvider clientId="566577100427-0qvvnme0tk75gmvade4f7pla1k21ldpt.apps.googleusercontent.com">

      <div style={{ maxWidth: "400px", margin: "auto" }}>
        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
          <button
            style={{ backgroundColor: activeTab === "signup" ? "#007bff" : "#f0f0f0", color: activeTab === "signup" ? "#fff" : "#000" }}
            onClick={() => { setActiveTab("signup"); setMessage(""); }}
          >
            Signup
          </button>
          <button
            style={{ backgroundColor: activeTab === "login" ? "#007bff" : "#f0f0f0", color: activeTab === "login" ? "#fff" : "#000" }}
            onClick={() => { setActiveTab("login"); setMessage(""); }}
          >
            Login
          </button>
        </div>

        {/* Forms */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignup}>
            <input type="text" name="name" placeholder="Name" value={signupData.name} onChange={(e) => handleChange(e, "signup")} required /><br /><br />
            <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={(e) => handleChange(e, "signup")} required /><br /><br />
            <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={(e) => handleChange(e, "signup")} required /><br /><br />
            <button type="submit"  style={{ backgroundColor:"#007bff" , color: "#fff" }}
          >Signup</button>
          </form>
        )}

        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={(e) => handleChange(e, "login")} required /><br /><br />
            <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={(e) => handleChange(e, "login")} required /><br /><br />
            <button type="submit" style={{ backgroundColor:"#007bff" , color: "#fff" }}>Login</button>
          </form>
        )}

        <p style={{ marginTop: "20px", color: "red" }}>{message}</p>
      </div>

       <GoogleLogin
              onSuccess={handleGoogleLogin}
              // onError={handleGoogleError}
            />
    </GoogleOAuthProvider>
  );
}

export default Auth;
