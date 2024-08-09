import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const categories = ['starters', 'mains', 'desserts']; // Update with your actual categories

const CategoryFilter = ({ selectedCategories, onSelectCategory }) => {
  const handlePress = (category) => {
    onSelectCategory(category);
  };

  return (
    <View style={styles.container}>
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.button,
            selectedCategories.includes(category) && styles.selectedButton
          ]}
          onPress={() => handlePress(category)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedCategories.includes(category) && styles.selectedButtonText
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    margin: 5,
    backgroundColor: '#F4CE14',
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#D9D9D9',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedButtonText: {
    color: '#495E57',
  },
});

export default CategoryFilter;
