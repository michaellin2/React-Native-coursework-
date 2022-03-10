/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'react-native-web';
import backgroundImage from '../assets/homeBackground.jpeg';

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
  backgroundContainer: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  textContainer: {
    flex: 1,
    marginVertical: 50,
    alignSelf: 'center',
    fontSize: 60,
    color: 'red',
  },
  logoContainer: {
    justifyContent: 'center',
    margin: 50,
  },
  logoStyle: {
    color: 'purple',
    alignSelf: 'center',
    fontSize: 45,
    fontWeight: 'bold',
  },
  friendContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: -40,
  },
  friendList: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#C3B1E1',
    marginLeft: 10,
  },
  friendRequest: {
    fontSize: 20,
    fontWeight: 'bold',
    borderColor: 'blue',
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: '#C3B1E1',
    marginLeft: 10,
  },
  textBoxContainer: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderColor: 'blue',
    backgroundColor: '#C3B1E1',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
class FriendPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.getFriend();
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

  getFriend = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Can only view the friends of yourself or your friends');
        } else if (response.status === 404) {
          throw new Error('Not Found');
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

  combineFunction = async (userId) => {
    await AsyncStorage.setItem('@UserId', userId);
    this.props.navigation.navigate('UserProfile');
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.lodingContainer}>
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
          <View style={styles.logoContainer}>
            <Text style={styles.logoStyle}>ᔕᑭᗩᑕEᗷOOK</Text>
          </View>
          <View style={styles.friendContainer}>
            <Text style={styles.friendList}>FriendList</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('FriendRequest')}
            >
              <Text style={styles.friendRequest}>Friend Request</Text>
            </TouchableOpacity>

            <FlatList
              data={this.state.listData}
              renderItem={({ item }) => (
                <View style={styles.container}>
                  <Text style={styles.textBoxContainer}>
                    <TouchableOpacity
                      onPress={async () => {
                        this.combineFunction(item.user_id);
                      }}
                    >
                      <Text style={styles.text}>
                        {item.user_givenname}
                        {' '}
                        {item.user_familyname}
                      </Text>
                    </TouchableOpacity>
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.user_id.toString()}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default FriendPage;
