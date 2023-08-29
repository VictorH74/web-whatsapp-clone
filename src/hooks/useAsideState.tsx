import { AsideCtx } from "@/contexts/aside";
import { useContext } from "react";

const useAsideState = () => useContext(AsideCtx);

export default useAsideState;
