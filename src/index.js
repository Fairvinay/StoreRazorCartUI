import React from "react";
import ReactDOM from "react-dom";
import "./styles/bootstrap.min.css";
import "./styles/index.css";
import App from "./App";
 
import { Provider } from "react-redux";
import store from "./store";
import { ApiConfigProvider } from "./context/ApiConfigContext";
import { loadApiConfig } from "./actions/apiConfigActions";

store.dispatch(loadApiConfig()); // Load API_URL at app startup

//  <InitLoader store={store} />
ReactDOM.render(
  <Provider store={store}>
     <ApiConfigProvider>
    <App />
    </ApiConfigProvider>
  </Provider>,
  document.getElementById("root")
);
