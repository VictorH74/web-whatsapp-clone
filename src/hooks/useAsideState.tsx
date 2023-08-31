import { AsideCtx } from "@/contexts/asideCtx";
import { useContext } from "react";

const useAsideState = () => useContext(AsideCtx);

export default useAsideState;
