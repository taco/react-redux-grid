import expect from 'expect';
import { fromJS } from 'immutable';

import {
    generateLastUpdate,
    getLastUpdate,
    resetLastUpdate
} from './../../src/util/lastUpdate';

describe('LastUpdate utility', () => {

    it('Should generateLastUpdate with a incrementing number', () => {
        const first = generateLastUpdate();
        const second = generateLastUpdate();

        expect(
            first
        ).toBeA('number');

        expect(
            second
        ).toBeA('number');

        expect(
            first < second
        ).toBe(true);
    });

    it('Should resetLastUdate where next generate will return 1', () => {
        resetLastUpdate();

        expect(
            generateLastUpdate()
        ).toBe(1);

        expect(
            generateLastUpdate()
        ).toBe(2);

        resetLastUpdate();

        expect(
            generateLastUpdate()
        ).toBe(1);

        expect(
            generateLastUpdate()
        ).toBe(2);
    });

    it('Should getLastupdate and provide a map of reducers lastUpdate', () => {
        const store = {
            getState: () => ({
                BulkActions: fromJS({ 'test-grid-1': { lastUpdate: 1 } }),
                DataSource: fromJS({ 'test-grid-1': { lastUpdate: 2 } }),
                Editor: fromJS({ 'test-grid-1': { lastUpdate: 3 } }),
                ErrorHandler: fromJS({ 'test-grid-1': { lastUpdate: 4 } }),
                Filter: fromJS({ 'test-grid-1': { lastUpdate: 5 } }),
                Grid: fromJS({ 'test-grid-1': { lastUpdate: 6 } }),
                Loader: fromJS({ 'test-grid-1': { lastUpdate: 7 } }),
                Menu: fromJS({ 'test-grid-1': { lastUpdate: 8 } }),
                Pager: fromJS({ 'test-grid-1': { lastUpdate: 9 } }),
                Selection: fromJS({ 'test-grid-1': { lastUpdate: 10 } })
            })
        };

        expect(
            getLastUpdate(store, 'test-grid-1')
        ).toEqual({
            BulkActions: 1,
            DataSource: 2,
            Editor: 3,
            ErrorHandler: 4,
            Filter: 5,
            Grid: 6,
            Loader: 7,
            Menu: 8,
            Pager: 9,
            Selection: 10
        });
    });

});