import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Card, Header, Icon, ThemeConsumer } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import { Alert } from 'react-native';
import MyHeader from '../components/header';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class UpcomingEventDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: '',
      organiserId: this.props.navigation.getParam('details')['organiser'],
      eventId: this.props.navigation.getParam('details')['eventId'],
      event: this.props.navigation.getParam('details')['event'],
      image: '#',
      address: this.props.navigation.getParam('details')['address'],
      participants: this.props.navigation.getParam('details')['participants'],
      description: '',
      time: this.props.navigation.getParam('details')['time'],
      organiserName: '',
      organiserContact: '',
      organiserEmail: '',
      organisereventDocId: '',
    };
  }

  getOrganiserDetails = () => {
    db.collection('users')
      .where('email', '==', this.state.organiserId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            organiserName: doc.data().name,
            organiserContact: doc.data().contact,
            organiserEmail: doc.data().email,
          });
        });
      });
    db.collection('invites')
      .where('ID', '==', this.state.eventId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            organisereventDocId: doc.id,
            image: doc.data().image,
            description: doc.data().description,
          });
        });
      });
  };
  getUserDetails = (userId) => {
    db.collection('users')
      .where('email', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().name,
          });
        });
      });
  };

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }
  addNotification = () => {
    var message = this.state.userName + ' is interested in attending';
    var notificationId = this.createUniqueId();
    db.collection('notifications').add({
      targetUserId: this.state.organiserId,
      user: this.state.userId,
      eventId: this.state.eventId,
      event: this.state.event,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notificationStatus: 'unread',
      message: message,
      notificationId: notificationId,
    });
    console.log('Hi, hello, how are you');
    db.collection('participants').add({
      participant: this.state.userId,
      status: 'unconfirmed',
      eventId: this.state.eventId,
      event: this.state.event,
      time: this.state.time,
      organiser: this.state.organiserEmail,
    });
  };
  addCancelNotification = () => {
    var message =
      this.state.userName + ' is no longer able to attend this event';
    var notificationId = this.createUniqueId();
    db.collection('notifications').add({
      targetUserId: this.state.organiserId,
      user: this.state.userId,
      eventId: this.state.eventId,
      event: this.state.event,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notificationStatus: 'unread',
      message: message,
      notificationId: notificationId,
    });
    db.collection('invites')
      .doc(this.state.organisereventDocId)
      .update({
        participants: this.state.participants - 1,
      });
    console.log('Notification added');
    var list = db
      .collection('participants')
      .where('eventId', '==', this.state.eventId)
      .where('participant', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('participants').doc(doc.id).delete();
        });
      });
    Alert.alert('Event has been cancelled');
    this.props.navigation.navigate('UpcomingEvents');
  };
  ReallyCancel = () => {
    var message = this.state.event + ' is canceled';
    var notificationId = this.createUniqueId();
    var users = [];
    var ids = [];
    db.collection('participants')
      .where('eventId', '==', this.state.eventId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          users.push(doc.data().participant);
          ids.push(doc.id);
        });
      });
    for (var user in users) {
      db.collection('notifications').add({
        targetUserId: user,
        user: this.state.userId,
        eventId: this.state.eventId,
        event: this.state.event,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        notificationStatus: 'unread',
        message: message,
        notificationId: notificationId,
      });
    }
    for (var id in ids) {
      db.collection('participants').doc(id).delete();
    }
    db.collection('invites')
      .where('ID', '==', this.state.eventId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('invites').doc(doc.id).delete();
        });
      });
    Alert.alert('Event has been deleted');
    this.props.navigation.navigate('UpcomingEvents');
  };
  componentDidMount() {
    this.getOrganiserDetails();
    this.getUserDetails(this.state.userId);
  }

  button() {
    if (this.state.organiserId != this.state.userId) {
      return (
        <LinearGradient
          // Button Linear Gradient
          colors={['#FC3973', '#FF7455']}
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}>
          <TouchableOpacity
            onPress={() => {
              this.addCancelNotification();
            }}>
            <Text style={styles.buttonText}>Cancel Attendance</Text>
          </TouchableOpacity>
        </LinearGradient>
      );
    } else if (this.state.organiserId == this.state.userId) {
      return (
        <LinearGradient
          // Button Linear Gradient
          colors={['#FC3973', '#FF7455']}
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}>
          <TouchableOpacity
            onPress={() => {
              this.ReallyCancel();
            }}>
            <Text style={styles.buttonText}>Cancel Event</Text>
          </TouchableOpacity>
        </LinearGradient>
      );
    }
  }
  render() {
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <Header
          leftComponent={
            <Icon
              name="arrow-left"
              type="feather"
              color="#ffffff"
              onPress={() => this.props.navigation.goBack()}></Icon>
          }
          centerComponent={{
            text: 'Event Details',
            style: { color: 'white', fontSize: 20 },
          }}
          backgroundColor="#FC3973"></Header>
        <View style={styles.container}>
          <ScrollView>
            <View style={{ flex: 1 }}>
              <Image
                source={{ uri: this.state.image }}
                style={{
                  width: '80%',
                  height: 200,
                  marginTop: 15,
                  marginLeft: 20,
                }}></Image>
            </View>
            <View style={styles.container}>
              <Text style={[styles.captionText2,{fontWeight:"bold"}]}>{this.state.event}</Text>
              <View style={{ flexDirection: 'row', margin: 5, padding: 5 }}>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    margin: 5,
                    padding: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Entypo name={'calendar'} size={25} color="pink" />
                  <Text style={styles.captionText2}>{this.state.time}</Text>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    margin: 5,
                    padding: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AntDesign name={'clockcircleo'} size={25} color="pink" />
                  <Text style={styles.captionText2}>{this.state.time}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', margin: 5, padding: 5 }}>
                <Entypo name={'location'} size={25} color="pink" />
                <Text style={styles.captionText2}>{this.state.address}</Text>
              </View>
              <View style={{ flexDirection: 'row', margin: 5, padding: 5 }}>
                <MaterialIcons name={'description'} size={25} color="pink" />
                <Text style={styles.captionText2}>
                  {this.state.description}
                </Text>
              </View>
            </View>
            <View style={{marginTop:30, padding:10}}>
              <Text style={styles.captionText}>
                {'Organiser: ' + this.state.organiserName}
              </Text>
              <Text style={styles.captionText}>
                {'Contact: ' + this.state.organiserContact}
              </Text>
            </View>
            <View style={styles.buttonCont}>{this.button()}</View>
          </ScrollView>
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  captionText2: {
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    alignSelf:"center", 
    paddingTop: RFValue(5),
  },
  buttonCont: {
    flex: 0.3,
    justifyContent: 'center',
    margin:20, 
  },
  captionText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  button: {
    width: RFValue(300),
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FC3973',
    borderRadius: 25,
    marginBottom: 35,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
