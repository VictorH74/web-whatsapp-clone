import ChatList from "./ChatList";
import Header from "./Header";
import NewChat from "./NewChat";
import ChatIcon from "@mui/icons-material/Chat";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import GroupsIcon from "@mui/icons-material/Groups";
import { getAuth } from "firebase/auth";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export default function SideBar() {
  const [show, setShow] = useState(false);
  const auth = getAuth();
  const router = useRouter();
  const { currentUser } = getAuth();

  const handleSetShow = useCallback((value: boolean) => {
    setShow(() => value);
  }, []);

  return (
    <aside className="relative border-r-[1px] border-r-zinc-700 min-w-[340px] w-[620px] max-h-screen bg-[#111B21] flex flex-col custom-scrollbar">
      <NewChat show={show} setShow={(value) => handleSetShow(value)} />
      <Header
        accountImgUrl={currentUser?.photoURL || undefined}
        actions={[
          <button key={(Math.random() + 1).toString(36).substring(7)}>
            <GroupsIcon sx={{ color: "white" }} />
          </button>,
          <button key={(Math.random() + 1).toString(36).substring(7)}>
            <TrackChangesIcon sx={{ color: "white" }} />
          </button>,
          <button
            key={(Math.random() + 1).toString(36).substring(7)}
            onClick={() => handleSetShow(true)}
          >
            <ChatIcon sx={{ color: "white" }} />
          </button>,
        ]}
        menuItems={[
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
