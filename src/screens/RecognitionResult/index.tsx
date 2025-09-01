import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Header, Card, Button } from '../../components/common';
import { theme } from '../../styles/theme';
import type { RootStackParamList, RecognitionResult } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = RouteProp<RootStackParamList, 'RecognitionResult'>;

export const RecognitionResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { result } = route.params;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleStartBrewing = useCallback(() => {
    if (result.recommendedBrewing.length > 0) {
      // 创建模拟的咖啡豆对象
      const bean = {
        id: '1',
        name: result.beanType,
        origin: result.origin,
        roastLevel: result.roastLevel as any,
        processingMethod: result.processingMethod as any,
        flavorProfile: result.flavorProfile,
        createdAt: new Date(),
      };

      navigation.navigate('BrewingGuide', { 
        recipe: result.recommendedBrewing[0], 
        bean 
      });
    }
  }, [navigation, result]);

  const handleFavorite = useCallback(() => {
    // TODO: 实现收藏功能
  }, []);

  const handleShare = useCallback(() => {
    // TODO: 实现分享功能
  }, []);

  const renderFlavorNotes = (notes: typeof result.flavorProfile.aroma) => {
    return notes.map((note, index) => (
      <View key={index} style={styles.flavorNote}>
        <Text style={styles.flavorNoteName}>{note.name}</Text>
        <View style={styles.intensityContainer}>
          {Array.from({ length: 5 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.intensityDot,
                i < note.intensity ? styles.intensityActive : styles.intensityInactive
              ]}
            />
          ))}
        </View>
      </View>
    ));
  };

  const renderFlavorProfile = () => {
    const attributes = [
      { name: '酸度', value: result.flavorProfile.acidity, icon: '⚡' },
      { name: '醇厚度', value: result.flavorProfile.body, icon: '☕' },
      { name: '甜味', value: result.flavorProfile.sweetness, icon: '🍯' },
      { name: '苦味', value: result.flavorProfile.bitterness, icon: '🌰' },
      { name: '余韵', value: result.flavorProfile.aftertaste, icon: '✨' },
    ];

    return attributes.map((attr, index) => (
      <View key={index} style={styles.attributeRow}>
        <View style={styles.attributeLabel}>
          <Text style={styles.attributeIcon}>{attr.icon}</Text>
          <Text style={styles.attributeName}>{attr.name}</Text>
        </View>
        <View style={styles.attributeValue}>
          {Array.from({ length: 5 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.attributeDot,
                i < attr.value ? styles.attributeActive : styles.attributeInactive
              ]}
            />
          ))}
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Header
        title="识别结果"
        showBack
        onBack={handleBack}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleFavorite} style={styles.headerAction}>
              <Icon name="favorite-border" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.headerAction}>
              <Icon name="share" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 识别成功卡片 */}
        <Card style={styles.resultCard}>
          <View style={styles.successHeader}>
            <Icon name="check-circle" size={24} color={theme.colors.success} />
            <Text style={styles.successText}>🎯 识别成功！</Text>
          </View>
          
          <View style={styles.beanInfo}>
            {result.imageUrl && (
              <Image source={{ uri: result.imageUrl }} style={styles.beanImage} />
            )}
            <View style={styles.beanDetails}>
              <Text style={styles.beanName}>{result.beanType}</Text>
              <Text style={styles.beanSubtitle}>
                {result.roastLevel} | {result.processingMethod} | 单一产区
              </Text>
              <Text style={styles.confidenceText}>
                置信度：{Math.round(result.confidence * 100)}%
              </Text>
            </View>
          </View>
        </Card>

        {/* 风味特征 */}
        <Card style={styles.flavorCard}>
          <Text style={styles.sectionTitle}>🌟 风味特征</Text>
          
          {/* 香气和风味描述 */}
          <View style={styles.flavorSection}>
            <Text style={styles.flavorSectionTitle}>香气</Text>
            {renderFlavorNotes(result.flavorProfile.aroma)}
          </View>
          
          <View style={styles.flavorSection}>
            <Text style={styles.flavorSectionTitle}>风味</Text>
            {renderFlavorNotes(result.flavorProfile.flavor)}
          </View>

          {/* 属性评分 */}
          <View style={styles.attributesSection}>
            <Text style={styles.flavorSectionTitle}>口感属性</Text>
            {renderFlavorProfile()}
          </View>
        </Card>

        {/* 推荐冲泡方式 */}
        {result.recommendedBrewing.length > 0 && (
          <Card style={styles.brewingCard}>
            <Text style={styles.sectionTitle}>☕ 推荐冲泡方式</Text>
            {result.recommendedBrewing.map((method, index) => (
              <View key={index} style={styles.brewingMethod}>
                <View style={styles.brewingHeader}>
                  <Text style={styles.brewingName}>{method.name}</Text>
                  <View style={styles.difficultyContainer}>
                    {Array.from({ length: 3 }, (_, i) => (
                      <Icon
                        key={i}
                        name="star"
                        size={12}
                        color={i < method.difficulty ? theme.colors.warning : theme.colors.gray300}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.brewingParams}>
                  <Text style={styles.paramText}>
                    研磨度：{method.parameters.grindSize}   水温：{method.parameters.waterTemp}°C
                  </Text>
                  <Text style={styles.paramText}>
                    粉水比：{method.parameters.ratio}   冲泡时间：{Math.floor(method.parameters.brewTime / 60)}:{(method.parameters.brewTime % 60).toString().padStart(2, '0')}
                  </Text>
                </View>
                <Button
                  title="开始制作指导"
                  onPress={handleStartBrewing}
                  style={styles.brewingButton}
                />
              </View>
            ))}
          </Card>
        )}

        {/* 购买推荐 */}
        <Card style={styles.purchaseCard}>
          <Text style={styles.sectionTitle}>🛒 购买推荐</Text>
          <View style={styles.purchaseOption}>
            <View style={styles.purchaseInfo}>
              <Text style={styles.purchaseName}>精品咖啡店：¥85/100g</Text>
              <View style={styles.ratingContainer}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon
                    key={i}
                    name="star"
                    size={14}
                    color={i < 5 ? theme.colors.warning : theme.colors.gray300}
                  />
                ))}
              </View>
            </View>
          </View>
          <View style={styles.purchaseOption}>
            <View style={styles.purchaseInfo}>
              <Text style={styles.purchaseName}>线上商城：¥78/100g</Text>
              <View style={styles.ratingContainer}>
                {Array.from({ length: 4 }, (_, i) => (
                  <Icon
                    key={i}
                    name="star"
                    size={14}
                    color={theme.colors.warning}
                  />
                ))}
              </View>
            </View>
          </View>
          <Button
            title="查看更多购买渠道"
            variant="outline"
            size="small"
            onPress={() => {}}
            style={styles.moreChannelsButton}
          />
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
  },

  headerAction: {
    marginLeft: theme.spacing.sm,
  },

  resultCard: {
    marginVertical: theme.spacing.sm,
  },

  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },

  successText: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },

  beanInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  beanImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },

  beanDetails: {
    flex: 1,
  },

  beanName: {
    fontSize: theme.typography.h5,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  beanSubtitle: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  confidenceText: {
    fontSize: theme.typography.body2,
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeight.medium,
  },

  flavorCard: {
    marginVertical: theme.spacing.sm,
  },

  sectionTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  flavorSection: {
    marginBottom: theme.spacing.lg,
  },

  flavorSectionTitle: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  flavorNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },

  flavorNoteName: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
  },

  intensityContainer: {
    flexDirection: 'row',
  },

  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },

  intensityActive: {
    backgroundColor: theme.colors.primary,
  },

  intensityInactive: {
    backgroundColor: theme.colors.gray300,
  },

  attributesSection: {
    marginTop: theme.spacing.md,
  },

  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },

  attributeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  attributeIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
  },

  attributeName: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
  },

  attributeValue: {
    flexDirection: 'row',
  },

  attributeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },

  attributeActive: {
    backgroundColor: theme.colors.primary,
  },

  attributeInactive: {
    backgroundColor: theme.colors.gray300,
  },

  brewingCard: {
    marginVertical: theme.spacing.sm,
  },

  brewingMethod: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
  },

  brewingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },

  brewingName: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
  },

  difficultyContainer: {
    flexDirection: 'row',
  },

  brewingParams: {
    marginBottom: theme.spacing.md,
  },

  paramText: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },

  brewingButton: {
    alignSelf: 'flex-start',
  },

  purchaseCard: {
    marginVertical: theme.spacing.sm,
  },

  purchaseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },

  purchaseInfo: {
    flex: 1,
  },

  purchaseName: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  ratingContainer: {
    flexDirection: 'row',
  },

  moreChannelsButton: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing.sm,
  },

  bottomSpacer: {
    height: theme.spacing.xl,
  },
});