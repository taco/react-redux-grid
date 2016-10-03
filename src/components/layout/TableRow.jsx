import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { isPluginEnabled } from '../../util/isPluginEnabled';
import { scrollIndex, bufferTop, bufferBottom } from '../../util/buffer';
import { prefix } from '../../util/prefix';
import { getCurrentRecords } from '../../util/getCurrentRecords';
import { getRowKey } from '../../util/getData';

import { moveNode } from '../../actions/GridActions';
import { ROW_HEIGHT, CLASS_NAMES } from '../../constants/GridConstants';

import Row from './table-row/Row';
import { PlaceHolder } from './row/PlaceHolder';

const { arrayOf, bool, func, number, object, oneOf, string } = PropTypes;

export class TableRow extends Component {

    render() {

        const {
            columnManager,
            columns,
            dataSource,
            dragAndDrop,
            editor,
            editorState,
            emptyDataMessage,
            events,
            gridType,
            infinite,
            menuState,
            pageSize,
            pager,
            plugins,
            reducerKeys,
            readFunc,
            selectedRows,
            selectionModel,
            showTreeRootNode,
            stateKey,
            store,
            scrollTop
        } = this.props;

        const pageIndex = pager && pager.pageIndex ? pager.pageIndex : 0;

        const totalRecords = dataSource && Array.isArray(dataSource.data)
            ? dataSource.data.length
            : 0;

        const rows = getRowSelection(
            dataSource,
            infinite,
            pageIndex,
            pageSize,
            pager,
            plugins,
            scrollTop,
            stateKey,
            store,
            this
        );

        const rowComponents = getRows(
            columns,
            columnManager,
            dragAndDrop,
            editor,
            editorState,
            gridType,
            menuState,
            reducerKeys,
            readFunc,
            rows,
            events,
            this.moveRow,
            plugins,
            selectionModel,
            selectedRows,
            showTreeRootNode,
            stateKey,
            store,
            scrollTop,
            infinite,
            totalRecords,
            this.rowHeight || ROW_HEIGHT
        );

        const rowInsert = Array.isArray(rowComponents)
            && rowComponents.length > 0
            ? rowComponents
            : <PlaceHolder { ...{ emptyDataMessage } } />;

        return (
            <tbody>
                { rowInsert }
            </tbody>
        );
    }

    componentDidUpdate() {
        if (!this.rowHeight) {
            const tbody = ReactDOM
                .findDOMNode(this);

            const firstRow = tbody
                ? tbody.querySelector(prefix(CLASS_NAMES.ROW))
                : null;

            if (firstRow) {
                this.rowHeight = firstRow.clientHeight;
            }

            else {
                this.rowHeight = ROW_HEIGHT;
            }
        }
    }

    constructor(props) {
        super(props);
    }

    static propTypes = {
        columnManager: object.isRequired,
        columns: arrayOf(object).isRequired,
        data: arrayOf(object),
        dataSource: object,
        dragAndDrop: bool,
        editor: object,
        editorState: object,
        emptyDataMessage: string,
        events: object,
        gridType: oneOf([
            'tree', 'grid'
        ]),
        infinite: bool,
        menuState: object,
        pageSize: number,
        pager: object,
        plugins: object,
        readFunc: func,
        reducerKeys: object,
        scrollTop: number,
        selectedRows: object,
        selectionModel: object,
        showTreeRootNode: bool,
        stateKey: string,
        store: object.isRequired
    };

    static defaultProps = {
        emptyDataMessage: 'No Data Available'
    };

    moveRow = (current, next) => {
        const { stateKey, store, showTreeRootNode } = this.props;
        if (!this.requestedFrame) {
            this.requestedFrame = requestAnimationFrame(() => {
                store.dispatch(
                    moveNode({
                        stateKey,
                        store,
                        current,
                        next,
                        showTreeRootNode
                    })
                );
                this.requestedFrame = null;
            });
        }

    };

}

export const getRowComponents = (
    columns,
    columnManager,
    dragAndDrop,
    editor,
    editorState,
    gridType,
    menuState,
    reducerKeys,
    readFunc,
    row,
    events,
    moveRow,
    plugins,
    selectionModel,
    selectedRows,
    showTreeRootNode,
    stateKey,
    store,
    index
) => {

    const key = getRowKey(columns, row);

    return (
        <Row
            key={ key }
            {
                ...{
                    columnManager,
                    columns,
                    dragAndDrop,
                    editor,
                    editorState,
                    events,
                    gridType,
                    index,
                    menuState,
                    moveRow,
                    plugins,
                    reducerKeys,
                    readFunc,
                    row,
                    selectedRows,
                    selectionModel,
                    showTreeRootNode,
                    stateKey,
                    store,
                    treeData: getTreeData(row)
                }
            }
        />);
};

export const getRowSelection = (
    dataSource,
    infinite,
    pageIndex,
    pageSize,
    pager,
    plugins,
    scrollTop,
    stateKey,
    store,
    scope
) => {

    if (!dataSource) {
        return false;
    }

    if (!isPluginEnabled(plugins, 'PAGER')
        || plugins.PAGER.pagingType === 'remote'
        && !infinite) {
        return dataSource.data;
    }

    return getCurrentRecords(
        dataSource, pageIndex, pageSize, scrollTop, infinite, scope.rowHeight || ROW_HEIGHT
    ).data;
};

export const getRows = (
    columns,
    columnManager,
    dragAndDrop,
    editor,
    editorState,
    gridType,
    menuState,
    reducerKeys,
    readFunc,
    rows,
    events,
    moveRow,
    plugins,
    selectionModel,
    selectedRows,
    showTreeRootNode,
    stateKey,
    store,
    scrollTop,
    infinite,
    totalRecords,
    rowHeight
) => {

    const rowArray = Array.isArray(rows)
            ? rows.map((row, i) => getRowComponents(
                columns,
                columnManager,
                dragAndDrop,
                editor,
                editorState,
                gridType,
                menuState,
                reducerKeys,
                readFunc,
                row,
                events,
                moveRow,
                plugins,
                selectionModel,
                selectedRows,
                showTreeRootNode,
                stateKey,
                store,
                i
            ))
            : [];

    if (!infinite) {
        return rowArray;
    }

    const renderedRows = rowArray.length;

    const topProps = {
        style: {
            height: bufferTop(
                totalRecords,
                renderedRows,
                scrollTop,
                rowHeight
            )
        }
    };

    const bottomProps = {
        style: {
            height: bufferBottom(
                totalRecords,
                renderedRows,
                scrollTop,
                rowHeight
            )
        }
    };

    // adding buffer rows for infinite scroll
    rowArray.unshift(<tr { ...topProps } />);
    rowArray.push(<tr { ...bottomProps } />);

    return rowArray;

};

export const getTreeData = row => ({
    depth: row._depth,
    parentId: row._parentId,
    id: row._id,
    index: row._index,
    flatIndex: row._flatIndex,
    leaf: row._leaf,
    hasChildren: row._hasChildren,
    isExpanded: row._isExpanded,
    isLastChild: row._isLastChild,
    isFirstChild: row._isFirstChild,
    previousSiblingId: row._previousSiblingId,
    previousSiblingTotalChildren: row._previousSiblingTotalChilden,
    previousSiblingChildIds: row._previousSiblingChildIds,
    parentTotalChildren: row._parentTotalChildren,
    parentIndex: row._parentIndex,
    indexPath: row._indexPath,
    path: row._path
});

export default DragDropContext(HTML5Backend)(TableRow);
