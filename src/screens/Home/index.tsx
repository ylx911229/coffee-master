import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Header, Card, Button } from '../../components/common';
import { theme } from '../../styles/theme';
import type { CoffeeBean, BrewingMethod } from '../../types';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    beansCount: 23,
    brewsCount: 156,
    level: '中级咖啡师',
    stars: 3,
  });
  const [todayRecommendation, setTodayRecommendation] = useState<CoffeeBean | null>(null);
  const [customBrewing, setCustomBrewing] = useState<BrewingMethod | null>(null);

  useEffect(() => {
    // 模拟数据加载
    setTodayRecommendation({
      id: '1',
      name: '埃塞俄比亚 耶加雪菲',
      origin: '埃塞俄比亚',
      roastLevel: 'Medium-Light',
      processingMethod: 'Washed',
      flavorProfile: {
        aroma: [{ name: '花香', intensity: 4, category: 'Floral' }],
        flavor: [{ name: '柑橘', intensity: 4, category: 'Fruity' }],
        acidity: 4,
        body: 3,
        aftertaste: 4,
        sweetness: 3,
        bitterness: 2,
      },
      price: 85,
      description: '花香 柑橘 明亮酸度 | 适合手冲',
      createdAt: new Date(),
    });

    setCustomBrewing({
      id: '1',
      name: 'V60手冲',
      equipment: {
        id: '1',
        name: 'Hario V60',
        type: 'Pour Over',
      },
      difficulty: 2,
      estimatedTime: 5,
      steps: [],
      parameters: {
        grindSize: '中细研磨',
        coffeeAmount: 15,
        waterAmount: 250,
        waterTemp: 90,
        brewTime: 150,
        ratio: '1:15',
      },
    });
  }, []);

  const handleCameraPress = () => {
    router.push('/recognition');
  };

  const handleStartBrewing = () => {
    if (customBrewing && todayRecommendation) {
      router.push({
        pathname: '/brewing-guide',
        params: {
          recipe: JSON.stringify(customBrewing),
          bean: JSON.stringify(todayRecommendation)
        }
      });
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name="star"
        size={16}
        color={index < count ? theme.colors.warning : theme.colors.gray300}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <Header 
        title="咖啡大师" 
        rightComponent={
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 搜索栏 */}
        <Card style={styles.searchCard}>
          <Text style={styles.searchTitle}>🔍 今天想喝什么咖啡？</Text>
          <View style={styles.searchActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCameraPress}
            >
              <Ionicons name="camera-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.actionText}>📷拍照识豆</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="compass-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.actionText}>🎯智能推荐</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="school-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.actionText}>📚学习教程</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 用户咖啡之旅 */}
        <Card style={styles.journeyCard}>
          <Text style={styles.sectionTitle}>📈 你的咖啡之旅</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              已品尝 {userStats.beansCount} 种豆子 | 制作咖啡 {userStats.brewsCount} 杯
            </Text>
            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>
                当前等级：{userStats.level} {renderStars(userStats.stars)}
              </Text>
            </View>
            <Button
              title="查看详细数据"
              variant="outline"
              size="small"
              onPress={() => router.push('/profile')}
              style={styles.detailButton}
            />
          </View>
        </Card>

        {/* 今日推荐 */}
        {todayRecommendation && (
          <Card style={styles.recommendationCard}>
            <Text style={styles.sectionTitle}>🔥 今日推荐</Text>
            <View style={styles.coffeeInfo}>
              <View style={styles.coffeeImage}>
                <Ionicons name="cafe-outline" size={40} color={theme.colors.primary} />
              </View>
              <View style={styles.coffeeDetails}>
                <Text style={styles.coffeeName}>{todayRecommendation.name}</Text>
                <Text style={styles.coffeeDescription}>
                  {todayRecommendation.description}
                </Text>
                <View style={styles.coffeeActions}>
                  <Button
                    title="查看详情"
                    variant="text"
                    size="small"
                    onPress={() => {}}
                  />
                  <Button
                    title="添加到购物车"
                    variant="text"
                    size="small"
                    onPress={() => {}}
                  />
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* 定制冲泡方案 */}
        {customBrewing && (
          <Card style={styles.brewingCard}>
            <Text style={styles.sectionTitle}>🎯 为你定制的冲泡方案</Text>
            <View style={styles.brewingInfo}>
              <Text style={styles.brewingSubtitle}>
                基于你的{customBrewing.equipment.name}和今天的豆子
              </Text>
              <Text style={styles.brewingParams}>
                {customBrewing.parameters.coffeeAmount}g豆 / {customBrewing.parameters.waterAmount}ml水 / {customBrewing.parameters.waterTemp}°C / {Math.floor(customBrewing.parameters.brewTime / 60)}:{(customBrewing.parameters.brewTime % 60).toString().padStart(2, '0')}
              </Text>
              <Button
                title="开始制作"
                onPress={handleStartBrewing}
                style={styles.startButton}
              />
            </View>
          </Card>
        )}

        {/* 底部占位 */}
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
  
  searchCard: {
    marginVertical: theme.spacing.sm,
  },
  
  searchTitle: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  searchActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.md,
  },
  
  actionText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  
  journeyCard: {
    marginVertical: theme.spacing.sm,
  },
  
  sectionTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  statsContainer: {
    alignItems: 'flex-start',
  },
  
  statsText: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  
  levelText: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  
  detailButton: {
    alignSelf: 'flex-start',
  },
  
  recommendationCard: {
    marginVertical: theme.spacing.sm,
  },
  
  coffeeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  coffeeImage: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  
  coffeeDetails: {
    flex: 1,
  },
  
  coffeeName: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  
  coffeeDescription: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  
  coffeeActions: {
    flexDirection: 'row',
  },
  
  brewingCard: {
    marginVertical: theme.spacing.sm,
  },
  
  brewingInfo: {
    alignItems: 'flex-start',
  },
  
  brewingSubtitle: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  
  brewingParams: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  startButton: {
    alignSelf: 'flex-start',
  },
  
  bottomSpacer: {
    height: theme.spacing.xl,
  },
});