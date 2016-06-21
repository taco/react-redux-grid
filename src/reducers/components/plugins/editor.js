import { fromJS } from 'immutable';

import {
    EDIT_ROW,
    DISMISS_EDITOR,
    ROW_VALUE_CHANGE,
    CANCEL_ROW,
    REMOVE_ROW
} from '../../../constants/ActionTypes';

import {
    getData,
    setDataAtDataIndex
} from './../../../util/getData';

import { generateLastUpdate } from './../../../util/lastUpdate';

const initialState = fromJS({
    lastUpdate: generateLastUpdate()
});

export const isCellValid = ({ validator }, value) => {
    if (!validator || !typeof validator === 'function') {
        return true;
    }

    return validator({value});
};

export const isRowValid = (columns, rowValues) => {
    for (let i = 0; i < columns.length; i++) {

        const col = columns[i];
        const val = isCellValid(col, getData(rowValues, columns, i));

        if (!val) {
            return false;
        }
    }

    return true;
};

export default function editor(state = initialState, action) {

    switch (action.type) {

    case EDIT_ROW:

        const isValid = isRowValid(action.columns, action.values);

        return state.setIn([action.stateKey], fromJS({
            row: {
                key: action.rowId,
                values: action.values,
                rowIndex: action.rowIndex,
                top: action.top,
                valid: isValid,
                isCreate: action.isCreate || false
            },
            lastUpdate: generateLastUpdate()
        }));

    case ROW_VALUE_CHANGE:
        const { column, columns, value, stateKey } = action;
        const previousValues = state.getIn([stateKey, 'row', 'values']).toJS();

        const rowValues = setDataAtDataIndex(
            previousValues, column.dataIndex, value
        );

        columns.forEach((col, i) => {
            const val = getData(rowValues, columns, i);
            if (col.defaultValue !== undefined
                && val === undefined || val === null) {
                setDataAtDataIndex(rowValues, col.dataIndex, col.defaultValue);
            }
        });

        const valid = isRowValid(columns, rowValues);

        state = state.mergeIn([action.stateKey, 'row'], {
            values: rowValues,
            previousValues: state.getIn([stateKey, 'row', 'values']),
            valid
        });

        return state.setIn(
            [action.stateKey, 'lastUpdate'],
            generateLastUpdate()
        );

    case REMOVE_ROW:
    case DISMISS_EDITOR:
    case CANCEL_ROW:
        return state.setIn(
            [action.stateKey],
            fromJS({ lastUpdate: generateLastUpdate() })
        );

    default:
        return state;
    }
}