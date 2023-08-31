import { useContext } from "react";
import { AppStatesCtx } from "../contexts/appStates";

export default function useAppStates() {
  return useContext(AppStatesCtx);
}
