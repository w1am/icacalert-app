import React from 'react';
import { Route } from 'react-router-native';
import Stack from 'react-router-native-stack';

import Home from './Home';
import Alert from './Alert';
import MapPage from './MapPage';

export default class Routes extends React.Component {
  render() {
    return (
      <Stack animationType='slide-horizontal' gestureEnabled={false}>
        <Route
          exact
          path='/'
          component={Home}
        />
        <Route exact={true} path='/map' component={MapPage} />
        <Route exact={true} path='/alert' component={Alert} />
      </Stack>
    )
  }
}
