import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Header, Card, Button } from '../../components/common';
import { theme } from '../../styles/theme';
import type { RootStackParamList, FlavorWheelData, TastingRecord } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'TastingRecord'>;

export const TastingRecordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { brewingRecord } = route.params;

  const [photos, setPhotos] = useState<string[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [flavorWheel, setFlavorWheel] = useState<FlavorWheelData>({
    floral: 0,
    fruity: 0,
    sweet: 0,
    nutty: 0,
    chocolate: 0,
    spicy: 0,
    acidic: 0,
    bitter: 0,
  });
  const [professionalScores, setProfessionalScores] = useState({
    aroma: 0,
    wetAroma: 0,
    acidity: 0,
    sweetness: 0,
    body: 0,
    aftertaste: 0,
  });
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>(['花香', '柑橘', '明亮']);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddPhoto = useCallback(() => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setPhotos([...photos, imageUri]);
        }
      }
    });
  }, [photos]);

  const handleFlavorWheelChange = useCallback((flavor: keyof FlavorWheelData, value: number) => {
    setFlavorWheel(prev => ({
      ...prev,
      [flavor]: value,
    }));
  }, []);

  const handleProfessionalScoreChange = useCallback((aspect: string, score: number) => {
    setProfessionalScores(prev => ({
      ...prev,
      [aspect]: score,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    const tastingRecord: TastingRecord = {
      id: Date.now().toString(),
      userId: 'user1',
      brewingRecordId: brewingRecord.id,
      overallScore,
      aromaScore: professionalScores.aroma,
      flavorScore: (flavorWheel.floral + flavorWheel.fruity + flavorWheel.sweet) / 3,
      acidityScore: flavorWheel.acidic,
      bodyScore: professionalScores.body,
      aftertasteScore: professionalScores.aftertaste,
      flavorWheel,
      notes,
      photos,
      createdAt: new Date(),
    };

    // TODO: 保存到本地数据库
    console.log('保存品鉴记录:', tastingRecord);
    
    Alert.alert(
      '保存成功',
      '品鉴记录已保存到您的个人档案',
      [{ text: '确定', onPress: () => navigation.goBack() }]
    );
  }, [brewingRecord.id, overallScore, professionalScores, flavorWheel, notes, photos, navigation]);

  const handleShare = useCallback(() => {
    Alert.alert('分享功能', '开发中...');
  }, []);

  const handleVoiceInput = useCallback(() => {
    Alert.alert('语音录入', '功能开发中...');
  }, []);

  const handleAIAssist = useCallback(() => {
    const suggestions = [
      '入口有明显的花香味',
      '中段能感受到柑橘的酸甜',
      '余韵带有淡淡的蜂蜜甜味',
      '整体平衡度不错'
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setNotes(notes ? `${notes}\n${randomSuggestion}` : randomSuggestion);
  }, [notes]);

  const handleAddTag = useCallback(() => {
    Alert.prompt(
      '添加标签',
      '请输入风味标签',
      (text) => {
        if (text && !tags.includes(text)) {
          setTags([...tags, text]);
        }
      }
    );
  }, [tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }, [tags]);

  const renderStars = (score: number, onPress: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity key={index} onPress={() => onPress(index + 1)}>
        <Icon
          name="star"
          size={24}
          color={index < score ? theme.colors.warning : theme.colors.gray300}
        />
      </TouchableOpacity>
    ));
  };

  const renderFlavorWheel = () => {
    const flavorItems = [
      { key: 'floral' as keyof FlavorWheelData, label: '花香', icon: '🌸' },
      { key: 'sweet' as keyof FlavorWheelData, label: '甜味', icon: '🍯' },
      { key: 'fruity' as keyof FlavorWheelData, label: '果香', icon: '🍋' },
      { key: 'acidic' as keyof FlavorWheelData, label: '酸味', icon: '🍋' },
      { key: 'nutty' as keyof FlavorWheelData, label: '坚果', icon: '🌰' },
      { key: 'bitter' as keyof FlavorWheelData, label: '苦味', icon: '☕' },
    ];

    return (
      <View style={styles.flavorWheelGrid}>
        {flavorItems.map(({ key, label, icon }) => (
          <View key={key} style={styles.flavorItem}>
            <Text style={styles.flavorIcon}>{icon}</Text>
            <Text style={styles.flavorLabel}>{label}</Text>
            <View style={styles.flavorDots}>
              {Array.from({ length: 3 }, (_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleFlavorWheelChange(key, index + 1)}
                >
                  <View style={[
                    styles.flavorDot,
                    index < flavorWheel[key] && styles.flavorDotActive
                  ]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderProfessionalScores = () => {
    const scoreItems = [
      { key: 'aroma', label: '干香', icon: '👃' },
      { key: 'wetAroma', label: '湿香', icon: '💨' },
      { key: 'acidity', label: '酸度', icon: '⚡' },
      { key: 'sweetness', label: '甜味', icon: '🍯' },
      { key: 'body', label: '醇厚', icon: '☕' },
      { key: 'aftertaste', label: '余韵', icon: '✨' },
    ];

    return (
      <View style={styles.professionalScoresGrid}>
        {scoreItems.map(({ key, label, icon }) => (
          <View key={key} style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>{label}:</Text>
            <View style={styles.scoreStars}>
              {renderStars(professionalScores[key], (score) => 
                handleProfessionalScoreChange(key, score)
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="品鉴记录"
        showBack
        onBack={handleBack}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>保存</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.headerAction}>
              <Icon name="share" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 成品照片 */}
        <Card style={styles.photoCard}>
          <Text style={styles.sectionTitle}>📸 成品照片</Text>
          <View style={styles.photoContainer}>
            {photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.photo} />
            ))}
            <TouchableOpacity onPress={handleAddPhoto} style={styles.addPhotoButton}>
              <Icon name="add-a-photo" size={30} color={theme.colors.primary} />
              <Text style={styles.addPhotoText}>+添加照片</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 整体评分 */}
        <Card style={styles.ratingCard}>
          <Text style={styles.sectionTitle}>⭐ 整体评分</Text>
          <View style={styles.overallRating}>
            <View style={styles.ratingStars}>
              {renderStars(overallScore, setOverallScore)}
            </View>
            <Text style={styles.ratingText}>({overallScore}.0分)</Text>
          </View>
        </Card>

        {/* 风味轮评测 */}
        <Card style={styles.flavorWheelCard}>
          <Text style={styles.sectionTitle}>🌈 风味轮评测</Text>
          {renderFlavorWheel()}
        </Card>

        {/* 口味描述 */}
        <Card style={styles.notesCard}>
          <Text style={styles.sectionTitle}>📝 口味描述</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="入口有明显的柠檬酸味，中段能感受到花香，余韵有淡淡的蜂蜜甜味。整体平衡度不错，适合喜欢明亮酸度的朋友。"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.inputActions}>
            <TouchableOpacity onPress={handleVoiceInput} style={styles.inputAction}>
              <Icon name="mic" size={20} color={theme.colors.primary} />
              <Text style={styles.inputActionText}>🎤语音录入</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAIAssist} style={styles.inputAction}>
              <Icon name="psychology" size={20} color={theme.colors.primary} />
              <Text style={styles.inputActionText}>AI辅助描述</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 标签 */}
        <Card style={styles.tagsCard}>
          <Text style={styles.sectionTitle}>🏷️ 标签</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRemoveTag(tag)}
                style={styles.tag}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <Icon name="close" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={handleAddTag} style={styles.addTagButton}>
              <Text style={styles.addTagText}>+添加标签</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 专业评分 */}
        <Card style={styles.professionalCard}>
          <Text style={styles.sectionTitle}>📊 专业评分</Text>
          {renderProfessionalScores()}
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPadding,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  saveButton: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },

  headerAction: {
    marginLeft: theme.spacing.md,
  },

  sectionTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  photoCard: {
    marginVertical: theme.spacing.sm,
  },

  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  photo: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  addPhotoText: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },

  ratingCard: {
    marginVertical: theme.spacing.sm,
  },

  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingStars: {
    flexDirection: 'row',
    marginRight: theme.spacing.md,
  },

  ratingText: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
  },

  flavorWheelCard: {
    marginVertical: theme.spacing.sm,
  },

  flavorWheelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  flavorItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },

  flavorIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },

  flavorLabel: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  flavorDots: {
    flexDirection: 'row',
  },

  flavorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.gray300,
    marginHorizontal: 2,
  },

  flavorDotActive: {
    backgroundColor: theme.colors.primary,
  },

  notesCard: {
    marginVertical: theme.spacing.sm,
  },

  notesInput: {
    height: 120,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  inputAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.md,
  },

  inputActionText: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },

  tagsCard: {
    marginVertical: theme.spacing.sm,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  tagText: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
  },

  addTagButton: {
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  addTagText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  professionalCard: {
    marginVertical: theme.spacing.sm,
  },

  professionalScoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  scoreItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  scoreLabel: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
  },

  scoreStars: {
    flexDirection: 'row',
  },

  bottomSpacer: {
    height: theme.spacing.xl,
  },
});