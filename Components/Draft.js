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
  FlatList,
}
  from 'react-native';
import backIcon from '../assets/backIcon.png';
import editIcon from '../assets/editIcon.png';
import deleteIcon from '../assets/deleteIcon.png';

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
    textBoxContainer: {
      flex: 1,
      borderWidth: 1,
      padding: 10,
      marginHorizontal: 15,
      margin: 5,
      borderRadius: 5,
      borderColor: 'blue',
      backgroundColor: '#C3B1E1',
      fontSize: 20,
    },
    icon: {
      height: 20,
      width: 20,
      marginVertical: 10,
      marginLeft: 20,
    },
  },
);
class DraftPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draftBox: [],
    };
  }

  async componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getPost();
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

  getPost = async () => {
    const draft = JSON.parse(await AsyncStorage.getItem('draft'));
    this.setState({ draftBox: draft });
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

  currDraft = async (item) => {
    await AsyncStorage.setItem('currDraft', JSON.stringify(item));
    this.props.navigation.navigate('EditDraft');
  };

  display(item) {
    return (
      <View style={styles.showPost}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => this.currDraft(item)}>
            <Image
              style={styles.icon}
              source={editIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.removeDraft(item.id)}>
            <Image
              style={styles.icon}
              source={deleteIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <View style={{ justifyContent: 'flex-end' }}>
          <FlatList
            data={this.state.draftBox}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.textBoxContainer}>
                  {item.text}

                </Text>
                {this.display(item)}
              </View>

            )}
            inverted
            keyExtractor={(item) => item.id}
          />

        </View>
      </View>
    );
  }
}

export default DraftPage;
