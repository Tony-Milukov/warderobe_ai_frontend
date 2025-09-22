import { useState } from 'react';
import { Alert } from 'react-native';
import {
  pickImageFromCamera,
  pickImageFromGallery,
  compressImage,
} from '@/utils';
import { ImagePickerResult } from '@/types';

export const useImagePicker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const showImagePickerOptions = (): Promise<ImagePickerResult | null> => {
    return new Promise(resolve => {
      Alert.alert(
        'Select Image',
        'Choose how you want to add your clothing item:',
        [
          {
            text: 'Camera',
            onPress: async () => {
              setIsLoading(true);
              try {
                const result = await pickImageFromCamera();
                if (result) {
                  const compressedUri = await compressImage(result.uri);
                  resolve({ ...result, uri: compressedUri });
                } else {
                  resolve(null);
                }
              } catch (error) {
                console.error('Camera error:', error);
                resolve(null);
              } finally {
                setIsLoading(false);
              }
            },
          },
          {
            text: 'Gallery',
            onPress: async () => {
              setIsLoading(true);
              try {
                const result = await pickImageFromGallery();
                if (result) {
                  const compressedUri = await compressImage(result.uri);
                  resolve({ ...result, uri: compressedUri });
                } else {
                  resolve(null);
                }
              } catch (error) {
                console.error('Gallery error:', error);
                resolve(null);
              } finally {
                setIsLoading(false);
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ]
      );
    });
  };

  return {
    showImagePickerOptions,
    isLoading,
  };
};
