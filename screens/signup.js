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
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/Entypo";

export default class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      firstName: "",
      contact: "",
      pcontact: "",
      pemail: "",
      confirmPassword: "",
      width: 0,
      height: 0,
    };
  }
  signUp = (email, password, confirmPassword) => {
    if (password != confirmPassword) {
      return Alert.alert("Passwords don't match");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("users").add({
            name: this.state.firstName,
            contact: this.state.contact,
            email: this.state.email,
            pEmail: this.state.pemail,
            pContact: this.state.pcontact,
          });
          return Alert.alert("User addded successfully", "", [
            {
              text: "Okay",
              onPress: () => this.props.navigation.navigate("Welcome"),
            },
          ]);
        })
        .catch((error) => {
          var errorcode = error.code;
          var errorM = error.message;
          return alert(errorM);
        });
    }
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <ImageBackground
          source={require("../assets/register.png")}
          style={styles.image}
        >
          <ScrollView style={{ width: "100%" }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
              <View style={styles.profileContainer}>
                <View style={[styles.inputContainer, { marginTop: 100 }]}>
                  <View style={styles.iconStyle}>
                    <AntDesign name={"user"} size={25} color="pink" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={"Name"}
                    onChangeText={(text) => {
                      this.setState({
                        firstName: text,
                      });
                    }}
                    value={this.state.firstName}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.iconStyle}>
                    <MaterialCommunityIcons
                      name={"phone"}
                      size={25}
                      color="pink"
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={"Contact"}
                    maxLength={10}
                    keyboardType={"numeric"}
                    onChangeText={(text) => {
                      this.setState({
                        contact: text,
                      });
                    }}
                    value={this.state.contact}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.iconStyle}>
                    <Entypo name={"mail"} size={25} color="pink" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={"Email Id"}
                    keyboardType={"email-address"}
                    onChangeText={(text) => {
                      this.setState({
                        email: text,
                      });
                    }}
                    value={this.state.email}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.iconStyle}>
                    <MaterialCommunityIcons
                      name={"phone"}
                      size={25}
                      color="pink"
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={"Parent's Contact"}
                    maxLength={10}
                    keyboardType={"numeric"}
                    onChangeText={(text) => {
                      this.setState({
                        pcontact: text,
                      });
                    }}
                    value={this.state.pcontact}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.iconStyle}>
                    <Entypo name={"mail"} size={25} color="pink" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={"Parent's Email"}
                    keyboardType={"email-address"}
                    onChangeText={(text) => {
                      this.setState({
                        pemail: text,
                      });
                    }}
                    value={this.state.pemail}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.iconStyle}>
                    <AntDesign name={"eye"} size={25} color="pink" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={"Password"}
                    secureTextEntry={true}
                    onChangeText={(text) => {
                      this.setState({
                        password: text,
                      });
                    }}
                    value={this.state.password}
                  />
                </View>
                <View style={[styles.inputContainer, { marginBottom: 20 }]}>
                  <View style={styles.iconStyle}>
                    <AntDesign name={"eyeo"} size={25} color="pink" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={"Confirm Password"}
                    secureTextEntry={true}
                    onChangeText={(text) => {
                      this.setState({
                        confirmPassword: text,
                      });
                    }}
                    value={this.state.confirmPassword}
                  />
                </View>
                <View>
                  <LinearGradient
                    // Button Linear Gradient
                    colors={["#FC3973", "#FF7455"]}
                    start={{ x: -1, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button]}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.signUp(
                          this.state.email,
                          this.state.password,
                          this.state.confirmPassword
                        );
                        this.props.navigation.navigate("FirstScreen");
                      }}
                    >
                      <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("FirstScreen")}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 20,
                      marginTop: 10,
                      marginBottom: 20,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
    fontSize: 18,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: "100%",
    height: 50,
    borderColor: "pink",
    borderRadius: 20,
    borderBottomWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
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
    fontSize: 16,
    color: "#333",
  },
  profileContainer: {
    flex: 1,
  },
});
