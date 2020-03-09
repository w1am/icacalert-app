import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default class CurrMap extends React.Component {
  state = {
    lat: 0,
    lng: 0
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(p => {
      this.setState({
        lat: p.coords.latitude,
        lng: p.coords.longitude
      })
    })
  }
  render() {
    const { lat, lng } = this.state;
    const { currCity, currLat, currLng } =  this.props;
    return (
      <View style={{flex: 0.5}} pointerEvents='none' >
        <MapView
          style={{flex: 1}} 
          region={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: lat,
              longitude: lng
            }}
            image={require('../assets/pin.png')}
            title='You'
          />
          <Marker
            coordinate={{
              latitude: parseFloat(currLat),
              longitude: parseFloat(currLng)
            }}
            image={require('../assets/pinactive.png')}
            title='Alert'
          />
        </MapView>
      </View>
    )
  }
}
