import {
    DEFAULT_RENDERED_RECORDS_VISIBLE,
    ROW_HEIGHT
} from './../constants/GridConstants';

export const bufferBottom = (
    total, totalRendered, scrollTop, rowHeight,
) => {

    const intervalsPossible = (
        total * rowHeight / ((DEFAULT_RENDERED_RECORDS_VISIBLE / 2) * rowHeight)
    );

    const scroll = scrollIndex(rowHeight, scrollTop, intervalsPossible);
    const maxHeight = rowHeight * (total - totalRendered);


    console.log('bufferBottom', scroll, scrollTop);
    if (scroll === 0) {
        return maxHeight;
    }

    if (scroll === intervalsPossible) {
        return 0;
    }

    return maxHeight -
        (scroll * (rowHeight * DEFAULT_RENDERED_RECORDS_VISIBLE / 4));

};

export const bufferTop = (
    total, totalRendered, scrollTop, rowHeight
) => {

    const intervalsPossible = (
        total * rowHeight / ((DEFAULT_RENDERED_RECORDS_VISIBLE / 2) * rowHeight)
    );

    const scroll = scrollIndex(rowHeight, scrollTop, intervalsPossible);

    const maxHeight = (total - totalRendered) * rowHeight;

    if (scroll === 0) {
        return 0;
    }

    if (scroll === intervalsPossible) {
        return maxHeight;
    }

    return scroll * ((DEFAULT_RENDERED_RECORDS_VISIBLE / 4) * rowHeight);
};

export const scrollIndex = (rowHeight, scrollTop) => {

    const INCREMENT = Math.floor(
        DEFAULT_RENDERED_RECORDS_VISIBLE / 2
    ) * rowHeight;

    return Math.floor(scrollTop / INCREMENT);
};
