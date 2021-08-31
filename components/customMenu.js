import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import firebase from 'firebase';
import {Avatar, Icon} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

export default class CustomMenu extends React.Component{
    constructor(){
        super();
        this.state={
            userId: firebase.auth().currentUser.email,
            image: '#',
            name: '',
            docId: ''
        }
    }
    render(){
        return(
            <View style = {styles.container}>
                <View style = {styles.drawercont}>
                    <DrawerItems {...this.props}></DrawerItems>
                </View>
                <View style = {styles.logoutcontainer}>
                    <TouchableOpacity style = {styles.logoutButton} onPress = {()=>{
                        this.props.navigation.navigate('FirstScreen')
                        firebase.auth().signOut()
                    }}>
                        <Icon name = "logout" type = 'antdesign' iconStyle = {{paddingLeft: RFValue(10)}}></Icon>
                        <Text style = {styles.logouttext}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    drawercont: {
        flex: 0.8
    },
    logoutcontainer: {
        flex: 0.2,
        justifyContent: 'flex-end',
        paddingBottom: 30,
    },
    logoutButton: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        padding: 10
    },
    logouttext:{
        fontSize: 30,
        fontWeight: 'bold'
    },
    imageContainer: {
        flex: 0.75,
        width: '40%',
        height: '20%',
        marginLeft: 20,
        marginTop: 30,
        borderRadius: 40
    }
})