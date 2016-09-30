import React, { Component, PropTypes } from 'react';

import { CLASS_NAMES } from './../../constants/GridConstants';
import { prefix } from './../../util/prefix';
import Row from './TableRow';
import Header from './Header';

const { any, number, object, oneOfType, string } = PropTypes;

export class TableContainer extends Component {

    render() {

        const {
            editorComponent,
            headerProps,
            height,
            rowProps
        } = this.props;

        const tableContainerProps = {
            className: prefix(CLASS_NAMES.TABLE_CONTAINER),
            style: {
                height: height
            }
        };

        const tableProps = {
            className: prefix(CLASS_NAMES.TABLE, CLASS_NAMES.HEADER_HIDDEN),
            cellSpacing: 0
        };

        return (
            <div { ...tableContainerProps } >
                <table { ...tableProps }>
                    <Header { ...headerProps } />
                    <Row { ...rowProps } />
                </table>
                { editorComponent }
            </div>
        );
    }

    constructor(props) {
        super(props);
    }

    static propTypes = {
        editorComponent: any,
        headerProps: object,
        height: oneOfType([
            string,
            number
        ]),
        rowProps: object
    };

    static defaultProps = {
        headerProps: {},
        rowProps: {}
    };

}

export default TableContainer;
