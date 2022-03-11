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
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../assets/homeBackground.jpeg';
import backIcon from '../assets/blueBackIcon.png';
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
  backgroundContainer: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    justifyContent: 'center',
  },
  logoStyle: {
    color: 'purple',
    alignSelf: 'center',
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: -30,
  },
  backIcon: {
    flex: 1,
    height: 40,
    width: 40,
    alignSelf: 'flex-start',
    marginVertical: 20,
    marginLeft: 20,
  },
  friendRequest: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#C3B1E1',
    marginLeft: 10,

  },
  textBoxContainer: {
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderColor: 'blue',
    backgroundColor: '#C3B1E1',
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
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
      <View style={styles.container}>
        <ImageBackground
          style={styles.backgroundContainer}
          source={backgroundImage}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image
              style={styles.backIcon}
              source={backIcon}
            />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoStyle}>ᔕᑭᗩᑕEᗷOOK</Text>
          </View>
          <Text style={styles.friendRequest}>Friend Request</Text>
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
                <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
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
              </View>
            )}
            keyExtractor={(item) => item.user_id.toString()}
          />
        </ImageBackground>
      </View>
    );
  }
}
export default FriendRequestPage;
