import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// used to initialize the firebase object
var firebaseConfig = {
    apiKey: "AIzaSyCDLvi1HgoFKx3BV6gBlKLrQtKMECceD3s",
    authDomain: "bremer-final-project-316.firebaseapp.com",
    databaseURL: "https://bremer-final-project-316.firebaseio.com",
    projectId: "bremer-final-project-316",
    storageBucket: "bremer-final-project-316.appspot.com",
    messagingSenderId: "208688672910",
    appId: "1:208688672910:web:8213c4dcf1c902d593d9df",
    measurementId: "G-XR99K8KHTJ"};
firebase.initializeApp(firebaseConfig);

// now the firebase object can be connected to the store
export default firebase;