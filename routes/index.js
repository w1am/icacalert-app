import React from 'react';
import { AsyncStorage } from 'react-native';
import { Route, Switch } from 'react-router-native';

import Home from './Home';
import Alert from './Alert';
import MapPage from './MapPage';

export default class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path='/'
          component={Home}
        />
        <Route exact={true} path='/map' component={MapPage} />
        <Route exact={true} path='/alert' component={Alert} />
      </Switch>
    )
  }
}
