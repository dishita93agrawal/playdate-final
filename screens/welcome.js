import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
} from "react-native";
import { Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";
import db from "../config";
import { LinearGradient } from "expo-linear-gradient";

import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "something@gmail.com",
      password: "123456",
      address: "",
      firstName: "",
      lastName: "",
      contact: "",
    };
  }
  login = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate("Home");
      })
      .catch((error) => {
        var errorcode = error.code;
        var errorM = error.message;
        return alert(errorM);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/welcomebg.png")}
          style={styles.image}
        >
          <KeyboardAvoidingView style={{ justifyContent: "flex-end" }}>
            <View style={styles.profileContainer}>
              <View style={[styles.inputContainer, { marginTop: "85%" }]}>
                <View style={styles.iconStyle}>
                  <Entypo name={"mail"} size={25} color="pink" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  onChangeText={(text) => {
                    this.setState({ email: text });
                  }}
                  value={this.state.email}
                />
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.iconStyle}>
                  <AntDesign name={"eye"} size={25} color="pink" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="password"
                  placeholderTextColor="grey"
                  secureTextEntry={true}
                  onChangeText={(text) => {
                    this.setState({
                      password: text,
                    });
                  }}
                  value={this.state.password}
                />
              </View>

              <LinearGradient
                // Button Linear Gradient
                colors={["#FC3973", "#FF7455"]}
                start={{ x: -1, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, { marginBottom: 10, marginTop: 30 }]}
              >
                <TouchableOpacity
                  style={{
                    width: 300,
                    height: 50,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    this.login(this.state.email, this.state.password);
                  }}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity
                style={{
                  width: 300,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 16,
                  marginBottom: 20,
                  marginTop: 5,
                }}
                onPress={() => {
                  this.props.navigation.navigate("Signup");
                }}
              >
                <Text style={{ fontSize: 18, color: "black" }}>
                  Not a user? Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    paddingBottom: 40,
    color: "blue",
  },
  loginBox: {
    width: 300,
    height: 40,
    borderBottomWidth: 1.5,
    borderColor: "grey",
    fontSize: 20,
    margin: 10,
    paddingLeft: 10,
  },
  button: {
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FC3973",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: "90%",
    height: 50,
    borderColor: "grey",
    borderRadius: 20,
    borderBottomWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },
  iconStyle: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRightColor: "pink",
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 5,
    flex: 1,
    fontSize: 18,
    color: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
});
