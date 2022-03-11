/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Button,
  View,
  TextInput,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../assets/background.jpg';

const styles = StyleSheet.create({
  lodingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  logoStyle: {
    alignSelf: 'center',
    fontSize: 45,
    margin: 60,
    fontWeight: 'bold',
    color: 'purple',
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 15,
    margin: 5,
    borderRadius: 5,
    borderColor: 'blue',
    backgroundColor: '#C3B1E1',
  },
  textStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    padding: 5,
    fontWeight: 'bold',
    color: '#C3B1E1',
  },
});
class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isLoading: true,
      emailError: '',
      passError: '',
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    this.refresh();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  login = async () => {
    const dataStorage = {
      email: this.state.email,
      password: this.state.password,
    };
    return fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataStorage),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw new Error('Invalid email or password');
        } else {
          throw new Error('error');
        }
      })
      .then(async (responseJson) => {
        await AsyncStorage.setItem(
          '@session_id',
          JSON.stringify(responseJson.id),
        );
        await AsyncStorage.setItem('@session_token', responseJson.token);
        this.props.navigation.navigate('Home');
      })
      .catch((error) => {
        Error(error);
      });
  };

  emailCheck() {
    if (this.state.email.length <= 6) {
      this.setState({ emailError: 'Please enter a valid email' });
    } else {
      this.setState({ emailError: '' });
    }
  }

  passwordCheck() {
    if (this.state.password.length <= 5 || this.state.password.length > 20) {
      this.setState({ passError: 'Please enter password between 6-20 characters' });
    } else {
      this.setState({ passError: '' });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.lodingContainer}>
          <Text>Loading..</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ImageBackground
          style={{ height: '100%', backgroundColor: 'transparent' }}
          source={backgroundImage}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.logoStyle}>ᔕᑭᗩᑕEᗷOOK</Text>
          </View>
          <View style={{ flex: 2 }}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              onBlur={() => this.emailCheck()}
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />
            <Text style={{ color: 'red', alignSelf: 'center' }}>
              {this.state.emailError}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              onBlur={() => this.passwordCheck()}
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              secureTextEntry
            />
            <Text style={{ color: 'red', alignSelf: 'center' }}>
              {this.state.passError}
            </Text>
            <Button title="Login" onPress={() => this.login()} />
            <Text style={styles.textStyle}>Dont have an account?</Text>
            <Button
              title="SignUp"
              onPress={() => this.props.navigation.navigate('Register')}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default LoginPage;
