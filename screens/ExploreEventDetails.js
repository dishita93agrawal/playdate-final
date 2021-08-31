import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView
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

export default class ExploreEventDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: '',
      organiserId: this.props.navigation.getParam('details')['userId'],
      eventId: this.props.navigation.getParam('details')['ID'],
      event: this.props.navigation.getParam('details')['invite'],
      image: this.props.navigation.getParam('details')['image'],
      description: this.props.navigation.getParam('details')['description'],
      address: this.props.navigation.getParam('details')['address'],
      time: this.props.navigation.getParam('details')['time'],
      participants: this.props.navigation.getParam('details')['participants'],
      city: this.props.navigation.getParam('details')['city'],
      organiserName: '',
      organiserContact: '',
      organiserEmail: '',
      organisereventDocId: '',
      attending: false,
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
  getAttending = () => {
    db.collection('participants')
      .where('participant', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().eventId == this.state.eventId) {
            this.setState({
              attending: true,
            });
          }
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
    db.collection('invites')
      .doc(this.state.organisereventDocId)
      .update({
        participants: this.state.participants + 1,
      });
    db.collection('participants').add({
      participant: this.state.userId,
      status: 'unconfirmed',
      eventId: this.state.eventId,
      event: this.state.event,
      time: this.state.time,
      organiser: this.state.organiserEmail,
      image: this.state.image,
      address: this.state.address,
      participants: this.state.participants+1
      //add parents email 
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
    this.props.navigation.navigate('Home');
  };
  ReallyCancel = async () => {
    var message = this.state.event + ' is canceled';
    var notificationId = this.createUniqueId();
    var users = [];
    var ids = [];
    try {
      await db
        .collection('participants')
        .where('eventId', '==', this.state.eventId)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            console.log(doc.data());
            users.push(doc.data().participant);
            ids.push(doc.id);
            console.log(users);
          });
        });

      for (var i = 0; i < users.length; i++) {
        console.log(users[i]);
        console.log(ids);
        await db.collection('notifications').add({
          targetUserId: users[i],
          user: this.state.userId,
          eventId: this.state.eventId,
          event: this.state.event,
          date: firebase.firestore.FieldValue.serverTimestamp(),
          notificationStatus: 'unread',
          message: message,
          notificationId: notificationId,
        });
      }
      for (var j = 0; j < ids.length; j++) {
        db.collection('participants').doc(ids[j]).delete();
      }
      db.collection('invites')
        .where('ID', '==', this.state.eventId)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            db.collection('invites').doc(doc.id).delete();
          });
        });
    } catch (error) {
      console.log(error);
    }
    Alert.alert('Event has been deleted');
    this.props.navigation.navigate('Home');
  };
  componentDidMount() {
    this.getOrganiserDetails();
    this.getUserDetails(this.state.userId);
    this.getAttending();
  }

  button() {
    if (
      this.state.organiserId != this.state.userId &&
      this.state.attending == false
    ) {
      return (
        <LinearGradient
          // Button Linear Gradient
          colors={['#FC3973', '#FF7455']}
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}>
          <TouchableOpacity
            onPress={() => {
              this.addNotification();
              this.props.navigation.navigate('UpcomingEvents');
            }}>
            <Text style={styles.buttonText}>I want to attend</Text>
          </TouchableOpacity>
        </LinearGradient>
      );
    } else if (
      this.state.organiserId != this.state.userId &&
      this.state.attending == true
    ) {
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
                  width: '90%',
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
