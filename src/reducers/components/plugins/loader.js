import { fromJS } from 'immutable';

import {
    SET_LOADING_STATE
} from '../../../constants/ActionTypes';

import { generateLastUpdate } from './../../../util/generateLastUpdate';

const initialState = fromJS({
    lastUpdate: generateLastUpdate()
});

export default function loader(state = initialState, action) {

    switch (action.type) {

    case SET_LOADING_STATE:
        return state.setIn([action.stateKey], {
            isLoading: action.state,
            lastUpdate: generateLastUpdate()
        });

    default:
        return state;
    }
}