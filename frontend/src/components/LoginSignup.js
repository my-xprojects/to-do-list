import React, { useState } from "react";
import axios from 'axios';
import '../css/LoginSignup.css'

const LoginSignup = ({onLogin}) => {
    const [action, setAction] = useState("Login");
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleActionChange = (action) => {
        if (action === "Login") {
            setAction(action);
            handleLoginSubmit()
        } else {
            setAction(action);
            handleSignUpSubmit()
        }
    };

    const handleLoginSubmit = async () => {
      const accessToken = "access_token: ahmad, token_type : bearer"
      onLogin(accessToken);
      console.log('username', username);
        try {
          const response = await axios.post(
            'http://localhost:8000/token',
            new URLSearchParams({
              username: username,
              password: password,
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );
          const accessToken = response.data.access_token;
          onLogin(accessToken);
        } catch (error) {
          setError('Invalid username or password');
        }
      };

      const handleSignUpSubmit = async () => {
        try {
          const response = await axios.post(
            'http://localhost:8000/users',
            {
              username: username,
              email: email,
              password: password,
              is_active: true
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          if (response.status === 201) {
            alert("User successfully registered");
          } else {
            alert("Something went wrong");
          }
        } catch (error) {
          console.error('Error signing up:', error);
        }
      };
      
      return (
          <div className='container'>
              <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
              </div>
              <div className="inputs">
                    <div className="input">
                        <input
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                    </div>
                    {action === "Sign Up" && (
                        <div className="input">
                            <input
                            type="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                        </div>
                    )}
                    <div className="input">
                        <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                    </div>
              </div>
              <div className='submit-container'>
                    <button
                        className={action === "Login" ? "submit gray" : "submit"}
                        onClick={() => handleActionChange("Sign Up")}
                    >
                        Sign Up
                    </button>
                    <button
                        className={action === "Sign Up" ? "submit gray" : "submit"}
                        onClick={() => handleActionChange("Login")}
                    >
                        Login
                    </button>
              </div>
              {error && <p className="error-message">{error}</p>}
          </div>
        )
    }

export default LoginSignup;
