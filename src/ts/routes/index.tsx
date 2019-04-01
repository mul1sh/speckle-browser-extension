import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from '../containers/App'
import Term from '../components/account/Term'

import {
  DEFAULT_ROUTE,
  TERM_SERVICE_ROUTE
} from '../constants/routes'

export class Routes extends React.Component {
  renderRoutes () {
    return (
      <Switch>
        <Route path={DEFAULT_ROUTE} component={App} exact={true} />
        <Route path={TERM_SERVICE_ROUTE} component={Term} exact={true} />
      </Switch>
    )
  }

  render () {
    return (
      this.renderRoutes()
    )
  }
}