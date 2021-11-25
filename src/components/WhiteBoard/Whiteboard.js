import React from "react";
import Container from "./Container/Container";

function Whiteboard(props) {
  return (
    <div style={{ height: "66vh" }}>
      <Container color={props.color} />
    </div>
  );
}

export default Whiteboard;
