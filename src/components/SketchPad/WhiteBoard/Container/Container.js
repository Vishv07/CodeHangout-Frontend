import React from "react";
import Board from "../Board/Board";
import "./Container.css";
class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = { addClass: false, size: 2 };
  }
  render() {
    return (
      <div className="z-100">
        <div className="board-container">
          <Board color={this.props.color} size={this.state.size}></Board>
        </div>
      </div>
    );
  }
}

export default Container;
