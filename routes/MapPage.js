import React from 'react';
import { View, TouchableOpacity, Text, BackHandler, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import CreateBar from '../containers/CreateBar';
import Navbar from '../containers/Navbar';

import { graphql, Query } from 'react-apollo';
import { ALERTS_QUERY } from '../graphql'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class MapPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: -20.117843,
      lng: 57.507746
    }
  }
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
    return true
  }
  render() {
    const { lat, lng } = this.state;
    return (
      <View style={{flex: 1}} >
        <Navbar />
        <TouchableOpacity onPress={() => { this.setState({ lat : -20.117843, lng : 57.507746 }) }}>
          <View style={styles.Relocate}>
            <Icon style={styles.MarkerIcon}
              name="location-arrow"
              size={16}
              color="white"
            />
            <Text style={styles.Text}>Find your location</Text>
          </View>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  Relocate: {
    backgroundColor: 'green',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  Text: {
    color: 'white',
    paddingHorizontal: 10
  }
})
