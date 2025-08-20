import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = 'genz_translator_device_id';

export class DeviceService {
  static async getDeviceId(): Promise<string> {
    try {
      const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
      
      if (stored) {
        return stored;
      }

      const newId = `android_${Crypto.randomUUID()}`;
      await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
      
      return newId;
    } catch (error) {
      console.error('Error with device ID:', error);
      return `android_fallback_${Date.now()}`;
    }
  }

  static async clearDeviceId(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DEVICE_ID_KEY);
    } catch (error) {
      console.error('Error clearing device ID:', error);
    }
  }
}