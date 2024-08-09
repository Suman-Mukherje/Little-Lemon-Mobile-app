import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(null);
  const [initials, setInitials] = useState('');

  const loadProfileData = async () => {
    try {
      const storedAvatar = await AsyncStorage.getItem('avatar');
      const storedFirstName = await AsyncStorage.getItem('firstName');
      const storedLastName = await AsyncStorage.getItem('lastName');

      if (storedAvatar) {
        setAvatar(storedAvatar);
      } else if (storedFirstName && storedLastName) {
        const userInitials = `${storedFirstName.charAt(0)}${storedLastName.charAt(0)}`;
        setInitials(userInitials.toUpperCase());
      }
    } catch (e) {
      console.error("Failed to load profile data", e);
    }
  };

  const updateAvatar = async (newAvatar) => {
    try {
      await AsyncStorage.setItem('avatar', newAvatar);
      setAvatar(newAvatar);
    } catch (e) {
      console.error("Failed to update avatar", e);
    }
  };

  return (
    <UserContext.Provider value={{ avatar, initials, loadProfileData, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
