import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';

export default class CreateBar extends React.Component {
  render() {
    const { onPress } = this.props;
    return (
      <Link style={styles.Layout} to='/alert' component={TouchableOpacity}>
        <Text style={styles.BeforePress}>Send Alert</Text>
      </Link>
    )
  }
}

const styles = StyleSheet.create({
  Layout: {
    backgroundColor: '#9F6AFE',
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb'
  },
  AfterPress: {
    paddingHorizontal: 40,
  },
  BeforePress: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 22
  }
})
