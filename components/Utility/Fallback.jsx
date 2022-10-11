import { useRouter } from "next/router";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

export const Fallback = () => {
  const router = useRouter();

  return (
    <>
      <div className="h-[90vh] w-full flex items-center justify-center flex-col space-y-4">
        <ExclamationCircleIcon className="h-24 w-24 text-red-800" />
        <h1 className="text-red-600 font-bold bg-white p-3 shadow-md ">
          Something went wrong... Please refresh or login again
        </h1>
        <button
          className="text-white px-3 py-2 bg-indigo-500 hover:bg-white hover:text-indigo-600"
          onClick={() => router.replace("/auth/signin")}
        >
          Take me to login
        </button>
      </div>
    </>
  );
};
