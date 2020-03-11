import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import strings from '../../languages/strings';

export const setLanguage = data => dispatch => {
  strings.setLanguage(data);
  dispatch({type: 'SET_LANGUAGE', data: data});
};

export const login = (email, password, navigation) => dispatch => {
  let data = {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify({
      email: email,
      password: password,
      captcha: Math.random()
        .toString(36)
        .substr(2, 9),
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
  };
  fetch(`https://lakogep.microstation.hu/api/appuser/rest-login/login`, data)
    .then(response => response.json())
    .then(json => {
      console.log(json);
      if (json.message) {
        dispatch({type: 'LOGIN_ERROR', data: strings.act_loginerrormsg});
        Alert.alert(strings.act_loginerror, json.message);
      }
      if (!json.message) {
        dispatch({type: 'LOGIN', data: json});
        dispatch(getProjects());
        navigation.navigate('Order');
      }
      return json;
    })
    .catch(function(error) {
      dispatch({type: 'LOGIN_ERROR', data: strings.act_loginerrormsg});
      Alert.alert(strings.act_loginerror, strings.act_loginerrormsg);
      throw error;
    });
};

export const getUnits = () => (dispatch, getState) => {
  const token = getState().order.user.access_token;
  let data = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/appuser/rest-unit/all-units`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      if (json.status == '') {
        dispatch({type: 'GET_UNITS_ERROR'});
        console.log(json.status);
        // Alert.alert('Unitok lekérése', json.message);
      } else {
        dispatch({type: 'GET_UNITS', data: json});
      }
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'GET_UNITS_ERROR'});
    });
};

export const getProjects = () => (dispatch, getState) => {
  const id = getState().order.user.person_id;
  const token = getState().order.user.access_token;
  const person_id = encodeURIComponent(id);
  let data = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/projects/rest-subproject/get-projects-mobile?person_id=${person_id}`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      /*if (json.message !== ''){
					dispatch({ type: 'GET_PROJECTS_ERROR'});
					console.log(json);
					Alert.alert('Projektek lekérése', json.message);
				}*/
      //else {
      dispatch({type: 'GET_PROJECTS', data: json});
      {
        !json[0] &&
          dispatch({
            type: 'SET_PROJECT_ERROR',
            data: strings.act_noproject,
          });
      }
      dispatch(getUnits());
      dispatch(getPeople());
      dispatch(getCompanies());
      dispatch(getProductGroups());
      //}
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'GET_PROJECTS_ERROR'});
    });
};

export const setProject = currentproject => dispatch => {
  dispatch({type: 'SET_PROJECT', data: currentproject});
  dispatch(getOrders());
};

export const getOrders = () => (dispatch, getState) => {
  const id = getState().order.user.person_id;
  const person_id = encodeURIComponent(id);
  const token = getState().order.user.access_token;
  const projectid = getState().order.currentproject.subproject_id;
  const subproject_id = encodeURIComponent(projectid);
  let data = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/logistics/rest-supply/get-supply-heads-mobile?person_id=${person_id}&subproject_id=${subproject_id}`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch({type: 'GET_ORDERS', data: json});
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'GET_ORDERS_ERROR'});
    });
};

export const getOrderItems = id => (dispatch, getState) => {
  const supply_head_id = encodeURIComponent(id);
  const token = getState().order.user.access_token;
  let data = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/logistics/rest-supply-detail/get-supply-details-mobile?supply_head_id=${supply_head_id}`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch({type: 'GET_ORDERITEMS', data: json});
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'GET_ORDERITEMS_ERROR'});
    });
};

export const getCompanies = () => (dispatch, getState) => {
  const token = getState().order.user.access_token;
  let data = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/appuser/rest-company-data/companies?company_type=4`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      if (json.status === '') {
        dispatch({type: 'GET_COMPANY_ERROR'});
        console.log(json.status);
      } else {
        dispatch({type: 'GET_COMPANY', data: json});
      }
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'GET_COMPANY_ERROR'});
    });
};

export const getPeople = () => (dispatch, getState) => {
  const token = getState().order.user.access_token;
  let data = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/appuser/rest-person/all-people`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      if (json.status === '') {
        dispatch({type: 'GET_PEOPLE_ERROR'});
        console.log(json.status);
        // Alert.alert('Átvevők lekérdezése', json.message);
      } else {
        dispatch({type: 'GET_PEOPLE', data: json});
      }
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'GET_PEOPLE_ERROR'});
    });
};

