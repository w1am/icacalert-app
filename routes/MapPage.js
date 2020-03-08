import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import CreateBar from '../containers/CreateBar';

import { graphql } from 'react-apollo';
import { ALERTS_QUERY } from '../graphql'

class MapPage extends React.Component {
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
    const { alerts, loading } = this.props.data;
    const { lat, lng } = this.state;
    return (
      <View style={{flex: 1}} >
        <MapView
          style={{flex: 1}} 
          region={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
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
          {
            loading ? null : alerts.map(a => (
              <Marker
                key={a.id}
                coordinate={{
                  latitude: parseFloat(a.latitude),
                  longitude: parseFloat(a.longitude)
                }}
                image={require('../assets/pinactive.png')}
                title={a.city}
              />
            ))
          }
        </MapView>
        <CreateBar />
      </View>
    )
  }
}

export default graphql(ALERTS_QUERY)(MapPage);

