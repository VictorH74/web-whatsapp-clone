import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import ChatsProvider from "../contexts/chats";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatsProvider>{children}</ChatsProvider>
    </QueryClientProvider>
  );
}
