import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import { SafeAreaView, Platform, StatusBar, ScrollView } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Test extends React.Component {
  constructor() {
    super();
    this.state = {
      inviteList: [],
      userId: firebase.auth().currentUser.email,
    };
    this.requestref = null;
  }
  getEvents = () => {
    this.requestref = db
      .collection('invites')
      .where('status', '==', 'open')
      .onSnapshot((snapshot) => {
        var requestList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          inviteList: requestList,
        });
      });
  };
  componentDidMount() {}
  componentWillUnmount() {
    this.requestref = null;
  }
  renderEvents = () => {
    this.getEvents();
    print(this.state.invitelist);
    print('Hi');
    return this.state.invitelist
      .map((item, i) => {
        return (
          <Animated.View
            style={{
              height: height - 120,
              width: width,
              padding: 10,
              position: 'absolute',
            }}>
            <View style={styles.container}>
              <SafeAreaView style={styles.droidSafeArea} />
              <ScrollView style={styles.postCard}>
                <View style={styles.authorContainer}>
                  <View style={styles.authorNameContainer}>
                    <Text style={styles.authorNameText}>
                      {this.props.route.params.author}
                    </Text>
                  </View>
                </View>
                <Image
                  source={require('../assets/adaptive-icon.png')}
                  style={styles.postImage}
                />
                <View style={styles.captionContainer}>
                  <Text style={styles.captionText}>
                    {'Event: ' + item.invite}
                  </Text>
                  <Text style={styles.captionText}>{'Time: ' + item.time}</Text>
                  <Text style={styles.captionText}>
                    {'Description: ' + item.description}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      this.props.navigation.navigate('EventDetails', {
                        details: item,
                      });
                    }}>
                    <Text style={styles.buttonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        );
      })
      .reverse();
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }}></View>
        <View style={{ flex: 1 }}>{this.renderEvents()}</View>
        <View style={{ height: 60 }}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
  },
  postContainer: {
    flex: 1,
  },
  postCard: {
    margin: RFValue(20),
    backgroundColor: '#2a2a2a',
    borderRadius: RFValue(20),
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'white',
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
  authorContainer: {
    height: RFPercentage(10),
    padding: RFValue(10),
    flexDirection: 'row',
  },
  authorImageContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: RFValue(100),
  },
  authorNameContainer: {
    flex: 0.85,
    padding: RFValue(10),
    justifyContent: 'center',
  },
  authorNameText: {
    color: 'white',
    fontSize: RFValue(20),
  },
  postImage: {
    width: '100%',
    alignSelf: 'center',
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: 'contain',
  },
  captionContainer: {
    padding: RFValue(10),
  },
  captionText: {
    fontSize: 13,
    color: 'white',
    paddingTop: RFValue(10),
  },
});
