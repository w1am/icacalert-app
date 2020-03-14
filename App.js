import React from 'react';
import Routes from './routes';
import { StatusBar, AsyncStorage, BackHandler } from 'react-native';
import { NativeRouter } from 'react-router-native';

import { ApolloProvider } from 'react-apollo';
import { client } from './apollo';

import axios from 'axios';
import { normalizeDistrictName } from './utils/districtNameFormatter';

export default class App extends React.Component {
  async componentDidMount() {
    StatusBar.setHidden(true)
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    navigator.geolocation.getCurrentPosition(async p => {
      const geoUrl = `http://www.geoplugin.net/extras/location.gp?lat=${p.coords.latitude}&lon=${p.coords.longitude}&format=json`;
      const res = await axios.get(geoUrl);
      const district = normalizeDistrictName(res.data.geoplugin_region);
      if (district) {
        await AsyncStorage.setItem('dname', district);
      } else {
        await AsyncStorage.setItem('dname', 'portlouis');
      }
    })
  }
  render() {
    return (
      <ApolloProvider client={client}>
        <NativeRouter>
          <Routes />
        </NativeRouter>
      </ApolloProvider>
    );
  }
}
