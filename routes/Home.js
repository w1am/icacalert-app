import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Link } from 'react-router-native';

import axios from 'axios';
import Status from '../containers/Status';
import AlertList from '../containers/AlertList';
import CreateBar from '../containers/CreateBar';

const { height } = Dimensions.get('window');

export default class Home extends React.Component {
  state = {
    screenHeight: 0,
    dname:''
  }
  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight })
  }
  async componentDidMount() {
    this.setState({
      dname: await AsyncStorage.getItem('dname')
    })
  }
  render() {
    const { dname } = this.state;
    return (
      <View style={{flex: 1}}>
      <ScrollView
        style={styles.Layout}
        scrollEnabled={true}
        onContentSizeChange={this.onContentSizeChange}
      >
        <Text style={styles.Header}>Home</Text>
        <Text style={styles.RegionName}>{dname}</Text>
        <Status dname={dname}/>
        <Text style={styles.Header}> Alerts </Text>
        <AlertList />
      </ScrollView>
      <CreateBar />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Layout: {
    backgroundColor: '#EFF1F4',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  Header: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingLeft: 20
  },
  RegionName: {
    fontSize: 19,
    paddingLeft: 20
  },
  MapLink: {
    color: '#003087',
    fontSize: 16,
    paddingLeft: 20,
  }
})
