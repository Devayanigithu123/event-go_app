import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // Update with your navigation types

type AdminPanelNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdminPanel'>;

const AdminPanelScreen = () => {
  const navigation = useNavigation<AdminPanelNavigationProp>();
  const [activeTab, setActiveTab] = useState<'events' | 'users' | 'reports'>('events');

  // Mock data - replace with your actual data fetching
  const events = [
    { id: '1', name: 'Tech Fest', date: '2023-12-15', attendees: 120 },
    { id: '2', name: 'Cultural Night', date: '2023-12-20', attendees: 200 },
  ];

  const users = [
    { id: '1', name: 'Admin User', email: 'admin@hnbgu.ac.in', role: 'admin' },
    { id: '2', name: 'Event Manager', email: 'manager@hnbgu.ac.in', role: 'manager' },
  ];

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => console.log('Deleted event:', eventId) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Dashboard</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={styles.tabText}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={styles.tabText}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={styles.tabText}>Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'events' && (
          <>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('CreateEvent')}
            >
              <Icon name="plus" size={16} color="white" />
              <Text style={styles.addButtonText}>Add New Event</Text>
            </TouchableOpacity>

            {events.map(event => (
              <View key={event.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text style={styles.eventDate}>Date: {event.date}</Text>
                  <Text style={styles.eventAttendees}>Attendees: {event.attendees}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.editButton}>
                    <Icon name="pencil" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteEvent(event.id)}
                  >
                    <Icon name="trash" size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'users' && (
          <>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="plus" size={16} color="white" />
              <Text style={styles.addButtonText}>Add New User</Text>
            </TouchableOpacity>

            {users.map(user => (
              <View key={user.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={[
                    styles.userRole,
                    user.role === 'admin' && styles.adminRole,
                    user.role === 'manager' && styles.managerRole
                  ]}>
                    {user.role.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.editButton}>
                    <Icon name="pencil" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton}>
                    <Icon name="trash" size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'reports' && (
          <View style={styles.reportsContainer}>
            <Text style={styles.sectionTitle}>Event Reports</Text>
            <View style={styles.reportCard}>
              <Text style={styles.reportText}>Total Events: 15</Text>
              <Text style={styles.reportText}>Total Attendees: 1,250</Text>
            </View>

            <Text style={styles.sectionTitle}>User Statistics</Text>
            <View style={styles.reportCard}>
              <Text style={styles.reportText}>Total Users: 42</Text>
              <Text style={styles.reportText}>Active Today: 18</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF7B00',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF7B00',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#FF7B00',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    marginBottom: 10,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDate: {
    color: '#666',
    marginBottom: 3,
  },
  eventAttendees: {
    color: '#666',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    color: '#666',
    marginBottom: 3,
  },
  userRole: {
    padding: 3,
    borderRadius: 3,
    alignSelf: 'flex-start',
    fontSize: 12,
    color: 'white',
    backgroundColor: '#9E9E9E',
  },
  adminRole: {
    backgroundColor: '#F44336',
  },
  managerRole: {
    backgroundColor: '#4CAF50',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  editButton: {
    marginRight: 15,
  },
  deleteButton: {},
  reportsContainer: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  reportCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  reportText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default AdminPanelScreen;