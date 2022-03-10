/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ImageBackground,
}
  from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../assets/homeBackground.jpeg';
import editIcon from '../assets/editIcon.png';
import deleteIcon from '../assets/deleteIcon.png';
import thumbUpIcon from '../assets/thumbIcon.png';
import thumbDownIcon from '../assets/thumbDown.png';
import heartIcon from '../assets/heartIcon.png';
import addIcon from '../assets/blueAdd.png';
import viewIcon from '../assets/eyeIcon.png';

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
  addIcon: {
    height: 35,
    width: 35,
    alignSelf: 'center',
    marginTop: 20,
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
    flexWrap: 'wrap',
  },
  viewIcon: {
    flex: 1,
    height: 20,
    width: 20,
    marginHorizontal: 10,
    marginBottom: -5,
  },
  showPost: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 15,
  },
  icon: {
    height: 20,
    width: 20,
    margin: 5,
  },
});
class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id1: '',
      isLoading: true,
      listData: [],
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getPost();
    });
  }

  componentWillUnmount() {
    this.refresh();
  }

  getPost = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const sessionToken = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
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
          listData: responseJson,
          id1: id,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

  likePost = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const sessionToken = await AsyncStorage.getItem('@session_token');

    return fetch(
      `http://localhosthost:3333/api/1.0.0/user/${
        id
      }/post/${
        this.postId
      }/like`,
      {
        method: 'post',
        headers: { 'X-Authorization': sessionToken },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Forbidden - You have already liked this post');
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

  unlikePost = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const sessionToken = await AsyncStorage.getItem('@session_token');

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${
        id
      }/post/${
        this.postId
      }/like`,
      {
        method: 'DELETE',
        headers: { 'X-Authorization': sessionToken },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Forbidden - You have already liked this post');
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

  deletePost = async (postId) => {
    const id = await AsyncStorage.getItem('@session_id');
    const sessionToken = await AsyncStorage.getItem('@session_token');

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${id}/post/${postId}`,
      {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': sessionToken,
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          this.getPost();
        } else if (response.status === 401) {
          throw new Error('Unauthorised');
        } else if (response.status === 403) {
          throw new Error('Forbidden - You have already liked this post');
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  showPost(item) {
    if (item.author.user_id == this.state.id1) {
      return (
        <View style={styles.showPost}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.setItem('@postId', item.post_id);
                this.props.navigation.navigate('UpdatePost');
              }}
            >
              <Image
                style={styles.icon}
                source={editIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.deletePost(item.post_id);
              }}
            >
              <Image
                style={styles.icon}
                source={deleteIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.likePost(item.post_id)}>
              <Image
                style={styles.icon}
                source={thumbUpIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.unlikePost(item.post_id)}>
              <Image
                style={styles.icon}
                source={thumbDownIcon}
              />
            </TouchableOpacity>
            <Image
              style={{ height: 18, width: 18, margin: 5 }}
              source={heartIcon}
            />
            <Text style={{ marginTop: 2 }}>{item.numLikes}</Text>
          </View>
        </View>
      );
    }
    return (
      <View
        style={{ flexDirection: 'row', marginHorizontal: 15 }}
      >
        <TouchableOpacity onPress={() => this.likePost(item.post_id)}>
          <Image
            style={{ height: 20, width: 20, margin: 5 }}
            source={thumbUpIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.unlikePost(item.post_id)}>
          <Image
            style={{ height: 20, width: 20, margin: 5 }}
            source={thumbDownIcon}
          />
        </TouchableOpacity>
        <Image
          style={{ height: 18, width: 18, margin: 5 }}
          source={heartIcon}
        />
        <Text style={{ marginTop: 2 }}>{item.numLikes}</Text>
      </View>
    );
  }

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
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Post')}
            >
              <Image
                style={styles.addIcon}
                source={addIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 11 }}>
            <FlatList
              data={this.state.listData}
              renderItem={({ item }) => (
                <View>
                  <Text style={styles.textBoxContainer}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {item.author.first_name}
                      {' '}
                      {item.author.last_name}
                      :
                    </Text>
                    <TouchableOpacity
                      onPress={async () => {
                        await AsyncStorage.setItem('@postId', item.post_id);
                        this.props.navigation.navigate('MySinglePost');
                      }}
                    >
                      <Text style={{ margin: 5 }}>
                        {item.text}
                        <Image
                          style={styles.viewIcon}
                          source={viewIcon}
                        />
                      </Text>
                    </TouchableOpacity>
                  </Text>
                  {this.showPost(item)}
                </View>
              )}
              keyExtractor={(item) => item.post_id.toString()}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default HomePage;
