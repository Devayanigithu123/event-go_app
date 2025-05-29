import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomIcon from './CustomIcon'; // Assuming you're using a custom icon component
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';

interface AppHeaderProps {
  name: string; // Icon name 
  header: string; // Header title
  action: () => void; // Function to execute on press
}

const AppHeader: React.FC<AppHeaderProps> = ({ name, header, action }) => {
  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity onPress={action} style={styles.iconContainer}>
        <CustomIcon name={name} style={styles.iconStyle} />
      </TouchableOpacity>

      {/* Centered Header */}
      <Text style={styles.headerText}>{header}</Text>

      {/* Placeholder View to Balance the Layout */}
      <View style={styles.iconContainer} />
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingVertical: SPACING.space_16,
    paddingHorizontal: SPACING.space_20,
  },
  iconContainer: {
    width: 40, 
    alignItems: 'center',
  },
  iconStyle: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.Black,
  },
  headerText: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.Black,
    textAlign: 'center',
    flex: 1, 
  },
});
