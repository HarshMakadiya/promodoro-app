import React, { useEffect, useState } from "react";
import { auth, GoogleAuthProvider, signInWithPopup } from "../../firebase";
import LogoutIcon from "../../assets/LogoutIcon/LogoutIcon";
import user from "../../handler/User";

const Navbar = ({ setIsLoggedIn, isLoggedIn }) => {
  useEffect(()=>{
    setIsLoggedIn(user.isLoggedIn);
    // if(user.isLoggedIn){
    //     user.sync();
    //     console.log(user.displayName);
        
    // }
  },[])
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem('user',JSON.stringify(result.user));
      await user.sync();
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };
  return (
    <nav className="bg-transparent p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">Promodoro</div>
          <ul className="flex space-x-6">
            {isLoggedIn ? (
              <>
                <li>
                <button
                  className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
                >
                  <img
                    className="w-6 h-6 rounded-full"
                    src={user.photoURL}
                    loading="lazy"
                    alt="google logo"
                  />
                  <span>{user.displayName}</span>
                </button>
                </li>
                <li>
                    <button
                        onClick={() => {
                            user.logout();
                            setIsLoggedIn(false);
                        }}
                        className="px-4 py-2 flex gap-2 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
                    >
                        <LogoutIcon/>
                        {/* <span>Logout</span> */}
                    </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleGoogleSignIn}
                  className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
                >
                  <img
                    className="w-6 h-6"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    loading="lazy"
                    alt="google logo"
                  />
                  <span>Login with Google</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
