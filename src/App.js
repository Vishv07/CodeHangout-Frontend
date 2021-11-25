import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import store from "./store/store";
import { Provider } from "react-redux";
import SnackBar from "./components/SnackBar/Snackbar.js";
import "fontsource-poppins";
import "./App.css";

const Home = React.lazy(() => import("./components/Home/Home"));
const HangoutArea = React.lazy(() =>
  import("./components/HangoutArea/HangoutArea")
);

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<Loader />}>
          <SnackBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/:roomId" component={HangoutArea} />
          </Switch>
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;
