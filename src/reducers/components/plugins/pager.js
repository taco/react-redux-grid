import { fromJS } from 'immutable';

import {
    PAGE_LOCAL,
    PAGE_REMOTE
} from '../../../constants/ActionTypes';

import { generateLastUpdate } from './../../../util/generateLastUpdate';

const initialState = fromJS({
    lastUpdate: generateLastUpdate()
});

export default function pager(state = initialState, action) {

    switch (action.type) {

    case PAGE_LOCAL:
        return state.setIn([action.stateKey], fromJS({
            lastUpdate: generateLastUpdate()
        }));

    case PAGE_REMOTE:
        return state.setIn([action.stateKey], fromJS({
            lastUpdate: generateLastUpdate()
        }));

    default:
        return state;
    }
}