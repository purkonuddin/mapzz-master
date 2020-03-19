import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, ToastAndroid, StyleSheet, View, Text, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native';
import { CardItem, Body, Card, Container, Header, Content, Footer, FooterTab, Button, Icon, Thumbnail, Left, Right } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { f, auth, database, storage } from '../configs/config';
// import {Permissions, ImagePicker} from 'expo';
import ImagePicker from 'react-native-image-picker';

const BLUE = "#428AF8";
const LIGHT_GREY = "#D3D3D3";

export default class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state={
      loggedin:false,
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
      setImage:'',
      imageSelected:false,
      imageId:'',
      currentFileType: '',
      uploading:false,
      progress:0,
    }
  }

  // photoURL edit
  picker = async () => {
    const options = {
      title: 'Select Image',
      takePhotoButtonTitle: 'Take photo from camera',
      chooseFromLibraryButtonTitle: 'Choose photo from gallery',
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response.uri);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({
          imageSelected : false, 
        })
    
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(
          response.type,
        )
      ) {
        ToastAndroid.show('File is not image !', ToastAndroid.SHORT);
      } else if (response.fileSize > 5000000) {
        ToastAndroid.show('Maximum image size is 5MB !', ToastAndroid.SHORT);
      } else {
        console.log(response); 
        
        this.setState({
          imageSelected : true,
          imageId : this.uniqueId(),
          setImage:response,
          photoURL:response.uri,
        })
        this.uploadImage(response.uri);
      }
    });
  };

  uploadImage = async(uri)=>{
    let that = this;
    let userId = f.auth().currentUser.uid;
    let imageId = userId;
    
    let re = /(?:\.([^.]+))?$/;
    let ext = re.exec(uri)[1];
    this.setState({
      currentFileType: ext,
      uploading : true
    })

    // console.log('data upload->',userId, imageId, ext,);
    const response = await fetch(uri);
    // console.log(response);
    const blob = await response.blob();
    // console.log(blob);
    let filePath = imageId+'.'+that.state.currentFileType;
    // console.log(filePath);
    let uploadTask = storage.ref('user/'+userId+'/img').child(filePath).put(blob);
    // console.log('uploadTask ->',uploadTask);
    uploadTask.on('state_changed', function(snapshot){
      // console.log('snapshot.bytesTransfered =>', snapshot.bytesTransferred);
      // console.log('snapshot.totalBytes =>', snapshot.totalBytes);
      
      // console.log((snapshot.bytesTransfered / snapshot.totalBytes) * 100);
      
      const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      // console.log('upload is'+ progress +'% complete');
      that.setState({
        progress:progress,
      });
    }, function(error){
      console.log('error with upload - '+ error)
    }, function(){
      that.setState({
        progress:100,
        photoURL: uri,
      })
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){ 
        that.processUpload(downloadURL) // process upload
      })
    })  
  }

  processUpload=(downloadURL)=>{  
    // process here...
    // //set needed info
    let userId = f.auth().currentUser.uid; 
    
    //update databse
    database.ref('/users/'+userId).child('photoURL').set(downloadURL) 

    this.setState({
      uploading:false,
      imageSelected:false, 
      photoURL: downloadURL,
    })

    alert('Image uploaded');
  }
  

  uniqueId=()=>{
    return this.s4()+this.s4()+'-'+this.s4()+'-'+this.s4()+'-'+this.s4()+'-'+this.s4()+'-'+this.s4()+'-'+this.s4();
  }
  
  s4 = () =>{
    return Math.floor((1+Math.random()*0*10000)).toString(16);
  }

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
            {this.state.imageSelected == true ? (
            <View> 
              { this.state.uploading == true ? ( 
                <>
                <Text>upload {this.state.progress}%</Text>
                <View>
                  { this.state.progress != 100 ? (
                    <ActivityIndicator size='small' color='blue' />
                  ):(
                    <Text></Text>
                  )} 
                </View>
                </>
              ):(
                <View>
                <Text></Text>
                </View>
              )}
            </View> 
            ):( 
              <View>
                 <Text></Text>
              </View>
            )}
            <Card> 
              <CardItem style={{backgroundColor:LIGHT_GREY}}>
                <TouchableHighlight onPress={() => this.editProfile()}  style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
                    <Text>edit</Text>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={() => this.picker()} activeOpacity={1} style={{marginTop:10, marginHorizontal:40, paddingVertical:15, borderRadius:20, borderColor: 'grey'}}>
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
