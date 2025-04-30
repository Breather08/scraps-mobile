import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuth } from '@/providers/auth-provider';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const { requestOtp } = useAuth();

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    setIsPhoneValid(cleaned.length === 10);
    // Format as +X (XXX) XXX-XXXX if in proper length
    if (cleaned.length <= 10) {
      setPhone(cleaned);
    }
  };

  const handleContinue = async () => {
    if (phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    try {
      setIsLoading(true);
      const formattedPhone = `+7${phone}`;
      await requestOtp(formattedPhone);
      
      // Pass phone to verification screen
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: formattedPhone }
      });
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось отправить код подтверждения. Пожалуйста, повторите попытку.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const displayPhone = () => {
    if (!phone) return '';
    
    // Format for display only
    let formatted = phone;
    if (phone.length === 10) {
      formatted = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return formatted;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Приветствуем!</Text>
        <Text style={styles.subtitle}>Введите свой номер телефона, чтобы продолжить</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>+7</Text>
          <TextInput
            style={styles.input}
            onChangeText={formatPhoneNumber}
            value={displayPhone()}
            placeholder="(###) ###-####"
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={14}
          />
        </View>

        <Pressable 
          style={[styles.button, !isPhoneValid && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isPhoneValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Продолжить</Text>
          )}
        </Pressable>

        <Text style={styles.terms}>
          {/* TODO: Add terms and privacy policy */}
          Продолжая, вы соглашаетесь с нашими Условиями использования и Политикой конфиденциальности
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2ecc71',
    marginBottom: 32,
  },
  prefix: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6ba',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  terms: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
  },
});
