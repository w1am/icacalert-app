import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';

export default class CreateBar extends React.Component {
  render() {
    const { onPress } = this.props;
    return (
      <View style={styles.Layout}>
        <Link to='/alert' component={TouchableOpacity}>
          <Text style={styles.BeforePress}>Send Alert</Text>
        </Link>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Layout: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb'
  },
  AfterPress: {
    paddingHorizontal: 40,
  },
  BeforePress: {
    textAlign: 'center',
    color: '#2A4F98',
    fontWeight: 'bold',
    paddingVertical: 22
  }
})
