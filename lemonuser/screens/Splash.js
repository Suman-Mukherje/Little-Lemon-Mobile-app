// screens/Splash.js

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import logo from '../assets/logo.png'; // Adjust the path as necessary

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
  },
});

export default Splash;
