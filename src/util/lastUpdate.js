let num = 0;

const REDUCER_KEYS = {
    BulkActions: 'BulkActions',
    DataSource: 'DataSource',
    Editor: 'Editor',
    ErrorHandler: 'ErrorHandler',
    Filter: 'Filter',
    Grid: 'Grid',
    Loader: 'Loader',
    Menu: 'Menu',
    Pager: 'Pager',
    Selection: 'Selection'
};

export const generateLastUpdate = () => ++num;

export const resetLastUpdate = () => { num = 0; };

export const getLastUpdate = (store, key, reducerKeys = REDUCER_KEYS) => {
    const state = store.getState();

    let keys = Object.keys(reducerKeys);

    if (!keys.length) {
        reducerKeys = REDUCER_KEYS;
        keys = Object.keys(REDUCER_KEYS);
    }

    return keys.reduce((prev, reducerAccessor) => {
        const reducerKey = reducerKeys[reducerAccessor];
        if (state[reducerKey] && state[reducerKey].toJS) {
            prev[reducerKey] = state[reducerKey].getIn([key, 'lastUpdate']);
        }
        return prev;
    }, {});
};