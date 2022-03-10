/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
}
  from 'react-native';

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
class PostPage extends Component {
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
    const id = await AsyncStorage.getItem('@session_id');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const postedText = {
      text: this.state.postText,
    };

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Authorization': sessionToken },
      body: JSON.stringify(postedText),
    })
      .then((response) => {
        if (response.status === 201) {
          this.props.navigation.goBack();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 404) {
          throw new Error('Not Found');
        } else {
          throw new Error('Server error');
        }
      })
      .catch((error) => {
        Error(error);
      });
  };

  saveDraft = async () => {
    const draftBox = JSON.parse(await AsyncStorage.getItem('draft'));

    if (draftBox == null) {
      await AsyncStorage.setItem('draft', JSON.stringify([{ text: this.state.postText, id: 0 }]));
    } else {
      const value = draftBox.length;
      draftBox.push({ text: this.state.postText, id: value });
      await AsyncStorage.setItem('draft', JSON.stringify(draftBox));
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topText}>
          <View style={{ flexDirection: 'column' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
              <Text style={{ fontSize: 20, alignSelf: 'center', marginBottom: 5 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Draft')}>
              <Text style={styles.topTextFontSize}>
                DraftBox
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.topTextFontSize}>
            Text
          </Text>

          <View style={{ flexDirection: 'column' }}>
            <TouchableOpacity onPress={() => this.Post()}>
              <Text style={{ fontSize: 20, alignSelf: 'center', marginBottom: 5 }}>
                Post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.saveDraft()}>
              <Text style={styles.topTextFontSize}>
                Save Draft
              </Text>
            </TouchableOpacity>
          </View>

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

export default PostPage;
