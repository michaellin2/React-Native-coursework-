/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  TextInput, Text, StyleSheet, TouchableOpacity, View,
} from 'react-native';

const styles = StyleSheet.create(
  {
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
  },
);
class UserPostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postText: '',
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

  Post = async () => {
    const id = await AsyncStorage.getItem('@UserId');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const postedText = {
      text: this.state.postText,
    };
    if (this.state.postText.length < 1 || this.state.postText.length > 500) {
      throw new Error('Please enter within 1-500 words');
    } else {
      return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Authorization': sessionToken },
        body: JSON.stringify(postedText),
      })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          } if (response.status === 401) {
            throw new Error('Unauthorised');
          } else if (response.status === 404) {
            throw new Error('Not Found');
          } else {
            throw new Error('Server error');
          }
        })
        .then(() => {
          this.props.navigation.goBack();
        })
        .catch((error) => {
          Error(error);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topText}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.topTextFontSize}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.topTextFontSize}>
            Text
          </Text>
          <TouchableOpacity onPress={() => this.Post()}>
            <Text style={styles.topTextFontSize}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 15 }}>
          <TextInput
            style={styles.textInputContainer}
            multiline="true"
            maxLength={500}
            placeholder="Type here!"
            onChangeText={(postText) => this.setState({ postText })}
            value={this.state.postText}
          />
        </View>
      </View>
    );
  }
}

export default UserPostPage;
