import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Date from '../containers/Date';
import Region from '../containers/Region';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

class AlertContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: this.props.slicedAlerts,
      start: 0,
      count: 5,
      len: this.props.len,
      loading: false,
    }
    this.loadMore = this.loadMore.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }
  async loadMore() {
    const { start, count, alerts } = this.state;
    const { dname } = this.props;
    const newStart = start + 5;
    const newCount = count + 5;
    this.setState({ start: newStart, count: newCount, loading: true });
    const res = await axios.get(`https://icacalertweb.herokuapp.com/api/alerts/${dname}/${newStart}/${newCount}`, { headers: {'Cache-Control': 'no-cache'}});
    this.setState({
      alerts: [...alerts, ...res.data.slicedAlerts]
    })
  }
  renderButton() {
    const { start, count, alerts, len, loading } = this.state;
    if (alerts.length == 0 || alerts.length >= len) {
      return <Text style={styles.Note}>that's all we have for this month 😊</Text>
    } else {
      return (
        <TouchableOpacity onPress={this.loadMore}>
          {
          loading ? (
            <ActivityIndicator style={{padding: 30}} size="small" color="#1871BB"></ActivityIndicator>
            ) : (
            <Text style={styles.ShowMore}>Show more</Text>
            )
          }
        </TouchableOpacity>
      )
    }
  }
  render() {
    const { alerts } = this.state;
    if (alerts.length == 0) {
      return <ActivityIndicator style={{ padding: 40 }} size="large" color="#1871BB"></ActivityIndicator>
    } else {
      return (
        <View style={{ paddingBottom: 100 }} >
          {
            alerts.map(alert => 
              (
                <View key={alert.id} style={styles.Alert}>
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
                        this.props.action(
                          alert.latitude,
                          alert.longitude,
                          alert.mdhm,
                          alert.city
                        )
                      }}
                    >
                      <Region>{alert.city}</Region>
                    </TouchableOpacity>
                    <Date>{alert.mdhm}</Date>
                  </View>
                </View>
              )
            )
          }
          {this.renderButton()}
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    backgroundColor: 'white',
  },
  Marker: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F1EEF7'
  },
  Infos: {
    marginLeft: 15,
    top: 2
  },
  CityHeader: {
    fontSize: 18,
  },
  Mdhm: {
    fontSize: 14,
    color: '#9b9b9b'
  },
  MarkerIcon: {
    padding: 10,
    paddingRight: 30
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
  ShowMore: {
    color: '#4849A1',
    paddingHorizontal: 22,
    marginTop: 30,
    fontSize: 18
  },
  Note: {
    color: '#586069',
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 40,
  }
})

export default AlertContent;
