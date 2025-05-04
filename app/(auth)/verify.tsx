import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/providers/auth-provider';
import Button from '@/components/ui/button';

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOtp } = useAuth();
  
  // References for each input field
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Auto-focus the first input when screen loads
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Format the phone number for display
  const formatPhoneForDisplay = () => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) { // With country code
      return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  // Handle input changes and move to next input
  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // If input isn't empty, move to next field
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to move to previous input
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Submit the verification code
  const handleSubmit = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      Alert.alert('Ошибка', 'Пожалуйста, введите полный 6-значный код подтверждения');
      return;
    }

    if (!phone) {
      Alert.alert('Ошибка', 'Номер телефона отсутствует');
      return;
    }

    try {
      setIsLoading(true);
      await verifyOtp(phone, fullCode);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Код, который вы ввели, неверен или устарел. Пожалуйста, повторите попытку.'
      );
      // Clear code fields
      setCode(['', '', '', '', '', '']);
      // Focus first input
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (!phone) return;
    
    try {
      // Call the requestOtp function again
      setIsLoading(true);
      await useAuth().requestOtp(phone);
      Alert.alert('Код отправлен', 'Новый код подтверждения был отправлен на ваш телефон');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить код подтверждения. Пожалуйста, повторите попытку.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Проверьте ваш номер</Text>
        <Text style={styles.subtitle}>
          Введите 6-значный код, отправленный на {formatPhoneForDisplay()}
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <Button 
          title="Проверить"
          variant="primary"
          size="large"
          onPress={handleSubmit}
          disabled={code.join('').length !== 6}
          loading={isLoading}
          style={styles.button}
          fullWidth
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Не получили код? </Text>
          <Button
            title="Отправить повторно"
            variant="text"
            size="small"
            onPress={resendCode}
            disabled={isLoading}
            textStyle={styles.resendAction}
          />
        </View>
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    marginBottom: 16,
    borderRadius: 12,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: '#666',
  },
  resendAction: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
});
