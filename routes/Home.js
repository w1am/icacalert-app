import React from 'react';
import { ActivityIndicator, BackHandler, Alert, View, Text, TouchableOpacity, StyleSheet, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { INDEX_ALERT_QUERY } from "../graphql";
import { graphql, Query } from 'react-apollo';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Date from '../containers/Date';
import Region from '../containers/Region';

import SlidingUpPanel from 'rn-sliding-up-panel';

import Status from '../containers/Status';
import CreateBar from '../containers/CreateBar';

import CurrMap from '../containers/CurrMap';
import AlertContent from '../containers/AlertContent';

const { height } = Dimensions.get('window');

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      count: 10,
      screenHeight: 0,
      dname:'',
      dname: '',
      modalVisible: false,
      currLat: 0,
      currLng: 0,
      currDate: 'March 8 12:53',
      currCity: 'Baie Du Tombeau'
    }
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
  render() {
    const {dname, start, count, currLat, currDate, currLng, currCity } = this.state;
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.Layout} scrollEnabled={true} onContentSizeChange={this.onContentSizeChange} >
          <Text style={styles.Header}>Home</Text>
          <Text style={styles.RegionName}>{dname}</Text>
          <Status dname={dname}/>
          <View style={styles.Alerts}>
            <Text style={styles.Header}> Alerts </Text>
            <TouchableOpacity onPress={() => this.props.history.push('/map')}>
              <Text style={styles.See}>See all</Text>
            </TouchableOpacity>
          </View>
          <Query pollInterval={500} query={INDEX_ALERT_QUERY} variables={{ dname, start, count }}>
            {
              ({ loading, data, startPolling, stopPolling, refetch }) => {
                if (loading) return (
                  <ActivityIndicator style={{ padding: 40 }} size="large" color="#1871BB"></ActivityIndicator>
                );
                const { slicedAlerts, len } = data.indexAlerts
                return (
                  <View style={{ paddingBottom: 100 }}>
                    {
                      slicedAlerts.map(alert => (
                        <View key={alert.id} style={styles.Alert}>
                          <View>
                            <Icon
                              style={styles.MarkerIcon}
                              name="map-marker"
                              size={20}
                              color="#3F99E0"
                            />
                          </View>
                          <View>
                            <TouchableOpacity onPress={() => {
                              this.setState({
                                currLat: alert.latitude,
                                currLng: alert.longitude,
                                currCity: alert.city,
                                currDate: alert.mdhm
                              })
                              this._panel.show()
                            }}>
                              <Region>{alert.city}</Region>
                            </TouchableOpacity>
                            <Date>{alert.mdhm}</Date>
                          </View>
                        </View>
                      ))
                    }
                    {
                      (slicedAlerts.length == 0 || slicedAlerts.length >= len) ? (
                        <Text style={styles.Note}>that's all we have for this month 😊</Text>
                        ) : (
                          <TouchableOpacity onPress={() => {
                              this.setState({ count: count + 10 })
                              refetch()
                            }}>
                            <Text style={styles.ShowMore}>Show more</Text>
                          </TouchableOpacity>
                        )
                    }
                  </View>
                )
              }
            }
          </Query>
        </ScrollView>
        <SlidingUpPanel
          friction={0.5}
          backdropOpacity={0.2}
          ref={c => this._panel = c}>
          <View style={styles.container}>
            <Icon
              style={{
                textAlign: 'center',
              }}
              name="window-minimize"
              size={20}
              color="#d8d8d8"
            />
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 22,
                paddingVertical: 20
              }}>
              <View style={styles.Marker}>
                <Icon
                  name="map-marker"
                  size={28}
                  color="#329AED"
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
        <CreateBar />
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
    marginLeft: 20,
    top: 2
  },
  Marker: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#eef8ff'
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
    paddingTop: 50,
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
    color: '#383838',
  },
  See: {
    fontSize: 18,
    paddingRight: 20,
    paddingTop: 3,
    color: '#1871BB'
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
    color: '#2D9CF0',
    paddingHorizontal: 22,
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 18,
  },
  Note: {
    color: '#586069',
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 40,
  },
})
