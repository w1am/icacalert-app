import React from 'react';
import {View, Text, StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { normalizeDistrictName } from '../utils/districtNameFormatter';

import { graphql, Query } from 'react-apollo';
import { DISTRICT_ALERTS_QUERY } from '../graphql'

export default class Status extends React.Component {
  state = {
    hasError: false,
    tendency: '',
    count: 0,
    dname: 'pamplemousses'
  }
  async componentDidMount() {
    this.setState({
      dname: await AsyncStorage.getItem('dname')
    })
  }
  render() {
    const { dname } = this.state;
    return (
      <Query query={DISTRICT_ALERTS_QUERY} variables={{ dname }}>
        {
          ({loading, data}) => {
            if (loading) return (
              <View style={styles.Layout}>
                  <ActivityIndicator size="small" color="white"></ActivityIndicator>
              </View>
            );
            const { getAlerts } = data;
            return (
              <View style={styles.Layout}>
                <Text style={styles.Tendency}>{getAlerts.tendency.toUpperCase()}</Text>
                <Text style={styles.Count}>{getAlerts.alerts ? getAlerts.alerts.length : 0}</Text>
              </View>
            )
          }
        }
      </Query>
    )
  }
}

const styles = StyleSheet.create({
  Layout: {
    backgroundColor: '#003087',
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignContent: 'space-around',
    justifyContent: 'center',
    borderRadius: 20,
    marginVertical: 25,
  },
  Tendency: {
    fontSize: 30,
    color: 'white',
    paddingHorizontal: 50,
  },
  Count: {
    fontSize: 30,
    color: 'white',
    paddingHorizontal: 50
  }
})
