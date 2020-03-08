import React from 'react';
import {View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default class MarkerPoint extends React.Component {
  render() {
    const { alerts } = this.props;
    return (
      alerts.map(a => {
        <Marker
          key={a._id}
          image={require('../assets/pinactive.png')}
          coordinate={{ 
            latitude: parseInt(a.latitude),
            longitude: parseInt(a.longitude)
          }}
          title='prick'
        /> 
      })
    )
  }
}
