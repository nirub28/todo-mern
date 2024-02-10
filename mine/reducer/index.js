// userReducer.js
const initialState = {
    user: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...state,
          user: action.payload, // Update user
        };
      case 'LOGOUT':
        return {
          ...state,
          user: null,
        };
        case 'UPDATE_USER': 
      return {
        ...state,
        user: {
          ...state.user,
          bio: action.bio,
          profilePicture: action.profilepic,
        },
      };
      default:
        return state;
    }
  };
  
  export default userReducer;
  