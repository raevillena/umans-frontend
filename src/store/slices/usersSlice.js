import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import usersApi from "../../api/usersApi";

// Async action to handle getting users
export const getUsers = createAsyncThunk("users/getUsers", async (_, { rejectWithValue }) => {
  try {
      const response = await usersApi.getUsers();
      console.log("from slice: ",response.data)
      return response.data; // Expecting { accessToken, user }
  } catch (error) {
      if(error.response.data.errors){
          const eachError = error.response.data.errors.map(err => err.msg).join(", ")
          return rejectWithValue(eachError || "Getting users failed");
      }
      return rejectWithValue(error.response?.data?.msg || "Getting users failed");
  }
});

// Async action to handle getting users
export const createUser = createAsyncThunk("auth/createUser", async (newUser, { rejectWithValue }) => {
  try {
      const response = await usersApi.createUser(newUser);
      return response.data; // Expecting { accessToken, user }
  } catch (error) {
      if(error.response.data.errors){
        const eachError = error.response.data.errors.map(err => err.msg).join(", ")
        return rejectWithValue(eachError || "Signup failed");
      }
      return rejectWithValue(error.response?.data?.msg || "Something went wrong");
  }
});

// Async action to handle getting users
export const updateUser = createAsyncThunk("users/updateUser", async ({id, data}, { rejectWithValue }) => {
  try {
      const response = await usersApi.updateUser(id, data);
      return response.data; // Expecting { accessToken, user }
  } catch (error) {
      if(error.response.data.errors){
        const eachError = error.response.data.errors.map(err => err.msg).join(", ")
        return rejectWithValue(eachError || "Signup failed");
      }
      return rejectWithValue(error.response?.data?.msg || "Something went wrong");
  }
});

const initialState = {
  users:  ['empty'],
  admins: ['empty'],
  types: ['empty'],
  loading: false,
  error: null,
  message: null,
  snackbar: { open: false, message: "", severity: "info" }, // Snackbar state
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    closeSnackbar: (state) => {
      state.snackbar.open = false;
    },
  },
  extraReducers: (builder) => {
      builder
          .addCase(getUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
          })
          .addCase(getUsers.fulfilled, (state, action) => {
            state.users = action.payload;
            state.loading = false;
            state.snackbar = { open: true, message: "User loaded successfully!", severity: "success" };
            state.message = "Users loaded successfully";
          })
          .addCase(getUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.snackbar = { open: true, message: "Error on loading users!", severity: "error" };
          })
          .addCase(createUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
          })
          .addCase(createUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users.push(action.payload);
            state.snackbar = { open: true, message: `${action.payload.email} was added successfully`, severity: "success" };
          })
          .addCase(createUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(updateUser.pending, (state) => {
            state.error = null;
            state.message = null;
          })
          .addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = state.users.map((user) =>
              user.id === action.payload.id ? action.payload : user
            );
            state.snackbar = { open: true, message: "User was updated successfully!", severity: "success" };
          })
          .addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.snackbar = { open: true, message: "Something went wrong updating the user!", severity: "success" };
          })
  },
});
export const { closeSnackbar } = usersSlice.actions;
export default usersSlice.reducer;