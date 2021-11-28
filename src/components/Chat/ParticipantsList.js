import React, { useState } from "react";
import GroupIcon from "@material-ui/icons/Group";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Drawer,
  List,
} from "@material-ui/core";
import localclasses from "./Chat.module.css";
import { makeStyles } from "@material-ui/core/styles";
import CloseSharpIcon from "@material-ui/icons/CloseSharp";
import { connect } from "react-redux";
const useStyles = makeStyles({
  list: {
    width: 400,
  },
  fullList: {
    width: "auto",
  },
});
const nameGenerator = (name) =>
  (name[0][0] + (name.length > 1 ? name[1][0] : "")).toUpperCase();

function ParticipantsList(props) {
  const classes = useStyles();
  const { users } = props;
  const [openList, setOpenList] = useState(false);

  const renderParticipants = () => {
    return Object.keys(users).map((elem) => {
      const name = users[elem];
      return (
        <>
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{ fontWeight: "bold" }}>
                {nameGenerator(name.split(" "))}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              className={localclasses.listItemText}
              primary={name}
            />
          </ListItem>
        </>
      );
    });
  };
  return (
    <div>
      <Button
        onClick={() => setOpenList(true)}
        variant="contained"
        color="secondary"
        className={localclasses.participants}
        startIcon={<GroupIcon />}
      >
        Participants [ {Object.keys(users).length} ]
      </Button>
      <Drawer
        anchor={"right"}
        open={openList}
        onClose={() => setOpenList(false)}
      >
        <CloseSharpIcon
          className={localclasses.closeIcon}
          onClick={() => setOpenList(false)}
        />
        <div
          className={classes.list}
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100%",
          }}
          role="presentation"
        >
          <List>{renderParticipants()}</List>
        </div>
      </Drawer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    users: state.ROOM.users,
  };
};

export default connect(mapStateToProps, null)(ParticipantsList);
