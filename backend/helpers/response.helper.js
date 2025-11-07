
export const responseSuccess = (message, data) => {
  return {
    status: "success",
    message: message,
    data: data,
  };
};

export const responseError = (message) => {
  return {
    status: "error",
    message: message,
    data: null,
  };
};

