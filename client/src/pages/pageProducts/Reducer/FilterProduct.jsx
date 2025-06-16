// Sửa initialState:
export const initialState = {
  limit: 8,
  page: 1,
  q: "",
  order: "",
  sortBy: "",
  skip: 0, 
};

export const TYPE_ACITON = {
  CHANGE_SORT: "CHANGE_SORT",
  CHANGE_PAGE: "CHANGE_PAGE",
  CHANGE_SEARCH: "CHANGE_SEARCH",
};

export const filterproductReducer = (state, action) => {
  switch (action.type) {
    case TYPE_ACITON.CHANGE_SORT:
      return {
        ...state,
        order: action.payload.order,
        sortBy: action.payload.sortBy,
        page: 1,
        skip: 0,
      };
    case TYPE_ACITON.CHANGE_PAGE:
      return {
        ...state,
        page: action.payload.page,
        skip: action.payload.skip,
        
      };
    case TYPE_ACITON.CHANGE_SEARCH:
      return {
        ...state,
        q: action.payload,
      };

    default:
      return state;
  }
};
