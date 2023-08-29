import { SidebarCtx } from "@/contexts/sidebar";
import { useContext } from "react";

const useSidebarState = () => useContext(SidebarCtx);

export default useSidebarState;
