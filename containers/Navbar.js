import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'react-router-native';

export default class Navbar extends React.Component {
  render() {
    return (
      <View style={styles.Layout}>
        <View style={styles.BackHandler}>
          <Link style={styles.BackBtn} to='/' component={TouchableOpacity}>
            <Icon
              name="chevron-left"
              size={20}
              color="#232323"
            />
            <Text style={styles.BackText}>Home</Text>
          </Link>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Layout: {
    backgroundColor: '#EFF1F4',
    paddingHorizontal: 25,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  NavigatorIcon: {
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  BackHandler: {
    paddingVertical: 20,
    width: 90,
  },
  BackBtn: {
    flexDirection: 'row'
  },
  BackText: {
    fontSize: 19,
    paddingLeft: 15,
    top: -4
  }
})
