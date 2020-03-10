import React from 'react';
import { ActivityIndicator, BackHandler, Alert, View, Text, TouchableOpacity, StyleSheet, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { INDEX_ALERT_QUERY } from "../graphql";

import { Button } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';

import axios from 'axios';
import Status from '../containers/Status';
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
      currDate: 'March 8 12:53',
      currCity: 'Baie Du Tombeau'
    }
    this.loadMore = this.loadMore.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.handleBackPress = this.handleBackPress.bind(this);
  }
  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight })
  }
  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.setState({
      dname: await AsyncStorage.getItem('dname')
    })
    const dname = await AsyncStorage.getItem('dname');
    const { start, count } = this.state;
    const res = await axios.get(`https://icacalertweb.herokuapp.com/api/alerts/${dname}/${start}/${count}`, { headers: {'Cache-Control': 'no-cache'}});
    this.setState({ alerts: res.data.slicedAlerts, len: res.data.len, dname });
  }
  componentWillUnmount() {
    this.backHandler.remove()
  }
  handleBackPress() {
    Alert.alert(
      'Exit App',
      'Exiting the application?', [{
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'OK',
        onPress: () => BackHandler.exitApp()
      }]
    )
    return true
  }
  async loadMore() {
    const { start, count, alerts, dname } = this.state;
    const newStart = start + 5;
    const newCount = count + 5;
    this.setState({ start: newStart, count: newCount });
    const res = await axios.get(`https://icacalertweb.herokuapp.com/api/alerts/${dname}/${newStart}/${newCount}`, { headers: {'Cache-Control': 'no-cache'}});
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
    const { alerts, dname, len, currLat, currDate, currLng, currCity } = this.state;
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
          <TouchableOpacity onPress={() => this.props.history.push('/map')}>
            <Text style={styles.See}> See all </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.AlertLayout}>
          {
            alerts.length == 0  ? (
              <ActivityIndicator style={{ padding: 40 }} size="large" color="grey"></ActivityIndicator>
            ) : (
              alerts.map(alert => (
                <View key={alert._id} style={styles.Alert}>
                  <View>
                    <Icon
                      style={styles.MarkerIcon}
                      name="map-marker"
                      size={20}
                      color="#6688FA"
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => { 
                        this._panel.show()
                        this.setState({
                          currLat: alert.latitude,
                          currLng: alert.longitude,
                          currCity: alert.city,
                          currDate: alert.mdhm,
                        })
                      } }
                    >
                      <Region>{alert.city}</Region>
                    </TouchableOpacity>
                    <Date>{alert.mdhm}</Date>
                  </View>
                </View>
              ))
            )
          }
          {this.renderButton()}
        </View>



      </ScrollView>
      <CreateBar />
      <SlidingUpPanel
        friction={0.6}
        draggableRange={{ top: 400, bottom: 0 }}
        backdropOpacity={0.2}
        ref={c => this._panel = c}>
        <View style={styles.container}>
          <View style={{
              flexDirection: 'row',
              paddingHorizontal: 22,
              paddingVertical: 20
            }}>
            <View style={styles.Marker}>
              <Icon
                name="map-marker"
                size={28}
                color="#9C83BD"
              />
            </View>
            <View style={styles.Infos}>
              <Text style={styles.CityHeader}>{currCity}</Text>
              <Text style={styles.Mdhm}>{currDate}</Text>
            </View>
          </View>
          <CurrMap
            currLat={currLat}
            currLng={currLng}
            currCity={currCity}
          />
        </View>
      </SlidingUpPanel>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  MarkerIcon: {
    padding: 10,
    paddingRight: 30
  },
  AlertLayout: {
    paddingBottom: 90,
    marginTop: 10
  },
  Infos: {
    marginLeft: 15,
    top: 2
  },
  Marker: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F1EEF7'
  },
  CityHeader: {
    fontSize: 18,
  },
  Mdhm: {
    fontSize: 14,
    color: '#9b9b9b'
  },
  iconDown: {
    textAlign: 'center',
    paddingBottom: 8,
  },
  Alert: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    borderRadius: 20,
    marginVertical: 5,
    flexDirection: 'row',
  },
  Layout: {
    backgroundColor: '#EFF1F4',
    paddingHorizontal: 18,
    paddingVertical: 15,
    paddingTop: 50
  },
  container: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    backgroundColor: 'white',
  },
  Header: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: 20,
    color: '#383838'
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
    paddingLeft: 20,
    color: '#9b9b9b'
  },
  MapLink: {
    color: '#003087',
    fontSize: 16,
    paddingLeft: 20,
  },
  ShowMore: {
    color: '#6A89F3',
    paddingHorizontal: 22,
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 18
  },
})
