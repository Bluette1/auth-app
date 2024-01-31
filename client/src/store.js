import { createStore, applyMiddleware } from "redux";
import { composeWithDevToolsDevelopmentOnly } from "@redux-devtools/extension";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers";

const middleware = [thunk];

const configureStore = (preloadedState) => {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeWithDevToolsDevelopmentOnly(applyMiddleware(...middleware))
  );
  return store;
};

export default configureStore;
