import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For better icons
import AppHeader from '../components/AppHeader';
import SettingComponent from '../components/SettingComponent';

const UserAccountScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Floating Header */}
      <View style={styles.headerContainer}>
        <AppHeader name="close" header="My Profile" action={() => navigation.goBack()} />
      </View>
      
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
            
            {/* Profile Section */}
            <View style={styles.profileContainer}>
              <View style={styles.avatarWrapper}>
                <Image 
                  source={{ uri: 'https://imgcdn.stablediffusionweb.com/2024/3/31/a07c234b-ab97-4ad4-96b1-e1e88ec45e45.jpg' }} 
                  style={styles.avatarImage}
                />
              </View>
              <Text style={styles.avatarText}>Tanisha Chhimwal</Text>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Settings Section */}
            <View style={styles.settingsContainer}>
              <SettingComponent icon="user" heading="Account" subheading="Edit Profile" subtitle="Gender" />
              <View style={styles.divider} />
              <SettingComponent icon="setting" heading="Settings" subheading="Theme" subtitle="Permissions" />
              <View style={styles.divider} />
              <SettingComponent icon="dollar" heading="Offers" subheading="Discounts" subtitle="Referral" />
              <View style={styles.divider} />
              <SettingComponent icon="info" heading="About" subheading="Event Details" subtitle="More Info" />
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  headerContainer: {
    height: 60, 
    width: '100%',
    backgroundColor: COLORS.White, 
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    elevation: 6, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 10, 
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 80,
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.space_36,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: COLORS.Primary, 
    borderRadius: 50,
    padding: 4,
  },
  avatarImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
  },
  avatarText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
    marginTop: SPACING.space_12,
    color: COLORS.Black,
  },
  editProfileButton: {
    marginTop: SPACING.space_8,
    backgroundColor: COLORS.Primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editProfileText: {
    color: COLORS.White,
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_medium,
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.space_36,
    paddingBottom: SPACING.space_20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.Gray,
    marginVertical: SPACING.space_12,
    opacity: 0.3,
  },
});

export default UserAccountScreen;

