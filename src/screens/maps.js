import 'react-native-gesture-handler';
import React from 'react';
import { Alert, StyleSheet, View, Text, TouchableHighlight, TextInput } from 'react-native';
import { Container, Header, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { f, auth, database } from '../configs/config';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'; 
import '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:'',
      friendsLocation:[],
      curentPosition: {
        latitude: -6.3919103,
        longitude: 106.8266298,
        latitudeDelta: 0,
        longitudeDelta: 0.05,
      },
      mapRegion: null,
      latitude: -6.3919103,
      longitude: 106.8266298
    };
  }

  onRegionChange(region, latitude, longitude) {
      this.setState({
        mapRegion: region,
        // If there are no new values set the current ones
        latitude: latitude || this.state.latitude,
        longitude: longitude || this.state.longitude
    });
  }

  getCoordinate = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        // Alert.alert(position)
        // console.log('lokasi :',position.coords);
        const {longitude, latitude} = position.coords;
        let data = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0,
          longitudeDelta: 0.05,
        };
        console.warn(data);
        this.setState({
          curentPosition: data,
          mapRegion:data
        });
        // console.warn(longitude, latitude);
      },
      error => console.log(error.message),
      {timeout: 20000, maximumAge: 1000},
    );
  };

  // get fiends location
  getFriendLocation=()=>{
    let friends =[]
    database.ref('users').on('child_added', result=>{
      let data = result.val() ? result.val() : {};
      // let todoItems = {...data};  
      // console.log('teman -> ',data);
      if (data.email != this.state.user) {
        friends.push(data)
      }
      
      this.setState({
        friendsLocation: friends,
      });
    })
  }

  getUser = () => {
    f.auth().onAuthStateChanged(async user => { 
      console.log('email user ->',user.email);
      
      await this.setState({
        user: user.email
      }); 
      await this.getFriendLocation()
    });
  };

  componentDidMount = () => {
    // this.getFriendLocation();
    this.getCoordinate();
    this.getUser(); 
  };

  render(){
    // console.log('friendsLocation ->', this.state.friendsLocation);
    
    const data = this.state.curentPosition;
    const mapStyle = [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#181818"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#1b1b1b"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#2c2c2c"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8a8a8a"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#373737"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#3c3c3c"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#4e4e4e"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3d3d3d"
          }
        ]
      }
    ]
    return ( 
      <Container>
      
        <View style={{flex:1, width:'100%', height:'100%', backgroundColor:'red'}}>
          <MapView style={styles.map}
          customMapStyle = {mapStyle} 
          region={this.state.mapRegion}
          onRegionChange={(regions) => {
              // this.setState({
              //   mapRegion: regions
              // });
            }}
          onPress={(e) => {
            const region = {
                 latitude: e.nativeEvent.coordinate.latitude,
                 longitude: e.nativeEvent.coordinate.longitude,
                 latitudeDelta: 0.00922 * 1.5,
                 longitudeDelta: 0.00421 * 1.5
               }
            this.onRegionChange(region, region.latitude, region.longitude);
          }}
          showsUserLocation
          >
          {this.state.friendsLocation.length > 0 ? (
            <>
            {this.state.friendsLocation.map((friends, index) => {
              
              return (
                <MapView.Marker
                  key={index}
                  coordinate={{
                    latitude: friends.lat,
                    longitude: friends.lng
                  }}
                  title={friends.email}
                  description={friends.lat + ', '+ friends.lng}
                />
              )}) 
            }
            </>
          ): null 
          }
           
        </MapView>
        <GooglePlacesAutocomplete 
            placeholder='Enter Location'
            minLength={2}
            autoFocus={false}
            fetchDetails
            listViewDisplayed='auto'
            query={{
                key: 'AIzaSyA57OyrCvXWB-xOLBAHRLU3s5cExPpXwcA',
                language: 'en',
                types: 'geocode',
            }}
            currentLocation={false} 
            onPress={(data, details = null) => {
              const region = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.00922 * 1.5,
                longitudeDelta: 0.00421 * 1.5
              };
              this.onRegionChange(region, region.latitude, region.longitude);
            }}
            />
      </View>
      <Footer>
          <FooterTab  style={{backgroundColor:'#ffff'}}>
          <Button  onPress={() => this.props.navigation.navigate('Chat')}>
              <Text>Chat</Text>
            </Button>
            <Button active style={{backgroundColor:'#D3D3D3'}}>
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