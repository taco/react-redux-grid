const RENDERED_RECORDS = 200;
const ROW_HEIGHT = 50;

export const getCurrentRecords = (
    dataSource, pageIndex, pageSize, scrollTop, infinite
) => {

    console.log(scrollTop, infinite);

    if (!dataSource) {
        return null;
    }

    const start = 0;
    const end = start + RENDERED_RECORDS

    if (!infinite) {
        return dataSource.data.slice(
            pageIndex * pageSize, (pageIndex + 1) * pageSize
        );
    }

    // logic for what rows to be shown, based on scrollTop
    // of parent container
    return dataSource.data.slice(start, end);
};
