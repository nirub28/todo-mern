// actions/userActions.js
export const login = (user) => {
    return {
      type: 'LOGIN',
      payload: user,
    };
  };
  
  export const logout = () => {
    return {
      type: 'LOGOUT',
    };
  };
  
  export const updateUser = (profilepic, bio) => {
    return {
      type: 'UPDATE_USER',
      profilepic,
      bio,
    };
  };