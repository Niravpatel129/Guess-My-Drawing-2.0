export const setInfo = user => {
  return {
    type: "SET_INFO",
    payload: user
  };
};

export const UserInfo = user => {
  return {
    type: "LOGIN_USER",
    payload: user
  };
};

export const showNotification = val => {
  return {
    type: "SET_NOTIFICATION",
    payload: val
  };
};
