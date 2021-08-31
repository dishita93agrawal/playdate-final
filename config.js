import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDcZxTHwuHoNEGxxdQcPzRDSlM5mQX-WSM",
    authDomain: "playdate-9d914.firebaseapp.com",
    databaseURL: "https://playdate-9d914.firebaseio.com",
    projectId: "playdate-9d914",
    storageBucket: "playdate-9d914.appspot.com",
    messagingSenderId: "279518946642",
    appId: "1:279518946642:web:fefa16cf9ad4929b65468b"
  };
  // Initialize Firebase
  
 firebase.initializeApp(firebaseConfig) 
  export default firebase.firestore()