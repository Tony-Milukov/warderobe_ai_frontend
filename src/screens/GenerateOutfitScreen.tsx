import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks';
import { Button, Card } from '@/components';
import { useGenerateOutfit, useWardrobeItems } from '@/api';
import { Season, Outfit } from '@/types';

const GenerateOutfitScreen: React.FC = () => {
  const { theme } = useTheme();
  const { data: wardrobeItems = [] } = useWardrobeItems();
  const generateOutfitMutation = useGenerateOutfit();

  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [generatedOutfit, setGeneratedOutfit] = useState<Outfit | null>(null);

  const seasons = [
    { key: Season.SPRING, label: 'Spring', icon: '🌸' },
    { key: Season.SUMMER, label: 'Summer', icon: '☀️' },
    { key: Season.FALL, label: 'Fall', icon: '🍂' },
    { key: Season.WINTER, label: 'Winter', icon: '❄️' },
  ];

  const occasions = [
    { key: 'casual', label: 'Casual', icon: '👕' },
    { key: 'work', label: 'Work', icon: '👔' },
    { key: 'formal', label: 'Formal', icon: '🤵' },
    { key: 'party', label: 'Party', icon: '🎉' },
    { key: 'date', label: 'Date', icon: '💕' },
    { key: 'workout', label: 'Workout', icon: '💪' },
  ];

  const handleGenerateOutfit = () => {
    if (wardrobeItems.length === 0) {
      Alert.alert(
        'Empty Wardrobe',
        'You need to add some clothing items to your wardrobe first before generating outfits.',
        [{ text: 'OK' }]
      );
      return;
    }

    generateOutfitMutation.mutate(
      {
        season: selectedSeason || undefined,
        occasion: selectedOccasion || undefined,
      },
      {
        onSuccess: outfit => {
          setGeneratedOutfit(outfit);
        },
        onError: error => {
          console.error('Generate outfit error:', error);
          Alert.alert(
            'Generation Failed',
            'Failed to generate outfit. Please try again.'
          );
        },
      }
    );
  };

  const renderPreferences = () => (
    <>
      <Card title="Season">
        <View style={styles.optionsGrid}>
          {seasons.map(season => (
            <Button
              key={season.key}
              title={`${season.icon} ${season.label}`}
              variant={selectedSeason === season.key ? 'primary' : 'outline'}
              size="small"
              onPress={() => setSelectedSeason(season.key)}
              style={styles.optionButton}
            />
          ))}
        </View>
      </Card>

      <Card title="Occasion">
        <View style={styles.optionsGrid}>
          {occasions.map(occasion => (
            <Button
              key={occasion.key}
              title={`${occasion.icon} ${occasion.label}`}
              variant={
                selectedOccasion === occasion.key ? 'primary' : 'outline'
              }
              size="small"
              onPress={() => setSelectedOccasion(occasion.key)}
              style={styles.optionButton}
            />
          ))}
        </View>
      </Card>
    </>
  );

  const renderGeneratedOutfit = () => {
    if (!generatedOutfit) return null;

    return (
      <Card title="🎉 Your Generated Outfit">
        <Text style={[styles.outfitName, { color: theme.colors.text }]}>
          {generatedOutfit.name}
        </Text>
        <Text
          style={[styles.outfitOccasion, { color: theme.colors.textSecondary }]}
        >
          Perfect for: {generatedOutfit.occasion}
        </Text>

        <View style={styles.outfitItems}>
          {generatedOutfit.items.map(item => (
            <View key={item.id} style={styles.outfitItem}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.outfitItemImage}
                resizeMode="cover"
              />
              <Text
                style={[styles.outfitItemLabel, { color: theme.colors.text }]}
              >
                {item.category.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.outfitActions}>
          <Button
            title="Generate Another"
            variant="outline"
            onPress={handleGenerateOutfit}
            loading={generateOutfitMutation.isPending}
            style={styles.actionButton}
          />
          <Button
            title="Save Outfit"
            onPress={() => {
              Alert.alert('Save Outfit', 'Outfit saved to your collection!');
            }}
            style={styles.actionButton}
          />
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card title="Generate AI Outfit">
          <Text
            style={[styles.description, { color: theme.colors.textSecondary }]}
          >
            Let AI create the perfect outfit for you based on your wardrobe and
            preferences.
          </Text>

          <View style={styles.stats}>
            <Text style={[styles.statsText, { color: theme.colors.text }]}>
              Items in wardrobe: {wardrobeItems.length}
            </Text>
          </View>
        </Card>

        {renderPreferences()}

        <Button
          title="✨ Generate Outfit"
          onPress={handleGenerateOutfit}
          loading={generateOutfitMutation.isPending}
          disabled={wardrobeItems.length === 0}
          style={styles.generateButton}
        />

        {renderGeneratedOutfit()}

        {wardrobeItems.length === 0 && (
          <Card title="💡 Get Started">
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              To generate outfits, you&apos;ll need to add some clothing items
              to your wardrobe first. Go to the &quot;Add Item&quot; tab to
              start building your digital closet!
            </Text>
          </Card>
        )}
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
    marginBottom: 16,
  },
  stats: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 8,
  },
  generateButton: {
    marginVertical: 20,
  },
  outfitName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  outfitOccasion: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  outfitItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  outfitItem: {
    alignItems: 'center',
  },
  outfitItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  outfitItemLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  outfitActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});

export default GenerateOutfitScreen;
