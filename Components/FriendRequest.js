/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backIcon from '../assets/backIcon.png';
import tickIcon from '../assets/tickIcon.png';
import crossIcon from '../assets/crossIcon.png';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logoStyle: {
    color: '#0000ff',
    alignSelf: 'center',
    fontSize: 45,
    fontWeight: 'bold',
  },
  friendRequest: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 5,
  },
  textBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 6,
  },
  text: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    width: '96%',
    borderRadius: 5,
    borderColor: 'blue',
    justifyContent: 'space-around',
  },
  icon: {
    height: 20,
    width: 20,
    margin: 5,
  },
});

class FriendRequestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      listData: [],
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.getFriendRequest();
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

  getFriendRequest = async () => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else {
          throw new Error('Server error');
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          listData: responseJson,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

  acceptFriend = async (id) => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getFriendRequest();
        } else if (response.status === 401) {
          throw new Error('Unauthroised');
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

  deleteFriend = async (id) => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getFriendRequest();
        } else if (response.status === 401) {
          throw new Error('Unauthroised');
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

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading..</Text>
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Image
            style={{ height: 60, width: 60 }}
            source={backIcon}
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoStyle}>ᔕᑭᗩᑕEᗷOOK</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.friendRequest}>Friend Request</Text>
        </View>
        <FlatList
          data={this.state.listData}
          renderItem={({ item }) => (
            <View style={styles.textBoxContainer}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                  {item.first_name}
                  {' '}
                  {item.last_name}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() => this.acceptFriend(item.user_id)}
                style={{ alignSelf: 'center' }}
              >
                <Image
                  style={styles.icon}
                  source={tickIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.deleteFriend(item.user_id)}
                style={{ alignSelf: 'center' }}
              >
                <Image
                  style={styles.icon}
                  source={crossIcon}
                />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
      </ScrollView>
    );
  }
}
export default FriendRequestPage;
