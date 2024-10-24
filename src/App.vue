<template>
  <div id="app">
    <navBar/>
    <router-view></router-view>
    <iot/>
    <parkAlert/>
  </div>
</template>

<head>
  <script>
  (function(n,i,v,r,s,c,x,z){x=window.AwsRumClient={q:[],n:n,i:i,v:v,r:r,c:c};window[n]=function(c,p){x.q.push({c:c,p:p});};z=document.createElement('script');z.async=true;z.src=s;document.head.insertBefore(z,document.head.getElementsByTagName('script')[0]);})(
    'cwr',
    '94c4cbc7-bbe8-403f-b2d1-9f052240e083',
    '1.0.0',
    'us-east-1',
    'https://client.rum.us-east-1.amazonaws.com/1.19.0/cwr.js',
    {
      sessionSampleRate: 1,
      identityPoolId: "us-east-1:d57a48f9-d843-4b5d-a94c-67231b1547be",
      endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
      telemetries: ["performance","errors","http"],
      allowCookies: true,
      enableXRay: true
    }
  );
</script>
  
</head>
<script>
/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

import NavBar from '@/components/NavBar'
import ParkAlert from '@/components/ParkAlert'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    NavBar,
    ParkAlert
  },
  methods: {
    initState: function (items) {
      let initRideTimes
      items.map(item => {
        // Initial ride time valus - store until locations populaterd
        if (item.partitionKey === 'config' && item.message) {
          initRideTimes = item.message
        }
        // Photos
        if (item.partitionKey === 'user-photo') {
          this.$store.commit('addPhoto', item.URL)
        }
        // Other data
        if (item.partitionKey !== 'locations') return
        const key = item.sortKey.split('-')[0]
        switch (key) {
          // Facilities
          case 'facility':
            this.$store.commit('addFacility', {
              id: item.sortKey,
              name: item.name,
              lat: JSON.parse(item.map).lat.N,
              lng: JSON.parse(item.map).lng.N,
              type: item.type
            })
            break
          // Rides
          case 'ride':
            this.$store.commit('addRide', {
              id: item.sortKey,
              name: item.name,
              lat: JSON.parse(item.map).lat.N,
              lng: JSON.parse(item.map).lng.N,
              thumbnail: item.thumbnail,
              image: item.image,
              wait: null,
              inService: null
            })
            break
        }
        // Now add init ride times
        if (initRideTimes) {
          this.$store.commit('updateRideTimes', initRideTimes)
        }
        this.$store.commit('setInitialized')
      })
    }
  },
  mounted: async function () {
    try {
      // For the workshop, if this isn't in the config, the user has not
      // attemped this module yet, so don't initalize.
      if (this.$appConfig.initStateAPI === '') return

      const response = await axios.get(`${this.$appConfig.initStateAPI}`)
      console.log('ParkMap: ', response)
      this.initState(response.data.result.Items)
    } catch (err) {
      console.error(err)
    }
  }
}
</script>
<style>
  body {
    background: #00b0f3 !important;
  }
</style>
