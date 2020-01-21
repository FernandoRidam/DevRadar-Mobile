import React from 'react';

import { Marker, Callout } from 'react-native-maps';

import {
  Image,
  View,
  Text,
} from 'react-native';

import Styles from '../pages/styles';

export default function DevMarker({ data, navigation }) {
  return (
    <Marker coordinate={{ latitude: data.location.coordinates[1], longitude: data.location.coordinates[0]}}>
      <Image style={ Styles.avatar } source={{ uri: data.avatar_url }} />

      <Callout onPress={() => {
        navigation.navigate('Profile', { github_username: data.github_username});
      }}>
        <View style={ Styles.callout }>
          <Text style={ Styles.devName }>{ data.name }</Text>

          <Text style={ Styles.devBio }>{ data.bio }</Text>

          <Text style={ Styles.devTechs }>{ data.techs.join(', ')}</Text>
        </View>
      </Callout>
    </Marker>
  );
};