import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';

export default class CreateBar extends React.Component {
  render() {
    return (
      <Link style={styles.Layout} to='/alert' component={TouchableOpacity}>
        <Text style={styles.BeforePress}>Send Alert</Text>
      </Link>
    )
  }
}

const styles = StyleSheet.create({
  Layout: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 50,
    },
    shadowOpacity: 0.1,
    shadowRadius: 30.00,
    elevation: 50,
  },
  BeforePress: {
    textAlign: 'center',
    color: '#1871BB',
    fontWeight: 'bold',
    paddingVertical: 22
  }
})
