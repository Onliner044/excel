import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Menu, MenuItem, Button } from '@material-ui/core';
import XLSX, { utils } from 'xlsx';
import './styles/app.css';
import { getDataSheet, createSheets, isEqual } from './helpers/wordbookFunctions';
import images from './helpers/images';
import Cell from './containers/Cell';
import { readFileRequest } from './helpers/saga/readFile';

/**
 * @return {component} component App
 */
class App extends Component {
  /**
   * @return {void} void
   * @param {object} props props
   */
  constructor(props) {
    super(props);

    this.fileInput = React.createRef();

    this.startContent = (
      <div className="d-table w-100 h-100 fileText">
        <div className="d-table-cell center">Перетащите файл сюда (.xlsx/.xls/.csv)</div>
      </div>
    );
    this.state = {
      isFileDrag: false,
      isActiveDownload: false,
      isOpenMenu: false,
      sheetName: null,
    };
  }

  /**
   * @return {void} onClick
   */
  onInput = () => {
    const { readFile } = this.props;
    const file = this.fileInput.current.files[0];

    this.setState(() => ({
      sheetName: null,
    }));

    if (!file) {
      return;
    }

    this.setActiveDownload(false);
    readFile(file);
  }

  /**
   * @return {void} onDragEnter
   */
  onDragEnter = () => {
    this.setState(() => ({
      isFileDrag: true,
    }));
  }

  /**
   * @return {void} onDragLeave
   */
  onDragLeave = () => {
    this.setState(() => ({
      isFileDrag: false,
    }));
  }

  /**
   * @return {void} onDrag
   * @param {object} e e
   */
  onDrop = (e) => {
    console.log(this.fileInput.current);
    
    this.fileInput.current.files = e.dataTransfer.files;
    e.preventDefault();
    this.onDragLeave();
  }

  /**
   * @return {void} cancelDownload
   * @param {object} e e
   */
  onCancelDownload = (e) => {
    e.preventDefault();
  }

  /**
   * @return {void} onDragOver
   * @param {object} e e
   */
  onDragOver = (e) => {
    e.preventDefault();
  }

  /**
   * @return {void} onDownload
   */
  onDownload = () => {
    const { customWorkbook, originalWorkbook } = this.props;

    const downloadWorkBook = originalWorkbook;
    const sheets = createSheets(customWorkbook);

    downloadWorkBook.Sheets = sheets;
    XLSX.writeFile(downloadWorkBook, 'table.xlsx');
  }

  /**
   * @param {boolean} visible visible
   * @return {void} setActiveDownload
   */
  setActiveDownload = (visible) => {
    this.setState(() => ({
      isActiveDownload: visible,
    }));
  }

  /**
   * @return {void} openMenu
   */
  openMenu = () => {
    const { customWorkbook, initialWorkbook, setActiveDownload } = this.props;

    if (isEqual(customWorkbook, initialWorkbook)) {
      this.setActiveDownload(false);
    } else {
      this.setActiveDownload(true);
    }

    this.setState(() => ({
      isOpenMenu: true,
    }));
  }

  /**
   * @return {void} closeMenu
   */
  closeMenu = () => {
    this.setState(() => ({
      isOpenMenu: false,
    }));
  }

