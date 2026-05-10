import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', name: 'All Rooms', icon: '🏨' },
  { id: 'luxury', name: 'Luxury', icon: '👑' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'suite', name: 'Suites', icon: '✨' },
];

interface CategorySwiperProps {
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
}

export const CategorySwiper: React.FC<CategorySwiperProps> = ({
  selectedCategory,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      decelerationRate="fast"
      snapToInterval={80}
    >
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryChip,
            selectedCategory === category.id && styles.categoryChipActive,
          ]}
          onPress={() => onSelect(category.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text
            style={[
              styles.categoryName,
              selectedCategory === category.id && styles.categoryNameActive,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'white',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    minHeight: 44, // Meets tap target requirement
  },
  categoryChipActive: {
    backgroundColor: '#1a2a4f',
    elevation: 4,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a5568',
  },
  categoryNameActive: {
    color: '#FFD700',
  },
});