/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  ScrollView,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import backIcon from '../assets/backIcon.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIcon: {
    flex: 1,
    height: 80,
    width: 80,
    alignSelf: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginVertical: 40,
    alignSelf: 'center',
    fontSize: 60,
    fontFamily: 'Lucida Calligraphy',
    color: 'red',
  },
  logoStyle: {
    alignSelf: 'center',
    fontSize: 40,
    marginVertical: 20,
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    margin: 10,
  },
});
class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Firstname: '',
      Lastname: '',
      Email: '',
      Password: '',
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
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

  signUp = () => {
    const dataStorage = {
      first_name: this.state.Firstname,
      last_name: this.state.Lastname,
      email: this.state.Email,
      password: this.state.Password,
    };
    return fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataStorage),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } if (response.status === 400) {
          throw new Error('Invalid email or password');
        } else {
          throw new Error('Error');
        }
      })
      .then(() => {
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        Error(error);
      });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Login')}
        >
          <Image style={styles.backIcon} source={backIcon} />
        </TouchableOpacity>
        <Text style={styles.textContainer}>Register</Text>
        <Text style={styles.logoStyle}>ᔕᑭᗩᑕEᗷOOK</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your first name"
          onChangeText={(Firstname) => this.setState({ Firstname })}
          value={this.state.Firstname}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter your last name"
          onChangeText={(Lastname) => this.setState({ Lastname })}
          value={this.state.Lastname}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter your email address"
          onChangeText={(Email) => this.setState({ Email })}
          value={this.state.Email}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter your last password"
          onChangeText={(Password) => this.setState({ Password })}
          value={this.state.Password}
          secureTextEntry
        />
        <Button title="Create Account" onPress={() => this.signUp()} />
      </ScrollView>
    );
  }
}

export default RegisterPage;
