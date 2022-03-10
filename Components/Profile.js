/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Text, ScrollView, TouchableOpacity, View, Image, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

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
  imageContainer: {
    flex: 1,
    height: 250,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 2,
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
  textStyle: {
    borderWidth: 2,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  updateButton: {
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 4,
    padding: 6,
    fontWeight: 'bold',
  },
  logoutButton: {
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 50,
    padding: 10,
    fontWeight: 'bold',
  },
  logout: {
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 10,
    color: 'blue',
    margin: 10,
  },
});
class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userData: [],
      isModalVisible: false,
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.get_profile_image();
    });
    this.getUserInfo();
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

  logout = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    await AsyncStorage.clear();
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          throw new Error('Unauthroised');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        Error(error);
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
        Error(error);
      });
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
        Error(err);
      });
  };

  openModal = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  combineFunction() {
    this.closeModal();
    this.props.navigation.navigate('Profile');
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.lodingContainer}>
          <Text>Loading..</Text>
        </View>
      );
    } return (
      <ScrollView style={styles.container}>
        <View>
          <Image
            style={styles.imageContainer}
            source={{ uri: this.state.photo }}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>First Name</Text>
          <Text style={styles.textStyle}>
            {this.state.userData.first_name}
          </Text>
          <Text style={styles.text}>Last Name</Text>
          <Text style={styles.textStyle}>
            {this.state.userData.last_name}
          </Text>
          <Text style={styles.text}>Email</Text>
          <Text style={styles.textStyle}>{this.state.userData.email}</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Update')}
          >
            <Text style={styles.updateButton}>Update Details</Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => this.openModal()}>
            <Text style={styles.logoutButton}>Logout</Text>
          </TouchableOpacity>
          <Modal
            isVisible={this.state.isModalVisible}
            style={{ backgroundColor: 'white' }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            >
              <Text>Really wanna logout?</Text>
              <TouchableOpacity onPress={() => this.logout()}>
                <TouchableOpacity onPress={() => this.logout()}>
                  <Text style={styles.logout}>Yes</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.combineFunction()}>
                <Text style={styles.logout}>Take me back</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ScrollView>
    );
  }
}

export default ProfilePage;
