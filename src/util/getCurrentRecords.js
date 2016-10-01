import {
    DEFAULT_RENDERED_RECORDS_VISIBLE,
    ROW_HEIGHT
} from './../constants/GridConstants';

export const getCurrentRecords = (
    dataSource, pageIndex, pageSize, scrollTop, infinite
) => {

    if (!dataSource) {
        return {};
    }

    if (!infinite) {
        return {
            data: dataSource.data.slice(
                pageIndex * pageSize, (pageIndex + 1) * pageSize
            ),
            startIndex: null,
            endIndex: null
        };
    }

    const INCREMENT = Math.floor(
        DEFAULT_RENDERED_RECORDS_VISIBLE / 4
    );

    const scrollIndex = Math.floor(scrollTop / INCREMENT);

    const start = 0;
    const end = start + DEFAULT_RENDERED_RECORDS_VISIBLE;

    // logic for what rows to be shown, based on scrollTop
    // of parent container
    return {
        data: dataSource.data.slice(start, end),
        startIndex: start,
        endIndex: end
    };
};
