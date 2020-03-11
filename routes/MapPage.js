import React from 'react';
import { View, BackHandler } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import CreateBar from '../containers/CreateBar';
import Navbar from '../containers/Navbar';

import { graphql, Query } from 'react-apollo';
import { ALERTS_QUERY } from '../graphql'

export default class MapPage extends React.Component {
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    navigator.geolocation.getCurrentPosition(p => {
      this.setState({
        lat: p.coords.latitude,
        lng: p.coords.longitude
      })
    })
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.backHandler.remove()
  }
  handleBackPress = () => {
    this.props.history.push('/')
    // this.props.history.goBack()
    return true
  }
  render() {
    const lat = -20.117843
    const lng = 57.507746
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
          <Query pollingInterval={500} query={ALERTS_QUERY}>
            {
              ({ loading, data, startPolling, stopPolling }) => {
                if (loading) return null;
                console.log(data);
                const { alerts } = data;
                return alerts.map(a => (
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
            }
          </Query>
        </MapView>
        <CreateBar />
      </View>
    )
  }
}
