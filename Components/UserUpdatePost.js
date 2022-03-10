/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  topTextFontSize: {
    fontSize: 20,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: 'azure',
    fontSize: 20,
    padding: 10,
  },

});
class UserUpdatePostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userData: [],
      postText: '',
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.getPost();
      this.checkLoggedIn();
    });
    this.getPost();
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

  getPost = async () => {
    const id = await AsyncStorage.getItem('@UserId');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const postId = await AsyncStorage.getItem('@postId');

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${postId}`, {
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

  getSinglePost = async () => {
    const id = await AsyncStorage.getItem('@UserId');
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
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

  updatePost = async (postId) => {
    const id = await AsyncStorage.getItem('@UserId');
    const sessionToken = await AsyncStorage.getItem('@session_token');

    const dataStorage = {
      text: this.state.postText,
    };
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${id}/post/${postId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionToken,
        },
        body: JSON.stringify(dataStorage),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          this.getPost();
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

  render() {
    return (
      <View style={styles.container}>
        <View
          style={styles.topText}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.topTextFontSize}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.topTextFontSize}>Text</Text>
          <TouchableOpacity
            onPress={() => {
              this.updatePost(this.state.userData.post_id);
              this.props.navigation.goBack();
            }}
          >
            <Text style={styles.topTextFontSize}>Post</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 15 }}>
          <TextInput
            style={styles.textInputContainer}
            multiline="true"
            maxLength={500}
            defaultValue={this.state.userData.text}
            onChangeText={(postText) => this.setState({ postText })}
          />
        </View>
      </View>
    );
  }
}

export default UserUpdatePostPage;
