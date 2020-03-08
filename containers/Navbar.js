import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link, Redirect } from 'react-router-native';

export default class Navbar extends React.Component {
  render() {
    return (
      <View style={styles.Layout}>
        <Link component={TouchableOpacity} to='/' >
          <Icon
            style={styles.NavigatorIcon}
            name="arrow-left"
            size={20}
            color="#2A4F98"
          />
        </Link>

        <Link component={TouchableOpacity} to='/map'>
          <Icon
            style={styles.NavigatorIcon}
            name="map-marker"
            size={20}
            color="#2A4F98"
          />
        </Link>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Layout: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  NavigatorIcon: {
    paddingVertical: 10,
    paddingHorizontal: 20
  }
})
