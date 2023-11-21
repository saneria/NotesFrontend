import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Provider>
    </>
  );
}

export default App;
