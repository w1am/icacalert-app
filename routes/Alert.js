import React from 'react';
import { View, Text,TouchableOpacity, ActivityIndicator, BackHandler, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Link, Redirect } from 'react-router-native';

import { checkEmail, checkPhone } from '../utils/formChecker';

import Icon from 'react-native-vector-icons/FontAwesome';

import { graphql } from 'react-apollo';
import { CREATE_ALERT_MUTATION } from '../graphql';

const { height } = Dimensions.get('window');

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: 0,
      desc: '',
      email: '',
      phone: '',
      descErr: '',
      emailErr: '',
      phoneErr: '',
      error: false,
      lat: 0,
      lng: 0,
      success: false,
      errorMsg: '',
      loading: false
    }
    this.onButtonPress = this.onButtonPress.bind(this)
    this.handleBackPress = this.handleBackPress.bind(this)
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    navigator.geolocation.getCurrentPosition(p => {
      this.setState({
        lat: p.coords.latitude,
        lng: p.coords.longitude
      })
    })
  }
  componentWillUnmount() {
    this.backHandler.remove()
  }
  handleBackPress() {
    this.props.history.goBack()
    return true
  }
  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight })
  }
  async onButtonPress() {
    const { desc, phone, email, lat, lng } = this.state;
    this.setState({ loading: true })
    if (!desc) {
      this.setState({ error: true, descErr: 'This field is required', loading: false })
    } else if (email && !checkEmail(email)) {
      this.setState({
        error: true,
        emailErr: 'Invalid email',
        loading: false
      })
    } else if (phone && !checkPhone(phone)) {
      this.setState({
        error: true,
        phoneErr: 'Invalid phone',
        loading: false
      })
    } else {
      const response = await this.props.mutate({
        variables: { desc, email, phone, lat, long: lng }
      })
      const { ok, error } = response.data.createAlert;
      if (ok) {
        this.setState({ success: true })
      } else {
        this.setState({
          error: true,
          errorMsg: error.message,
          loading: false
        })
      }
    }
  }
  render() {
    const { desc, phone, loading, email, descErr, emailErr, phoneErr, error, errorMsg, success } = this.state;
    return (
      <View style={{flex: 1}}>
        <ScrollView
          style={styles.Layout}
          scrollEnabled={true}
          onContentSizeChange={this.onContentSizeChange}
        >
          <View style={styles.BackHandler}>
            <Link style={styles.BackBtn} to='/' component={TouchableOpacity}>
              <Icon
                name="chevron-left"
                size={20}
                color="#232323"
              />
              <Text style={styles.BackText}>Home</Text>
            </Link>
          </View>
          <Text style={styles.Header}>Alert Us</Text>
          <Text style={styles.Notice}>1) Your alerts are anonymous</Text>
          <Text style={styles.Notice}>2) Fake entries & spamming may be liable to legal procedures</Text>
          <TextInput
            value={desc}
            style={styles.Description}
            mode='outlined'
            label='Brief description'
            onChangeText={desc => this.setState({ desc, error: false, descErr: '' })}
          />
          { error ? (
            <Text style={styles.Error}>{descErr}</Text>
          ) : null }
          <Text style={styles.Note}>These fields below may be left blank if you wish.</Text>
          <TextInput
            value={email}
            style={styles.Description}
            mode='outlined'
            label='Email (optional)'
            onChangeText={email => this.setState({ email, error: false, emailErr: '' })}
          />
          { error ? (
            <Text style={styles.Error}>{emailErr}</Text>
          ) : null }
          <TextInput
            value={phone}
            style={styles.Description}
            mode='outlined'
            label='Phone (optional)'
            onChangeText={phone => this.setState({ phone, error: false, phoneErr: '' })}
          />
          { error ? (
            <Text style={styles.Error}>{phoneErr}</Text>
          ) : null }
        </ScrollView>
          {
            success ? (
              <View style={styles.BtnSuccess}>
                <Text style={styles.BeforePress}>
                  Success
                  {'   '}
                  <Icon
                    name="check"
                    size={18}
                    color="white"
                  />
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.Btn} onPress={this.onButtonPress}>
                {
                  !success && loading ?  (
                    <ActivityIndicator size="small" color="white"></ActivityIndicator>
                  ) : (
                    <Text style={styles.BeforePress}>
                      Confirm
                      {'   '}
                      <Icon
                        name="arrow-right"
                        size={18}
                        color="white"
                      />
                    </Text>
                  ) 
                }
              </TouchableOpacity>
            )
          }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Layout: {
    flex: 1,
    backgroundColor: '#EFF1F4',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  Btn: {
    backgroundColor: '#1871BB',
    paddingVertical: 22,
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb'
  },
  BtnSuccess: {
    backgroundColor: '#5CB85B',
    paddingVertical: 22,
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb'
  },
  Header: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: 20,
    marginVertical: 10,
    color: '#383838'
  },
  Description: {
    marginTop: 20
  },
  Notice: {
    color: '#919191',
    paddingLeft: 10,
    paddingVertical: 5
  },
  Note: {
    color: '#919191',
    paddingLeft: 10,
    marginTop: 20
  },
  Error: {
    color: 'red',
    paddingLeft: 10,
    marginTop: 10
  },
  Success: {
    color: 'green',
    paddingLeft: 10,
    marginTop: 10
  },
  BeforePress: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  BackHandler: {
    paddingVertical: 20,
    width: 90,
  },
  BackBtn: {
    flexDirection: 'row'
  },
  BackText: {
    fontSize: 19,
    paddingLeft: 15,
    top: -4
  }
})

export default graphql(CREATE_ALERT_MUTATION)(Alert);
