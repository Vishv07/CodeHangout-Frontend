import React, { Fragment, useState, useRef } from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, Typography, Button, TextField } from "@material-ui/core";
import localclasses from "./NavBar.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PersonIcon from "@material-ui/icons/Person";
import Chat from "../Chat/Chat.js";
import copy from "copy-to-clipboard";
import { SkyLightStateless } from "react-skylight";
import ParticpantsList from "../Chat/ParticipantsList";
import { init } from "emailjs-com";
import { Link } from "react-router-dom";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { connect } from "react-redux";
import emailjs from "emailjs-com";
import * as UIactions from "../../store/actions/uiActions.js";

const roomModal = {
  backgroundImage:
    "linear-gradient(to top, #d6d4ee, #e1dff2, #ebe9f6, #f5f4fb, #ffffff)",
  width: "30%",
  marginTop: "-200px",
  marginLeft: "-15%",
};

const Navbar = (props) => {
  const [email, setEmail] = useState("");
  const [emailModel, setemailModel] = useState(false);
  const sendInviteref = useRef(null);
  const Copytext = (value) => {
    copy(value);
    props.setSnackBar("Room-ID Copied !", "success");
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSendInvite = () => {
    if (validateEmail(email)) {
      init(process.env.REACT_APP_USER_ID);
      var templateParams = {
        message: `You have been invited for CodeHangout, To join head over to this link https://codehangout.vercel.app/home/?id=${props.roomId}`,
        email: email,
        reply_to: "krishnakakadiya9@gmail.com",
      };
      emailjs
        .send(
          process.env.REACT_APP_SERVICE_ID,
          "template_crf7qh6",
          templateParams
        )
        .then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);
            setemailModel(false);
            props.setSnackBar("Invite Sent", "success");
          },
          function (error) {
            console.log("FAILED...", error);
            setemailModel(false);
            props.setSnackBar("Invite Failed", "success");
          }
        );
    } else {
      props.setSnackBar("Enter valid email", "error");
    }
  };

  const ModalTitle = (props) => (
    <Row className="justify-content-md-center mt-5">
      <span
        style={{
          fontFamily: "poppins",
          fontWeight: "600",
          color: "#000",
          fontSize: "4vh",
        }}
      >
        {props.start}
        <span style={{ color: "#000", fontWeight: "800" }}>&nbsp;Hangout</span>
        <span style={{ color: "#23A6F0", fontWeight: "800" }}>Invite 🤟</span>
      </span>
    </Row>
  );

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
                `Hi there! You have been invited by ${props.name} to join Code Hangout. 
                \nClick on this link - https://codehangout.vercel.app/home/?id=${props.roomId}`
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
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setemailModel(true)}
            color="secondary"
            className={localclasses.navButton_Invite}
          >
            Invite
          </Button>
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
          <SkyLightStateless
            dialogStyles={roomModal}
            isVisible={emailModel}
            onCloseClicked={() => setemailModel(false)}
            title={<ModalTitle start="Send a" />}
          >
            <Container className={localclasses.home__modal__container}>
              <Typography
                style={{
                  color: "#000",
                  marginBottom: "10px",
                  fontSize: "2vh",
                }}
              >
                Enter Email ID:
              </Typography>
              <TextField
                fullWidth
                id="outlined-basic"
                label=" Email"
                variant="outlined"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                style={{ color: "#000" }}
              />

              <br />
              <br />

              <Row>
                <Button
                  block
                  variant="contained"
                  color="secondary"
                  style={{
                    padding: "auto",
                    margin: "auto",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "white",
                    width: "147px",
                    textDecoration: "none",
                  }}
                  size={"large"}
                  ref={sendInviteref}
                  onClick={() => {
                    handleSendInvite();
                  }}
                >
                  Send an Invite
                </Button>
              </Row>
            </Container>
          </SkyLightStateless>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    setSnackBar: (msg, type) => dispatch(UIactions.setSnackBar(msg, type)),
  };
};

export default connect(null, mapDispatchToProps)(Navbar);
