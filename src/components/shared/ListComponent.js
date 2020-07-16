import React from "react";

class ListComponent extends React.Component {
  render(props) {
    return <div className="">{this.props.cardList}</div>;
  }
}

export default ListComponent;
