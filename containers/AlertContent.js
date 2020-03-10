import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import Date from './Date';
import Region from './Region';
import CurrMap from './CurrMap';

export default class AlertContent extends React.Component {
  render() {
    const { slicedAlerts, len } = this.props;
    if (alert.length == 0) {
      <ActivityIndicator style={{ padding: 40 }} size="large" color="grey"></ActivityIndicator>
    } else {
      slicedAlerts.map(alert => (
        <View key={alert._id} style={styles.Alert}>
          <View>
            <Icon
              style={styles.MarkerIcon}
              name="map-marker"
              size={20}
              color="#6688FA"
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => { 
                this._panel.show()
                this.setState({
                  currLat: alert.latitude,
                  currLng: alert.longitude,
                  currCity: alert.city,
                  currDate: alert.mdhm,
                })
              } }
            >
              <Region>{alert.city}</Region>
            </TouchableOpacity>
            <Date>{alert.mdhm}</Date>
          </View>
        </View>
      ))

    }
  }
}

const styles = StyleSheet.create({
  Layout: {
    backgroundColor: '#F27E55',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10
  },
  Region: {
    color: 'white',
    fontSize: 16
  },
})
