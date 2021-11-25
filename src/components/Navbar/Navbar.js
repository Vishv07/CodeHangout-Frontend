import React, { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, Typography, Button } from "@material-ui/core";
import localclasses from "./NavBar.module.css";
import PersonIcon from "@material-ui/icons/Person";
import Chat from "../Chat/Chat.js";
import copy from "copy-to-clipboard";
import Slide from "@material-ui/core/Slide";
import ParticpantsList from "../Chat/ParticipantsList";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as UIactions from "../../store/actions/uiActions.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Navbar = (props) => {
  const Copytext = (value) => {
    copy(value);
    props.setSnackBar("Room-ID Copied !", "success");
  };

  return (
    <Fragment>
      <AppBar position="static" style={{ backgroundColor: "#23A6F0" }}>
        <Toolbar>
          <Typography
            variant="h5"
            style={{ color: "white", fontFamily: "poppins", fontWeight: "800" }}
          >
            &nbsp;Code<span style={{ color: "black" }}> Hangout🤟 </span>
          </Typography>
          {/* // TODO Change URL */}
          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            onClick={() =>
              Copytext(
                `Hi there! You have been 
                invited by ${props.name} to join Code Hangout. 
                \n \nClick on this link - https://codehangout.vercel.app \n 
                \nand join the room by providing your name and Room-Id: ${props.roomId}`
              )
            }
            color="secondary"
            className={localclasses.navButton_rooomID}
          >
            <Typography className={localclasses.roomIDText}>
              RoomId : {props.roomId}
            </Typography>
          </Button>
          <Chat name={props.name} roomId={props.roomId} socket={props.socket} />
          <ParticpantsList />
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              className={localclasses.navButton_leave}
              onClick={() => {
                props.socket.disconnect();
              }}
            >
              Leave
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};
// const mapStateToProps = (state) => {
//   return{
//     roomId:state.ROOM.roomId,
//   };
// };
const mapDispatchToProps = (dispatch) => {
  return {
    setSnackBar: (msg, type) => dispatch(UIactions.setSnackBar(msg, type)),
  };
};

export default connect(null, mapDispatchToProps)(Navbar);
