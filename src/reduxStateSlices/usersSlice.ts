import { RootState } from "@/app/store";
import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UsersObjType = Record<
  string,
  Omit<User, "lastTimeOnline"> & Record<"lastTimeOnline", string>
>;

interface UsersState {
  value: UsersObjType;
}

const initialState: UsersState = {
  value: {},
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUsersObj: (
      state,
      { payload: { id, data } }: PayloadAction<{ id: string; data: User }>
    ) => {
      state.value = {
        ...state.value,
        [id]: {
          ...state.value[id],
          ...{ ...data, lastTimeOnline: data.lastTimeOnline.toString() },
        },
      };
    },
    seedUsersObj: (state, { payload }: PayloadAction<UsersObjType>) => {
      state.value = payload;
    },
  },
});

export const { updateUsersObj, seedUsersObj } = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users.value;

export default usersSlice.reducer;