  /**
   * @return {void} show drag zone
   */
  showDragZone = () => {
    const { isFileDrag } = this.state;

    if (isFileDrag) {
      return (
        <div
          className="fileDrag h-100"
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
        >
          <div className="d-table w-100 h-100">
            <div className="d-table-cell center">
              <img className="imgFile" src={images.file} alt="" />
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  /**
   * @param {event} e e
   * @return {void} show sheet
   */
  showSheet = (e) => {
    const name = e.target.attributes.name.value;
    this.setState(() => ({
      sheetName: name,
    }));
  }

  /**
   * @return {React.ReactElement} create table
   * @param {number} width width
   * @param {number} height height
   * @param {object} sheet sheet
  */
  createTable() {
    const { customWorkbook, originalWorkbook } = this.props;

    const { SheetNames } = originalWorkbook;
    const { sheetName } = this.state;
    const currentSheetName = sheetName || SheetNames[0];

    const { width, height } = getDataSheet(customWorkbook[currentSheetName]);
    const { cells } = customWorkbook[currentSheetName];

    const table = (
      <table>
        <tbody>
          {[...Array(height + 1)].map((el, i) => {
            const encodeHeight = utils.encode_row(i);
            return (
              <Fragment key={i}>
                {i === 0
                  ? (
                    <tr>
                      <td />
                      {[...Array(width + 1)].map((el, j) => (
                        <td key={j}>{utils.encode_col(j)}</td>
                      ))}
                    </tr>
                  )
                  : null
                }

                <tr>
                  {[...Array(width + 1)].map((el, j) => {
                    const encodeWidth = utils.encode_col(j);
                    const cell = encodeWidth + encodeHeight;
                    const value = cells[cell] ? cells[cell].value : '';

                    const td = React.createRef();
                    return (
                      <Fragment key={`${i}${j}`}>
                        {j === 0 ? <td>{i + 1}</td> : null}
                        <Cell
                          id={`${encodeWidth}${encodeHeight}`}
                          sheetName={currentSheetName}
                          value={value}
                        />
                      </Fragment>
                    );
                  })}
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    );

    return (
      <Fragment>
        {!width || !height
          ? (
            <div className="d-table w-100 h-75">
              <div className="d-table-cell center emptySheet h-75">
                <span>Лист пуст</span>
              </div>
            </div>
          )
          : table
        }
        <div className="sheets">
          <ul className="list-unstyled">
            <li className="d-inline-block">
              {SheetNames.map((name, i) => (
                <input
                  className="btn-default sheet"
                  onClick={this.showSheet}
                  key={i}
                  name={name}
                  type="button"
                  defaultValue={name}
                />
              ))}
            </li>
          </ul>
        </div>
      </Fragment>
    );
  }

  renderTable = () => {
    const { customWorkbook } = this.props;
    if (Object.keys(customWorkbook).length > 0) {
      return this.createTable();
    }

    return this.startContent;
  }

  /**
   * @return {void} render
   */
  render() {
    const { isActiveDownload, isOpenMenu } = this.state;

    return (
      <div
        className="app"
        onDrop={this.onCancelDownload}
        onDragOver={this.onDragOver}
      >
        <div className="header">
          <div className="d-table w-100 h-100">
            <div className="d-table-cell center">
              <ul className="list-unstyled">
                <li className="d-inline-block float-left">
                  <Button
                    className="btn btn-info download"
                    variant="contained"
                    onClick={this.openMenu}
                  >
                    Файл
                  </Button>
                  <Menu
                    open={isOpenMenu}
                    onClose={this.closeMenu}
                  >
                    <MenuItem onClick={this.closeMenu}>
                      <label htmlFor="file">Открыть</label>
                    </MenuItem>
                    <MenuItem onClick={this.closeMenu} disabled={!isActiveDownload}>
                      <div onClick={this.onDownload}>Скачать</div>
                    </MenuItem>
                  </Menu>
                </li>
                <li className="d-inline-block">
                  <input
                    className="d-none"
                    id="file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    ref={this.fileInput}
                    onInput={this.onInput}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="content"
          onDragEnter={this.onDragEnter}
          onDragOver={this.onDragOver}
        >
          <div className="dropContainer">
            {this.renderTable()}
          </div>
          {this.showDragZone()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customWorkbook: state.customWorkbook.data,
  originalWorkbook: state.originalWorkbook.data,
  initialWorkbook: state.initialWorkbook.data,
});

const mapDispatchToProps = dispatch => ({
  readFile: file => dispatch(readFileRequest(file)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
