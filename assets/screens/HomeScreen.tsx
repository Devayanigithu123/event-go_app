import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Animated,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { Menu, Divider } from 'react-native-paper';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  EventDetails: { eventId: string };
  CreateEvent: undefined;
  QRScanner: undefined;
  AdminPanel: undefined;
  ManageEvents: undefined;
  EventReports: undefined;
  UserStatistics: undefined;
  ManageAdmins: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type UserRole = 'student' | 'manager' | 'administrator';

const translations = {
  en: {
    title: 'HNBGU Events',
    bookNow: 'Book Now',
    noEvents: 'No events found',
    language: 'Language',
    upcoming: 'Upcoming Events',
    popular: 'Popular Now',
    searchPlaceholder: 'Search events...',
    selectLocation: 'Select Location',
    currentLocation: 'Current Location',
    createEvent: 'Create Event',
    scanQR: 'Scan QR Code',
    adminPanel: 'Admin Panel',
    manageEvents: 'Manage Events',
    eventReports: 'Event Reports',
    userStats: 'User Statistics',
    manageManagers: 'Manage Managers',
    manageAdmins: 'Manage Admins',
  },
  hi: {
    title: 'एचएनबीजीयू इवेंट्स',
    bookNow: 'बुक करें',
    noEvents: 'कोई इवेंट नहीं मिला',
    language: 'भाषा',
    upcoming: 'आगामी कार्यक्रम',
    popular: 'लोकप्रिय अभी',
    searchPlaceholder: 'इवेंट खोजें...',
    selectLocation: 'स्थान चुनें',
    currentLocation: 'वर्तमान स्थान',
    createEvent: 'इवेंट बनाएं',
    scanQR: 'QR कोड स्कैन करें',
    adminPanel: 'एडमिन पैनल',
    manageEvents: 'इवेंट प्रबंधित करें',
    eventReports: 'इवेंट रिपोर्ट्स',
    userStats: 'उपयोगकर्ता आँकड़े',
    manageManagers: 'मैनेजर प्रबंधित करें',
    manageAdmins: 'एडमिन प्रबंधित करें',
  },
};

const universities = [
  {
    id: '1',
    name: 'HNB Garhwal University',
    shortName: 'HNBGU',
    location: 'Srinagar, Uttarakhand',
    image: 'https://www.hnbgu.ac.in/sites/default/files/HNBG-new-logo.png',
  },
  {
    id: '2',
    name: 'Delhi University',
    shortName: 'DU',
    location: 'New Delhi',
    image: 'https://w7.pngwing.com/pngs/103/517/png-transparent-faculty-of-law-university-of-delhi-deen-dayal-upadhyaya-college-school-of-open-learning-others-purple-logo-university.png',
  },
  {
    id: '3',
    name: 'Banaras Hindu University',
    shortName: 'BHU',
    location: 'Varanasi, UP',
    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Banaras_Hindu_University_Emblem_Seal_Transparent.png',
  },
  {
    id: '4',
    name: 'IIT Roorkee',
    shortName: 'IITR',
    location: 'Roorkee, Uttarakhand',
    image: 'https://i.pinimg.com/474x/4d/d1/7b/4dd17b6058bf7bd2f4f972082ec1ae5c.jpg',
  },
];

const eventsData = [
  {
    id: '1',
    name: 'Ananta Fest 2025',
    date: 'April 30, 2025',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHfcvPnqFpi1LEBGzx74mQYPgCRkWcgpqyKt7hUk-S_zf0emjqd0dztfYWbtuiyxjZnug&usqp=CAU',
    category: 'Festival',
    popular: true,
    description: 'Join us for a day of fun and festivities at Ananta Fest 2025!',
    universityId: '1',
  },
  {
    id: '2',
    name: 'Tech Summit',
    date: 'May 5, 2025',
    time: '09:00 AM',
    venue: 'SOET',
    image: 'https://www.networksplus.com/sites/default/files/styles/slideshow/public/2025-01/Screenshot%202025-01-27%20at%2010.44.57%E2%80%AFAM.png?itok=6Aw2OiSC',
    category: 'Technology',
    popular: true,
    description: 'Explore the latest in technology at the Tech Summit.',
    universityId: '1',
  },
  {
    id: '3',
    name: 'Cultural Night',
    date: 'May 22, 2025',
    time: '04:00 PM',
    venue: 'Parking Area',
    image: 'https://i.ytimg.com/vi/W2g2wr7WXTk/maxresdefault.jpg',
    category: 'Cultural',
    popular: false,
    description: 'Experience the rich culture of our campus at Cultural Night.',
    universityId: '1',
  },
  {
    id: '5',
    name: 'Budhi Kaaki Aur Chori',
    date: '4 April, 2025',
    time: '05:45 AM',
    venue: 'Mini Auditorium',
    image: '',
    category: 'Drama',
    popular: true,
    description: '" Lights. Drama. Action ! "',
    universityId: '1',
  },
  {
    id: '6',
    name: 'Sports Day',
    date: 'June 10, 2025',
    time: '08:00 AM',
    venue: 'University Ground',
    image: 'https://www.hnbgu.ac.in/sites/default/files/2023-02/IMG_7695.JPG',
    category: 'Sports',
    popular: true,
    description: 'Join us for a day of sports and competition!',
    universityId: '1',
  },
  {
    id: '7',
    name: 'DU Literature Fest',
    date: 'May 15, 2025',
    time: '11:00 AM',
    venue: 'Arts Faculty',
    image: 'https://apnaaddafest.in/blog/content/images/2024/01/DU-Lit.jpg',
    category: 'Literature',
    popular: true,
    description: 'Celebrating literature and arts at DU',
    universityId: '2',
  },
  {
    id: '8',
    name: 'BHU Tech Expo',
    date: 'June 5, 2025',
    time: '10:00 AM',
    venue: 'Engineering Block',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb8Is3cJJ8AseAta8xaIygnEEi2rzRZvIXqA&s',
    category: 'Technology',
    popular: true,
    description: 'Showcasing innovative tech projects',
    universityId: '3',
  },
];

