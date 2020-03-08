import React from 'react';
import {View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Date extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.Date}>{this.props.children}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Date: {
    color: '#9b9b9b',
    fontSize: 16
  },
})
