import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/authReducer";

// Combine reducers
const rootReducer = combineReducers({
//   notes: noteReducer,
  auth: authReducer,
});

// Create the store with combined reducer
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
