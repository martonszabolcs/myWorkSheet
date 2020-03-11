import * as React from 'react';
import {Image} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Picker,
  Platform,
} from 'react-native';
//import NfcManager, { Ndef } from "react-native-nfc-manager";
//import {startNFC, stopNFC, registerTagEvent} from '../components/NfcHelper';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

//const IS_IOS = Platform.OS === 'ios';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
const inputwidth = viewportWidth - 100;
//const separatorwidth = inputwidth / 2 - 40;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      usernameError: '',
      passwordError: '',
      //uidtf: false
    };
  }

  componentWillMount() {}
  async saveEmailtoStorage() {
    const data = this.state.username;
    await AsyncStorage.setItem('EMAIL', JSON.stringify(data));
  }

  async saveLanguagetoStorage(data) {
    await AsyncStorage.setItem('LANGUAGE', JSON.stringify(data));
    this.props.setLanguage(data);
  }

  validate = () => {
    let usernameError = '';
    let passwordError = '';
    const {login_emailerror, login_passworderror} = strings;
    if (!this.state.username) {
      usernameError = login_emailerror;
    }
    if (!this.state.password) {
      passwordError = login_passworderror;
    }

    if (usernameError || passwordError) {
      this.setState({usernameError, passwordError});
      return false;
    }

    return true;
  };

  loginBtnPressed(e) {
    e.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      this.loginPassw();
    }
  }

  async loginPassw() {
    const email = this.state.username;
    const password = this.state.password;
    const navigation = this.props.navigation;
    await this.props.login(email, password, navigation);
    this.setState({usernameError: '', passwordError: ''});
    this.saveEmailtoStorage();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logincontainer}>
        <LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => console.log("logout.")}/>
          <Text>{'strings.login_email'}</Text>
          <TextInput
            editable
            onChangeText={text => this.setState({username: text})}
            value={this.state.username}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.errortxt}>{this.state.usernameError}</Text>
          <Text style={{marginTop: 5}}>{'strings.login_password'}</Text>
          <TextInput
            editable
            onChangeText={text => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry
            style={styles.input}
            autoCorrect={false}
          />
          <Text style={styles.errortxt}>{this.state.passwordError}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={e => this.loginBtnPressed(e)}>
            <Text style={styles.buttontxt}>{'strings.login_button'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    flex: 1,
  },
  logincontainer: {
    marginHorizontal: 50,
    marginTop: 100,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: inputwidth,
  },
  button: {
    backgroundColor: '#23B7E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttontxt: {
    color: '#fff',
    fontSize: 14,
  },
  nfc: {
    margin: 20,
    marginHorizontal: 50,
    fontSize: 16,
    width: inputwidth,
    textAlign: 'center',
  },
  errortxt: {
    color: '#EF4141',
    fontSize: 12,
    textAlign: 'center',
  },
  flagcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 50,
  },
  icon: {
    height: 25,
    width: 40,
    marginHorizontal: 10,
  },
});

const stateToProps = state => ({
  state: state.state,
});

const dispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(stateToProps, dispatchToProps)(Login);
