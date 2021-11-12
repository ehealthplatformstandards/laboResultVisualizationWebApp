/* global document:true */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Route, Router, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { history } from './helpers'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

import Login from './pages/Login'
import FhirViz from './pages/FhirViz'

import 'antd/dist/antd.css'
import './styles/style.css'

/**
 * ### configureStore
 */
import { store } from './core/store'
import i18next from 'i18next'

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lowerCaseLng: true,
    supportedLngs: ['en', 'nl', 'fr'],
    lng: 'en',
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })
  .then(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    history.listen(() => {})
    ReactDOM.render(
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route path="/" component={FhirViz} />
            <Route path="/Login" component={Login} />
            <Route path="/*" component={FhirViz} />
          </Switch>
        </Router>
      </Provider>,
      document.getElementById('root'),
    )
  })
