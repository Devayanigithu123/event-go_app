import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../assets/theme/theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomIcon from './CustomIcon';

interface SettingComponentProps {
  icon: string;
  heading: string;
  subheading: string;
  subtitle: string;
}

const SettingComponent: React.FC<SettingComponentProps> = ({ icon, heading, subheading, subtitle }) => {
  return (
    <View style={styles.container}>
      {/* Left Icon */}
      <CustomIcon name={icon} style={styles.iconStyle} />

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{heading}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{subheading}</Text>
          <Text style={styles.subtitle}>• {subtitle}</Text> 
        </View>
      </View>

      {/* Right Arrow Icon */}
      <CustomIcon name="arrow-right" style={styles.arrowIcon} />
    </View>
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
    elevation: 2, // Shadow for Android
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
