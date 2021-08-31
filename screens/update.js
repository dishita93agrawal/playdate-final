import * as React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/header";
import {
  Card,
  Header,
  Icon,
  ThemeConsumer,
  Avatar,
} from "react-native-elements";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      email: firebase.auth().currentUser.email,
      name: "",
      contact: "",
      docID: "",
      image: "#",
    };
  }
  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.setState({ image: uri });
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
      console.log("upload successful");
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };
  getUserDetails = () => {
    console.log("get user details");
    var email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data());
          var data = doc.data();
          this.setState({
            email: data.email,
            name: data.name,
            contact: data.contact,
            pemail: data.pemail,
            image: data.image,
            pcontact: data.pcontact,
            docID: doc.id,
          });
        });
      });
  };
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }
  updateDetails = async (uri) => {
    this.uploadImage(this.state.image, this.state.email);
    await db.collection("users").doc(this.state.docID).update({
      name: this.state.name,
      image: this.state.image,
      contact: this.state.contact,
      pemail: this.state.pemail,
      pcontact: this.state.pcontact,
    });
    Alert.alert("Profile Updated");
    alert("Profile updated");
  };
  componentDidMount() {
    this.getUserDetails();
  }
  render() {
    return (
      <SafeAreaProvider>
        <Header
          leftComponent={
            <Icon
              name="arrow-left"
              type="feather"
              color="#ffffff"
              onPress={() => this.props.navigation.goBack()}
            ></Icon>
          }
          centerComponent={{
            text: "Profile Settings",
            style: { color: "white", fontSize: 20 },
          }}
          backgroundColor="#FC3973"
        ></Header>
        <ScrollView style={{ width: "100%", backgroundColor: "white" }}>
          <KeyboardAvoidingView>
            <Avatar
              rounded
              source={{ uri: this.state.image }}
              size="xlarge"
              onPress={() => this.selectPicture()}
              containerStyle={styles.imageContainer}
            ></Avatar>
            <TextInput
              style={styles.textinput}
              placeholder={"first name"}
              onChangeText={(text) => {
                this.setState({
                  name: text,
                });
              }}
              value={this.state.name}
            ></TextInput>
            <TextInput
              style={styles.textinput}
              placeholder={"contact"}
              maxLength={10}
              keyboardType={"numeric"}
              onChangeText={(text) => {
                this.setState({
                  contact: text,
                });
              }}
              value={this.state.contact}
            ></TextInput>
            <TextInput
              style={styles.textinput}
              placeholder={"parent's email"}
              onChangeText={(text) => {
                this.setState({
                  pemail: text,
                });
              }}
              value={this.state.pemail}
            ></TextInput>
            <TextInput
              style={styles.textinput}
              placeholder={"parent's contact"}
              maxLength={10}
              keyboardType={"numeric"}
              onChangeText={(text) => {
                this.setState({
                  pcontact: text,
                });
              }}
              value={this.state.pcontact}
            ></TextInput>

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
                  this.updateDetails(this.state.image);
                }}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </LinearGradient>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8be85",
  },
  buttonText: {
    color: "black",
    fontSize: 20,
  },
  button: {
    width: 300,
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
  textinput: {
    marginTop: 5,
    marginBottom: 10,
    width: "90%",
    height: 50,
    borderColor: "pink",
    borderRadius: 20,
    borderBottomWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    padding: 10,
  },
  register: {
    justifyContent: "center",
    alignItems: "center",
    color: "#ff5722",
    fontSize: 15,
    fontWeight: "bold",
  },
  cancel: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 30,
    marginTop: 5,
  },
  imageContainer: {
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});
