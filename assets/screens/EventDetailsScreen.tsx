import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

type EventType = {
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  image: string;
};

const eventsData: Record<string, EventType> = {
  '1': {
    name: 'Ananta Fest 2025',
    date: 'April 30, 2025',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    description: 'The biggest cultural fest at HNBGU with music, dance, Modelling, Games and many more! We are glad to see you here!!!',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHfcvPnqFpi1LEBGzx74mQYPgCRkWcgpqyKt7hUk-S_zf0emjqd0dztfYWbtuiyxjZnug&usqp=CAU',
  },
  '2': {
    name: 'Tech Fest 2025',
    date: 'May 15, 2025',
    time: '11:00 AM',
    venue: 'Engineering Block',
    description: 'A festival dedicated to technology and innovation, featuring workshops, hackathons, and tech talks.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6KxY1vZc3z8jJmXkF4y0n7gk6OaWvX1b8rQ&usqp=CAU',
  },
  '3': {
    name: 'Cultural Night 2025',
    date: 'June 20, 2025',
    time: '7:00 PM',
    venue: 'Open Air Theatre',
    description: 'An evening of cultural performances, including dance, music, and drama by students.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6KxY1vZc3z8jJmXkF4y0n7gk6OaWvX1b8rQ&usqp=CAU',
  },
  '4': {
    name: 'Sports Day 2025',
    date: 'July 10, 2025',
    time: '9:00 AM',
    venue: 'University Ground',
    description: 'A day filled with sports competitions and activities for students to showcase their athletic skills.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6KxY1vZc3z8jJmXkF4y0n7gk6OaWvX1b8rQ&usqp=CAU',
  },
  '5': {
    name: 'Art and Craft Exhibition 2025',
    date: 'August 5, 2025',
    time: '10:00 AM',
    venue: 'Art Gallery',
    description: 'An exhibition showcasing the artistic talents of students, featuring paintings, sculptures, and crafts.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6KxY1vZc3z8jJmXkF4y0n7gk6OaWvX1b8rQ&usqp=CAU',
  },
  '6': {
    name: 'Literary Fest 2025',
    date: 'September 15, 2025',
    time: '11:00 AM',
    venue: 'Library Auditorium',
    description: 'A celebration of literature with book readings, poetry slams, and author interactions.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6KxY1vZc3z8jJmXkF4y0n7gk6OaWvX1b8rQ&usqp=CAU',
  },
  '7': {
    name: 'Science Fair 2025',
    date: 'October 20, 2025',
    time: '10:00 AM',
    venue: 'Science Block',
    description: 'An exhibition of innovative science projects and experiments by students.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6KxY1vZc3z8jJmXkF4y0n7gk6OaWvX1b8rQ&usqp=CAU',
  },
};

const EventDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params as { eventId: string };
  const event = eventsData[eventId];
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Button pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient 
        colors={['#FF7B00', '#FF4500']} 
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color="white" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Event Image with Shadow */}
      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
        <Image 
          source={{ uri: event.image }} 
          style={styles.eventImage} 
          resizeMode="cover"
        />
      </Animated.View>

      {/* Event Details */}
      <Animated.View style={[styles.eventDetails, { opacity: fadeAnim }]}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        
        {/* Detail Row with Icons */}
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <Icon name="calendar-outline" size={20} color="#FF7B00" />
          </View>
          <Text style={styles.detailText}>{event.date} • {event.time}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <Icon name="location-outline" size={20} color="#FF7B00" />
          </View>
          <Text style={styles.detailText}>{event.venue}</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>About the Event</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Music</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Dance</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Festival</Text>
          </View>
        </View>

        {/* Book Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={styles.bookButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF7B00', '#FF4500']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
              <Icon name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  imageContainer: {
    marginTop: 100,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: 'white',
  },
  eventImage: {
    width: '100%',
    height: 220,
    borderRadius: 20,
  },
  eventDetails: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'Roboto',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 123, 0, 0.1)',
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Roboto',
  },
  descriptionContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    fontFamily: 'Roboto',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    marginBottom: 5,
  },
  tag: {
    backgroundColor: 'rgba(255, 123, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FF7B00',
    fontSize: 12,
    fontWeight: '500',
  },
  bookButton: {
    marginTop: 25,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bookButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default EventDetailsScreen;