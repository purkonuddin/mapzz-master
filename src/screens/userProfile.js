import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight, TextInput } from 'react-native';
import { CardItem, Body, Card, Container, Header, Content, Footer, FooterTab, Button, Icon, Thumbnail } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { f, auth, database } from '../configs/config';

const BLUE = "#428AF8";
const LIGHT_GREY = "#D3D3D3";

export default class UserProfile extends React.Component {
  constructor(props){
    super(props);
    this.state={
      userData: props.userData,
      user:[],
      isFocused:false
    }
  }

  dataUser=async()=>{
    // console.log('users yyy :',database.ref("users/"+this.props.userData.uid).once("value"));
    
    var ref = await database.ref("users/"+this.props.userData.uid);
    ref.once("value").then((snapshot)=>{
      console.log('user.xxx :', snapshot);
      this.setState({
        user:snapshot

      })
    }) 

    console.log('user zzz:',ref.once("value"));
    
  }

  signUserOut=()=>{  
    auth.signOut()
    .then(()=>{console.log('loged out')})
    .catch((error)=>{console.log('logout error', error)})
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

  componentDidMount=()=>{
    this.dataUser();
  }

  render(){ 
    const uri = "https://api.adorable.io/avatars/25/test@user.i.png"; 
    const {isFocused} = this.state;
    const {onFocus, onBlur, ...otherProps} = this.props;

    return (
      <Container style={{backgroundColor: LIGHT_GREY}}> 
        <Content> 
            <View style={styles.container}> 
            <Thumbnail large square source={{uri: uri}} />  
            <TouchableHighlight  style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
               <Text> {this.props.userData.uid}</Text>
            </TouchableHighlight>
              
            </View>
            <Card> 
              <CardItem style={{backgroundColor:LIGHT_GREY}}>
                <TouchableHighlight style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
                    <Text>Update</Text>
                  </TouchableHighlight>
                  <TouchableHighlight style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
                    <Text>upload </Text>
                  </TouchableHighlight>
                <TouchableHighlight onPress={() => this.signUserOut()} style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
                <Text>Keluar</Text>
              </TouchableHighlight>
              </CardItem>
            </Card>
            <Card> 
            
            <CardItem header >
               <Text>User Profile</Text>
               
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>Email :</Text><TextInput onBlur={this.handleBlur} onFocus={this.handleFocus} underlineColorAndroid={isFocused? BLUE : LIGHT_GREY} placeholder="email" selectionColor={BLUE} style={{paddingLeft:6, height:40}} {...otherProps} onChangeText={(text)=>this.setState({regemail:text})} value={this.state.userData.email}/>
                <Text>Display Name :</Text><TextInput onBlur={this.handleBlur} onFocus={this.handleFocus} underlineColorAndroid={isFocused? BLUE : LIGHT_GREY} placeholder="nama" selectionColor={BLUE} style={{paddingLeft:6, height:40}} {...otherProps} onChangeText={(text)=>this.setState({regdisplayname:text})} value={this.state.userData.displayName}/>
                <Text>phone Number :</Text><TextInput onBlur={this.handleBlur} onFocus={this.handleFocus} underlineColorAndroid={isFocused? BLUE : LIGHT_GREY} placeholder="number" selectionColor={BLUE} style={{paddingLeft:6, height:40}} {...otherProps} onChangeText={(text)=>this.setState({regphonenumber:text})} value={this.state.userData.phoneNumber}/>
                <Text>Password :</Text><TextInput  secureTextEntry onBlur={this.handleBlur} onFocus={this.handleFocus} underlineColorAndroid={isFocused? BLUE : LIGHT_GREY} placeholder="********" selectionColor={BLUE} style={{paddingLeft:6, height:40}} {...otherProps} onChangeText={(text)=>this.setState({regpass:text})} value={this.state.regpass}/>
                
              </Body>
            </CardItem>
            <CardItem footer>
              
              
            </CardItem>
          </Card>
        </Content>
        <Footer>
          <FooterTab style={{backgroundColor:'#ffff'}}>
            <Button onPress={() => this.props.navigation.navigate('Chat')}>
              <Text>Chat</Text>
            </Button>
            <Button  onPress={() => this.props.navigation.navigate('Maps')}>
              <Text>Maps</Text>
            </Button>
            <Button active style={{backgroundColor:LIGHT_GREY}}>
              <Text>Profile</Text>
            </Button> 
          </FooterTab>
        </Footer>
      </Container> 
    )
  }

}

const styles=StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    marginTop: 50,
    justifyContent:'center',
    backgroundColor: LIGHT_GREY
  }
})
