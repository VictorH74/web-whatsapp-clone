type ChatBox = {
  id: string;
  createAt: Date;
  messages?: Message[] | [];
  users: string[];
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
