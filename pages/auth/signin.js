import Header from "../../components/Header";
import { useEffect, useLayoutEffect, useState } from "react";
import { signInWithGoogle } from "../../auth";
import { useRouter } from "next/dist/client/router";
import Circles from "../../components/SVG/Circles";
import LoginForm from "../../components/Auth/LoginForm";
import RegisterForm from "../../components/Auth/RegisterForm";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";

//Browser
function signIn() {
  const [login, setLogin] = useState(true);
  const [googleError, setGoogleError] = useState("");
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  return (
    <>
      <section className="bg-[#F4F7FF] py-20 lg:py-[120px] h-screen">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center">
            <div className="w-full px-4">
              <div
                className="
               max-w-[525px]
               mx-auto
               text-center
               bg-white
               rounded-lg
               relative
               overflow-hidden
               py-16
               px-10
               sm:px-12
               md:px-[60px]
               "
              >
                <div className="mb-10 md:mb-16 text-center">
                  <div className="inline-block max-w-[160px] mx-auto">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png"
                      alt="logo"
                    />
                  </div>
                </div>
                {login ? <LoginForm /> : <RegisterForm />}

                <p className="text-base text-[#000000]">OR</p>
                {googleError && (
                  <p className="text-red-500 text-center text-base">
                    {googleError}
                  </p>
                )}
                <div className="my-4">
                  <div>
                    <button
                      className="p-3 bg-red-600 rounded-lg border-transparent border-2 text-white hover:bg-white hover:text-red-600 hover:border-blue-400 text-md  hover:transition "
                      onClick={async () => {
                        try {
                          const data = await signInWithGoogle();

                          console.log(data.user.uid);
                          const user = await getDoc(
                            doc(db, "users", data.user.uid)
                          );

                          if (user.exists()) return;
                          else
                            await setDoc(doc(db, "users", data.user.uid), {
                              uid: data.user.uid,
                              username: data.user.displayName,
                              name: data.user.displayName,
                              email: data.user.email,
                              createdAt: Timestamp.fromDate(new Date()),
                              isOnline: true,
                            });
                          router.push("/");
                        } catch (err) {
                          setGoogleError(err.message);
                        }
                      }}
                    >
                      Sign in with Google
                    </button>
                  </div>
                </div>

                <p className="text-base text-[#adadad]">
                  Not a member yet?
                  <br />
                  <button
                    onClick={() => {
                      setLogin((prev) => !prev);
                    }}
                    className="text-primary hover:underline"
                  >
                    {login ? "Sign Up" : "Sign in"}
                  </button>
                </p>
                <Circles />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default signIn;
