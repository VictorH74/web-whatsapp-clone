import { db } from "@/services/firebase";
import { doc } from "firebase/firestore";

export const createUserRef = (email: string) => doc(db, "user", email);