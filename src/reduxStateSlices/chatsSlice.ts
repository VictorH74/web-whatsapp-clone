import { RootState } from "@/app/store";
import { Chat, Message } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChatF = Omit<Chat, "createdAt" | "recentMessage"> &
  Record<"createdAt", string> &
  Record<
    "recentMessage",
    (Omit<Message, "id" | "sentAt"> & Record<"sentAt", string>) | undefined
  >;

interface chatsState {
  value: ChatF[];
  currentChat: ChatF | null;
}

const initialState: chatsState = {
  value: [],
  currentChat: null,
};

const serializeDateFields = (c: Chat) => ({
  ...c,
  createdAt: c.createdAt.toString(),
  recentMessage: c.recentMessage
    ? { ...c.recentMessage, sentAt: c.recentMessage.sentAt.toString() }
    : undefined,
});

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    updateChats: (state, { payload }: PayloadAction<Chat[]>) => {
      const chats = payload.map((c) => serializeDateFields(c));

      state.value = chats;
    },
    updateCurrentChat: (state, { payload }: PayloadAction<Chat | null>) => {
      state.currentChat =
        payload !== null ? serializeDateFields(payload) : null;
    },
  },
});

export const { updateChats, updateCurrentChat } = chatsSlice.actions;

export const selectChats = (state: RootState) => state.chats.value;

export const selectCurrentChat = (state: RootState) => state.chats.currentChat;

export default chatsSlice.reducer;
