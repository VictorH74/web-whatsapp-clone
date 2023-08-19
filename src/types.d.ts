type ChatBox = {
  id: string;
  createdAt: Date;
  messages: Message[] | [];
  users: SimpleUser[];
};

type User = {
  photoUrl?: string;
  email: string;
  name: string;
  createdAt: Date;
};

type SimpleUser = Pick<User, "name" | "email">;

type Message = {
  sender: string;
  content: string;
  createdAt: any;
  vizualizedBy: string[];
};
