import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';


type RootStackParamList = {
  Home: undefined;
  CreateEvent: undefined;
};

type CreateEventScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateEvent'>;

interface EventForm {
  title: string;
  description: string;
  venue: string;
  date: Date;
  time: Date;

}

const CreateEventScreen = () => {
  const navigation = useNavigation<CreateEventScreenNavigationProp>();
  const [event, setEvent] = useState<EventForm>({
    title: '',
    description: '',
    venue: '',
    date: new Date(),
    time: new Date(),

  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [eventImage, setEventImage] = useState<string | null>(null);
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImageUri = response.assets[0]?.uri;
          if (selectedImageUri) {
            setEventImage(selectedImageUri);
          }
        }
      }
    );
  };
  


  const handleDateChange = (
    event: DateTimePickerEvent, 
    selectedDate?: Date
  ) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEvent(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date
  ) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setEvent(prev => ({ ...prev, time: selectedTime }));
    }
  };

  const handleSubmit = () => {
    if (!event.title.trim()) {
      Alert.alert('Error', 'Event title is required');
      return;
    }
    if (!event.venue.trim()) {
      Alert.alert('Error', 'Venue is required');
      return;
    }

    const formattedEvent = {
      ...event,
      date: event.date.toLocaleDateString(),
      time: event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    console.log('Event created:', formattedEvent);
    Alert.alert('Success', 'Event created successfully!');
    navigation.goBack();
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Text style={styles.header}>Create New Event</Text>

      {/* Title */}
      <Text style={styles.label}>Event Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="Tech Summit 2025"
        placeholderTextColor="#888"
        value={event.title}
        onChangeText={(text) => setEvent(prev => ({ ...prev, title: text }))}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Describe your event..."
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        value={event.description}
        onChangeText={(text) => setEvent(prev => ({ ...prev, description: text }))}
      />

      {/* Venue */}
      <Text style={styles.label}>Venue *</Text>
      <TextInput
        style={styles.input}
        placeholder="Main Auditorium"
        placeholderTextColor="#888"
        value={event.venue}
        onChangeText={(text) => setEvent(prev => ({ ...prev, venue: text }))}
      />

      {/*Image Upload */}
      <Text style={styles.label}>Event Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {eventImage ? (
          <Image source={{uri: eventImage}} style={styles.imagePicker} />
        ):(
          <Text style={styles.imagePlaceholder}>Select an Image</Text>
        )}

      </TouchableOpacity>


      {/* Date Picker */}
      <Text style={styles.label}>Date *</Text>
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{event.date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={event.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      <Text style={styles.label}>Time *</Text>
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowTimePicker(true)}
      >
        <Text>
          {event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={event.time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FF7B00', '#FF4500']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.submitText}>Create Event</Text>
          <Icon name="checkmark-circle" size={20} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 25,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 10,
    marginTop: 20,
    overflow: 'hidden',
  },
  gradient: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  imagePicker: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    height: 150,
  },
  
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  
  imagePlaceholder: {
    color: '#888',
    fontSize: 16,
  },
  
});

export default CreateEventScreen;