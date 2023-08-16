type ChatBox = {
  id: string;
  createAt: Date;
  messages?: Message[] | [];
  users: User[];
};

type User = {
  email: string;
  name: string;
};

type Message = {
  sender: string;
  content: string;
  createdAt: Date;
  vizualizedBy: string[];
};
