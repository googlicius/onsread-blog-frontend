import client from '@/apollo-client';
import { MeDocument, MeQuery } from '@/graphql/generated';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IMeState, IRootState } from './interface';

const initialState: IMeState = {
  value: null,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const meInitialAsync = createAsyncThunk('me/initial', async () => {
  if (
    typeof window !== 'undefined' &&
    !!localStorage.getItem(process.env.NEXT_PUBLIC_JWT_TOKEN_KEY)
  ) {
    const res = await client.query<MeQuery>({
      query: MeDocument,
    });
    return res.data.me;
  }

  // The value we return becomes the `fulfilled` action payload
  return null;
});

const meSlice = createSlice({
  name: 'me',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLoggedInUser(state, action) {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
    clearLoggedInUser(state) {
      state.value = null;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: builder => {
    builder.addCase(meInitialAsync.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    // .addCase(incrementAsync.fulfilled, (state, action) => {
    //   state.status = 'idle';
    //   state.value += action.payload;
    // });
  },
});

export const { setLoggedInUser, clearLoggedInUser } = meSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectMe = (state: IRootState) => state.me.value;

export default meSlice.reducer;
