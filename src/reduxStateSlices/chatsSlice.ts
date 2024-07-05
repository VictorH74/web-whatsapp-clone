import { RootState } from "@/app/store";
import { Chat } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface chatsState {
  value: Chat[];
  currentChat: Chat | null;
}

const initialState: chatsState = {
  value: [],
  currentChat: null,
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    updateChats: (state, { payload }: PayloadAction<Chat[]>) => {
      state.value = payload;
    },
    updateCurrentChat: (state, { payload }: PayloadAction<Chat | null>) => {
      state.currentChat = payload;
    },
  },
});

export const { updateChats, updateCurrentChat } = chatsSlice.actions;

export const selectChats = (state: RootState) => state.chats.value;

export const selectCurrentChat = (state: RootState) => state.chats.currentChat;

export default chatsSlice.reducer;
