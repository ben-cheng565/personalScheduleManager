const filtersReducerDefaultState = {
    sortBy: '',
    sortDirection: 'ascending',
    groupBy: '',
    separateCompleted: false
};

export default (state = filtersReducerDefaultState, action) => {

    switch (action.type) {

        case 'SORT_BY':
            return {
                ...state,
                sortBy: action.sortType

            };
        case 'SORT_DIRECTION':
            return {
                ...state,
                sortDirection: action.sortDirection
            };
        case 'GROUP_BY':
            return {
                ...state,
                groupBy: action.groupBy
            };
        case 'GROUP_COMPLETED_ITEMS_SEPERATELY':
            return {
                ...state,
                separateCompleted: action.separateCompleted
            };

        default:
            return state;
    }
}