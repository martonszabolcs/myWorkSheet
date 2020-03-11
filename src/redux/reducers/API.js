export const initialState = {
  language: 'hu',
  user: {},
  logerror: '',
  projects: [],
  currentproject: {},
  noproject: '',
  orders: [],
  orderitems: [],
  order: {},
  units: [],
  people: [],
  pendingorders: [],
  productgroups: [],
  productsubgroups: [],
  products: [],
  productcosts: [],
  ordercosts: [],
  companies: [],
  emailerror: '',
};

const api = (state = initialState, action) => {
  switch (action.type) {
    // state
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.data,
      };
    case 'SET_PROJECT':
      return {
        ...state,
        currentproject: action.data,
        noproject: '',
      };
    case 'SET_PROJECT_ERROR':
      return {
        ...state,
        noproject: action.data,
      };
    case 'SET_COST':
      return {
        ...state,
        ordercosts: [...state.ordercosts, action.data],
      };
    case 'DELETE_COST':
      return {
        ...state,
        ordercosts: [],
      };
    // api
    case 'LOGIN':
      return {
        ...state,
        user: action.data,
        logerror: '',
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        logerror: action.data,
      };
    case 'LOGOUT':
      return {
        user: {},
      };
    case 'GET_UNITS':
      return {
        ...state,
        units: action.data,
      };
    case 'GET_UNITS_ERROR':
      return state;
    case 'GET_PROJECTS':
      return {
        ...state,
        projects: action.data,
      };
    case 'GET_PROJECTS_ERROR':
      return state;
    case 'GET_ORDERS':
      return {
        ...state,
        orders: action.data,
      };
    case 'GET_ORDERS_ERROR':
      return state;
    case 'GET_ORDERITEMS':
      return {
        ...state,
        orderitems: action.data,
      };
    case 'GET_ORDERITEMS_ERROR':
      return state;
    case 'GET_PRODUCT_GROUPS':
      return {
        ...state,
        productgroups: action.data,
        productsubgroups: [],
        products: [],
        productcosts: [],
      };
    case 'GET_PRODUCT_GROUPS_ERROR':
      return state;
    case 'GET_PRODUCT_SUBGROUPS':
      return {
        ...state,
        productsubgroups: action.data,
      };
    case 'GET_PRODUCT_SUBGROUPS_ERROR':
      return state;
    case 'GET_PRODUCTS':
      return {
        ...state,
        products: action.data,
      };
    case 'GET_PRODUCTS_ERROR':
      return state;
    case 'GET_PRODUCT_COSTS':
      return {
        ...state,
        productcosts: action.data,
      };
    case 'GET_PRODUCT_COSTS_ERROR':
      return state;
    case 'GET_COMPANY':
      return {
        ...state,
        companies: action.data,
      };
    case 'GET_COMPANY_ERROR':
      return state;
    // people
    case 'GET_PEOPLE':
      return {
        ...state,
        people: action.data,
      };
    case 'GET_PEOPLE_ERROR':
      return state;
    case 'CREATE_RECEIVER':
      return state;
    case 'CREATE_RECEIVER_ERROR':
      return state;
    // orders
    case 'CREATE_ORDER':
      return state;
    case 'CREATE_ORDER_ERROR':
      return state;
    case 'CREATE_EMAIL_ERROR':
      return {
        ...state,
        emailerror: action.data,
      };
    // pending orders
    case 'GET_PENDING_ORDERS':
      return {
        ...state,
        pendingorders: action.data,
      };
    case 'GET_PENDING_ORDERS_ERROR':
      return {
        ...state,
        pendingorders: [],
      };
    case 'DELETE_PENDING_ORDERS':
      return {
        ...state,
        pendingorders: [],
      };
    case 'SAVE_PENDING_ORDER':
      return {
        ...state,
        pendingorders: [...state.pendingorders, action.data],
      };
    case 'SAVE_TO_STORAGE':
      return state;
    //case 'UPDATE_ORDER':
    //  return state;
    //case 'UPDATE_ORDER_ERROR':
    //  return state;
    default:
      return state;
  }
};

export default api;
