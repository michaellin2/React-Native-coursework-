/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  View,
} from 'react-native';
import { ImageBackground } from 'react-native-web';
import backIcon from '../assets/blueBackIcon.png';
import backgroundImage from '../assets/background.jpg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIcon: {
    flex: 1,
    height: 40,
    width: 40,
    alignSelf: 'flex-start',
    marginVertical: 20,
    marginLeft: 20,
  },

  logoStyle: {
    alignSelf: 'center',
    marginTop: -20,
    fontSize: 45,
    fontWeight: 'bold',
    color: 'purple',
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    margin: 10,
    borderColor: 'blue',
    backgroundColor: '#C3B1E1',
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
      <View style={styles.container}>
        <ImageBackground
          style={{ height: '100%', backgroundColor: 'transparent' }}
          source={backgroundImage}
        >
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Image style={styles.backIcon} source={backIcon} />
          </TouchableOpacity>
          <Text style={styles.logoStyle}>ᔕᑭᗩᑕEᗷOOK</Text>
          <View style={{ marginTop: 50 }}>
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
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default RegisterPage;
