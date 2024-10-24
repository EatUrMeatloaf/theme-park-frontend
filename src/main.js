/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import { store } from './store'
import messages from './languages/translations.json'

import IoT from '@/components/IoT'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { appConfig } from './config'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faImages, faGlobe, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { getLanguageList } from './languages/languageLookup'

import { AwsRum } from 'aws-rum-web';

try {
  const config = {
    sessionSampleRate: 1,
    identityPoolId: "us-east-1:d57a48f9-d843-4b5d-a94c-67231b1547be",
    endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
    telemetries: ["performance","errors","http"],
    allowCookies: true,
    enableXRay: true
  };

  const APPLICATION_ID = '94c4cbc7-bbe8-403f-b2d1-9f052240e083';
  const APPLICATION_VERSION = '1.0.0';
  const APPLICATION_REGION = 'us-east-1';

  const awsRum = new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.config.lang = 'en'
Vue.component('iot', IoT)

// Font-awesome library
library.add(faImages, faGlobe, faArrowCircleLeft)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Internationalization
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

// This is workshop-specific because the user can change the languages file
Vue.prototype.$languages = getLanguageList(messages)

// Turn off production tip in console
Vue.config.productionTip = false

// Custom settings for app
Vue.prototype.$appConfig = appConfig

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  template: '<App/>',
  components: { App }
})
