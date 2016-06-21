/* eslint-enable describe it */
import expect from 'expect';
import { fromJS } from 'immutable';

import {
    SET_DATA,
    DISMISS_EDITOR,
    REMOVE_ROW,
    ADD_NEW_ROW,
    SAVE_ROW,
    SORT_DATA,
    CLEAR_FILTER_LOCAL,
    FILTER_DATA
} from './../../../src/constants/ActionTypes';

import
    dataSource
from './../../../src/reducers/components/datasource';

import {
    resetLastUpdate
} from './../../../src/util/lastUpdate';

describe('The grid dataSource reducer setData func', () => {
    beforeEach(() => resetLastUpdate());

    it('Should set data with a total', () => {

        const state = fromJS({});

        const action = {
            stateKey: 'test-grid',
            type: SET_DATA,
            total: 2,
            data: [{ x: 1 }, { x: 2 }]
        };

        expect(
            dataSource(state, action)
        ).toEqualImmutable(fromJS({
            'test-grid': {
                data: [
                    { x: 1 }, { x: 2 }
                ],
                proxy: [
                    { x: 1 }, { x: 2 }
                ],
                total: 2,
                currentRecords: [
                    { x: 1 }, { x: 2 }
                ],
                lastUpdate: 1
            }
        }));

    });

    it('Should set data without a total', () => {

        const state = fromJS({});

        const action = {
            stateKey: 'test-grid',
            type: SET_DATA,
            data: [{x: 1}, {x: 2}]
        };

        expect(
            dataSource(state, action)
        ).toEqualImmutable(fromJS({
            'test-grid': {
                data: [{ x: 1 }, { x: 2 }],
                proxy: [{ x: 1 }, { x: 2 }],
                total: 2,
                currentRecords: [{ x: 1 }, { x: 2 }],
                lastUpdate: 1
            }
        }));

    });

    it('Should set currentRecords when they are passed', () => {

        const state = fromJS({});

        const action = {
            stateKey: 'test-grid',
            type: SET_DATA,
            data: [{x: 1}, {x: 2}],
            currentRecords: [
                { banana: 2 }
            ],
            lastUpdate: 1
        };

        expect(
            dataSource(state, action)
        ).toEqualImmutable(fromJS({
            'test-grid': {
                data: [{ x: 1 }, { x: 2 }],
                proxy: [{ x: 1 }, { x: 2 }],
                total: 2,
                currentRecords: [{ banana: 2 }],
                lastUpdate: 1
            }
        }));

    });

});

describe('The grid dataSource reducer dissmissEditor func', () => {
    beforeEach(() => resetLastUpdate());

    it('Should wipe previous values upon dissmiss', () => {

        const inState = fromJS({
            'test-grid': {
                proxy: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                total: 2
            }
        });

        const outState = fromJS({
            'test-grid': {
                proxy: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                total: 2,
                data: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                currentRecords: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                isEditing: false,
                lastUpdate: 1
            }
        });

        const action = {
            stateKey: 'test-grid',
            type: DISMISS_EDITOR
        };

        expect(
            dataSource(inState, action)
        ).toEqualImmutable(outState);
    });
});

describe('The grid dataSource reducer removeRow func', () => {
    beforeEach(() => resetLastUpdate());

    const inState = fromJS({
        'test-grid': {
            proxy: [
                { cell: 1 },
                { cell: 2 }
            ],
            data: [
                { cell: 1 },
                { cell: 2 }
            ],
            currentRecords: [
                { cell: 1 },
                { cell: 2 }
            ],
            total: 2,
            lastUpdate: 1
        }
    });

    it('Should remove row at 0 index of none is passed', () => {

        const outState = fromJS({
            'test-grid': {
                proxy: [
                    { cell: 2 }
                ],
                data: [
                    { cell: 2 }
                ],
                currentRecords: [
                    { cell: 2 }
                ],
                total: 2,
                lastUpdate: 1
            }
        });

        const action = {
            stateKey: 'test-grid',
            type: REMOVE_ROW
        };

        expect(
            dataSource(inState, action)
        ).toEqualImmutable(outState);
    });

    it('Should remove row at 1 index if arg is passed', () => {

        const outState = fromJS({
            'test-grid': {
                proxy: [
                    { cell: 1 }
                ],
                data: [
                    { cell: 1 }
                ],
                currentRecords: [
                    { cell: 1 }
                ],
                total: 2,
                lastUpdate: 1
            }
        });

        const action = {
            stateKey: 'test-grid',
            rowIndex: 1,
            type: REMOVE_ROW
        };

        expect(
            dataSource(inState, action)
        ).toEqualImmutable(outState);

    });

});

