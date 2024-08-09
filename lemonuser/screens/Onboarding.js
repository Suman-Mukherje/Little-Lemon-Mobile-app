import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/logo.png'; // Placeholder for your app's logo

const Onboarding = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      // Reset input fields when the screen comes into focus
      setFirstName('');
      setLastName('');
      setEmail('');
      setIsButtonDisabled(true);
    }, [])
  );

  useEffect(() => {
    // Check if all inputs are valid
    const isFormValid = firstName.trim() !== '' && lastName.trim() !== '' && validateEmail(email);
    setIsButtonDisabled(!isFormValid);
  }, [firstName, lastName, email]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleStart = async () => {
    if (!isButtonDisabled) {
      try {
        await AsyncStorage.setItem('firstName', firstName);
        await AsyncStorage.setItem('lastName', lastName);
        await AsyncStorage.setItem('email', email);
        console.log('Onboarding data saved:', { firstName, lastName, email });
        navigation.navigate('Home'); // or 'Profile'
      } catch (e) {
        console.error("Failed to save onboarding data", e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.welcomeText}>Welcome to Little Lemon!</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        onPress={handleStart}
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
        disabled={isButtonDisabled}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  logo: {
    width: '80%',  // Adjust to fit screen size
    height: undefined,
    aspectRatio: 7, // Adjust aspect ratio according to your logo dimensions
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4CE14',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  button: {
    backgroundColor: '#F4CE14',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#F8E27F', // Lighter shade for disabled state
  },
});

export default Onboarding;
