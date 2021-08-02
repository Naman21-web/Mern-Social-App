import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    // post user credential in this address
    const res = await axios.post("/auth/login", userCredential);
    // if login success payload res.data
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    // if error occour
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

