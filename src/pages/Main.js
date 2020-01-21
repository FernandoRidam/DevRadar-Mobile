import React, { useState, useEffect } from 'react';

import MapView from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import {
  requestPermissionsAsync,
  getCurrentPositionAsync,
} from 'expo-location';

import Styles from './styles';

import {
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

import DevMarker from '../components/DevMarker';

export default function Main({ navigation }) {
  const [ devs, setDevs ] = useState([]);
  const [ currentRegion, setCurrentRegion ] = useState(null);

  const [ techs, setTechs ] = useState('');

  useEffect(() => {
    async function getInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if( granted ) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      } else {}
    };

    getInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewDevs( dev => setDevs([ ...devs, dev ]));
  }, [ devs ]);

  if( !currentRegion ) {
    return null;
  }

  function handleRegionChanged( region ) {
    setCurrentRegion( region );
  };

  function seturWebsocket() {
    disconnect();

    const { latitude, longitude } = currentRegion;

    connect(
      latitude,
      longitude,
      techs,
    );
  };

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs,
      },
    });

    setDevs( response.data );

    seturWebsocket();
  };

  return (
    <>
      <MapView
        onRegionChangeComplete={ handleRegionChanged }
        initialRegion={ currentRegion }
        style={ Styles.map }
      >
        {
          devs.map( dev => (
            <DevMarker
              key={ dev._id }
              data={ dev }
              navigation={ navigation }
            />
          ))
        }
      </MapView>

      <View style={ Styles.searchForm }>
        <TextInput
          style={ Styles.searchInput }
          placeholder="Buscar Devs por Tecnologias..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={ false }
          value={ techs }
          onChangeText={ setTechs }
        />

        <TouchableOpacity
          style={ Styles.searchButton }
          onPress={ loadDevs }
        >
          <MaterialIcons name="my-location" size={ 20 } color="#FFF"/>
        </TouchableOpacity>
      </View>
    </>
  )
};