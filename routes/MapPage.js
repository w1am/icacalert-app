import React from 'react';
import { View, Text, BackHandler } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import CreateBar from '../containers/CreateBar';
import Navbar from '../containers/Navbar';

import { graphql } from 'react-apollo';
import { ALERTS_QUERY } from '../graphql'

class MapPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: -20.117843,
      lng: 57.507746
    }
    this.handleBackPress = this.handleBackPress.bind(this)
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    navigator.geolocation.getCurrentPosition(p => {
      this.setState({
        lat: p.coords.latitude,
        lng: p.coords.longitude
      })
    })
  }
  componentWillUnmount() {
    this.backHandler.remove()
  }
  handleBackPress() {
    this.props.history.goBack()
    return true
  }
  render() {
    const { alerts, loading } = this.props.data;
    const { lat, lng } = this.state;
    return (
      <View style={{flex: 1}} >
        <Navbar />
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

