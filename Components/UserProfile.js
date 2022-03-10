/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backIcon from '../assets/backIcon.png';
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
  imageContainer: {
    flex: 1,
    height: 250,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 2,
  },
  post: {
    flex: 1,
    flexDirection: 'column',
  },
  addIcon: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    marginTop: 5,
  },
  textContainer: {
    borderWidth: 2,
    padding: 10,
    margin: 15,
    borderRadius: 5,
  },
  viewIcon: {
    flex: 1,
    height: 20,
    width: 20,
    marginHorizontal: 10,
    marginBottom: -5,
  },
});

class UserProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id1: '',
      isLoading: true,
      userData: [],
    };
  }

  componentDidMount() {
    this.refresh = this.props.navigation.addListener('focus', () => {
      this.get_profile_image();
      this.getPost();
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

  get_profile_image = async () => {
    const id = await AsyncStorage.getItem('@UserId');
    const sessionToken = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo/`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        Error(err);
      });
  };

  getPost = async () => {
    const id = await AsyncStorage.getItem('@UserId');
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
          userData: responseJson,
          id1: id,
        });
      })
      .catch((error) => {
        Error(error);
      });
  };

  likePost = async (postId) => {
    const id = await AsyncStorage.getItem('@UserId');
    const sessionToken = await AsyncStorage.getItem('@session_token');

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${
        id
      }/post/${
        postId
      }/like`,
      {
        method: 'post',
        headers: { 'X-Authorization': sessionToken },
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

  unlikePost = async (postId) => {
    const id = await AsyncStorage.getItem('@UserId');
    const sessionToken = await AsyncStorage.getItem('@session_token');

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${
        id
      }/post/${
        postId
      }/like`,
      {
        method: 'DELETE',
        headers: { 'X-Authorization': sessionToken },
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

  deletePost = async (postId) => {
    const id = await AsyncStorage.getItem('@UserId');
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

  showPost(item) {
    if (item.author.user_id != this.state.id1) {
      return (

        <View style={{
          flex: 1, flexDirection: 'row', marginHorizontal: 15, marginTop: -10,
        }}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.setItem('@postId', item.post_id);
                this.props.navigation.navigate('UserUpdatePost');
              }}
            >
              <Image
                style={{ height: 20, width: 20, margin: 5 }}
                source={editIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.deletePost(item.post_id);
              }}
            >
              <Image
                style={{ height: 20, width: 20, margin: 5 }}
                source={deleteIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
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
        </View>
      );
    }
    return (
      <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: -10 }}>
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
        <View
          style={styles.lodingContainer}
        >
          <Text>Loading..</Text>
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <View>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image
              style={{ height: 60, width: 60 }}
              source={backIcon}
            />
          </TouchableOpacity>
          <Image
            style={styles.imageContainer}
            source={{ uri: this.state.photo }}
          />
        </View>

        <View style={styles.post}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('UserPost')}
          >
            <Image
              style={styles.addIcon}
              source={addIcon}
            />
          </TouchableOpacity>
          <FlatList
            data={this.state.userData}
            renderItem={({ item }) => (
              <View>
                <Text
                  style={styles.textContainer}
                >
                  <Text style={{ fontWeight: 'bold' }}>
                    {item.author.first_name}
                    {' '}
                    {item.author.last_name}
                    :
                  </Text>

                  <TouchableOpacity
                    onPress={async () => {
                      await AsyncStorage.setItem('@UserPostId', item.post_id);
                      this.props.navigation.navigate('SinglePost');
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
      </ScrollView>
    );
  }
}

export default UserProfilePage;