describe('The grid dataSource reducer addRow func', () => {
    beforeEach(() => resetLastUpdate());

    const inState = fromJS({
        'test-grid': {
            proxy: [
                { cell: 1 },
                { cell: 2 }
            ],
            data: [
                { cell: 1 },
                { cell: 2 }
            ],
            currentRecords: [
                { cell: 1 },
                { cell: 2 }
            ],
            total: 2
        }
    });

    it('Should add a new blank row if rows have been established', () => {
        const outState = fromJS({
            'test-grid': {
                proxy: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                data: [
                    { cell: '' },
                    { cell: 1 },
                    { cell: 2 }
                ],
                currentRecords: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                total: 2,
                isEditing: true,
                lastUpdate: 1
            }
        });

        const action = {
            stateKey: 'test-grid',
            type: ADD_NEW_ROW
        };

        expect(
            dataSource(inState, action)
        ).toEqualImmutable(outState);
    });

    it('Should add a new blank row if no rows have been established', () => {
        const innerState = fromJS({
            'test-grid': {
                proxy: [],
                data: [],
                currentRecords: [],
                total: 0,
                lastUpdate: 1
            }
        });

        const outState = fromJS({
            'test-grid': {
                proxy: [],
                data: [{}],
                currentRecords: [],
                total: 0,
                isEditing: true,
                lastUpdate: 1
            }
        });

        const action = {
            stateKey: 'test-grid',
            type: ADD_NEW_ROW
        };

        expect(
            dataSource(innerState, action)
        ).toEqualImmutable(outState);
    });

});

describe('The grid dataSource reducer saveRow func', () => {
    beforeEach(() => resetLastUpdate());

    const inState = fromJS({
        'test-grid': {
            proxy: [
                { cell: 1 },
                { cell: 2 }
            ],
            data: [
                { cell: 1 },
                { cell: 2 }
            ],
            currentRecords: [
                { cell: 1 },
                { cell: 2 }
            ],
            total: 2,
            lastUpdate: 1
        }
    });

    it('Should update row values on save', () => {

        const outState = fromJS({
            'test-grid': {
                proxy: [
                    { cell: 'newValues' },
                    { cell: 2 }
                ],
                data: [
                    { cell: 'newValues' },
                    { cell: 2 }
                ],
                currentRecords: [
                    { cell: 'newValues' },
                    { cell: 2 }
                ],
                total: 2,
                lastUpdate: 1
            }
        });

        const action = {
            stateKey: 'test-grid',
            type: SAVE_ROW,
            rowIndex: 0,
            values: { cell: 'newValues' }
        };

        expect(
            dataSource(inState, action)
        ).toEqualImmutable(outState);

    });

});

describe('The grid dataSource reducer sortData func', () => {
    beforeEach(() => resetLastUpdate());

    const inState = fromJS({
        'test-grid': {
            proxy: [
                { cell: 1 },
                { cell: 2 }
            ],
            data: [
                { cell: 1 },
                { cell: 2 }
            ],
            currentRecords: [
                { cell: 1 },
                { cell: 2 }
            ],
            total: 2,
            lastUpdate: 1
        }
    });

    it('Should update sort data', () => {

        const outState = fromJS({
            'test-grid': {
                proxy: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                data: [
                    { cell: 2 },
                    { cell: 1 }
                ],
                currentRecords: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                total: 2,
                lastUpdate: 1
            }
        });

        const action = {
            stateKey: 'test-grid',
            type: SORT_DATA,
            data: [
                { cell: 2 },
                { cell: 1 }
            ]
        };

        expect(
            dataSource(inState, action)
        ).toEqualImmutable(outState);

    });

});

describe('The grid dataSource reducer clearFilter func', () => {
    beforeEach(() => resetLastUpdate());

    const inState = fromJS({
        'test-grid': {
            proxy: [
                { cell: 1 },
                { cell: 2 }
            ],
            data: [
                { cell: 2 },
                { cell: 1 }
            ],
            currentRecords: [
                { cell: 2 },
                { cell: 1 }
            ],
            total: 2,
            lastUpdate: 1
        }
    });

    it('Should revert back to proxy if avail', () => {

        const outState = fromJS({
            'test-grid': {
                proxy: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                data: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                currentRecords: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                total: 2,
                lastUpdate: 1
            }
        });

        const action = {
            stateKey: 'test-grid',
            type: CLEAR_FILTER_LOCAL
        };

        expect(
            dataSource(inState, action)
        ).toEqualImmutable(outState);

    });

});

describe('The grid dataSource reducer filterData func', () => {
    beforeEach(() => resetLastUpdate());

    const inState = fromJS({
        'test-grid': {
            proxy: [
                { cell: 1 },
                { cell: 2 }
            ],
            data: [
                { cell: 1 },
                { cell: 2 }
            ],
            currentRecords: [
                { cell: 1 },
                { cell: 2 }
            ],
            total: 2,
            lastUpdate: 1
        }
    });

    it('Should revert back to proxy if avail', () => {

        const outState = fromJS({
            'test-grid': {
                proxy: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                data: [
                    { cell: 'newVals' },
                    { cell: 'moreNewVals' }
                ],
                currentRecords: [
                    { cell: 1 },
                    { cell: 2 }
                ],
                total: 2,
                lastUpdate: 1
            }
        });

        const action = {
            stateKey: 'test-grid',
            type: FILTER_DATA,
            data: [
                { cell: 'newVals' },
                { cell: 'moreNewVals' }
            ]
        };

        expect(
            dataSource(inState, action)
        ).toEqualImmutable(outState);

    });

});
