import React from "react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

export default class Tree extends React.Component {
  state = {
    isOpen: true
  };

  onToggle = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  render() {
    const { item } = this.props;

    const { isOpen } = this.state;
    return (
      <div>
        <div className="folder" onClick={this.onToggle}>
          {!item.children ? (
            <IoIosArrowForward />
          ) : isOpen ? (
            <IoIosArrowDown />
          ) : (
            <IoIosArrowForward />
          )}
          {item.title}
        </div>

        <div style={{ marginLeft: "20px" }}>
          {isOpen &&
            item.children &&
            item.children.map(item => (
              <Tree {...this.props} key={item.id} item={item} />
            ))}
        </div>
      </div>
    );
  }
}
