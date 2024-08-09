import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTable, getMenuItemsByCategory, saveMenuItems, clearMenuTable } from './database';
import CategoryFilter from './CategoryFilter'; // Import the CategoryFilter component
// Import the logo and banner image
import logo from '../assets/logo.png';
import bannerImage from '../assets/banner.png';
import { useUser } from './UserContext'; 

const BASE_IMAGE_URL = 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';

const Home = ({ route }) => {
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState(null);
  //const { avatar,loadProfileData } = useUser();
  const [initials, setInitials] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // Use an array for multiple selections
  const [searchText, setSearchText] = useState('');

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

  const fetchMenuData = async () => {
    try {
      await clearMenuTable();
      await createTable();

      const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
      const result = await response.json();

      const transformedMenuItems = Array.from(
        new Set(result.menu.map(item => item.name))
      ).map(name => result.menu.find(item => item.name === name));

      const finalMenuItems = transformedMenuItems.map(item => ({
        ...item,
        image: `${BASE_IMAGE_URL}${item.image}?raw=true`
      }));

      await saveMenuItems(finalMenuItems);

      // Initially fetch all menu items to populate the database
      const allMenuItems = await getMenuItemsByCategory('All');
      setMenuItems(allMenuItems);
    } catch (e) {
      console.error("Failed to fetch or store menu data", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
      fetchMenuData();
    }, [route.params?.updatedAvatar])
  );

  useEffect(() => {
    const fetchFilteredMenuItems = async () => {
      console.log(`Fetching items for category: ${selectedCategories}`);
      const filteredMenuItems = await getMenuItemsByCategory(selectedCategories);
      console.log('Filtered items:', filteredMenuItems);
      filteredMenuItems.sort((a, b) => a.price - b.price);
      setMenuItems(filteredMenuItems);
    };
  
    fetchFilteredMenuItems();
  }, [selectedCategories]);

  const handleCategorySelect = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSearch = (text) => {
    setSearchText(text);
    // Implement search logic here if needed
  };

  const renderItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.menuImage} />
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDescription}>{item.description}</Text>
        <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.profileImage} />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Banner Section */}
      <View style={styles.bannerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Little Lemon</Text>
          <Text style={styles.subtitle}>Chicago</Text>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu..."
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
        <Image source={bannerImage} style={styles.bannerImage} />
      </View>
       
      {/* Category Filter Section */}
      <CategoryFilter selectedCategories={selectedCategories} onSelectCategory={handleCategorySelect} />

      {/* Menu Items Section */}
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
        contentContainerStyle={styles.menuList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  logo: {
    width: '80%',
    height: undefined,
    aspectRatio: 7,
    marginBottom: 15,
    marginTop: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  initialsContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 18,
    color: '#495E57',
  },
  bannerContainer: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 20,
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#F4CE14',
  },
  subtitle: {
    fontSize: 24,
    color: '#333',
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  bannerImage: {
    flex: 1,
    height: '80%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
    marginLeft: 10,
  },
  menuList: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    alignItems: 'center',
  },
  menuImage: {
    width: '30%',
    height: '70%',
    borderRadius: 8,
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default Home;
