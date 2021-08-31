import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/header";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default class NotificationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allNotifications: [],
      Notifications: [],
      userId: firebase.auth().currentUser.email,
      inviteList: "",
      docID: "",
      item: {},
      check: false,
    };
    this.requestref = null;
    this.inviteref = null;
  }
  getNotifications = () => {
    this.requestRef = db
      .collection("notifications")
      .where("notificationStatus", "==", "unread")
      .where("targetUserId", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification["doc_id"] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications,
        });
      });
  };

  getNotificationDetails = (ID) => {
    console.log(ID);
    db.collection("invites")
      .where("ID", "==", ID)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          console.log("This is data ", data);
          this.setState({
            inviteList: data,
          });
        });
      });
  };

  markAsRead = (id) => {
    console.log(id);
    db.collection("notifications")
      .where("notificationId", "==", id)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("notifications").doc(doc.id).update({
            notificationStatus: "read",
          });
        });
      });
  };

  componentDidMount() {
    this.getNotifications();
  }

  componentDidUpdate() {
    if (this.state.check == true) {
      console.log("invitelist ", this.state.inviteList);
      this.props.navigation.navigate("ExploreEventDetails", {
        details: this.state.inviteList,
      });
    }
  }

  componentWillUnmount() {
    this.notificationRef = null;
    this.inviteref = null;
    console.log("I am not here");
  }

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, I }) => {
    return (
      <View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.markAsRead(item.notificationId);
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.event}</Text>
            <Text>{item.message}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: "white" }}>
        <MyHeader title="Notification"></MyHeader>
        <View style={{ flex: 1 }}>
          {this.state.allNotifications.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  width: 150,
                  height: 200,
                  alignSelf: "center",
                  marginTop: "50%",
                }}
                source={require("../assets/empty.png")}
              ></Image>
              <Text style={{ fontSize: 20 }}>No Notifications</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allNotifications}
              renderItem={this.renderItem}
            ></FlatList>
          )}
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  keyView: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "95%",
    padding: 10,
    margin: 5,
    color: "#f0f0f0",
    marginRight: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 16,
  },
  input: {
    width: "75%",
    height: 30,
    borderBottomWidth: 1.5,
    borderColor: "#ff8a65",
    fontSize: 12,
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 20,
  },
});
