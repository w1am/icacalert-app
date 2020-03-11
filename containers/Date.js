import React from 'react';
import {View, Text, StyleSheet } from 'react-native';

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
