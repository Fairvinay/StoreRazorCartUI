const initialState = {
    apiUrl: null,
  };
  
  const apiConfigReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_API_URL":
        return {
          ...state,
          apiUrl: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default apiConfigReducer;
  