import ChatList from "./components/ChatList";
import Header from "../global/Header";
import NewGroupChat from "./components/newchat/NewGroupChat";
import ChatIcon from "@mui/icons-material/Chat";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import GroupsIcon from "@mui/icons-material/Groups";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import NewPrivateChat from "./components/newchat/NewPrivateChat";
import useAsideState from "@/hooks/useAsideState";
import service from "@/services/chat";

export default function Aside() {
  const { setAsideContentNumber } = useAsideState();
  const router = useRouter();
  const auth = getAuth();

  return (
    <aside className="relative border-r-[1px] border-r-zinc-700 min-w-[340px] w-[620px] max-h-screen bg-[#111B21] flex flex-col custom-scrollbar">
      <NewGroupChat />
      <NewPrivateChat />
      <Header
        imgSrc={auth.currentUser?.photoURL || undefined}
        actions={[
          <button
            onClick={() => alert("Não funcional")}
            key={(Math.random() + 1).toString(36).substring(7)}
          >
            <GroupsIcon sx={{ color: "white" }} />
          </button>,
          <button
            onClick={() => alert("Não funcional")}
            key={(Math.random() + 1).toString(36).substring(7)}
          >
            <TrackChangesIcon sx={{ color: "white" }} />
          </button>,
          <button
            key={(Math.random() + 1).toString(36).substring(7)}
            onClick={() => setAsideContentNumber(1)}
          >
            <ChatIcon sx={{ color: "white" }} />
          </button>,
        ]}
        menuItems={[
          {
            onClick() {
              setAsideContentNumber(2);
            },
            title: "Novo Grupo",
          },
          {
            onClick() {
              const email = auth.currentUser?.email;
              if (email) {
                service.createOrUpdateUser(
                  {
                    email: email,
                    online: false,
                    lastTimeOnline: new Date(),
                  },
                  true
                );
              }
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
