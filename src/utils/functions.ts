import { db } from "@/services/firebase";
import { Timestamp, doc } from "firebase/firestore";

export const createUserRef = (email: string) => doc(db, "user", email);

export const getDate = (date?: Date): { hour: number; minute: number } => {
  if (!date) return { hour: 0, minute: 0 };

  const unknowDate = date as unknown;
  const dt = new Date((unknowDate as Timestamp).seconds * 1000);
  const hour = dt.getHours();
  const minute = dt.getMinutes();

  return { hour, minute };
};

export const generateChatId = (emails: string[]) =>
  emails
    .sort()
    .map((id) => id)
    .join("+");

export const formatNumber = (number: number) => {
  if (number < 10) {
    return "0" + number;
  }
  return `${number}`;
};
