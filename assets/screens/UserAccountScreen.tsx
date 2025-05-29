import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import React, { useState } from 'react';
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
  TouchableOpacity,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppHeader from '../components/AppHeader';
import SettingComponent from '../components/SettingComponent';

console.log("✅ UserAccountScreen mounted");


const UserAccountScreen = ({ navigation }: any) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

    {/* Floating Header */}
      <View style={styles.headerContainer}>
        <AppHeader name="close" header="My Profile" action={() => navigation.goBack()} />
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollView} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            
            {/* Profile Section */}
            <View style={styles.profileContainer}>
              <View style={styles.avatarWrapper}>
                <Image 
                  source={{ uri: 'https://imgcdn.stablediffusionweb.com/2024/3/31/a07c234b-ab97-4ad4-96b1-e1e88ec45e45.jpg' }} 
                  style={styles.avatarImage}
                />
              </View>
              <Text style={styles.avatarText}>Tanisha Chhimwal</Text>
              <Text style={styles.membershipText}>Gold Member</Text>
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Settings Section */}
            <View style={styles.settingsContainer}>
              {/* Account Settings */}
              <SettingComponent 
                icon="person-circle-sharp" 
                heading="Account" 
                subheading="Edit profile, change password"
                onPress={() => navigation.navigate('AccountSettings')}
              />
              <View style={styles.divider} />

              {/* Notification Settings with Switch */}
              <View style={styles.settingRow}>
                <SettingComponent
                  icon="notifications-outline"
                  heading="Notifications"
                  subheading="Event reminders, updates"
                />
                <Switch
                  value={notificationsEnabled}
                  onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  trackColor={{ true: COLORS.Primary, false: COLORS.Gray }}
                />
              </View>
              <View style={styles.divider} />

              {/* Dark Mode with Switch */}
              <View style={styles.settingRow}>
                <SettingComponent
                  icon="moon-outline"
                  heading="Dark Mode"
                  subheading="Switch between themes"
                />
                <Switch
                  value={darkModeEnabled}
                  onValueChange={() => setDarkModeEnabled(!darkModeEnabled)}
                  trackColor={{ true: COLORS.Primary, false: COLORS.Gray }}
                />
              </View>
              <View style={styles.divider} />

              
              {/* Event Preferences */}
              <SettingComponent 
                icon="calendar-outline" 
                heading="Event Preferences" 
                subheading="Categories, locations"
                onPress={() => navigation.navigate('EventPreferences')}
              />
              <View style={styles.divider} />

              {/* Help & Support */}
              <SettingComponent 
                icon="help-circle-outline" 
                heading="Help & Support" 
                subheading="contact us"
                onPress={() => navigation.navigate('HelpSupport')}
              />
              <View style={styles.divider} />


              {/* Logout */}
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Icon name="log-out-outline" size={24} color={COLORS.Red} />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
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
    backgroundColor: '#ffffff ',
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
    paddingBottom: 20,
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
    overflow: 'hidden',
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
  membershipText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Gold,
    marginTop: SPACING.space_4,
  },
  editProfileButton: {
    marginTop: SPACING.space_16,
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
    paddingHorizontal: SPACING.space_20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.Gray,
    marginVertical: SPACING.space_12,
    opacity: 0.2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_16,
    marginTop: SPACING.space_12,
  },
  logoutText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.Red,
    marginLeft: SPACING.space_16,
  },
});

export default UserAccountScreen;