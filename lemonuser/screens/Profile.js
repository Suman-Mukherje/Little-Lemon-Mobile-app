import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from './UserContext'; 

const Profile = ({ route, navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [notifications, setNotifications] = useState({
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  });

  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: null,
    notifications: {
      orderStatuses: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
        const storedAvatar = await AsyncStorage.getItem('avatar');
        const storedNotifications = await AsyncStorage.getItem('notifications');

        const loadedData = {
          firstName: storedFirstName || '',
          lastName: storedLastName || '',
          email: storedEmail || '',
          phoneNumber: storedPhoneNumber || '',
          avatar: storedAvatar || null,
          notifications: storedNotifications ? JSON.parse(storedNotifications) : {
            orderStatuses: false,
            passwordChanges: false,
            specialOffers: false,
            newsletter: false,
          },
        };

        setOriginalData(loadedData);
        setFirstName(loadedData.firstName);
        setLastName(loadedData.lastName);
        setEmail(loadedData.email);
        setPhoneNumber(loadedData.phoneNumber);
        setAvatar(loadedData.avatar);
        setNotifications(loadedData.notifications);

        console.log('Stored Data:', loadedData);
      } catch (e) {
        console.error("Failed to load profile data", e);
      }
    };

    loadData();

    if (route.params) {
      const { firstName, lastName, email } = route.params;
      console.log('Route Params:', { firstName, lastName, email });
      if (firstName) setFirstName(firstName);
      if (lastName) setLastName(lastName);
      if (email) setEmail(email);
    }
  }, [route.params]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setAvatar(imageUri);
      await AsyncStorage.setItem('avatar', imageUri);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Save or remove firstName
      if (firstName !== '') {
        await AsyncStorage.setItem('firstName', firstName);
      } else {
        await AsyncStorage.removeItem('firstName');
      }
  
      // Save or remove lastName
      if (lastName !== '') {
        await AsyncStorage.setItem('lastName', lastName);
      } else {
        await AsyncStorage.removeItem('lastName');
      }
  
      // Save or remove email
      if (email !== '') {
        await AsyncStorage.setItem('email', email);
      } else {
        await AsyncStorage.removeItem('email');
      }
  
      // Save or remove phoneNumber
      if (phoneNumber !== '') {
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
      } else {
        await AsyncStorage.removeItem('phoneNumber');
      }
  
      // Save or remove avatar
      if (avatar) {
        await AsyncStorage.setItem('avatar', avatar);
      } else {
        await AsyncStorage.removeItem('avatar');
      }
  
      // Save notifications
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  
      navigation.navigate('Home', { updatedAvatar: avatar });
    } catch (e) {
      console.error("Failed to save profile data", e);
    }
  };
  

  const handleDiscardChanges = () => {
    setFirstName(originalData.firstName);
    setLastName(originalData.lastName);
    setEmail(originalData.email);
    setPhoneNumber(originalData.phoneNumber);
    setAvatar(originalData.avatar);
    setNotifications(originalData.notifications);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('Onboarding');
    } catch (e) {
      console.error("Failed to log out", e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </View>

        {/* Profile Information Container */}
        <View style={styles.infoContainer}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initials}>
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={pickImage} style={styles.changeButton}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAvatar(null)} style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>

          {/* Header with Personal Information text */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Personal Information</Text>
          </View>

          {/* Profile Information Inputs */}
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
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Notifications */}
          <Text style={styles.label}>Email Notifications</Text>
          {Object.keys(notifications).map((key) => (
            <View key={key} style={styles.switchContainer}>
              <Text>{key.split(/(?=[A-Z])/).join(' ')}</Text>
              <Switch
                value={notifications[key]}
                onValueChange={(value) => setNotifications((prev) => ({ ...prev, [key]: value }))}
              />
            </View>
          ))}

          {/* Save/Discard Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleDiscardChanges} style={styles.buttonDiscard}>
              <Text style= {[styles.buttonText, { color: '#000000' }]}>Discard Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSaveChanges} style={styles.buttonSave}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.buttonLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F9F9F9',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  infoContainer: {
    backgroundColor: '#F0F0F0', // Slightly darker white
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000', // Add shadow for better appearance
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Elevation for Android
  },
  header: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  initialsContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  initials: {
    fontSize: 36,
    color: '#FFF',
  },
  changeButton: {
    backgroundColor: '#495E57',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  changeText: {
    color: '#FFF',
  },
  removeButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeText: {
    color: '#000000',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonDiscard: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonSave: {
    backgroundColor: '#495E57',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonLogout: {
    backgroundColor: '#F4CE14',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutText: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Profile;
