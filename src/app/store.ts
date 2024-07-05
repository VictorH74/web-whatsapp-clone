import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import chatsReducer from "@/reduxStateSlices/chatsSlice";
import usersReducer from "@/reduxStateSlices/usersSlice";

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
