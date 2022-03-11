/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  TextInput,
}
  from 'react-native';
import backIcon from '../assets/backIcon.png';

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    backIcon: {
      flex: 1,
      height: 50,
      width: 50,
      alignSelf: 'flex-start',
    },
    draftBox: {
      alignSelf: 'center',
      fontSize: 30,
      fontWeight: 'bold ',
    },
    icon: {
      height: 20,
      width: 20,
      marginVertical: 10,
      marginLeft: 20,
    },
    post: {
      fontSize: 20,
      alignSelf: 'flex-end',
      marginBottom: 5,
      flex: 1,
      marginRight: 10,
    },
    textInputContainer: {
      flex: 1,
      backgroundColor: 'azure',
      fontSize: 20,
      padding: 10,
    },
  },
);
class EditDraftPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draftBox: [],
      currDraft: [],
      postText: '',
    };
  }

  async componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getPost();
    });
    this.getPost();
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
    const currentDraft = JSON.parse(await AsyncStorage.getItem('currDraft'));
    const draft = JSON.parse(await AsyncStorage.getItem('draft'));
    this.setState({ draftBox: draft, currDraft: currentDraft });
  };

  editDraft = async () => {
    const currId = this.state.currDraft.id;
    this.state.draftBox[currId].text = this.state.postText;
    await AsyncStorage.setItem('draft', JSON.stringify(this.state.draftBox));
    this.Post();
    this.removeDraft(currId);
  };

  Post = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const draftText = {
      text: this.state.postText,
    };

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Authorization': sessionToken },
      body: JSON.stringify(draftText),
    })
      .then((response) => {
        if (response.status === 201) {
          this.props.navigation.navigate('Home');
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

  removeDraft = async (draftId) => {
    const draft = JSON.parse(await AsyncStorage.getItem('draft'));
    const array = [];
    for (let i = 0; i < draft.length; i += 1) {
      const draftText = draft[i].text;
      const draftid = draft[i].id;
      if (draftid != draftId) {
        array.push({ id: draftid, text: draftText });
      }
    }
    await AsyncStorage.setItem('draft', JSON.stringify(array));
    this.getPost();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
        >
          <Image style={styles.backIcon} source={backIcon} />
        </TouchableOpacity>

        <Text style={styles.draftBox}>
          DraftBox
        </Text>
        <View>
          <TouchableOpacity
            onPress={() => {
              this.editDraft();
            }}
          >
            <Text style={styles.post}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.textInputContainer}
            multiline="true"
            maxLength={500}
            defaultValue={this.state.currDraft.text}
            onChangeText={(postText) => this.setState({ postText })}
          />
        </View>
      </View>
    );
  }
}

export default EditDraftPage;