export const createReceiver = (reverse_name, handy) => (dispatch, getState) => {
  const token = getState().order.user.access_token;
  console.log(reverse_name);
  let data = {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify({
      reverse_fullname: reverse_name,
      handy: handy,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/appuser/rest-person/create-person`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch({type: 'CREATE_RECEIVER', data: json});
      dispatch(getPeople());
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'CREATE_RECEIVER_ERROR'});
    });
};

export const getProductGroups = () => (dispatch, getState) => {
  const token = getState().order.user.access_token;
  let data = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/appuser/rest-product-group/all-product-groups?parent=null`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch({type: 'GET_PRODUCT_GROUPS', data: json});
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'GET_PRODUCT_GROUPS_ERROR'});
    });
};

export const getProductSubGroups = id => (dispatch, getState) => {
  const parent_id = encodeURIComponent(id);
  const token = getState().order.user.access_token;
  let data = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/appuser/rest-product-group/all-product-groups?parent=${parent_id}`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch({type: 'GET_PRODUCT_SUBGROUPS', data: json});
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'GET_PRODUCT_SUBGROUPS_ERROR'});
    });
};

export const getProducts = id => (dispatch, getState) => {
  const parent = encodeURIComponent(id);
  const token = getState().order.user.access_token;
  let data = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/appuser/rest-product/all-products?parent=${parent}`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch({type: 'GET_PRODUCTS', data: json});
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'GET_PRODUCTS_ERROR'});
    });
};

export const getProductCosts = productid => (dispatch, getState) => {
  const product_id = encodeURIComponent(productid);
  const subprojectid = getState().order.currentproject.subproject_id;
  const subproject_id = encodeURIComponent(subprojectid);
  const token = getState().order.user.access_token;
  let data = {
    method: 'GET',
    mode: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/logistics/rest-supply-detail/get-supply-details-by-projects?subproject_id=${subproject_id}&&product_id=${product_id}`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch({type: 'GET_PRODUCT_COSTS', data: json});
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'GET_PRODUCT_COSTS_ERROR'});
    });
};

export const saveCostLine = item => dispatch => {
  dispatch({type: 'SET_COST', data: item});
};

export const sendOrder = (
  delivery_deadline,
  receiver,
  comment,
  items,
  company_id,
  location,
) => (dispatch, getState) => {
  const token = getState().order.user.access_token;
  const subproject_id = getState().order.currentproject.subproject_id;
  const creator_id = getState().order.user.person_id;
  console.log(company_id);
  let data = {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify({
      subproject_id: subproject_id,
      delivery_deadline: delivery_deadline,
      creator_id: creator_id,
      person_id: receiver,
      company_id: company_id,
      subject: comment,
      products: items,
      status_name: 'Elküldve',
      location: location,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/logistics/rest-supply-detail/insert-supply-details-with-head`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      dispatch(getOrders());
      if (json.missingCompanyEmail === true) {
        dispatch({type: 'CREATE_EMAIL_ERROR', data: json.error});
      } else {
        dispatch({type: 'CREATE_ORDER', data: json});
        dispatch({type: 'DELETE_COST'});
      }
    })
    .catch(function(error) {
      dispatch(getOrders());

      dispatch({type: 'CREATE_ORDER_ERROR'});
      //dispatch(pendingOrder(subproject_id, delivery_deadline, creator_id, receiver, comment, items));
      dispatch({type: 'DELETE_COST'});
    });
};

export const pendingOrder = (
  subproject_id,
  delivery_deadline,
  creator_id,
  receiver,
  comment,
  items,
) => (dispatch, getState) => {
  const order = {
    subproject_id: subproject_id,
    delivery_deadline: delivery_deadline,
    creator_id: creator_id,
    receiver: receiver,
    comment: comment,
    items: items,
  };
  console.log(order);
  dispatch({type: 'SAVE_PENDING_ORDER', data: order});
  dispatch(saveOrderToStorage());
};

