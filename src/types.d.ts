type ChatBox = {
  id: string;
  createdAt: Date;
  messages: Message[] | [];
  users: SimpleUser[];
  type: "duo" | "group";
  admList: string[];
  colors?: { [email: string]: number };
};


type User = {
  photoUrl?: string;
  email: string;
  name: string;
  createdAt: Date;
};

type SimpleUser = Pick<User, "name" | "email" | "photoUrl">;

type Message = {
  sender: string;
  content: string;
  createdAt: any;
  vizualizedBy: string[];
};
