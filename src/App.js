import './App.css';
import { useState, useEffect } from 'react';
import { auth } from './FirebaseConfigurations/Firebase';
import {
  signInWithEmailAndPassword, // signin and receive jwt token from firebase
  onAuthStateChanged, // recceive user jwt and details after signin
  signOut,
} from 'firebase/auth';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  // Get access Info from firebase
  useEffect(() => {
    const listenToAuth = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser?.accessToken);
      setAuthUser(currentUser);
    });
    return () => {
      listenToAuth();
    };
  }, [isLoggedIn]);

  // Firebase = Sign in Existing user
  const signInUserWithPwAndEmail = () => {
    return signInWithEmailAndPassword(auth, 'admin@gmail.com', 'password');
  };

  // 3. Logout
  const signout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      signOut(auth);
      signOutUser(authUser?.uid);
    }
  };

  // Springboot = Sign-in Admin
  const signinAdmin = async (uid) => {
    return await axios.post(`${BASE_URL}api/admin/signin`, {
      uid: uid,
    });
  };

  // Sign-out Volunteer/Admin
  const signOutUser = async (uid) => {
    await axios.post(`${BASE_URL}api/signout`, {
      uid: uid,
    });
  };

  // Listener to trigger signin of springboot
  useEffect(() => {
    if (authUser) {
      try {
        signinAdmin(authUser?.uid);
        setIsLoggedIn(true);
      } catch (err) {
        setError(err.message);
      }
    }
  }, [authUser]);

  const submitHandler = () => {
    signInUserWithPwAndEmail();
    setIsLoggedIn(true);
  };

  return (
    <div className="flex flex-col mt-28 w-full h-auto md:h-[75vh] justify-center items-center">
      <h1 className="text-2xl font-bold text-red-300">
        Token Generator for VMS REST API (SWAGGER)
      </h1>
      <h3>{error}</h3>
      <div className="flex flex-col justify-center items-center lg:mt-8 space-y-4 p-6 py-10 px-12 border border-gray-200 rounded-md shadow-lg">
        <div className="flex flex-col justify-between items-center mt-8 space-y-3">
          <h2 className="font-bold text-2xl">
            Click here to generate access token
          </h2>
          <button
            onClick={submitHandler}
            className="btn btn-info w-full text-white"
          >
            Generate Token
          </button>
          <button onClick={signout} className="btn btn-error w-full text-white">
            Sign Out
          </button>
        </div>
      </div>
      <h3 className="mt-4 text-2xl font-bold">Access Token</h3>
      <div className="w-[40vw] h-[75vh] text-blue-600 bg-blue-100 mt-4 text-center border border-gray-300 rounded-lg p-4 overflow-auto break-words">
        {authUser?.accessToken
          ? authUser?.accessToken
          : 'You are logged out! Please generate token.'}
      </div>
      <button
        disabled={!authUser?.accessToken}
        onClick={() => {
          navigator.clipboard.writeText(authUser?.accessToken);
        }}
        className="btn btn-secondary btn-xs mt-4"
      >
        Copy
      </button>
    </div>
  );
}

export default App;
