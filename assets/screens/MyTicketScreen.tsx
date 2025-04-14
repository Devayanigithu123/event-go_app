import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  MyTickets: undefined;
  EventDetails: { eventId: string };
};

type MyTicketsScreenProp = NativeStackNavigationProp<RootStackParamList, 'MyTickets'>;

type TicketStatus = 'confirmed' | 'cancelled' | 'used';

type Ticket = {
  id: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  ticketType: string;
  price: string;
  bookingId: string;
  seat: string;
  bookingDate: string;
  status: TicketStatus;
};

type TicketsData = {
  upcoming: Ticket[];
  past: Ticket[];
};

const MyTicketsScreen = () => {
  const navigation = useNavigation<MyTicketsScreenProp>();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [ticketsData, setTicketsData] = useState<TicketsData>({ 
    upcoming: [], 
    past: [] 
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: TicketsData = {
          upcoming: [
            {
              id: '1',
              eventName: 'Ananta Fest',
              date: '2025-04-30',
              time: '10:00 AM ',
              venue: 'Main Auditorium',
              image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHfcvPnqFpi1LEBGzx74mQYPgCRkWcgpqyKt7hUk-S_zf0emjqd0dztfYWbtuiyxjZnug&usqp=CAU',
              ticketType: 'VIP',
              price: '₹199',
              bookingId: 'HNBGU2023XYZ123',
              seat: 'A-12',
              bookingDate: '2025-04-25',
              status: 'confirmed'
            },
            {
              id: '2',
              eventName: 'Tech Summit',
              date: '2025-05-05',
              time: '09:00 AM ',
              venue: 'SOET',
              image: 'https://www.networksplus.com/sites/default/files/styles/slideshow/public/2025-01/Screenshot%202025-01-27%20at%2010.44.57%E2%80%AFAM.png?itok=6Aw2OiSC',
              ticketType: 'General',
              price: '₹99',
              bookingId: 'HNBGU2023ABC456',
              seat: 'NA',
              bookingDate: '2025-05-01',
              status: 'confirmed'
            }
          ],
          past: [
            {
              id: '3',
              eventName: 'Freshers Party',
              date: '2025-07-10',
              time: '10:00 AM',
              venue: 'Aashirwaad Hotel',
              image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpmFTOh3BM1ovMrFX8eLS162NNaA0REuzguQ&s',
              ticketType: 'General',
              price: 'Free',
              bookingId: 'HNBGU2023DEF789',
              seat: 'NA',
              bookingDate: '2025-07-02',
              status: 'used'
            }
          ]
        };
        
        setTicketsData(mockData);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        Alert.alert('Error', 'Failed to load tickets. Please try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    
    fetchTickets();
  }, [refreshing]);

  const handleRefresh = () => {
    setRefreshing(true);
  };

  const handleCancelTicket = (ticketId: string) => {
    Alert.alert(
      'Cancel Ticket',
      'Are you sure you want to cancel this ticket?',
      [
        { 
          text: 'No', 
          style: 'cancel',
          onPress: () => console.log('Cancel Pressed')
        },
        { 
          text: 'Yes', 
          onPress: () => {
            setTicketsData(prev => ({
              ...prev,
              upcoming: prev.upcoming.filter(ticket => ticket.id !== ticketId)
            }));
            Alert.alert('Cancelled', 'Your ticket has been cancelled successfully');
          }
        }
      ]
    );
  };

  const handleDownloadTicket = (ticketId: string) => {
    Alert.alert('Download', 'Ticket downloaded to your device');
  };

  const handleViewEvent = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const renderTicketItem = ({ item }: { item: Ticket }) => (
    <TouchableOpacity 
      style={styles.ticketCard}
      onPress={() => handleViewEvent(item.id)}
      activeOpacity={0.9}
    >
      <LinearGradient 
        colors={['#FF7B00', '#FF4500']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 0 }}
        style={styles.ticketHeader}
      >
        <View style={styles.ticketHeaderContent}>
          <Text style={styles.ticketHeaderText}>HNBGU E-TICKET</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'confirmed' && styles.statusConfirmed,
            item.status === 'cancelled' && styles.statusCancelled,
            item.status === 'used' && styles.statusUsed
          ]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.ticketBody}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.eventImage} 
          resizeMode="cover" 
        />
        
        <View style={styles.eventInfo}>
          <Text style={styles.eventName} numberOfLines={2}>{item.eventName}</Text>
          
          <View style={styles.detailRow}>
            <Icon name="calendar-outline" size={16} color="#555" />
            <Text style={styles.detailText}>{formatDate(item.date)} • {item.time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="location-outline" size={16} color="#555" />
            <Text style={styles.detailText} numberOfLines={1}>{item.venue}</Text>
          </View>
          
          <View style={styles.ticketDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Ticket Type</Text>
              <Text style={styles.detailValue}>{item.ticketType}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Seat</Text>
              <Text style={styles.detailValue}>{item.seat}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>{item.price}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.qrContainer}>
          <QRCode 
            value={item.bookingId} 
            size={width * 0.2} 
            color="black" 
            backgroundColor="white" 
          />
          <Text style={styles.bookingId}>Booking ID: {item.bookingId}</Text>
        </View>
      </View>
      
      {activeTab === 'upcoming' && item.status === 'confirmed' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.downloadButton} 
            onPress={() => handleDownloadTicket(item.id)}
          >
            <Icon name="download-outline" size={18} color="#FF7B00" />
            <Text style={[styles.buttonText, { color: '#FF7B00' }]}>Download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => handleCancelTicket(item.id)}
          >
            <Icon name="close-circle-outline" size={18} color="#FF4500" />
            <Text style={[styles.buttonText, { color: '#FF4500' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF7B00" />
        <Text style={styles.loaderText}>Loading your tickets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF7B00" barStyle="light-content" />
      
      <LinearGradient
        colors={['#FF7B00', '#FF4500']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Tickets</Text>
      </LinearGradient>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'upcoming' && styles.activeTab
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'upcoming' && styles.activeTabText
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'past' && styles.activeTab
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'past' && styles.activeTabText
          ]}>
            Past Events
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={activeTab === 'upcoming' ? ticketsData.upcoming : ticketsData.past}
        renderItem={renderTicketItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="ticket-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No {activeTab} tickets found</Text>
            <Text style={styles.emptySubText}>
              {activeTab === 'upcoming' 
                ? 'Book events to see them here' 
                : 'Your attended events will appear here'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loaderText: {
    marginTop: 10,
    color: '#FF7B00',
    fontSize: 16
  },
  header: {
    
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3
  },
  headerTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#F0F4F8',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  activeTab: {
    backgroundColor: '#FF7B00',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500'
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600'
  },
  listContent: {
    paddingBottom: 20
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  ticketHeader: {
    padding: 12
  },
  ticketHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ticketHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#38a169'
  },
  statusCancelled: {
    backgroundColor: '#e53e3e'
  },
  statusUsed: {
    backgroundColor: '#718096'
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  ticketBody: {
    padding: 15
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15
  },
  eventInfo: {
    width: '100%'
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flexShrink: 1
  },
  ticketDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  detailItem: {
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  bookingId: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontWeight: '500'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF7B00',
    backgroundColor: 'rgba(255, 123, 0, 0.1)'
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF4500',
    backgroundColor: 'rgba(255, 69, 0, 0.1)'
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginTop: 15
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5
  }
});

export default MyTicketsScreen;