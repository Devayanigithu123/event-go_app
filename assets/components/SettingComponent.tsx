import { COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../../assets/theme/theme';
import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


interface SettingComponentProps {
  icon: string;
  heading: string;
  subheading: string;
  subtitle?: string;
  onPress?: () => void; 
  rightElement?: React.ReactNode; 
}

const SettingComponent: React.FC<SettingComponentProps> = ({ 
  icon, 
  heading, 
  subheading, 
  subtitle,
  onPress,
  rightElement // New prop for custom right elements
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Icon */}
      <Icon name={icon} style={styles.iconStyle} />

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{heading}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{subheading}</Text>
          {subtitle && (  // Only render if subtitle exists
            <Text style={styles.subtitle}>• {subtitle}</Text> 
          )}
        </View>
      </View>

      {/* Right Side - Either custom element or arrow */}
      {rightElement}
    </TouchableOpacity>
  );
};

export default SettingComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.space_16,
    paddingHorizontal: SPACING.space_20,
    backgroundColor: COLORS.White,
    borderRadius: 10,
    elevation: 2,
    shadowColor: COLORS.Black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: SPACING.space_10,
  },
  iconStyle: {
    color: COLORS.Orange,
    fontSize: FONTSIZE.size_24,
    marginRight: SPACING.space_12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.Black,
    marginBottom: SPACING.space_4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Grey,
    marginRight: SPACING.space_8,
  },
  arrowIcon: {
    color: COLORS.DarkGrey,
    fontSize: FONTSIZE.size_20,
  },
});
