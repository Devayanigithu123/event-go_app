import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, PermissionsAndroid, Linking} from 'react-native';
import QRCodeScanner, { RNQRCodeScannerProps }  from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // Define your navigation types
import { findNodeHandle } from 'react-native';


type ApiResponse = {
  valid: boolean;
  event_name?: string;
  message?: string;
};

type ScanEvent = {
  data: string;
};

const API_URL = 'https://hnbgu-api.example.com/validate';

const QrScannerScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<any>(null);


  scannerRef.current?.reactivate();

  // Check camera permissions (Android)
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs access to your camera",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          Alert.alert("Permission denied");
        } else {
          // RESULTS.NEVER_ASK_AGAIN
          Alert.alert(
            "Permission permanently denied",
            "Go to app settings to enable camera permission",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() }
            ]
          );
        }
      } catch (err) {
        console.warn(err);
        setHasPermission(false);
      }
    };

    requestCameraPermission();
  }, []);

  const validateTicket = async (ticketId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(API_URL, { ticket_id: ticketId });
      
      if (response.data.valid) {
        Alert.alert(
          'Access Granted',
          `Welcome to ${response.data.event_name || 'the event'}!`,
          [{ text: 'OK', onPress: () => scannerRef.current?.reactivate() }]
        );
      } else {
        Alert.alert(
          'Invalid Ticket',
          response.data.message || 'This ticket is not valid.',
          [{ text: 'OK', onPress: () => scannerRef.current?.reactivate() }]
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      Alert.alert(
        'Error',
        axiosError.response?.data?.message || 'Network error. Please try again.',
        [{ text: 'OK', onPress: () => scannerRef.current?.reactivate() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onScan = (e: ScanEvent) => {
    validateTicket(e.data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Text style={styles.permissionText}>
          Please enable camera permissions in settings
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <QRCodeScanner
        onRead={onScan}
        flashMode={RNCamera.Constants.FlashMode.auto}
        showMarker={true}
        reactivate={true}
        reactivateTimeout={3000}
        ref={scannerRef}
        topContent={
          <Text style={styles.headerText}>
            Scan HNBGU Event Ticket QR Code
          </Text>
        }
        bottomContent={
          isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text style={styles.footerText}>
              Align QR code within frame
            </Text>
          )
        }
        cameraStyle={styles.camera}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    marginTop: 10,
    color: 'gray',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  footerText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 5,
  },
  camera: {
    height: '100%',
  },
});

export default QrScannerScreen;