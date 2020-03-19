import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, Text, TouchableHighlight, TextInput } from 'react-native';
import { Thumbnail, Body, Left, Right, Card, CardItem, Container, Header, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { f, auth, database } from '../configs/config';
import { GiftedChat } from 'react-native-gifted-chat';
// import Fire from '../configs/Fire';

const BLUE = "#428AF8";
const LIGHT_GREY = "#D3D3D3";

export default class Frends extends React.Component {  

  constructor(props){
    super(props);
    this.state={ 
      isFocused:false, 
      messagesList:[], 
      fId:props.route.params.data.userId,
      fPhotoURL:props.route.params.data.photoURL,
      userId: '',
      email : '', 
      name : '', 
      photoURL : '',
      dbRef:database.ref('messages')
    }
  } 

  // user profile
  fetchUserInfo = (userId)=>{
    let that=this;
    database.ref('users').child(userId).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null)
      if(exists) data = snapshot.val(); 
      console.log('data.photoURL', data.photoURL);
      
        that.setState({
          userId: data.userId,
          email : data.email, 
          name : data.name, 
          photoURL :data.photoURL, 
        })
    })
  }

  componentDidMount() {
    let that=this;
    f.auth().onAuthStateChanged(async function(user){
      if(user){
        await that.fetchUserInfo(user.uid);
        await that.state.dbRef.child(user.uid).child(that.state.fId)
        .on('child_added', (value)=>{ 
          // console.log('val->',value.val());
          
          that.setState((prevState)=>{
            return {
              messagesList:[...prevState.messagesList, value.val()]
            }
          })
        })  
        
      }else{
        that.setState({
          loggedin:false
        })
      } 
    })
  }

  onSend(messages = []) {
    
    let msgId = this.state.dbRef.child(this.state.userId).child(this.state.fId).push().key;
    let updates = {};
    let message = { 
      _id:messages[0]._id,
      createdAt:messages[0].createdAt,
      text:messages[0].text,
      user:messages[0].user,
    }
    updates[this.state.userId+'/'+this.state.fId+'/'+msgId]=message;
    updates[this.state.fId+'/'+this.state.userId+'/'+msgId]=message;
    this.state.dbRef.update(updates); 
  }

  render() {
    // console.log('s =>',this.state);
    // console.log('p =>',this.props.route.params.data.photoURL); 
    //this.props.route.params.data.fId, fName, fPhotoURL
    // this.props.userData.uid
    // console.log('pesan --> ', this.state.messagesList);
    
    console.log('pesan ->',this.state.messagesList);
    return (
      <GiftedChat
        messages={this.state.messagesList}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.email,
          name:this.state.name,
          avatar:this.state.photoURL,
        }}
      />
    )
  }
}
