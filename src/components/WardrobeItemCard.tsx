import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/hooks';
import { WardrobeItem, ProcessingStatus } from '@/types';
import { Card } from './Card';

interface WardrobeItemCardProps {
  item: WardrobeItem;
  onPress?: (item: WardrobeItem) => void;
  onDelete?: (item: WardrobeItem) => void;
  style?: ViewStyle;
}

export const WardrobeItemCard: React.FC<WardrobeItemCardProps> = ({
  item,
  onPress,
  onDelete,
  style,
}) => {
  const { theme } = useTheme();

  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.COMPLETED:
        return theme.colors.success;
      case ProcessingStatus.PROCESSING:
        return theme.colors.warning;
      case ProcessingStatus.FAILED:
        return theme.colors.error;
      default:
        return theme.colors.info;
    }
  };

  const getStatusText = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.COMPLETED:
        return 'Ready';
      case ProcessingStatus.PROCESSING:
        return 'Processing...';
      case ProcessingStatus.FAILED:
        return 'Failed';
      default:
        return 'Uploading...';
    }
  };

  return (
    <TouchableOpacity
      style={style}
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
    >
      <Card>
        <View style={styles.container}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.content}>
            <Text style={[styles.category, { color: theme.colors.text }]}>
              {item.category.toUpperCase()}
            </Text>
            <Text style={[styles.color, { color: theme.colors.textSecondary }]}>
              {item.color}
            </Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {getStatusText(item.status)}
              </Text>
            </View>
            {item.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.slice(0, 2).map((tag, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tag,
                      { backgroundColor: theme.colors.surface },
                    ]}
                  >
                    <Text
                      style={[styles.tagText, { color: theme.colors.text }]}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
                {item.tags.length > 2 && (
                  <Text
                    style={[
                      styles.moreText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    +{item.tags.length - 2}
                  </Text>
                )}
              </View>
            )}
          </View>
          {onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(item)}
            >
              <Text style={[styles.deleteText, { color: theme.colors.error }]}>
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  color: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
  },
  moreText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
