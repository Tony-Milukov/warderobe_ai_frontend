import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useImagePicker } from '@/hooks';
import { Button, Card } from '@/components';
import { useCreateWardrobeItem } from '@/api';
import { ClothingCategory, ImagePickerResult } from '@/types';

const AddItemScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showImagePickerOptions, isLoading: imagePickerLoading } =
    useImagePicker();
  const createItemMutation = useCreateWardrobeItem();

  const [selectedImage, setSelectedImage] = useState<ImagePickerResult | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ClothingCategory | null>(null);

  const categories = [
    { key: ClothingCategory.TOP, label: 'Top', icon: '👕' },
    { key: ClothingCategory.BOTTOM, label: 'Bottom', icon: '👖' },
    { key: ClothingCategory.DRESS, label: 'Dress', icon: '👗' },
    { key: ClothingCategory.SHOES, label: 'Shoes', icon: '👟' },
    { key: ClothingCategory.ACCESSORIES, label: 'Accessories', icon: '👜' },
    { key: ClothingCategory.OUTERWEAR, label: 'Outerwear', icon: '🧥' },
  ];

  const handleImagePick = async () => {
    try {
      const result = await showImagePickerOptions();
      if (result) {
        setSelectedImage(result);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleUpload = () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    createItemMutation.mutate(
      {
        image: selectedImage.uri,
        category: selectedCategory || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert(
            'Success!',
            'Your clothing item has been added to your wardrobe.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setSelectedImage(null);
                  setSelectedCategory(null);
                },
              },
            ]
          );
        },
        onError: error => {
          console.error('Upload error:', error);
          Alert.alert(
            'Upload Failed',
            'Failed to upload your item. Please try again.'
          );
        },
      }
    );
  };

  const renderCategorySelector = () => (
    <Card title="Category (Optional)">
      <View style={styles.categoriesGrid}>
        {categories.map(category => (
          <Button
            key={category.key}
            title={`${category.icon} ${category.label}`}
            variant={selectedCategory === category.key ? 'primary' : 'outline'}
            size="small"
            onPress={() => setSelectedCategory(category.key)}
            style={styles.categoryButton}
          />
        ))}
      </View>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card title="Add New Item">
          <Text
            style={[styles.description, { color: theme.colors.textSecondary }]}
          >
            Take a photo or select from your gallery to add a new clothing item
            to your wardrobe.
          </Text>

          <Button
            title="Select Image"
            onPress={handleImagePick}
            loading={imagePickerLoading}
            style={styles.selectButton}
          />

          {selectedImage && (
            <View style={styles.imagePreview}>
              <Text style={[styles.previewLabel, { color: theme.colors.text }]}>
                Preview:
              </Text>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.imageInfo,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {selectedImage.width} × {selectedImage.height}
                {selectedImage.fileSize &&
                  ` • ${Math.round(selectedImage.fileSize / 1024)}KB`}
              </Text>
            </View>
          )}
        </Card>

        {selectedImage && renderCategorySelector()}

        {selectedImage && (
          <Button
            title="Upload to Wardrobe"
            onPress={handleUpload}
            loading={createItemMutation.isPending}
            style={styles.uploadButton}
          />
        )}

        <View style={styles.tipsCard}>
          <Card title="📸 Tips for Better Results">
            <Text
              style={[styles.tipText, { color: theme.colors.textSecondary }]}
            >
              • Ensure good lighting when taking photos{'\n'}• Place items on a
              clean, contrasting background{'\n'}• Make sure the entire item is
              visible{'\n'}• Take photos from the front for best AI recognition
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  selectButton: {
    marginBottom: 20,
  },
  imagePreview: {
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  imageInfo: {
    fontSize: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 8,
  },
  uploadButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  tipsCard: {
    marginTop: 20,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AddItemScreen;