const SubMenu = ({ title, children, style, contentStyle, titleStyle }: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Menu.Item 
          onPress={() => setVisible(true)}
          title={title}
          titleStyle={titleStyle}
          style={style}
        />
      }
      contentStyle={contentStyle}
    >
      {children}
    </Menu>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const isFocused = useIsFocused();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'popular'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(universities[0]);
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const [userRole, setUserRole] = useState<UserRole>('administrator'); // Change based on actual user
  const scrollY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isFocused && !isLoggedIn) {
      navigation.navigate('Login');
    }
  }, [isFocused, isLoggedIn, navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredEvents = eventsData.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeTab === 'popular' ? event.popular : true) &&
    event.universityId === selectedUniversity.id
  );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [145, 80],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleMenuAction = (action: string) => {
    setMenuVisible(false);
    console.log('Menu action:', action);
    
    switch (action) {
      case 'create_event':
        navigation.navigate('CreateEvent');
        break;
      case 'scan_qr':
        navigation.navigate('QRScanner');
        break;
      case 'admin_panel':
        navigation.navigate('AdminPanel');
        break;
      case 'manage_events':
        navigation.navigate('ManageEvents');
        break;
      case 'event_reports':
        navigation.navigate('EventReports');
        break;
      case 'user_statistics':
        navigation.navigate('UserStatistics');
        break;
      case 'manage_admins':
        navigation.navigate('ManageAdmins');
        break;
      default:
        console.warn('Unknown menu action:', action);
    }
  };

  const renderEventItem = ({ item }: { item: (typeof eventsData)[0] }) => {
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.image }} style={styles.eventImage} />
        <View style={styles.eventContent}>
          <Text style={styles.eventName}>{item.name}</Text>
          <Text style={styles.eventDescription} numberOfLines={2}>{item.description}</Text>
          <View style={styles.eventDetails}>
            <Text style={styles.eventText}>{item.date} | {item.time}</Text>
            <Text style={styles.eventText}>{item.venue}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>{translations[language].bookNow}</Text>
            <Icon name="arrow-right" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderUniversityItem = ({ item }: { item: (typeof universities)[0] }) => (
    <TouchableOpacity
      style={[
        styles.universityItem,
        selectedUniversity.id === item.id && styles.selectedUniversityItem
      ]}
      onPress={() => {
        setSelectedUniversity(item);
        setShowLocationModal(false);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.universityImage} />
      <View style={styles.universityInfo}>
        <Text style={styles.universityName}>{item.name}</Text>
        <Text style={styles.universityLocation}>{item.location}</Text>
      </View>
      {selectedUniversity.id === item.id && (
        <Icon name="check" size={20} color="#4CAF50" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <LinearGradient
          colors={['#FF7B00', '#FF4500']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: selectedUniversity.image }} 
                style={styles.logo}
              />
              <Text style={styles.headerText}>{selectedUniversity.shortName} Events</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')} 
                style={styles.languageButton}
              >
                <Text style={styles.languageText}>{language === 'en' ? 'हिन्दी' : 'English'}</Text>
              </TouchableOpacity>

              {(userRole === 'administrator' || userRole === 'manager') && (
                <Menu
                  visible={menuVisible}
                  onDismiss={closeMenu}
                  anchor={
                    <TouchableOpacity onPress={openMenu} style={styles.menuAnchor}>
                      <Icon name="ellipsis-v" size={24} color="white" />
                    </TouchableOpacity>
                  }
                  contentStyle={styles.menuContent}
                  style={styles.menuWrapper}
                >
                  {userRole === 'manager' && (
                    <>
                      <Menu.Item 
                        onPress={() => handleMenuAction('create_event')} 
                        title={translations[language].createEvent}
                        titleStyle={styles.menuItemText}
                      />
                      <Menu.Item 
                        onPress={() => handleMenuAction('scan_qr')} 
                        title={translations[language].scanQR}
                        titleStyle={styles.menuItemText}
                      />
                      <Menu.Item 
                        onPress={() => handleMenuAction('manage_events')} 
                        title={translations[language].manageEvents}
                        titleStyle={styles.menuItemText}
                      />
                    </>
                  )}
                  
                  {userRole === 'administrator' && (
                    <>
                      <SubMenu
                        title={translations[language].manageManagers}
                        contentStyle={styles.subMenuContent}
                        style={styles.subMenuWrapper}
                        titleStyle={styles.subMenuTitle}
                      >
                        <Menu.Item 
                          onPress={() => handleMenuAction('create_event')} 
                          title={translations[language].createEvent}
                          titleStyle={styles.subMenuItemText}
                        />
                        <Menu.Item 
                          onPress={() => handleMenuAction('scan_qr')} 
                          title={translations[language].scanQR}
                          titleStyle={styles.subMenuItemText}
                        />
                        <Menu.Item 
                          onPress={() => handleMenuAction('manage_events')} 
                          title={translations[language].manageEvents}
                          titleStyle={styles.subMenuItemText}
                        />
                      </SubMenu>
                      
                      <Divider style={styles.menuDivider} />
                      
                      <SubMenu
                        title={translations[language].manageAdmins}
                        contentStyle={styles.subMenuContent}
                        style={styles.subMenuWrapper}
                        titleStyle={styles.subMenuTitle}
                      >
                        <Menu.Item 
                          onPress={() => handleMenuAction('create_event')} 
                          title={translations[language].createEvent}
                          titleStyle={styles.subMenuItemText}
                        />
                        <Menu.Item 
                          onPress={() => handleMenuAction('event_reports')} 
                          title={translations[language].eventReports}
                          titleStyle={styles.subMenuItemText}
                        />
                        <Menu.Item 
                          onPress={() => handleMenuAction('user_statistics')} 
                          title={translations[language].userStats}
                          titleStyle={styles.subMenuItemText}
                        />
                        <Menu.Item 
                          onPress={() => handleMenuAction('manage_admins')} 
                          title={translations[language].manageAdmins}
                          titleStyle={styles.subMenuItemText}
                        />
                      </SubMenu>
                    </>
                  )}
                </Menu>
              )}
            </View>
          </View>
          <Animated.View style={{ opacity: headerOpacity }}>
            <Text style={styles.headerSubtext}>Discover amazing campus events 😍</Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <TouchableOpacity 
        style={styles.locationSelector}
        onPress={() => setShowLocationModal(true)}
      >
        <Icon name="map-marker" size={18} color="#FF7B00" />
        <Text style={styles.locationText}>
          {selectedUniversity.name} ({selectedUniversity.shortName})
        </Text>
        <Icon name="chevron-down" size={14} color="#666" />
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            {translations[language].upcoming}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'popular' && styles.activeTab]}
          onPress={() => setActiveTab('popular')}
        >
          <Text style={[styles.tabText, activeTab === 'popular' && styles.activeTabText]}>
            {translations[language].popular}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.noEventsText}>{translations[language].noEvents}</Text>}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } }}],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{translations[language].selectLocation}</Text>
            <TouchableOpacity 
              onPress={() => setShowLocationModal(false)}
              style={styles.closeButton}
            >
              <Icon name="times" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={universities}
            renderItem={renderUniversityItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.universityList}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 3,
  },
  headerSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  languageButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  menuAnchor: {
    padding: 10,
  },
  menuWrapper: {
    marginTop: 30, 
  },
  languageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginHorizontal: 20,
    marginTop: 150,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 5,
  },
  locationText: {
    flex: 1,
    marginLeft: 8,
    marginRight: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFA500',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventList: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 25,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  eventContent: {
    padding: 15,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  eventText: {
    fontSize: 12,
    color: '#888',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 5,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  universityList: {
    padding: 20,
  },
  universityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedUniversityItem: {
    backgroundColor: '#fff',
    borderColor: '#FFA500',
  },
  universityImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  universityLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  checkIcon: {
    marginLeft: 10,
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 0,
  },
  menuItemText: {
    color: '#333',
    fontSize: 14,
  },
  subMenuContent: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginLeft: 8,
  },
  subMenuWrapper: {
    marginTop: 0,
  },
  subMenuTitle: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subMenuItemText: {
    color: '#555',
    fontSize: 13,
    paddingLeft: 16,
  },
  menuDivider: {
    backgroundColor: '#eee',
    marginVertical: 4,
  },
});

export default HomeScreen;