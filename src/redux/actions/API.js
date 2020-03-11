import {Alert} from 'react-native';

const baseUrl = 'http://0.0.0.0:9000';
const masterKey = 'u7SeEISgQvsRXzKj7YfXWf0Zg5YZIrDx';

export const login = (
  email,
  password,
  navigation,
  type,
  fbToken,
) => dispatch => {
  const loginType =
    type === 'facebook'
      ? '/auth/facebook?access_token=' + fbToken
      : '/auth?access_token=' + masterKey;
  const data = {
    method: 'POST',
    mode: 'same-origin',
    headers: {
      Authorization: 'Basic dGVzdEBleGFtcGxlLmNvbToxMjM0NTY=',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
  };
  fetch(baseUrl + loginType, data)
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(json => {
      console.log(json);
    })
    .catch(function(error) {
      console.log(error);
      throw error;
    });
};
