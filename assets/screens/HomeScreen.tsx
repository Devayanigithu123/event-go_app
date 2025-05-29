import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  FlatListProps,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Animated,
  Dimensions,
  TextInput,
  Modal,
  ScrollView,
  Easing,
  NativeScrollEvent, 
  NativeSyntheticEvent,
  ListRenderItem,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { Menu, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
// Generic wrapper to preserve <T>
function createAnimatedFlatList<T>() {
  return Animated.createAnimatedComponent(
    FlatList as new () => FlatList<T>
  );
}


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as <T>(
  props: FlatListProps<T>
) => React.ReactElement;

interface EventItem  {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  category: string;
  popular: boolean;
  description: string;
  universityId: string;
  lastUpdated: string;
};


const translations = {
  en: {
    title: 'HNBGU Events',
    bookNow: 'Book Now',
    noEvents: 'No events found',
    noEventsDesc: 'No events match your criteria. Try adjusting your search or filters.',
    resetFilters: 'Reset Filters',
    loading: 'Loading events...',
    pullToRefresh: 'Pull to refresh',
    offlineMessage: 'You are offline. Some features may not be available.',
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
    noEventsDesc: 'कोई इवेंट आपकी खोज से मेल नहीं खाता। अपनी खोज या फ़िल्टर को समायोजित करने का प्रयास करें।',
    resetFilters: 'फिल्टर रीसेट करें',
    loading: 'इवेंट लोड हो रहे हैं...',
    pullToRefresh: 'ताज़ा करने के लिए खींचें',
    offlineMessage: 'आप ऑफलाइन हैं। कुछ सुविधाएँ उपलब्ध नहीं हो सकती हैं।',
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
    lastUpdated: '2025-03-15',
  },
  {
    id: '2',
    name: 'Rudraksh Fest 2025',
    date: 'May 10, 2025',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPhT0ngJa-YBhjTZGF2KKVmSNNMo8_0sqMQ&s',
    category: 'Festival',
    popular: true,
    description: 'Join us for a celebration of talent, creativity, and campus spirit like never before!',
    universityId: '1',
    lastUpdated: '2025-03-15',
  },
  {
    id: '3',
    name: 'Tech Summit',
    date: 'May 5, 2025',
    time: '09:00 AM',
    venue: 'SOET',
    image: 'https://www.networksplus.com/sites/default/files/styles/slideshow/public/2025-01/Screenshot%202025-01-27%20at%2010.44.57%E2%80%AFAM.png?itok=6Aw2OiSC',
    category: 'Technology',
    popular: true,
    description: 'Explore the latest in technology at the Tech Summit.',
    universityId: '1',
    lastUpdated: '2025-03-10',
  },
  {
    id: '4',
    name: 'Cultural Night',
    date: 'May 22, 2025',
    time: '04:00 PM',
    venue: 'Parking Area',
    image: 'https://i.ytimg.com/vi/W2g2wr7WXTk/maxresdefault.jpg',
    category: 'Cultural',
    popular: false,
    description: 'Experience the rich culture of our campus at Cultural Night.',
    universityId: '1',
    lastUpdated: '2025-03-12',
  },
  {
    id: '5',
    name: 'Budhi Kaaki Aur Chori',
    date: '4 April, 2025',
    time: '05:45 AM',
    venue: 'Mini Auditorium',
    image: 'https://media-hosting.imagekit.io/0c0188d1ca624d1a/play.png?Expires=1839604552&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=AOxaif5OaDqbQKTSVrecZjbYUGeVkRdeHfmosUQI1mh0huWpqn8FR4FbBQ6~kwV8vU71poW0KBwcDq4oy8iqSfi~6o7nHU2W1THOMh4xzWCnAakQ66bHAho4zzQhXyiDMn8ODHjWR~FTJOxTfLZPjCPMklfdAxrWXs-MuJAwtI--a2fwx53CFMOwicserol~TV~gN~b7PkXReUB5VIwW9PakUS5J31KwziC-9hs92u3kgjPqsHsnv2I3fgCeVpAVDqsv~ZDI~w12c79xBzYBDhQJzqyX3hncXhFFN995PeRiPF~KmFLjciniCJFlHbWVw8KHRKVBbm-XD7kIfZX1oA__',
    category: 'Drama',
    popular: true,
    description: '" Lights. Drama. Action ! "',
    universityId: '1',
    lastUpdated: '2025-03-18',
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
    lastUpdated: '2025-03-05',
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
    lastUpdated: '2025-03-08',
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
    lastUpdated: '2025-03-14',
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

  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'popular'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(universities[0]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [cachedEvents, setCachedEvents] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const [userRole, setUserRole] = useState<UserRole>('administrator');
  const HEADER_EXPANDED_HEIGHT = 116;
  const HEADER_COLLAPSED_HEIGHT = 0;
  const SCROLL_DISTANCE = HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT;
  const flatListRef = useRef<FlatList>(null);
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
  

  // Track scroll direction and position
const scrollDirection = useRef<'up'|'down'>('down');
const prevOffset = useRef(0);
const scrollY = useRef(new Animated.Value(0)).current;
const isHidden = useRef(false);
const isHiding = useRef(false);
const lastScrollY = useRef(0);
  // Animation values for header components
  
  const headerScaleY = scrollY.interpolate({
  inputRange: [0, SCROLL_DISTANCE],
  outputRange: [1, HEADER_COLLAPSED_HEIGHT / HEADER_EXPANDED_HEIGHT],
  extrapolate: 'clamp',
});

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

   const locationTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -HEADER_EXPANDED_HEIGHT],
    extrapolate: 'clamp',
  });

  const locationOpacity = scrollY.interpolate({
  inputRange: [0, SCROLL_DISTANCE * 0.7],
  outputRange: [1, 0], // fades out
  extrapolate: 'clamp',
});

  const searchTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -SCROLL_DISTANCE * 2],
    extrapolate: 'clamp',
  });

  const searchOpacity = scrollY.interpolate({
  inputRange: [0, SCROLL_DISTANCE * 0.7],
  outputRange: [1, 0], // fades out
  extrapolate: 'clamp',
});

  const tabTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -SCROLL_DISTANCE * 2.5],
    extrapolate: 'clamp',
  });

  
  const tabOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE * 0.7],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE * 0.5],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });
  // Shared animation for all secondary containers
