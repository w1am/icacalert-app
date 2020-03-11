import React from 'react';
import {View, Text, StyleSheet } from 'react-native';

export default class Region extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.Region}>{this.props.children}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Region: {
    color: 'black',
    fontSize: 16,
  },
})
