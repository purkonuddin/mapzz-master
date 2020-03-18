import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native';
import { CardItem, Body, Card, Container, Header, Content, Footer, FooterTab, Button, Icon, Thumbnail, Left, Right } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { f, auth, database } from '../configs/config';
// import {Permissions, ImagePicker} from 'expo';

const BLUE = "#428AF8";
const LIGHT_GREY = "#D3D3D3";

export default class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state={
      loggedin:false,
      userData: props.userData,
      user:[],
      isFocused:false,
      editingProfile:false,
      userId: '',
      email : '',
      emailVerified:'',
      name : '',
      password :'',
      photoURL :'',
      lat:'',
      lng:'',
    }
  }

  // user photo
  // findNewImage=async ()=>{
  //   this._checkPermissions();
    
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes :'Images',
  //     allowsEditing :true,
  //     quality :1
  //   })
  //   console.log(result);
    
  //   if(!result.cancelled){
  //     console.log('upload image');
  //     // This.uploadImage(result.uri);
  //     this.setState({
  //       imageSelected : true,
  //       imageId : this.uniqueId(),
  //       uri : result.uri
  //     })
  //   }else{
  //     console.log('cancel');
  //     this.setState({
  //       imageSelected : false,
  //       //imageId : this.imageId(),
  //       //Uri : result.uri
  //     })
  //   }
  // }
  

  // user profile
  fetchUserInfo = (userId)=>{
    let that=this;
    database.ref('users').child(userId).once('value').then(function(snapshot){
      const exists = (snapshot.val() !== null)
      if(exists) data = snapshot.val(); 
      
        that.setState({
          userId: data.userId,
          email : data.email,
          emailVerified:false,
          name : data.name,
          password :data.password,
          photoURL :data.photoURL,
          lat:data.lat,
          lng:data.lng,
        })
    })
  }

  saveProfile =()=>{
    let name = this.state.name;
    let email = this.state.email;
    database.ref('users/' + this.state.userId)
            .update({
              userId: this.state.userId,
              email : email,
              emailVerified:this.state.emailVerified,
              name : name,
              password :this.state.password,
              photoURL :this.state.photoURL,
              lat:this.state.lat,
              lng:this.state.lng,
            })
    this.setState({editingProfile:false})
  }
  

  editProfile =()=>{
    this.setState({
      editingProfile:true
    })
  }

  signUserOut=()=>{  
      f.auth().signOut();
      alert('logged out');  
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
    let that=this;
    f.auth().onAuthStateChanged(async function(user){
      if(user){
        await that.fetchUserInfo(user.uid)
      }else{
        that.setState({
          loggedin:false
        })
      }
    })
  
  }

  render(){ 
    const uri = this.state.photoURL == '' ? "https://api.adorable.io/avatars/25/test@user.i.png" : this.state.photoURL; 
    const {isFocused} = this.state;
    const {onFocus, onBlur, ...otherProps} = this.props;

    return (
      <Container style={{backgroundColor: LIGHT_GREY}}> 
        <Content> 
            <View style={styles.container}> 
            <Thumbnail large square source={{uri: uri}} />  
            <TouchableHighlight  style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
               <Text> {this.state.name}</Text>
            </TouchableHighlight>
              
            </View>
            <Card> 
              <CardItem style={{backgroundColor:LIGHT_GREY}}>
                <TouchableHighlight onPress={() => this.editProfile()}  style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
                    <Text>edit</Text>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={()=>this.findNewImage()} style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
                    <Text>upload </Text>
                  </TouchableHighlight>
                <TouchableHighlight onPress={() => this.signUserOut()} style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
                <Text>Keluar</Text>
              </TouchableHighlight>
              </CardItem>
            </Card>
            <Card> 
            
            <CardItem header > 
               {this.state.editingProfile == true ? (
                <View>
                  <Text>Name:</Text>
                  <TextInput
                    editable={true}
                    placeholder={'enter yout name'}
                    onChangeText={(text)=>this.setState({name:text})}
                    value={this.state.name}
                    style={{width:250, marginVertical:10, padding:5, borderColor:'grey', borderWidth:1}}
                  /> 
                  <Text>Email:</Text>
                  <TextInput
                    editable={true} 
                    keyboardType={'email-address'} 
                    placeholder={'enter yout email'}
                    onChangeText={(text)=>this.setState({email:text})}
                    value={this.state.email}
                    style={{width:250, marginVertical:10, padding:5, borderColor:'grey', borderWidth:1}}
                  /> 
                  <Text>Password:</Text>
                  <TextInput
                    editable={true}
                    secureTextEntry={true}
                    placeholder={'enter yout password'}
                    onChangeText={(text)=>this.setState({password:text})}
                    value={this.state.password}
                    style={{width:250, marginVertical:10, padding:5, borderColor:'grey', borderWidth:1}}
                  /> 
                  <View style={{marginVertical:20, flexDirection:'row'}}>
                  <TouchableOpacity onPress={()=>this.saveProfile()}>
                    <Text style={{fontWeight:'bold', color:'green'}}>Save</Text>
                  </TouchableOpacity>
                  <Text style={{marginHorizontal:10}}>|</Text>
                  <TouchableOpacity onPress={()=>this.setState({editingProfile:false})}>
                    <Text style={{fontWeight:'bold', color:'green'}}>Cancel</Text>
                  </TouchableOpacity>
                  </View>   
                </View>
				        ):(
                  <View>
                    <Body>
                      <Text>Email :</Text><TextInput editable={false} onBlur={this.handleBlur} onFocus={this.handleFocus} underlineColorAndroid={isFocused? BLUE : LIGHT_GREY} placeholder="email" selectionColor={BLUE} style={{paddingLeft:6, height:40}} {...otherProps} onChangeText={(text)=>this.setState({email:text})} value={this.state.email}/>
                      <Text>Display Name :</Text><TextInput  editable={false}  onBlur={this.handleBlur} onFocus={this.handleFocus} underlineColorAndroid={isFocused? BLUE : LIGHT_GREY} placeholder="nama" selectionColor={BLUE} style={{paddingLeft:6, height:40}} {...otherProps} onChangeText={(text)=>this.setState({displayname:text})} value={this.state.name}/>
                      <Text>Password :</Text><TextInput editable={false} secureTextEntry onBlur={this.handleBlur} onFocus={this.handleFocus} underlineColorAndroid={isFocused? BLUE : LIGHT_GREY} placeholder="********" selectionColor={BLUE} style={{paddingLeft:6, height:40}} {...otherProps} onChangeText={(text)=>this.setState({pass:text})} value={this.state.regpass}/>
                      
                    </Body>
                  </View>
                )}
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
