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
import * as ImagePicker from "expo-image-picker";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/Entypo";
export default class PreProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      inviteList: [],
      userId: firebase.auth().currentUser.email,
      image: "#",
      number: 1,
      name: "",
      docId: "",
    };
    this.requestref = null;
  }
  getUserProfile = () => {
    db.collection("users")
      .where("email", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  };
  componentDidMount() {
    this.getUserProfile();
  }
  componentWillUnmount() {
    this.requestref = null;
  }
  something() {
    this.props.navigation.navigate("Settings");
    console.log("pressed");
  }
  updateimg = () => {
    db.collection("users").doc(this.state.docID).update({
      image: this.state.image,
    });
    console.log("Updated");
  };
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
                flex: 0.3,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Avatar
                rounded
                source={{ uri: this.state.image }}
                size="medium"
                containerStyle={styles.imageContainer}
              ></Avatar>
              <View
                style={{
                  flexDirection: "column",
                  marginLeft: 10,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    paddingTop: 10,
                    color: "white",
                  }}
                >
                  {this.state.name}
                </Text>
                <Text style={{ fontSize: 16, color: "white" }}>
                  {this.state.userId}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                flex: 0.7,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <AntDesign name={"profile"} size={24} color="pink" />
                <TouchableOpacity
                  onPress={() => this.something()}
                  style={{
                    width: "80%",
                    marginLeft: 20,
                    borderWidth: 2,
                    borderColor: "white",
                    justifyContent: "center",
                    borderBottomColor: "pink",
                    padding: 10,
                  }}
                >
                  <Text style={{ textAlign: "left" }}> Update Profile </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <AntDesign name={"logout"} size={24} color="pink" />
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("FirstScreen");
                    firebase.auth().signOut();
                  }}
                  style={{
                    width: "80%",
                    marginLeft: 20,
                    borderWidth: 2,
                    borderColor: "white",
                    justifyContent: "center",
                    borderBottomColor: "pink",
                    padding: 10,
                  }}
                >
                  <Text style={{ textAlign: "left" }}> Logout </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 0.75,
    width: 70,
    height: 70,
    marginLeft: 20,
    marginTop: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
});
