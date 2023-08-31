import { useContext } from "react";
import { AppStatesCtx } from "../contexts/appCtx";

export default function useAppStates() {
  return useContext(AppStatesCtx);
}
