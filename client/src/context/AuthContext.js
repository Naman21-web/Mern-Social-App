import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

// It is the initial state
const INITIAL_STATE = {
  user:JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

//Creating the new context with name AuthContext and giving the INITIAL_STATE value inside it and exporting it
//and now we can useContext by providing AuthContext value inside it and get the data in this anywhere 
//by importing it in the file
export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  // using reducer to store data alternative of useState and providing value INITIAL_STATE inside it
  // useReducer is usually preferable to useState when you have complex state logic that involves
  // multiple sub-values or when the next state depends on the previous one. 
  //useReducer also lets you optimize performance for components that trigger deep updates because you can pass 
  //dispatch down instead of callbacks.
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  
  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(state.user))//Converting state.user (
      //i.e., calling user present in the INITIAL_STATE ) into string and Saving it into local storage
  },[state.user])//Refresh every time state.user is changes
  
  return (
    <AuthContext.Provider
    // props inside AuthContextProvider
      value={{
        // providing state.user i.e., calling user present in the INITIAL_STATE
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {/* Keeping its children inside AuthContext.Provider. We have kept App in index.js */}
      {children}
    </AuthContext.Provider>
  );
};
