export const loadApiConfig = () => async (dispatch) => {
  try {
    const response = await fetch("/config.json");
    const config = await response.json();

    dispatch({
      type: "SET_API_URL",
      payload: config.API_URL,
    });
  } catch (error) {
    console.error("Failed to load config.json", error);
  }
};
