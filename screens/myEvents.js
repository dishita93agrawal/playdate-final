import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/header";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class MyUpcomingEvents extends React.Component {
  constructor() {
    super();
    this.state = {
      eventList: [],
      userId: firebase.auth().currentUser.email,
      eventId: [],
    };
    this.eventref = null;
    this.eventref2 = null;
  }
  getMyEvents = async () => {
    var eventId = null;
    this.eventref = await db
      .collection("participants")
      .where("participant", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var list = [];

        snapshot.docs.map((doc) => {
          list.push(doc.data());
        });
        console.log(list);
        this.setState({
          eventList: list,
        });
        console.log(this.state.eventList);
      });
  };

  componentDidMount() {
    this.getMyEvents();
  }
  componentWillUnmount() {
    this.eventref = null;
    this.eventref2 = null;
  }
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("UpcomingEventDetails", {
              details: item,
            });
          }}
          style={styles.flatlist}
        >
          <View style={{ flexDirection: "column" }}>
            <Image
              style={{ width: "50%", height: 100, resizeMode: "contain" }}
              source={{ uri: item.image }}
            ></Image>
            <Text
              style={{
                fontSize: 16,
                alignSelf: "flex-start",
                margin: 10,
                fontWeight: "bold",
              }}
            >
              {item.event}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 16, margin: 10, flex: 0.5 }}>
                {item.address}
              </Text>
              <Text style={{ fontSize: 16, margin: 10, flex: 0.5 }}>
                {item.time}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return (
      <SafeAreaProvider style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1 }}>
          <MyHeader
            title="My Upcoming Events"
            navigation={this.props.navigation}
          ></MyHeader>
          <View style={{ flex: 1 }}>
            {this.state.eventList.length == 0 ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  style={{
                    width: 200,
                    height: 210,
                    alignSelf: "center",
                    marginTop: "50%",
                  }}
                  source={require("../assets/folder.png")}
                ></Image>
                <Text style={{ fontSize: 20 }}>No events</Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.eventList}
                renderItem={this.renderItem}
              />
            )}
          </View>
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
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
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
  flatlist: {
    margin: RFValue(10),
    borderRadius: RFValue(10),
    borderWidth: 2,
    borderColor: "pink",
    padding: RFValue(20),
    flex: 1,
    flexDirection: "column",
  },
  buttonText: {
    color: "black",
    fontSize: 20,
  },
});
