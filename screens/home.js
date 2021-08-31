import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/header";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      inviteList: [],
      userId: firebase.auth().currentUser.email,
      name: "",
      number: 1,
    };
    this.requestref = null;
  }
  getRequestedBooks = () => {
    this.requestref = db
      .collection("invites")
      .where("status", "==", "open")
      .onSnapshot((snapshot) => {
        var requestList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          inviteList: requestList,
        });
      });
    db.collection("users")
      .where("email", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            name: doc.data().name,
          });
        });
      });
  };
  componentDidMount() {
    this.getRequestedBooks();
  }
  componentWillUnmount() {
    this.requestref = null;
  }
  render() {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/header.jpg")}
            style={styles.image}
          >
            <View
              style={{
                flex: 0.18,
              }}
            >
              <Text
                style={[
                  styles.headerText,
                  {
                    marginTop: 20,
                  },
                ]}
              >
                {" "}
                Hello, {this.state.name}
              </Text>
              <Text style={styles.headerText}> Browse Events at Playdate</Text>
            </View>
            <View
              style={{
                flex: 0.82,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,

                backgroundColor: "#fff",
              }}
            >
              <Text style={{ fontSize: 20 }}> </Text>
              {this.state.inviteList.length == 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16 }}> Loading</Text>
                </View>
              ) : (
                <FlatList
                  data={this.state.inviteList}
                  renderItem={({ item }) => (
                    <View style={styles.container}>
                      <View style={styles.cardContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate(
                              "ExploreEventDetails",
                              {
                                details: item,
                              }
                            );
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <Image
                              source={{
                                uri: item.image,
                              }}
                              style={styles.img}
                            />
                            <View
                              style={{
                                flexDirection: "column",
                              }}
                            >
                              <Text
                                style={[styles.input, { fontWeight: "bold" }]}
                              >
                                {item.invite}
                              </Text>
                              <Text style={styles.input}>{item.time}</Text>
                              <Text style={styles.input}>{item.city}</Text>
                              <Text style={styles.input}>
                                Participants: {item.participants}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
          </ImageBackground>
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
    width: "75%",
    height: "30%",
    padding: 10,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#15193c",
  },
  cardContainer: {
    margin: RFValue(5),
    borderRadius: RFValue(10),
    padding: RFValue(10),
    flex: 1,
    borderWidth: 2,
    borderColor: "pink",
    flexDirection: "column",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerText: {
    marginLeft: 10,
    fontSize: 22,
    color: "white",
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    marginTop: 10,
    color: "black",
  },
  input: {
    fontSize: 16,
    padding: 5,
  },
  img: {
    width: "50%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: RFValue(10),
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
});
