import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginPage from './Components/Login';
import RegisterPage from './Components/Register';
import HomePage from './Components/Home';
import SearchPage from './Components/Search';
import ProfilePage from './Components/Profile';
import PostPage from './Components/Post';
import UpdatePage from './Components/Update';
import CameraPage from './Components/Camera';
import FriendPage from './Components/Friend';
import FriendRequestPage from './Components/FriendRequest';
import UserProfilePage from './Components/UserProfile';
import SinglePostPage from './Components/SinglePost';
import UpdatePostPage from './Components/UpdatePost';
import UserPostPage from './Components/UserPost';
import UserUpdatePostPage from './Components/UserUpdatePost';
import MySinglePostPage from './Components/MySinglePost';
import DraftPage from './Components/Draft';
import EditDraftPage from './Components/EditDraft';
import homeIcon from './assets/homeIcon.png';
import searchIcon from './assets/searchIcon1.png';
import friendIcon from './assets/friendIcon.png';
import userIcon from './assets/userIcon.png';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  imageIcon: {
    height: 27,
    width: 27,
  },
});

function App() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.imageIcon}
              source={homeIcon}
            />
          )
          ,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.imageIcon}
              source={searchIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Friend"
        component={FriendPage}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.imageIcon}
              source={friendIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.imageIcon}
              source={userIcon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function tabNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Home" component={App} />
        <Stack.Screen
          name="Post"
          component={PostPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Update"
          component={UpdatePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FriendRequest"
          component={FriendRequestPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfilePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SinglePost"
          component={SinglePostPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UpdatePost"
          component={UpdatePostPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserPost"
          component={UserPostPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserUpdatePost"
          component={UserUpdatePostPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MySinglePost"
          component={MySinglePostPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Draft"
          component={DraftPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditDraft"
          component={EditDraftPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
