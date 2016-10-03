import {
    DEFAULT_RENDERED_RECORDS_VISIBLE,
    ROW_HEIGHT
} from './../constants/GridConstants';

export const getCurrentRecords = (
    dataSource, pageIndex, pageSize, infinite, viewableIndex, viewableCount, bufferMultiplier
) => {

    if (!dataSource) {
        return {};
    }

    if (infinite) {
        const start = Math.max(
            viewableIndex - viewableCount * bufferMultiplier,
            0
        );

        const end = Math.min(
            viewableIndex + viewableCount * (bufferMultiplier + 1),
            dataSource.currentRecords.length
        );

        return {
            data: dataSource.data.slice(start, end),
            startIndex: start,
            endIndex: end
        };
    }

    return {
        data: dataSource.data.slice(
            pageIndex * pageSize, (pageIndex + 1) * pageSize
        ),
        startIndex: null,
        endIndex: null
    };
};
