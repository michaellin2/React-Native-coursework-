/* eslint-disable class-methods-use-this */
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
  TextInput,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../assets/homeBackground.jpeg';
import addIcon from '../assets/blueAdd.png';

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
  searchContainer: {
    margin: 10,
    marginTop: -30,
  },
  searchBox: {
    borderWidth: 2,
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: '#C3B1E1',
  },
  friendContainer: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 15,
    margin: 5,
    borderRadius: 5,
    borderColor: 'blue',
    backgroundColor: '#C3B1E1',
  },
  addIcon: {
    flex: 1,
    width: 16,
    height: 16,
    alignSelf: 'center',
  },
  displayingFriends: {
    flex: 1,
    fontWeight: 'bold',
    margin: 5,
    fontSize: 20,
  },
});

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textQuery: '',
      isLoading: true,
      listData: [],
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.searchFriend();
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

  searchFriend = async () => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    const Query = this.state.textQuery;
    return fetch(`http://localhost:3333/api/1.0.0/search/?q=${Query}`, {
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw new Error('Bad request');
        } else if (response.status === 401) {
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

  addFriend = async (id) => {
    const sessionToken = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } if (response.status === 401) {
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
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBox}
              placeholder="Enter name"
              onChangeText={(textQuery) => {
                this.setState({ textQuery });
                this.searchFriend();
              }}
              value={this.state.textQuery}
            />
          </View>
          <FlatList
            data={this.state.listData}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={styles.friendContainer}>
                  <TouchableOpacity
                    onPress={() => this.addFriend(item.user_id)}
                  >
                    <Image
                      style={styles.addIcon}
                      source={addIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.displayingFriends}>
                    {item.user_givenname}
                    {' '}
                    {item.user_familyname}
                  </Text>
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.user_id.toString()}
          />
        </ImageBackground>
      </View>
    );
  }
}
export default SearchPage;
