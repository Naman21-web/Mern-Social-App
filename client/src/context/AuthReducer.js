//Describing the different cases
// It takes two parameteres
const AuthReducer = (state, action) => {
  //Checking cases of type 
  switch (action.type) {
    //If login starts change details to 
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    //If login starts change details to
    case "LOGIN_SUCCESS":
       return {
        // use payload of the Authactions
        user: action.payload,
        isFetching: false,
        error: false,
      };
    //If login fails change details to
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    //In case of follow
    case "FOLLOW":
      return {
        //All previous state
        ...state,
        user: {
          //All previous user in state
          ...state.user,
          //All previous followings in state.user and add action.payload in it
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        //All previous state
        ...state,
        //All previous user in state
        user: {
          ...state.user,
          //filter following which is not equal to action.payload 
          //that will filter out all following except action.payload
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
      //In default return state
    default:
      return state;
  }
};

export default AuthReducer;
