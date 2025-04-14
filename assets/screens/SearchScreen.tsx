import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  image: string;
}

const API_URL = 'https://your-api.com/api/events/search';

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const fetchEvents = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const url = `${API_URL}?q=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      const data: Event[] = await response.json();
      setEvents(data);
      await saveSearchQuery(searchQuery);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching events:', error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const saveSearchQuery = async (query: string) => {
    try {
      let searches: string[] = JSON.parse((await AsyncStorage.getItem('recentSearches')) || '[]');
      if (!searches.includes(query)) {
        searches.unshift(query);
        searches = searches.slice(0, 5);
        await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
      }
      setRecentSearches(searches);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error saving search query:', error.message);
      }
    }
  };

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const searches = await AsyncStorage.getItem('recentSearches');
        if (searches) setRecentSearches(JSON.parse(searches));
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error loading recent searches:', error.message);
        }
      }
    };
    loadRecentSearches();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#888" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>
      {loading && <ActivityIndicator size="large" color="#FFA500" style={{ marginTop: 20 }} />}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventCard}>
            <Image source={{ uri: item.image }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventText}>{item.date} - {item.venue}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noResults}>No events found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8', padding: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 10 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, fontSize: 16, color: '#333' },
  clearIcon: { marginLeft: 8 },
  eventCard: { backgroundColor: '#FFF', marginBottom: 12, elevation: 3, borderRadius: 8 },
  eventImage: { width: '100%', height: 160, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  eventInfo: { padding: 12 },
  eventName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  eventText: { fontSize: 14, color: '#555' },
  noResults: { textAlign: 'center', fontSize: 16, color: '#AAA', marginTop: 20 },
});

export default SearchScreen;