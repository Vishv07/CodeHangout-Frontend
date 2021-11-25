import React, { Fragment, useEffect, useState } from "react";
import Modal from "react-modal";
import ShareIcon from "@material-ui/icons/Share";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import INPUT from "./CodeInput";
import OUTPUT from "./CodeOutput";
import copy from "copy-to-clipboard";
import { connect } from "react-redux";
import * as actions from "../../store/actions/editorActions.js";
import CloudDownloadRounded from "@material-ui/icons/CloudDownloadRounded";
import FullscreenRounded from "@material-ui/icons/FullscreenRounded";
import FullscreenExitRounded from "@material-ui/icons/FullscreenExitRounded";
import CloseIcon from "@material-ui/icons/Close";
import { getExtensionByLangCode } from "../../util/util";
import { css } from "@emotion/react";
import BeatLoader from "react-spinners/BeatLoader";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-jsx";
import {
  AppBar,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  ButtonGroup,
  Tooltip,
  Zoom,
  DialogContent,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import localClasses from "./CodeEditor.module.css";
import {
  languages,
  langMode,
  LangOptions,
  langId,
  langExtensionDict,
  themes,
} from "./LanguageData";

const useStyles = makeStyles((mutheme) => ({
  formControl: {
    margin: mutheme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: mutheme.spacing(2),
  },
}));

languages.forEach((lang) => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

themes.forEach((theme) => require(`ace-builds/src-noconflict/theme-${theme}`));

Modal.setAppElement("#root");

const CodeEditor = (props) => {
  const [filePopup, setFilePopup] = useState(false);
  const [fileHandleError, setFileHandleError] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [shareURL, setshareURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("monokai");
  const [popup, setPopup] = useState([false, ""]);

  useEffect(() => {
    let UpdatedCode = props.code;
    if (props.previousUser.id === props.id) {
      props.socket.emit("message", UpdatedCode);
    } else if (sessionStorage.getItem("isconnected")) {
      props.setCode(sessionStorage.getItem("code"));
    }
  }, [props.previousUser]);

  const classes = useStyles();
  useEffect(() => {
    props.socket.on("message", (newValue) => {
      props.setCode(newValue);
    });
  }, []);

  const handleChange = (newValue) => {
    props.setCode(newValue);
    sessionStorage.setItem("code", newValue);
    props.socket.emit("message", newValue);
  };

  const copyCode = (value) => {
    copy(value);
    setPopup([true, "Code Copied Sucessfully"]);
  };

  const fetchSharedCodeLink = async (content) => {
    var response = await fetch("https://dpaste.com/api/v2/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "content=" + encodeURIComponent(content),
    });
    return response.text();
  };

  const shareCode = (value) => {
    setModalIsOpen(true);
    setIsLoading(true);
    fetchSharedCodeLink(value).then((url) => {
      setIsLoading(false);
      setshareURL(url);
    });
  };

  const handleCodeRun = () => {
    props.executeCode(langId[props.currLang], props.code, props.codeInput);
  };

  const handleCodeDownload = () => {
    // download code here...
    const element = document.createElement("a");
    const file = new Blob([props.code], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = `solution.${getExtensionByLangCode(props.currLang)}`;
    document.body.appendChild(element);
    element.click();
  };

  const IONavbar = (props) => {
    return (
      <AppBar position="static" style={{ backgroundColor: "black" }}>
        <Typography
          variant="h6"
          style={{
            fontFamily: "poppins",
            color: "white",
            marginRight: "auto",
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: "auto",
            fontWeight: "400",
            padding: "3px 2px",
          }}
        >
          {props.type}
        </Typography>
      </AppBar>
    );
  };

  const uploadFile = () => {
    document.querySelector("#upload").click();
  };

  const checkValidFileExtension = (file) => {
    const validExtensions = Object.keys(langExtensionDict);
    var name = file.name;
    var valid = false;
    if (name.length > 0) {
      for (var i = 0; i < validExtensions.length; ++i) {
        var ext = validExtensions[i];
        if (
          name.substr(name.length - ext.length, ext.length).toLowerCase() ==
          ext.toLowerCase()
        ) {
          valid = true;
          break;
        }
      }
    }
    return valid;
  };

  const handleFileChange = () => {
    var file = document.querySelector("#upload").files[0];

    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        if (file.size > 10000) {
          setFilePopup(true);
          setFileHandleError("Error: File size greater than 10KB!");
          return;
        }

        if (!checkValidFileExtension(file)) {
          setFilePopup(true);
          setFileHandleError("Error: Not a Valid File Extension!");
          return;
        }

        handleChange(e.target.result);
        const fileNameArr = file.name.split(".");
        const ext = `.${fileNameArr[fileNameArr.length - 1]}`;
        props.setLanguage(langExtensionDict[ext]);
      };

      reader.onerror = function (e) {
        console.error("An error ocurred reading the file", e);
      };

      reader.readAsText(file, "UTF-8");
    }
  };

  // handle fullscreen mode
  const handleFullscreen = (props) => {
    fullscreen ? setFullscreen(false) : setFullscreen(true);
    props.toggleFocusMode();
  };

  return (
    <Fragment>
      <Dialog fullWidth={true} maxWidth={"sm"} open={props.isCompiling}>
        <DialogTitle style={{ margin: "auto" }}>Compiling ...</DialogTitle>
        {/* <div className={localClasses.loader}>
          <div>
            <span style={{ paddingLeft: "190px" }}>
              <ShareIcon style={{ fontSize: "125px" }} />
            </span>
            <span className={localClasses.arrow}>&gt;</span>
          </div>
        </div> */}
      </Dialog>
      <Dialog maxWidth={"sm"} open={props.isError}>
        <DialogTitle>Oops Error Occured</DialogTitle>
        <span style={{ marginLeft: "15px" }}>{props.codeError}</span>
        <DialogActions>
          <Button
            onClick={() => props.setIsError(false)}
            variant="contained"
            size="large"
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={popup[0]}
        autoHideDuration={2000}
        onClose={() => {
          setPopup([false, ""]);
        }}
      >
        <Alert
          onClose={() => {
            setPopup([false, ""]);
          }}
          severity="success"
          variant="filled"
        >
          {popup[1]}
        </Alert>
      </Snackbar>
      <Snackbar
        open={filePopup}
        autoHideDuration={2000}
        onClose={() => {
          setFilePopup(false);
        }}
      >
        <Alert
          onClose={() => {
            setFilePopup(false);
          }}
          severity="error"
          variant="filled"
        >
          {fileHandleError}
        </Alert>
      </Snackbar>
      <AppBar position="static" style={{ backgroundColor: "black" }}>
        <div className={`${localClasses.Editor__navbar} row`}>
          <Typography
            variant="h5"
            style={{
              fontFamily: "poppins",
              color: "white",
              marginRight: "auto",
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "30px",
              fontWeight: "800",
            }}
          >
            &nbsp;Code<span style={{ color: "#23A6F0" }}> Editor</span>
          </Typography>
          <Toolbar>
            <FormControl
              size="small"
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel
                id="mode-label"
                style={{ fontFamily: "poppins", color: "#23A6F0" }}
              >
                Language
              </InputLabel>
              <Select
                name="mode"
                labelId="mode-label"
                id="select-mode"
                value={props.currLang}
                onChange={(e) => {
                  props.setLanguage(e.target.value);
                }}
                label="Language"
                style={{ fontFamily: "poppins", color: "#ffffff" }}
              >
                {LangOptions.map((language) => (
                  <MenuItem value={language} key={language}>
                    <span className={localClasses.Menu__options}>
                      {language}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel
                id="theme-label"
                style={{ fontFamily: "poppins", color: "#23A6F0" }}
              >
                Theme
              </InputLabel>
              <Select
                name="Theme"
                labelId="theme-label"
                id="select-theme"
                onChange={(e) => setTheme(e.target.value)}
                value={theme}
                label="Theme"
                style={{ fontFamily: "poppins", color: "#ffffff" }}
              >
                {themes.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    <span className={localClasses.Menu__options}> {lang} </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel
                id="font-label"
                style={{ fontFamily: "poppins", color: "#23A6F0" }}
              >
                Font Size
              </InputLabel>
              <Select
                name="Theme"
                labelId="font-label"
                id="select-font"
                onChange={(e) => props.setFontSize(e.target.value)}
                value={props.fontSize}
                label="Font Size"
                style={{ fontFamily: "poppins", color: "#ffffff" }}
              >
                {[10, 12, 14, 16, 18, 20, 24, 28, 32, 40].map((size) => (
                  <MenuItem key={size} value={size}>
                    <span className={localClasses.Menu__options}> {size} </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Toolbar>
        </div>
      </AppBar>
      <Dialog fullWidth={true} maxWidth={"xs"} open={modalIsOpen}>
        <CloseIcon
          style={{
            fontSize: "2em",
            position: "absolute",
            right: "5px",
            top: "5px",
          }}
          onClick={() => {
            setModalIsOpen(false);
            setshareURL("");
          }}
        />
        <DialogTitle style={{ textAlign: "center", marginTop: "10px" }}>
          Share Your Code
        </DialogTitle>
        <DialogContent>
          <div
            style={{ display: "flex", alignItems: "center", margin: "20px" }}
          >
            {isLoading ? (
              <BeatLoader
                color="#23A6F0"
                loading={true}
                css={override}
                size={50}
              />
            ) : (
              <>
                <Typography
                  style={{
                    padding: "5px 10px",
                    background: "#eee",
                    borderRadius: "3px",
                  }}
                >
                  {shareURL}
                </Typography>
                <Tooltip title="Copy Url" arrow TransitionComponent={Zoom}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      copy(shareURL);
                      setPopup([true, "Url Copied !!!"]);
                    }}
                    style={{
                      fontFamily: "poppins",
                      marginLeft: "auto",
                      fontWeight: "600",
                      color: "white",
                    }}
                  >
                    <FileCopyIcon />
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <AceEditor
        mode={langMode[props.currLang]}
        theme={theme}
        height="550px"
        width={"auto"}
        value={props.code}
        onChange={handleChange}
        fontSize={props.fontSize}
        showPrintMargin
        showGutter
        highlightActiveLine
        name="CODEEDITOR"
        setOptions={{
          useWorker: false,
          enableLiveAutocompletion: props.autoCompletion,
        }}
      />
      <AppBar
        position="static"
        style={{ backgroundColor: "black", marginBottom: "10px" }}
      >
        <Toolbar>
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                checked={props.autoCompletion}
                onChange={() => {
                  props.setAutoCompletion(!props.autoCompletion);
                }}
                name="EnableAutoCompletion"
              />
            }
            label={
              <Typography>
                <span style={{ color: "white" }}>Auto-complete</span>
              </Typography>
            }
          />
          <input
            type="file"
            id="upload"
            onChange={() => handleFileChange()}
            hidden
            accept=".c, .cpp, .java, .js, .ts, .clj, .cljs, .cs, .cbl, .cob, .cpy, .erl, .hrl, .go, .py, .f90, .f95, .f03, .txt, .groovy, .gvy, .gy, .gsh, 	.kt, .kts, .ktm, .php, .r, .rb, .sql, .swift"
          />
          <ButtonGroup
            style={{ marginLeft: "auto" }}
            variant="contained"
            color="secondary"
          >
            <Tooltip title="Upload Code" arrow TransitionComponent={Zoom}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => uploadFile()}
                style={{
                  fontFamily: "poppins",
                  marginLeft: "auto",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                <CloudUploadIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Share Code" arrow TransitionComponent={Zoom}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => shareCode(props.code)}
                style={{
                  fontFamily: "poppins",
                  marginLeft: "auto",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                <ShareIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Copy Code" arrow TransitionComponent={Zoom}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => copyCode(props.code)}
                style={{
                  fontFamily: "poppins",
                  marginLeft: "auto",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                <FileCopyIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Download Code" arrow TransitionComponent={Zoom}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  fontFamily: "poppins",
                  marginLeft: "auto",
                  fontWeight: "600",
                  color: "white",
                }}
                onClick={handleCodeDownload}
              >
                <CloudDownloadRounded style={{ fontSize: 24 }} />
              </Button>
            </Tooltip>
            <Tooltip
              title={fullscreen ? "Exit Full Screen" : "Full Screen"}
              arrow
              TransitionComponent={Zoom}
            >
              <Button
                variant="contained"
                color="secondary"
                style={{
                  fontFamily: "poppins",
                  marginLeft: "auto",
                  fontWeight: "600",
                  color: "white",
                }}
                onClick={() => handleFullscreen(props)}
              >
                {fullscreen ? (
                  <FullscreenExitRounded style={{ fontSize: 24 }} />
                ) : (
                  <FullscreenRounded style={{ fontSize: 24 }} />
                )}
              </Button>
            </Tooltip>
          </ButtonGroup>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCodeRun}
            startIcon={<PlayArrowIcon style={{ fontSize: 24 }} />}
            style={{
              fontFamily: "poppins",
              marginLeft: "10px",
              fontWeight: "600",
              color: "#fff",
              backgroundColor: "green",
            }}
          >
            Run
          </Button>
        </Toolbar>
      </AppBar>

      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={6}>
          <IONavbar type={"Input"} />
          <INPUT />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <IONavbar type={"Output"} />
          <OUTPUT />
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    code: state.EDITOR.code,
    currLang: state.EDITOR.lang,
    fontSize: state.EDITOR.fontSize,
    autoCompletion: state.EDITOR.autoCompletion,
    codeInput: state.EDITOR.codeInput,
    codeOutput: state.EDITOR.codeOutput,
    isCompiling: state.EDITOR.isCompiling,
    isError: state.EDITOR.isError,
    codeError: state.EDITOR.codeError,
    previousUser: state.ROOM.previousUser,
    id: state.ROOM.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCode: (code) => dispatch(actions.setCode(code)),
    setLanguage: (lang) => dispatch(actions.setLanguage(lang)),
    setFontSize: (size) => dispatch(actions.setFontSize(size)),
    setAutoCompletion: (name) => dispatch(actions.setAutoCompletion(name)),
    setIsError: (isactive) => dispatch(actions.setIsError(isactive)),
    executeCode: (langId, code, input) =>
      dispatch(actions.executeCode(langId, code, input)),
    toggleFocusMode: () => dispatch(actions.toggleFocusMode()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);
