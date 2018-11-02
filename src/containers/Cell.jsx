import React, { Component } from 'react';
import { connect } from 'react-redux';

import { replaceCell } from '../helpers/action/cell';

/**
 * @return {td} component
 */
class Cell extends Component {
  /**
   * @return {void} constructor
   * @param {array} props props
   */
  constructor(props) {
    super(props);

    this.inputText = React.createRef();
    this.state = {
      isRead: false,
    };
  }

  /**
   * @return {void} didUpdate
   */
  componentDidUpdate() {
    const { isRead } = this.state;
    if (isRead) {
      this.inputText.current.focus();
    }
  }

  onBlur = () => {
    const { replaceCell, id, sheetName } = this.props;
    this.setState(() => ({
      isRead: false,
    }));

    const newValue = this.inputText.current.value;
    replaceCell(id, sheetName, newValue);
  }

  onEdit = () => {
    this.setState(() => ({
      isRead: true,
    }));
  }

  renderCell = () => {
    const { value } = this.props;
    const { isRead } = this.state;

    if (!isRead) {
      return <span>{value}</span>;
    }

    return (
      <input
        className="readCell"
        onBlur={this.onBlur}
        type="text"
        ref={this.inputText}
        defaultValue={value}
      />
    );
  }

  /**
   * @return {void} render
   */
  render() {
    const { id } = this.props;
    return (
      <td
        id={id}
        onDoubleClick={this.onEdit}
      >
        {this.renderCell()}
      </td>
    );
  }
}

const mapStateToProps = state => ({
  customWorkbook: state.customWorkbook.data,
  initialWorkbook: state.initialWorkbook.data,
});

const mapDispatchToProps = dispatch => ({
  replaceCell: (id, sheetName, newValue) => dispatch(replaceCell(id, sheetName, newValue)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Cell);