const containerTranslateY = scrollY.interpolate({
  inputRange: [0, SCROLL_DISTANCE],
  outputRange: [0, -SCROLL_DISTANCE * 1.5],
  extrapolate: 'clamp',
});

const containerOpacity = scrollY.interpolate({
  inputRange: [0, SCROLL_DISTANCE * 0.7],
  outputRange: [1, 0],
  extrapolate: 'clamp',
});
  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -SCROLL_DISTANCE * 0.5],
    extrapolate: 'clamp',
  });
  
  const handleScroll = Animated.event(
  [{ nativeEvent: { contentOffset: { y: scrollY } }}],
  {
    useNativeDriver: true,
    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const isScrollingDown = currentY > lastScrollY.current;
      lastScrollY.current = currentY;

      // Immediately show when starting to scroll down
      if (isScrollingDown && isHiding.current) {
        isHiding.current = false;
        Animated.timing(scrollY, {
          toValue: 0,
          duration: 0, // Instant show
          useNativeDriver: true
        }).start();
      }
    }
  }
);

const handleScrollEndDrag = () => {
  if (lastScrollY.current > 50 && !isHiding.current) {
    isHiding.current = true;
    Animated.timing(scrollY, {
      toValue: SCROLL_DISTANCE,
      duration: 300, // Smooth hide
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
  }
};
  React.useEffect(() => {
    if (isFocused && !isLoggedIn) {
      navigation.navigate('Login');
    }
  }, [isFocused, isLoggedIn, navigation]);

  // Offline detection
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
      
      if (state.isConnected && isOffline) {
        onRefresh();
      }
    });
    
    return () => unsubscribe();
  }, [isOffline]);

  // Load cached events
  const loadCachedEvents = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem('cachedEvents');
      if (cached) setCachedEvents(JSON.parse(cached));
    } catch (error) {
      console.error('Failed to load cached events', error);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const isEventSoon = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 3;
  };

  const filteredEvents: EventItem[] = (isOffline ? cachedEvents : eventsData).filter(
  (event: EventItem) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeTab === 'popular' ? event.popular : true) &&
    event.universityId === selectedUniversity.id
);



  const handleMenuAction = (action: string) => {
    setMenuVisible(false);
    
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

  const renderEventItem: ListRenderItem<EventItem> = ({ item }) => {
    const isPopular = item.popular;
    const isSoon = isEventSoon(item.date); 
    

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.image }} style={styles.eventImage} />
        
        <View style={styles.badgeContainer}>
          {isPopular && (
            <View style={[styles.eventBadge, styles.popularBadge]}>
              <Icon name="star" size={12} color="white" />
              <Text style={styles.eventBadgeText}>Popular</Text>
            </View>
          )}
          
          <View style={[styles.eventBadge, styles.categoryBadge]}>
            <Text style={styles.eventBadgeText}>{item.category}</Text>
          </View>
          
          {isSoon && (
            <View style={[styles.eventBadge, styles.soonBadge]}>
              <Icon name="clock-o" size={12} color="white" />
              <Text style={styles.eventBadgeText}>Soon</Text>
            </View>
          )}
        </View>
        
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
  }

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
      {/* Offline Banner */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Icon name="wifi" size={16} color="white" />
          <Text style={styles.offlineText}>
            {translations[language].offlineMessage}
          </Text>
        </View>
      )}

      {/* Header */}
