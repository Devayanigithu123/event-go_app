import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';

type RootStackParamList = {
  UserHome: undefined;
  AdminHome: undefined;
  ManagerHome: undefined;
  Login: undefined;
};

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const validateCredentials = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
      general: '',
    };

    // Email validation
    if (!credentials.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    } else if (isAdminLogin && !credentials.email.endsWith('@hnbgu.ac.in')) {
      newErrors.email = 'Administrative access requires university email';
      valid = false;
    }

    // Password validation
    if (!credentials.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (isAdminLogin && credentials.password.length < 10) {
      newErrors.password = 'Admin password must be at least 10 characters';
      valid = false;
    } else if (!isAdminLogin && credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (!validateCredentials()) return;

    setIsLoading(true);
    setErrors({ ...errors, general: '' });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock authentication - replace with real API call
      const mockUsers = {
        user: { email: 'user@example.com', password: 'user123' },
        admin: { email: 'admin@hnbgu.ac.in', password: 'admin12345' }
      };

      if (isAdminLogin) {
        if (credentials.email === mockUsers.admin.email && 
            credentials.password === mockUsers.admin.password) {
          navigation.replace('AdminHome');
        } else {
          setErrors({
            ...errors,
            general: 'Invalid administrative credentials'
          });
        }
      } else {
        if (credentials.email === mockUsers.user.email && 
            credentials.password === mockUsers.user.password) {
          navigation.replace('UserHome');
        } else {
          setErrors({
            ...errors,
            general: 'Invalid email or password'
          });
        }
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Logo */}
        <Image
          source={{ uri: 'https://www.hnbgu.ac.in/sites/default/files/HNBG-new-logo.png' }}
          style={styles.logo}
        />
        
        <Text style={styles.title}>University Portal</Text>
        <Text style={styles.subtitle}>Login to access your account</Text>

        {/* General Error Message */}
        {errors.general ? (
          <View style={styles.errorContainer}>
            <Icon name="exclamation-circle" size={16} color="#dc3545" />
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        ) : null}

        {/* Email Input */}
        <View style={[
          styles.inputContainer,
          errors.email && styles.inputError
        ]}>
          <Icon name="envelope" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={isAdminLogin ? 'University Email (@hnbgu.ac.in)' : 'Your email address'}
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={credentials.email}
            onChangeText={(text) => {
              setCredentials({ ...credentials, email: text });
              setErrors({ ...errors, email: '' });
            }}
          />
        </View>
        {errors.email ? (
          <Text style={styles.fieldErrorText}>{errors.email}</Text>
        ) : null}

        {/* Password Input */}
        <View style={[
          styles.inputContainer,
          errors.password && styles.inputError
        ]}>
          <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={credentials.password}
            onChangeText={(text) => {
              setCredentials({ ...credentials, password: text });
              setErrors({ ...errors, password: '' });
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#888" />
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={styles.fieldErrorText}>
            {errors.password}
            {isAdminLogin && (
              <Text style={styles.passwordHint}> (Include special characters)</Text>
            )}
          </Text>
        ) : null}

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>
              {isAdminLogin ? 'Login as Staff' : 'Login'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Admin/Manager Access Toggle */}
        {!showAdminLogin ? (
          <TouchableOpacity 
            style={styles.adminAccessButton}
            onPress={() => {
              setShowAdminLogin(true);
              setIsAdminLogin(true);
              setCredentials({ email: '', password: '' });
              setErrors({ email: '', password: '', general: '' });
            }}
          >
            <Text style={styles.adminAccessText}>Staff/Administrator Access</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.adminSection}>
            <Text style={styles.adminTitle}>Staff Login</Text>
            <Text style={styles.adminNote}>Use your university credentials</Text>
            
            <TouchableOpacity 
              style={styles.returnToUserButton}
              onPress={() => {
                setShowAdminLogin(false);
                setIsAdminLogin(false);
                setCredentials({ email: '', password: '' });
                setErrors({ email: '', password: '', general: '' });
              }}
            >
              <Text style={styles.returnToUserText}>← Return to User Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#FF7B00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'center',
    height: 50,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#FF7B00',
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#dc3545',
    marginLeft: 8,
    fontSize: 14,
  },
  fieldErrorText: {
    color: '#dc3545',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 5,
  },
  passwordHint: {
    color: '#6c757d',
  },
  adminAccessButton: {
    alignSelf: 'center',
    marginTop: 30,
    padding: 10,
  },
  adminAccessText: {
    color: '#24252a',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  adminSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  adminNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  returnToUserButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  returnToUserText: {
    color: '#FF7B00',
    fontSize: 14,
  },
});

export default LoginScreen;