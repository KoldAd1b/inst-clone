import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { signInWithPassword } from "../../auth";
import { db } from "../../firebase";
import { validateEmail, validatePassword } from "../../utils/validators";

const initialState = { email: "", password: "", errors: [] };

const LoginForm = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { password, email, errors } = form;
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setForm((prev) => ({
        ...prev,
        errors: ["Must not leave any field empty"],
      }));
    }

    const inValidEmail = validateEmail(email.trim());
    const invalidPassword = validatePassword(password.trim());

    if (invalidPassword || inValidEmail) {
      let passError = [];
      if (invalidPassword) {
        passError = [...invalidPassword];
      }

      return setForm((prev) => ({
        ...prev,
        errors: [inValidEmail, ...passError],
      }));
    }

    try {
      setLoading(true);
      const user = await signInWithPassword(email.trim(), password.trim());

      await updateDoc(doc(db, "users", user.user.uid), {
        isOnline: true,
      });

      setLoading(false);

      setForm(initialState);
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        errors: [err.message],
      }));
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
          className="
        w-full
        rounded-lg
        py-3
        px-5
        bg-[#FCFDFE]
        text-base 
        placeholder-gray-400
        outline-none
        focus:ring-2
        focus:scale-x-105
        transition
        "
        />
      </div>
      <div className="mb-6">
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={handleChange}
          className="
        w-full
        rounded-lg
        py-3
        px-5
        bg-[#FCFDFE]
        text-base
        focus:scale-x-105
        transition
        placeholder-gray-400
        outline-none
        focus-visible:shadow-none
        focus:ring-2
        "
        />
      </div>
      {errors.length > 0 &&
        errors.map((error) => (
          <p className="text-base text-red-400 text-left mb-2">{error}</p>
        ))}
      <div className="mb-10">
        <button
          type="submit"
          className={`
        w-full
        rounded-md
        border
        py-3
        px-5
        bg-primary
        text-base text-white
        cursor-pointer
        bg-gradient-to-r from-[#F58529]  via-[#DD2A7B] to-[#515BD4]
        hover:opacity-40
        hover:rounded-none
        active:-translate-y-1
        active:shadow-md
        transition ${loading && "animate-pulse"}`}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
