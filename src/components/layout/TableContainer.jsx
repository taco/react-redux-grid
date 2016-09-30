import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { CLASS_NAMES } from './../../constants/GridConstants';
import { prefix } from './../../util/prefix';
import { debounce } from './../../util/throttle';
import Row from './TableRow';
import Header from './Header';

const { any, bool, number, object, oneOfType, string } = PropTypes;

export class TableContainer extends Component {

    render() {

        const {
            editorComponent,
            headerProps,
            height,
            rowProps,
            infinite
        } = this.props;

        const { scrollTop } = this.state;

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
                    <Row { ...{ ...rowProps, scrollTop, infinite } } />
                </table>
                { editorComponent }
            </div>
        );
    }

    componentDidMount() {
        const { infinite } = this.props;

        if (infinite) {
            this.container = ReactDOM.findDOMNode(this);

            this.container.addEventListener(
                'scroll',
                debounce(this.onScroll.bind(this), 20)
            );
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            scrollTop: 0
        };
    }

    static propTypes = {
        editorComponent: any,
        headerProps: object,
        height: oneOfType([
            string,
            number
        ]),
        infinite: bool,
        rowProps: object
    };

    static defaultProps = {
        headerProps: {},
        rowProps: {}
    };

    onScroll = () => {
        this.setState({
            scrollTop: this.container.scrollTop
        });
    }

}

export default TableContainer;
