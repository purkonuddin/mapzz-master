import 'react-native-gesture-handler';
import React from 'react';
import { TouchableOpacity, AsyncStorage, StyleSheet, View, Text, TouchableHighlight, TextInput, Tab, Navigator, Alert } from 'react-native';
import { Thumbnail, Card, CardItem, Container, Header, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { f, auth, database } from './src/configs/config.js';
import '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');
import Maps from './src/screens/maps';
import Frends from './src/screens/frends';
import Chat from './src/screens/chat';
import Profile from './src/screens/profile';
const Stack = createStackNavigator();
const BLUE = "#428AF8";
const LIGHT_GREY = "#D3D3D3";

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      authStep:0,
      pass:'',
      loggedin:false,
      userData:[],
      email:'',
      password:'',
      isFocused:false,
      error:'',
      latitude: '',
      longitude: '',
    } 

    let that=this;
    f.auth().onAuthStateChanged(function(user) {
      if (user) {
        that.setState({ 
          userData:user
        }) 
        that.setState({
          loggedin:true 
        }) 
      }else { 
        that.setState({
          loggedin:false
        })
        console.log('log out');
      }
    })
  }

  getCoordinate = () => {
    navigator.geolocation.getCurrentPosition(
      position => { 
        // console.log('lokasi :',position.coords);
        const {longitude, latitude} = position.coords;  
        this.setState({ 
          latitude: latitude,
          longitude: longitude,
        }); 
      },
      error => console.log(error.message),
      {timeout: 20000, maximumAge: 1000},
    );
  };

  createUserObj = (userObj, email, pass)=>{
    // console.log(userObj, email, userObj.uid)
    let uObj = {
      userId : userObj.uid,
      name:userObj.email.substr(0, userObj.email.indexOf("@")), 
      email:userObj.email,
      emailVerified:false,
      password: pass,
      phoneNumber:userObj.phoneNumber,
      photoURL:'http://www.gravatar.com/avatar', 
      lat:this.state.latitude,
      lng:this.state.longitude,
    };
    database.ref('users').child(userObj.uid).set(uObj); 
  }    

  signup = async()=>{
    await this.getCoordinate();
    let email=this.state.email;
    let pass= this.state.pass;
    if(email !='' && pass != ''){
      try{
        let user = await auth.createUserWithEmailAndPassword(email, pass).then((userObj)=>this.createUserObj(userObj.user, email, pass))
        .catch((error)=>alert(error));
      }catch(error){
        console.log(error)
        alert(error)
      }
    }
    
  }
  
  login = async() =>{
    let email=this.state.email;
    let pass= this.state.pass;
    if(email !='' && pass != ''){
      try{
        let user = await auth.signInWithEmailAndPassword(email, pass);
      }catch(error){
        console.log(error)
        alert(error)
      }
    }
  }

  signUserOut=()=>{
    auth.signOut()
    .then(()=>{console.log('loged out')})
    .catch((error)=>{ 
      console.log('error', error) 
    })
  }

  handleFocus=event=>{
    this.setState({isFocus:true});
    if(this.props.onFocus){
      this.props.onFocus(event)
    }
  }

  handleBlur=event=>{
    this.setState({isFocus:false});
    if(this.props.onBlur){
      this.props.onBlur(event)
    }
  }

  render(){
    // console.log('error : ',this.state.error);
    
    if (this.state.loggedin == true) { 
      return (
          <NavigationContainer onStateChange={state => state} >
            <Stack.Navigator initialRouteName='Profile'>
              <Stack.Screen name="Profile">
                {props => <Profile {...props} userData={this.state.userData}/>}
              </Stack.Screen>
              <Stack.Screen name="Maps">
                {props => <Maps {...props} userData={this.state.userData}/>}
              </Stack.Screen>
              <Stack.Screen name="Frends" options={{ title: 'Chat' }}>
                {props => <Frends {...props} userData={this.state.userData}/>}
              </Stack.Screen>
              <Stack.Screen name="Chat" options={{ title: 'Chat List' }}>
                {props => <Chat {...props} userData={this.state.userData}/>}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        );
    }

    const {isFocused} = this.state;
    const {onFocus, onBlur, ...otherProps} = this.props;
    const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";

    return (
      <View style={{flex:1, alignItems:"center" ,justifyContent:"center"}}>
        <View  style={{flex: 1, alignItems:'center', justifyContent:'center', paddingHorizontal:40, marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
        <Text style={{fontSize:50, paddingVertical:30}}>MapZZ</Text>
        <Thumbnail large size={200} source={{uri: uri}} />
        <Text style={{paddingVertical:30}}>Aplikasi chat dan Maps</Text>
        </View>
        <Text>You are not logged in</Text>
        <Text>Silahkan login untuk menggunakan aplikasi ini</Text>
        {this.state.authStep == 0 ? (
          <View style={{marginVertical:20, flexDirection:'row'}}>
          <TouchableOpacity onPress={()=> this.setState({authStep:1})}>
            <Text style={{fontWeight:'bold', color:'green'}}>Login</Text>
          </TouchableOpacity>
          <Text style={{marginHorizontal:10}}>or</Text>
          <TouchableOpacity onPress={()=> this.setState({authStep:2})}>
            <Text style={{fontWeight:'bold', color:'green'}}>SignUp</Text>
          </TouchableOpacity>
          </View>          
        ):(
          <View style={{marginVertical:20}}>
            {this.state.authStep == 1 ? (
              <View>
                <TouchableOpacity onPress={()=> this.setState({authStep:0})} style={{borderBottomWidth:1, paddingVertical:5, marginBottom:10, borderBottomColor:'black'}}>
				          <Text style={{fontWeight:'bold'}}>... Cancel</Text>
				        </TouchableOpacity>
                <Text style={{fontWeight:'bold', marginBottom:20}}>Login</Text>
                <Text>Email address :</Text>
                <TextInput 
                  editable={true}
                  keyboardType={'email-address'}
                  placeholder={'enter your email address..'}
                  onChangeText={(text)=>this.setState({email:text})}
                  value={this.state.email}
                  style={{width:250, marginVertical:10, padding:5, borderWidth:1, borderColor:'green'}}
                />
                <Text>Password :</Text>
                <TextInput 
                  editable={true}
                  secureTextEntry={true}
                  placeholder={'enter your password..'}
                  onChangeText={(text)=>this.setState({pass:text})}
                  value={this.state.pass}
                  style={{width:250, marginVertical:10, padding:5, borderWidth:1, borderColor:'green'}}
                />
                <TouchableOpacity
                  style={{backgroundColor:'green', paddingVertical:10, paddingHorizontal:20, borderRadius:5}} 
                  onPress={()=>this.login()}
                  >
                  <Text style={{color:'white'}}>Login</Text>
                </TouchableOpacity>
              </View>
            ):(
              <View>
                <TouchableOpacity  onPress={()=> this.setState({authStep:0})} style={{borderBottomWidth:1, paddingVertical:5, marginBottom:10, borderBottomColor:'black'}}>
                  <Text style={{fontWeight:'bold'}}>... Cancel</Text>
                </TouchableOpacity>
                <Text style={{fontWeight:'bold', marginBottom:20}}>Sign Up</Text>
                <Text>Email address :</Text>
                <TextInput 
                  editable={true}
                  keyboardType={'email-address'}
                  placeholder={'enter your email address..'}
                  onChangeText={(text)=>this.setState({email:text})}
                  value={this.state.email}
                  style={{width:250, marginVertical:10, padding:5, borderWidth:1, borderColor:'green'}}
                />
                <Text>Password :</Text>
                <TextInput 
                  editable={true}
                  secureTextEntry={true}
                  placeholder={'enter your password..'}
                  onChangeText={(text)=>this.setState({pass:text})}
                  value={this.state.pass}
                  style={{width:250, marginVertical:10, padding:5, borderWidth:1, borderColor:'green'}}
                />
                <TouchableOpacity
                  style={{backgroundColor:'blue', paddingVertical:10, paddingHorizontal:20, borderRadius:5}} 
                  onPress={()=>this.signup()}
                  >
                  <Text style={{color:'white'}}>SignUp</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      
      </View>
    );
  }
}