export const saveOrderToStorage = () => (dispatch, getState) => {
  const items = getState().order.pendingorders;
  console.log(items);
  console.log(JSON.stringify(items));
  console.log(JSON.stringify(JSON.parse(items)));
  const orders = JSON.stringify(items);
  AsyncStorage.setItem('Orders', orders);
  dispatch({type: 'SAVE_TO_STORAGE', data: items});
  dispatch(getPendingOrders());
};

export const getPendingOrders = orders => (dispatch, getState) => {
  try {
    const get = AsyncStorage.getItem('Orders');
    if (get !== null) {
      console.log(get);
      console.log(JSON.parse(get));
      const orders = JSON.parse(get);
      dispatch({type: 'GET_PENDING_ORDER', data: orders});
      console.log(orders);
    }
  } catch (error) {
    console.log(error);
    dispatch({type: 'GET_PENDING_ORDER_ERROR'});
  }
  dispatch({type: 'GET_PENDING_ORDER_ERROR'});
  //dispatch(sendOrderAgain())
};

export const deletePendingOrders = () => (dispatch, getState) => {
  dispatch({type: 'DELETE_PENDING_ORDER'});
  //dispatch(sendOrderAgain())
};

export const sendOrderAgain = () => (dispatch, getState) => {
  const token = getState().order.user.access_token;
  const subproject_id = getState().order.pendingorders;
  const creator_id = getState().order.user.person_id;
  //delete from local
  const items = [];
  AsyncStorage.setItem('Orders', JSON.stringify(items));

  let data = {
    method: 'POST',
    mode: 'same-origin',
    body: JSON.stringify({
      subproject_id: subproject_id,
      delivery_deadline: delivery_deadline,
      creator_id: creator_id,
      person_id: receiver,
      subject: comment,
      products: items,
      status_name: 'Elküldve',
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  };
  return fetch(
    `https://lakogep.microstation.hu/api/logistics/rest-supply-detail/insert-supply-details-with-head`,
    data,
  )
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch({type: 'CREATE_ORDER', data: json});
      dispatch({type: 'DELETE_COST'});
      dispatch(getOrders());
    })
    .catch(function(error) {
      console.error(error);
      dispatch({type: 'CREATE_ORDER_ERROR'});
      dispatch(
        pendingOrder(
          subproject_id,
          delivery_deadline,
          creator_id,
          receiver,
          comment,
          items,
        ),
      );
    });
};

/*export const updateOrder = (history, id, name, date, owner, type, peopleNumber, other, address) => (dispatch, getState) => {
	axios
		.put(apiUrl + '/parentEvents/' + id, {
			name: name,
			date: date,
			address:address,
			owner: owner,
			type: type,
			peopleNumber: peopleNumber,
			other: other,
			access_token: getState().state.token
		})
		.then((response) => {
			dispatch({ type: 'UPDATE_ORDER' });
			dispatch(getParentEvent());
		})
		.catch(function(error) {
			dispatch({ type: 'UPDATE_ORDER' });
		});
};*/

/*export const loginNFC = (navigation, hash, nfcid, type, predor_10h6d_uid, predor_8h10d_uid, predor_12h15d_uid, predor_16h20d_uid, predor_2h10d4h10d_uid, predor_4h10d4h10d_uid) => (dispatch) => {
	axios
	.post(apiUrl + '/auth', {
		hash: hash,
		nfcid: nfcid,
		type: type,
		predor_10h6d_uid: predor_10h6d_uid, 
		predor_8h10d_uid: predor_8h10d_uid, 
		predor_12h15d_uid: predor_12h15d_uid, 
		predor_16h20d_uid: predor_16h20d_uid, 
		predor_2h10d4h10d_uid: predor_2h10d4h10d_uid, 
		predor_4h10d4h10d_uid: predor_4h10d4h10d_uid
	})
	.then((response) => {
		dispatch({ type: 'LOGIN', data: response });
		navigation.navigate('Order');
		return response
	})
	.catch(function(error) {
		dispatch({ type: 'LOGIN_ERROR', data: 'Hiba a belépésnél' });
	});
};

export const logout = () => (dispatch) => {
	dispatch({ type: 'LOGOUT' });
};*/
