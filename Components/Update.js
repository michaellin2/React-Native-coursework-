/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backIcon from '../assets/backIcon.png';

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    flex: 1,
    height: 50,
    width: 50,
    alignSelf: 'flex-start',
  },
  imageContainer: {
    flex: 1,
    height: 250,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 2,
  },
  changeProfilePicButton: {
    flex: 1,
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 5,
    margin: 10,
    padding: 5,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    width: '100%',
    marginVertical: 20,
    flexDirection: 'column',
  },
  text: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    margin: 10,
  },
  updateButton: {
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 4,
    padding: 6,
    fontWeight: 'bold',
  },
});

class UpdatePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      password: '',
      isLoading: true,
      userData: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.get_profile_image();
      this.checkLoggedIn();
    });
    this.getUserInfo();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  get_profile_image = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo/`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  getUserInfo = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      headers: { 'X-Authorization': sessionToken },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else {
          throw new Error('Server error');
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userData: responseJson,
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  updateUserInfo = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const dataStorage = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      password: this.state.password,
    };

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionToken,
      },
      body: JSON.stringify(dataStorage),
    })
      .then((response) => {
        if (response.status === 200) {
          this.getUserInfo();
        } else if (response.status === 400) {
          throw new Error('Bad Request');
        } else if (response.status === 401) {
          throw new Error('Unauthorise');
        } else if (response.status === 403) {
          throw new Error('Forbidden');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else {
          throw new Error('Server Error');
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userData: responseJson,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

  combineFunction() {
    this.updateUserInfo();
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Profile')}
        >
          <Image style={styles.backIcon} source={backIcon} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View>
            <Image
              style={styles.imageContainer}
              source={{ uri: this.state.photo }}
            />
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Camera')}
          >
            <Text
              style={styles.changeProfilePicButton}
            >
              Click to change profile image
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={styles.textContainer}
        >
          <Text
            style={styles.text}
          >
            First Name
          </Text>
          <TextInput
            style={styles.textInput}
            defaultValue={this.state.userData.first_name}
            onChangeText={(firstName) => this.setState({ firstName })}
          />
          <Text
            style={styles.text}
          >
            Last Name
          </Text>
          <TextInput
            style={styles.textInput}
            defaultValue={this.state.userData.last_name}
            onChangeText={(lastName) => this.setState({ lastName })}
          />
          <Text
            style={styles.text}
          >
            Password
          </Text>
          <TextInput
            style={styles.textInput}
            defaultValue={this.state.userData.password}
            onChangeText={(password) => this.setState({ password })}
          />
        </View>
        <TouchableOpacity onPress={() => this.combineFunction()}>
          <Text
            style={styles.updateButton}
          >
            Update
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default UpdatePage;
