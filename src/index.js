import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import MediaQuery from "react-responsive";

const theme = createMuiTheme({
  palette: {
    secondary: {
      light: "#00B4D8",
      main: "#00B4D8",
      dark: "#0077B6",
      contrastText: "#000",
    },
    info: {
      light: "#000A29",
      main: "#000A29",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "black",
      main: "#23A6F0",
      dark: "black",
      contrastText: "black",
    },
  },
  typography: {
    fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
    button: {
      textTransform: "none",
    },
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        position: "relative",
        "& $notchedOutline": {
          borderColor: "#00B4D8",
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: "#000a29",
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            borderColor: "#000a29",
          },
        },
        "&$focused $notchedOutline": {
          borderColor: "#000a29",
          borderWidth: 1,
        },
      },
    },
    MuiFormLabel: {
      root: {
        "&$focused": {
          color: "#4A90E2",
        },
      },
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <MediaQuery query="(min-device-width: 769px)">
      <App />
    </MediaQuery>
  </ThemeProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
