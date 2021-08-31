import * as React from 'react';
import { Alert, View, Text } from 'react-native';
import { Header, Icon, Badge } from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      user: firebase.auth().currentUser.email,
    };
  }
  render() {
    return (
      <Header
        centerComponent={{
          text: this.props.title,
          style: { color: 'white', fontSize: 20 },
        }}
        backgroundColor="#FC3973"></Header>
    );
  }
}
