/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backIcon from '../assets/backIcon.png';

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
  textContainer: {
    flex: 1,
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  imageContainer: {
    flex: 1,
    height: 250,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 2,
  },
  textContaianer: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    width: '95%',
    padding: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 20,
  },
});
class MySinglePostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      isLoading: true,
      userData: [],
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.get_profile_image();
      this.getSinglePost();
      this.checkLoggedIn();
    });
    this.getSinglePost();
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

  getSinglePost = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const postId = await AsyncStorage.getItem('@postId');
    const sessionToken = await AsyncStorage.getItem('@session_token');

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${id}/post/${postId}`,
      {
        headers: { 'X-Authorization': sessionToken },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Can only view the posts of yourself or your friends');
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
          firstName: responseJson.author.first_name,
          lastName: responseJson.author.last_name,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

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
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image
              style={{ height: 60, width: 60 }}
              source={backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.textContainer}>
            {this.state.firstName}
            {' '}
            {this.state.lastName}
          </Text>
          <Image
            style={styles.imageContainer}
            source={{ uri: this.state.photo }}
          />
        </View>
        <View style={{ flex: 15 }}>
          <Text style={styles.textContaianer}>
            {this.state.userData.text}
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default MySinglePostPage;
