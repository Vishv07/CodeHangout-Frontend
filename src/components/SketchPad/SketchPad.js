import React, { Fragment, useRef, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import CanvasDraw from "react-canvas-draw";
import UndoIcon from "@material-ui/icons/Undo";
import DeleteIcon from "@material-ui/icons/Delete";
import localClasses from "./SketchPad.module.css";
import { ChromePicker } from "react-color";
import ColorLensIcon from "@material-ui/icons/ColorLens";

const SketchPad = (props) => {
  const saveableCanvas = useRef(CanvasDraw);
  const [displayColorPicker, setdisplayColorPicker] = useState(false);
  const [brushColor, setBrushColor] = useState("#000A29");

  const popover = {
    position: "absolute",
    zIndex: "100",
    left: "-50px",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  const handleColorOpen = () => {
    setdisplayColorPicker(true);
  };

  const handleColorClose = () => {
    setdisplayColorPicker(false);
  };

  const handleColorChange = (color) => {
    setBrushColor(color.hex);
  };

  return (
    <Fragment>
      <AppBar position="static" style={{ backgroundColor: "black" }}>
        <div className={localClasses.Editor__navbar}>
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
            &nbsp;Sketch<span style={{ color: "#23A6F0" }}> Pad</span>
          </Typography>
          <Toolbar>
            <div>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleColorOpen}
                startIcon={<ColorLensIcon />}
                style={{
                  fontFamily: "poppins",
                  marginLeft: "auto",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                Pick Color
              </Button>
              {displayColorPicker ? (
                <div style={popover}>
                  <div style={cover} onClick={handleColorClose} />
                  <ChromePicker
                    color={brushColor}
                    onChange={handleColorChange}
                  />
                </div>
              ) : null}
            </div>
          </Toolbar>
        </div>
      </AppBar>

      <CanvasDraw
        ref={saveableCanvas}
        canvasWidth={"auto"}
        canvasHeight={"548px"}
        brushRadius={3}
        brushColor={brushColor}
        catenaryColor={"#23A6F0"}
        gridColor={"rgba(0, 180, 216, 0.1)"}
      />
      <AppBar position="static" style={{ backgroundColor: "black" }}>
        <Toolbar>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              saveableCanvas.current.clear();
            }}
            startIcon={<DeleteIcon />}
            style={{
              fontFamily: "poppins",
              marginLeft: "auto",
              fontWeight: "600",
              color: "white",
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            startIcon={<UndoIcon />}
            style={{
              fontFamily: "poppins",
              marginLeft: "15px",
              fontWeight: "600",
              color: "white",
              backgroundColor: "green",
            }}
            onClick={() => {
              saveableCanvas.current.undo();
            }}
          >
            UNDO
          </Button>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};

export default SketchPad;
