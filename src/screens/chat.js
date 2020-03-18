import 'react-native-gesture-handler';
import React from 'react';
import { AsyncStorage, Alert, TouchableOpacity, SafeAreaView, FlatList, StyleSheet, View, Text, TouchableHighlight, TextInput } from 'react-native';
import { Input, Item, H3, Fab, Thumbnail, Body, Left, Card, CardItem, Container, Header, Content, Footer, FooterTab, Button, Icon, Right } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { f, auth, database } from '../configs/config';
import Modal from 'react-native-modal';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFriend: [],
      user: '',
    };
  }

  getUser = () => {
    f.auth().onAuthStateChanged(async user => { 
      // console.log('email user ->',user.email);
      
      await this.setState({
        user: user.email
      });
      await this.listFriend(); 
    });
  };

  listFriend = () => { 
    let dataUsrs=[];
    database.ref('users').on('child_added', querySnapShot => {
      let data = querySnapShot.val() ? querySnapShot.val() : {};
      // let todoItems = {...data};  
      // console.log('teman -> ',data);
      if (data.email != this.state.user) {
        dataUsrs.push(data)
      }
      
      this.setState({
        dataFriend: dataUsrs,
      });
    });
  };

  gotoChat = data => { 
    this.props.navigation.navigate('Frends', {data});
  };

  componentDidMount = () => {
    this.listFriend();
    this.getUser(); 
  };

  render(){ 

    return (
      <Container>  
        <Content style={{backgroundColor:'#D3D3D3'}}> 
          <Card style={{flex: 1}}> 
          <SafeAreaView style={styles.container}>
            <FlatList
              data={this.state.dataFriend}
              renderItem={({item, index, separators}) => (
                <TouchableHighlight onPress={()=>this.gotoChat(item)}>
                <CardItem>
                  <Left>
                    <Thumbnail source={{uri: item.photoURL}} />
                    <Body>
                      <Text>{item.name}</Text>
                      <Text note>{item.email}</Text>
                    </Body>
                  </Left>
                </CardItem>
                </TouchableHighlight>
              )}
              keyExtractor={item => item.userId} 
            />
          </SafeAreaView>
          </Card> 
          
        </Content>
        <View>
          <Fab
            style={{backgroundColor: '#2196f3'}}
            position="bottomRight"
            onPress={this.toggleModal}>
            <Text>+</Text>
          </Fab>
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={{ flex: 1, backgroundColor: '#fff', padding: 30, borderRadius: 10}}>
            <H3 style={{alignSelf: 'center', marginBottom: 10}}>Add Contact</H3>
            {this.state.modalWarning !== '' && ( <Text note style={{alignSelf: 'center', color: 'red'}}> {this.state.modalWarning} </Text> )}
            
            <Item rounded style={{marginVertical: 20}}>
              <Input
                placeholder="Contact Email"
                style={{padding: 5}}
                onChangeText={text => this.setState({m_contact_email: text})}
              />
            </Item>
            <TouchableOpacity onPress={this.addFriend}>
              <Button
                rounded
                style={{
                  backgroundColor: '#D3D3D3',
                  justifyContent: 'center',
                  marginVertical:10
                }}>
                <Text>Tambah</Text>
              </Button>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleModal}>
              <Button
                rounded
                style={{
                  backgroundColor: '#D3D3D3',
                  justifyContent: 'center',
                }}>
                <Text>Batal</Text>
              </Button>
            </TouchableOpacity>  
          </View>
        </Modal>
        <Footer>
          <FooterTab  style={{backgroundColor:'#ffff'}}>
            <Button active style={{backgroundColor:'#D3D3D3'}}>
              <Text>Chat</Text>
            </Button>
            <Button  onPress={() => this.props.navigation.navigate('Maps')}>
              <Text>Maps</Text>
            </Button>
            <Button  onPress={() => this.props.navigation.navigate('Profile')}>
              <Text>Profile</Text>
            </Button> 
          </FooterTab>
        </Footer>
      </Container> 

      
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