<Animated.View style={[styles.headerContainer, { 
  // Remove height animation and replace with transform
  transform: [
    { translateY: headerTranslateY },
    { 
      scaleY: scrollY.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [1, HEADER_COLLAPSED_HEIGHT / HEADER_EXPANDED_HEIGHT],
        extrapolate: 'clamp',
      })
    }
  ],
  // Set initial height
  height: HEADER_EXPANDED_HEIGHT,
}]}>
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
          <Animated.View style={{ opacity: headerContentOpacity }}>
            <Text style={styles.headerSubtext}>Discover amazing campus events here😍</Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Location Selector */}
      <Animated.View style={[styles.locationContainer, { 
        transform: [{ translateY: locationTranslateY }],
        opacity: locationOpacity,
      
      }]}>
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
      </Animated.View>

      {/* Search Container */}
      <Animated.View style={[
        styles.searchContainer,
        searchFocused && styles.searchContainerFocused,
        { 
          transform: [{ translateY: searchTranslateY }],
          opacity: searchOpacity,
        }
        
      ]}>
        <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder={translations[language].searchPlaceholder}
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.searchClearButton}
          >
            <Icon name="times-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Tab Container */}
      <Animated.View style={[styles.tabContainer, { 
        transform: [{ translateY: tabTranslateY }],
        opacity: tabOpacity,
      }]}>
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
      </Animated.View>

      {/* Event List */}
      <Animated.View style={{ 
        flex: 1, 
        transform: [{ translateY: contentTranslateY }] 
      }}>
<AnimatedFlatList<EventItem>
  ref={flatListRef}
  data={filteredEvents}
  renderItem={renderEventItem}
  keyExtractor={(item: EventItem) => `${item.id}_${item.lastUpdated}`}
  onScroll={handleScroll}
  onScrollEndDrag={handleScrollEndDrag}
  scrollEventThrottle={16}
  onScrollBeginDrag={() => scrollY.stopAnimation()}
  contentContainerStyle={[styles.eventList, { paddingTop: HEADER_EXPANDED_HEIGHT + 160 }]}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#FF7B00', '#FF5722']}
      progressBackgroundColor="#ffffff"
      title={refreshing ? translations[language].loading : translations[language].pullToRefresh}
      titleColor="#666"
      tintColor="#FF7B00"
    />
  }
  ListEmptyComponent={
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{translations[language].noEvents}</Text>
      <Text style={styles.emptyText}>
        {translations[language].noEventsDesc}
      </Text>
      {(searchQuery.length > 0 || activeTab !== 'upcoming') && (
        <TouchableOpacity 
          style={styles.emptyButton}
          onPress={() => {
            setSearchQuery('');
            setActiveTab('upcoming');
          }}
        >
          <Text style={styles.emptyButtonText}>
            {translations[language].resetFilters}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  }
/>
      </Animated.View>

      {/* Modal */}
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
    zIndex: 100,
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
    gap: 8,
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 10,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  headerText: {
    fontSize: 23,
    fontWeight: '800',
    color: 'white',
    marginTop: 1,
    textShadowColor: 'rgba(255,123,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 0.5,
  },
  headerSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  languageButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  menuAnchor: {
    padding: 10,
  },
  menuWrapper: {
    marginTop: 30, 
  },
  locationContainer: {
    position: 'absolute',
    top: 116,
    left: 20,
    right: 20,
    zIndex: 90,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    flex: 1,
    marginLeft: 8,
    marginRight: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  searchContainer: {
    position: 'absolute',
    top: 165,
    left: 20,
    right: 20,
    zIndex: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#FF7B00',
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
  },
  searchContainerFocused: {
    borderColor: '#FF7B00',
    borderWidth: 1,
    shadowColor: '#FF7B00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  searchIcon: {
    marginRight: 10,
    color: '#718096'
  },
  searchInput: {
    flex: 1,
    padding: 0,
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  searchClearButton: {
    marginLeft: 10,
    padding: 4,
  },
  tabContainer: {
    position: 'absolute',
    top: 213,
    left: 20,
    right: 20,
    zIndex: 70,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#FFA500',
    shadowColor: '#FF7B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '700',
  },
  eventList: {
    paddingTop: 220,
    paddingBottom: 100,
    paddingHorizontal: 25,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    marginBottom: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,123,0,0.2)',
    shadowColor: '#FF7B00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
    transform: [{ perspective: 1000 }],
  },
  eventImage: {
    width: '100%',
    height: 205,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  eventContent: {
    padding: 15,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventText: {
    fontSize: 13,
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
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 5,
  },
  hiddenContainer: {
    opacity: 0,
    height: 0,
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
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    zIndex: 2,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  eventBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
    textTransform: 'uppercase',
  },
  popularBadge: {
    backgroundColor: '#FF5722',
  },
  categoryBadge: {
    backgroundColor: '#4CAF50',
  },
  soonBadge: {
    backgroundColor: '#FF9800',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#FF7B00',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  offlineBanner: {
    backgroundColor: '#FF3D00',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    marginTop: 60,
  },
  offlineText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;