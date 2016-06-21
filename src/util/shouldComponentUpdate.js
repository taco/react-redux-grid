import { fromJS, is } from 'immutable';
import deepEqual from 'deep-equal';
import { mapStateToProps } from './mapStateToProps';
import { keyGenerator } from './keyGenerator';

const buffer = {};
const to = {};
const queue = (key, start) => {
    clearTimeout(to[key]);
    const delta = Date.now() - start;
    if (!buffer[key]) {
        buffer[key] = [];
    }
    buffer[key].push(delta);
    console.log(key, `${delta} ms`);
    to[key] = setTimeout(() => {
        console.log(
            `%c${key} Total: ${buffer[key].reduce((p, v) => p + v, 0)} ms`,
            'font-weight:bold;color:blue;'
        );
        buffer[key] = [];
    }, 200);
};

export function shouldGridUpdate(nextProps) {
    let result = true;

    try {
        const start = Date.now();
        const { store } = this.props;

        const propsWithoutPlugins = {
            ...this.props,
            plugins: {},
            columns: ''
        };

        const nextPropsWithoutPlugins = {
            ...nextProps,
            plugins: {},
            columns: ''
        };

        const nextStateProps = mapStateToProps(store.getState(), propsWithoutPlugins);

        queue('mapGrid', start);


        nextProps = nextPropsWithoutPlugins;

        const startEqual = Date.now();

        result = (
            !deepEqual(nextProps, this._lastProps)
            || !deepEqual(nextStateProps, this._stateProps)
        );

        queue('gridEqual', startEqual);

        this._stateProps = nextStateProps;
        this._lastProps = nextProps;



        queue('gridShouldUpdate', start);
    } catch (e) { } // eslint-disable-line

    return result;
}

export function shouldRowUpdate(nextProps) {
    let result = true;
    const start = Date.now();
    const {
        columns,
        editorState,
        menuState,
        row,
        index,
        selectedRows
    } = nextProps;

    // create id for row a single time
    this.id = this.id || keyGenerator('row', index);

    // update if selection change
    const isSelected = Boolean(selectedRows && selectedRows[this.id]);

    // update if menu is shown or hidden
    const isMenuShown = Boolean(menuState && menuState[this.id]);

    // update if editor state changes for only this row
    const isEdited = Boolean(editorState
        && editorState.row
        && editorState.row.rowIndex === index);

    // if row is currently being edited, cache the last value
    if (isEdited) {
        this._previousEditorState = editorState;
    }

    nextProps = fromJS({
        columns,
        isSelected,
        isMenuShown,
        index,
        row,
        isEdited,
        rowValuesUpdated: this._previousEditorState
    });

    // if this is the first pass, no previous values have been
    // cached, thusly just return true and create _lastProps
    if (!this._lastProps) {
        this._lastProps = nextProps;
        queue('rowShouldUpdate', start);
        return true;
    }

    result = (
        !is(nextProps, this._lastProps)
    );

    this._lastProps = nextProps;

    queue('rowShouldUpdate', start);

    return result;
}