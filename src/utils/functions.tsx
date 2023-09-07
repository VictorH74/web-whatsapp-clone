import { db } from "@/services/firebase";
import { Timestamp, doc } from "firebase/firestore";

export const createUserRef = (email: string) => doc(db, "user", email);

export const unserializeDateField = (str: string) =>
  convertToTimestamp(str) as unknown as Date;

export const getDate = (
  timestamp?: Timestamp
): { hour: number; minute: number } => {
  if (!timestamp) return { hour: 0, minute: 0 };

  const dt = new Date(timestamp.seconds * 1000);
  const hour = dt.getHours();
  const minute = dt.getMinutes();

  return { hour, minute };
};

export const generateChatId = (emails: string[]) =>
  [...emails]
    .sort()
    .map((id) => id)
    .join("+");

export const formatNumber = (number: number) => {
  if (number < 10) {
    return "0" + number;
  }
  return `${number}`;
};

export const convertToTimestamp = (str?: string) => {
  if (!str) return;
  const timestampArray = str.match(/\d+/g);

  if (timestampArray && timestampArray.length === 2) {
    const seconds = parseInt(timestampArray[0]);
    const nanoseconds = parseInt(timestampArray[1]);

    return new Timestamp(seconds, nanoseconds);
  }
};

export const formatMsgContent = (contentText: string, className?: string) => {
  const parts = contentText.split("<br>");
  return parts.map((part, index) => (
    <p
      className={`${className} ${
        index !== parts.length - 1 ? "block" : "inline-block"
      }`}
      key={part}
    >
      {part}
    </p>
  ));
};
