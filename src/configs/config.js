import firebase from 'firebase';
// API details
const firebaseConfig = {
  apiKey: "AIzaSyBRLP8-K0eWmPSv-P-aoutK28oezMJRmq4",
  authDomain: "mapschat-30b63.firebaseapp.com",
  databaseURL: "https://mapschat-30b63.firebaseio.com",
  projectId: "mapschat-30b63",
  storageBucket: "mapschat-30b63.appspot.com",
  messagingSenderId: "300246738427",
  appId: "1:300246738427:web:36d886a7ca2a59d5d2975e",
  measurementId: "G-14KH6518MV"
};

firebase.initializeApp(firebaseConfig);

export const f=firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
