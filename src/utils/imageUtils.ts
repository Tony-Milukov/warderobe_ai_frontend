import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { ImagePickerResult } from '@/types';

export const requestCameraPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Sorry, we need camera permissions to take photos of your clothes.',
      [{ text: 'OK' }]
    );
    return false;
  }
  return true;
};

export const requestMediaLibraryPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Sorry, we need gallery permissions to select photos of your clothes.',
      [{ text: 'OK' }]
    );
    return false;
  }
  return true;
};

export const pickImageFromCamera =
  async (): Promise<ImagePickerResult | null> => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          type: 'image',
          fileSize: result.assets[0].fileSize,
        };
      }
    } catch (error) {
      console.error('Error picking image from camera:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }

    return null;
  };

export const pickImageFromGallery =
  async (): Promise<ImagePickerResult | null> => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          type: 'image',
          fileSize: result.assets[0].fileSize,
        };
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }

    return null;
  };

export const compressImage = async (
  uri: string,
  quality: number = 0.8
): Promise<string> => {
  try {
    const manipulatedImage = await manipulateAsync(
      uri,
      [{ resize: { width: 800, height: 800 } }],
      { compress: quality, format: SaveFormat.JPEG }
    );

    return manipulatedImage.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    return uri; // Return original if compression fails
  }
};

export const getImageInfo = async (uri: string) => {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return info;
  } catch (error) {
    console.error('Error getting image info:', error);
    return null;
  }
};
