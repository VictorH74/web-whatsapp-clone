"use client"
import { auth, provider } from "@/services/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter()
  
  const signInwithGoogle = () => {
    setPersistence(auth, inMemoryPersistence).then(() => {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          router.replace("/");
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    });
  };

  return (
    <main className="h-screen w-screen grid place-items-center">
      <button
        className="text-white bg-[#CE4736] p-3 rounded-md hover:scale-105 duration-200"
        onClick={signInwithGoogle}
      >
        Entrar com Google
      </button>
    </main>
  );
}
