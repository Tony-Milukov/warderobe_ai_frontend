import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks';
import { WardrobeItemCard, Button } from '@/components';
import { useWardrobeItems, useDeleteWardrobeItem } from '@/api';
import { WardrobeItem } from '@/types';

const WardrobeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { data: items = [], isLoading, refetch } = useWardrobeItems();
  const deleteItemMutation = useDeleteWardrobeItem();

  const handleDeleteItem = (item: WardrobeItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete this ${item.category}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteItemMutation.mutate(item.id, {
              onSuccess: () => {
                console.log('Item deleted successfully');
              },
              onError: error => {
                console.error('Failed to delete item:', error);
                Alert.alert(
                  'Error',
                  'Failed to delete item. Please try again.'
                );
              },
            });
          },
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Your wardrobe is empty
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}
      >
        Start building your digital wardrobe by adding your first clothing item!
      </Text>
      <Button
        title="Add Your First Item"
        onPress={() => {
          // Navigation will be handled by parent component
          console.log('Navigate to AddItem');
        }}
        style={styles.emptyButton}
      />
    </View>
  );

  const renderItem = ({ item }: { item: WardrobeItem }) => (
    <WardrobeItemCard
      item={item}
      onPress={item => {
        console.log('Item pressed:', item.id);
        // Could navigate to item details screen
      }}
      onDelete={handleDeleteItem}
      style={styles.itemCard}
    />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  itemCard: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});

export default WardrobeScreen;
