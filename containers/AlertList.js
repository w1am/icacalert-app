import React from 'react';
import {View, Modal, Text, AsyncStorage, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import axios from 'axios';

import Date from './Date';
import Region from './Region';
import CurrMap from './CurrMap';

export default class AlertList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      count: 5,
      alerts: [],
      len: 0,
      dname: '',
      modalVisible: false,
      currLat: '',
      currLng: '',
      currCity: ''
    }
    this.loadMore = this.loadMore.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }
  async componentDidMount() {
    const dname = await AsyncStorage.getItem('dname');
    const { start, count } = this.state;
    const res = await axios.get(`https://icacalertweb.herokuapp.com/api/alerts/${dname}/${start}/${count}`);
    this.setState({ alerts: res.data.slicedAlerts, len: res.data.len, dname });
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }
  async loadMore() {
    const { start, count, alerts, dname } = this.state;
    const newStart = start + 5;
    const newCount = count + 5;
    this.setState({ start: newStart, count: newCount });
    const res = await axios.get(`https://icacalertweb.herokuapp.com/api/alerts/${dname}/${newStart}/${newCount}`);
    this.setState({
      alerts: [...alerts, ...res.data.slicedAlerts]
    })
  }
  renderButton() {
    const { start, count, alerts, loading, len } = this.state;
    if (alerts.length == 0 || alerts.length >= len) {
      return null
    } else {
      return (
        <TouchableOpacity>
          <Text onPress={this.loadMore} style={styles.ShowMore}>Show more</Text>
        </TouchableOpacity>
      )
    }
  }
  render() {
    const { alerts, len, currLat, currLng, currCity } = this.state;
    return (
      <View>
        <Modal
          animationType='fade'
          transparent={false}
          visible={this.state.modalVisible}
          hardwareAccelerated={true}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}
        >
          <View style={styles.StatusBarLayout}>
            <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
              <Icon
                style={styles.NavigatorIcon}
                name="arrow-left"
                size={20}
                color="#2A4F98"
              />
            </TouchableOpacity>
          </View>
          <CurrMap
            currLat={currLat}
            currLng={currLng}
            currCity={currCity}
          />
        </Modal>
        <View style={styles.Layout}>
          {
            alerts.length == 0 ? (
              <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
            ) : (
              alerts.map(alert => (
                <View key={alert._id} style={styles.Alert}>
                  <TouchableOpacity
                    onPress={() => { 
                      this.setModalVisible(true)
                      this.setState({
                        currLat: alert.latitude,
                        currLng: alert.longitude,
                        currCity: alert.city
                      })
                    } }
                  >
                    <Region>{alert.city}</Region>
                  </TouchableOpacity>
                  <Date>{alert.mdhm}</Date>
                </View>
              ))
            )
          }
          {this.renderButton()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Layout: {
    paddingBottom: 90
  },
  Alert: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d8d8d8',
    borderRadius: 20,
    marginVertical: 5
  },
  ShowMore: {
    color: '#003087',
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: 'bold',
    fontSize: 18
  },
  EndText: {
    color: '#003087',
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: 'bold',
    fontSize: 16
  },
  StatusBarLayout: {
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
