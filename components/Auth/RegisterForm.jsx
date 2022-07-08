import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { createAccount } from "../../auth";
import { useRouter } from "next/dist/client/router";
import { db } from "../../firebase";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../utils/validators";

const intitialState = {
  email: "",
  password: "",
  username: "",
  name: "",
  confirmPassword: "",
  errors: [],
};

const RegisterForm = () => {
  const [form, setForm] = useState(intitialState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { password, email, name, confirmPassword, errors, username } = form;
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !email || !name || !confirmPassword) {
      setForm((prev) => ({
        ...prev,
        errors: ["Must not leave any field empty"],
      }));
    }

    const invalidName = validateName(name);
    const inValidEmail = validateEmail(email);
    const inValidPassword = validatePassword(password);
    const invalidUsername =
      username.trim().length > 20
        ? "Username cannot be over 20 characters"
        : null;

    if (invalidName || inValidEmail || inValidPassword || invalidUsername) {
      let passError = [];
      if (inValidPassword) {
        passError = [...inValidPassword];
      }
      return setForm((prev) => ({
        ...prev,
        errors: [invalidName, inValidEmail, invalidUsername, ...passError],
      }));
    }

    if (password.trim() !== confirmPassword.trim()) {
      return setForm((prev) => ({
        ...prev,
        errors: ["The two passwords must match"],
      }));
    }

    try {
      setLoading(true);
      const user = await createAccount(email.trim(), password.trim());

      await setDoc(doc(db, "users", user.user.uid), {
        uid: user.user.uid,
        name,
        username,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
        bio: "",
      });

      setForm(intitialState);
      setLoading(false);
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        errors: err.message,
      }));
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
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
          type="text"
          placeholder="Username"
          name="username"
          value={username}
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
          type="email"
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
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={password}
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
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
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
      {errors.length > 0 &&
        errors.map((error) => (
          <p className="text-base text-red-400 text-left mb-2">{error}</p>
        ))}
      <div className="mb-10">
        <input
          onClick={handleSubmit}
          type="submit"
          value="Sign Up"
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
        />
      </div>
    </form>
  );
};

export default RegisterForm;
