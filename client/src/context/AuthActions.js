export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

//Takes parameter user
export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

//Takes parameter userId 
export const Follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

//Takes parameter userId 
export const Unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});
