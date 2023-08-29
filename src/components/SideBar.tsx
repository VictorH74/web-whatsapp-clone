import ChatList from "./ChatList";
import Header from "./Header";
import NewGroupChat from "./NewGroupChat";
import ChatIcon from "@mui/icons-material/Chat";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import GroupsIcon from "@mui/icons-material/Groups";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import NewPrivateChat from "./NewPrivateChat";
import useSidebarState from "@/hooks/useSidebarState";

export default function SideBar() {
  const auth = getAuth();
  const router = useRouter();
  const { setNewGroupChatArea, setNewPrivateChatArea } = useSidebarState();
  const { currentUser } = getAuth();

  return (
      <aside className="relative border-r-[1px] border-r-zinc-700 min-w-[340px] w-[620px] max-h-screen bg-[#111B21] flex flex-col custom-scrollbar">
        <NewGroupChat />
        <NewPrivateChat />
        <Header
          imgSrc={currentUser?.photoURL || undefined}
          actions={[
            <button key={(Math.random() + 1).toString(36).substring(7)}>
              <GroupsIcon sx={{ color: "white" }} />
            </button>,
            <button key={(Math.random() + 1).toString(36).substring(7)}>
              <TrackChangesIcon sx={{ color: "white" }} />
            </button>,
            <button
              key={(Math.random() + 1).toString(36).substring(7)}
              onClick={() => setNewPrivateChatArea(true)}
            >
              <ChatIcon sx={{ color: "white" }} />
            </button>,
          ]}
          menuItems={[
            {
              onClick() {
                setNewGroupChatArea(true);
              },
              title: "Novo Grupo",
            },
            {
              onClick() {
                auth.signOut();
                router.replace("/login");
              },
              title: "Sair",
            },
          ]}
        />
        <ChatList />
      </aside>
  );
}
