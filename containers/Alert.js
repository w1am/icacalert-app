import React from 'react';
import {View, Text, StyleSheet } from 'react-native';

export default class Alert extends React.Component {
  render() {
    return (
      <View style={styles.Layout}>
        <Text style={styles.Region}>{this.props.children}</Text>
      </View>
    )
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
