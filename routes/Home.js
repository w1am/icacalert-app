import React from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Button } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';

import axios from 'axios';
import Status from '../containers/Status';
import AlertList from '../containers/AlertList';
import CreateBar from '../containers/CreateBar';

import Date from '../containers/Date';
import Region from '../containers/Region';
import CurrMap from '../containers/CurrMap';

const { height } = Dimensions.get('window');

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: 0,
      dname:'',
      start: 0,
      count: 5,
      alerts: [],
      len: 0,
      dname: '',
      modalVisible: false,
      currLat: 0,
      currLng: 0,
      mdhm: 'March 8 12:53',
      currCity: 'Baie Du Tombeau'
    }
    this.loadMore = this.loadMore.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }
  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight })
  }
  async componentDidMount() {
    this.setState({
      dname: await AsyncStorage.getItem('dname')
    })
    const dname = await AsyncStorage.getItem('dname');
    const { start, count } = this.state;
    const res = await axios.get(`https://icacalertweb.herokuapp.com/api/alerts/${dname}/${start}/${count}`);
    this.setState({ alerts: res.data.slicedAlerts, len: res.data.len, dname });
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
    const { alerts, dname, len, currLat, mdhm, currLng, currCity } = this.state;
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
        <View style={styles.Alerts}>
          <Text style={styles.Header}> Alerts </Text>
          <Link to='/map' component={TouchableOpacity}>
            <Text style={styles.See}> See all </Text>
          </Link>
        </View>



        <View style={styles.AlertLayout}>
          {
            alerts.length == 0 ? (
              <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
            ) : (
              alerts.map(alert => (
                <View key={alert._id} style={styles.Alert}>
                  <TouchableOpacity
                    onPress={() => { 
                      this._panel.show()
                      this.setState({
                        currLat: alert.latitude,
                        currLng: alert.longitude,
                        currCity: alert.city,
                        mdhm: alert.mdhm
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



      </ScrollView>
      <CreateBar />
      <SlidingUpPanel ref={c => this._panel = c}>
        <View style={styles.container}>
          <CurrMap
            currLat={currLat}
            currLng={currLng}
            currCity={currCity}
          />
          <Text style={styles.CityHeader}>{currCity}</Text>
          <Text style={styles.Mdhm}>{mdhm}</Text>
        </View>
      </SlidingUpPanel>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  AlertLayout: {
    paddingBottom: 90
  },
  CityHeader: {
    fontSize: 20,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 5,
    fontWeight: 'bold'
  },
  Mdhm: {
    fontSize: 14,
    paddingHorizontal: 40,
  },
  Alert: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d8d8d8',
    borderRadius: 20,
    marginVertical: 5
  },
  Layout: {
    backgroundColor: '#EFF1F4',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 1.20,
    shadowRadius: 16.00,
    elevation: 24,
  },
  Header: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: 20
  },
  See: {
    fontSize: 18,
    paddingRight: 20,
    paddingTop: 3,
    color: '#4849A1'
  },
  Alerts: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
