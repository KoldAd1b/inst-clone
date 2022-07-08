import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../firebase";
import { authActions } from "../../store/authSlice";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Loading from "../Utility/Loading";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const { doneChecking } = useSelector((state) => state.auth);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      const getUser = async () => {
        const user = await getDoc(doc(db, "users", auth.currentUser.uid));

        if (user.exists()) {
          dispatch(
            authActions.setUser({
              ...user.data(),
              createdAt: user.data().createdAt.toDate().toString(),
            })
          );
        }
      };
      if (user) {
        getUser();
      }
      setLoading(false);
      dispatch(authActions.doneChecking());
    });
  }, []);

  if (loading) return <Loading />;

  return <>{doneChecking && children}</>;
};

export default AuthProvider;
