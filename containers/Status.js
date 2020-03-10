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
                <View style={styles.TendencyCard}>
                  <Text style={styles.Tendency}>LOW</Text>
                  <Text style={styles.MiniText}>Tendency</Text>
                </View>
              </View>
            );
            const { getAlerts } = data;
            return (
              <View style={styles.Layout}>
                <View style={styles.Card}>
                  <Text style={styles.Label}>Tendency</Text>
                  <Text style={styles.Tendency}>{getAlerts.tendency.toUpperCase()}</Text>
                </View>
                <View style={styles.Card}>
                  <Text style={styles.Label}>Count</Text>
                  <Text style={styles.Count}>{getAlerts.alerts ? getAlerts.alerts.length : 0}</Text>
                </View>
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
    flexDirection: 'row',
    marginVertical: 25,
    backgroundColor: '#3694B4',
    paddingVertical: 20,
    borderRadius: 10
  },
  MiniText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    paddingTop: 10
  },
  Card: {
    paddingHorizontal: 50,
    paddingBottom: 10,
  },
  Label: {
    color: 'white'
  },
  Tendency: {
    fontSize: 30,
    color: 'white',
  },
  Count: {
    fontSize: 30,
    color: 'white',
  }
})
