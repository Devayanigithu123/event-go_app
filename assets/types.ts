import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  image_url: string;
}

export type RootStackParamList = {
  Home: undefined;
  EventDetails: { event: Event };
  AllEvents: undefined;
  AdminPanel: undefined;
  CreateEvent: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
