import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Header, Card, Button } from '../../components/common';
import { theme } from '../../styles/theme';
import type { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'RecipeDetail'>;

export const RecipeDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { recipe } = route.params;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleStartBrewing = useCallback(() => {
    // 创建模拟的咖啡豆对象
    const mockBean = {
      id: '1',
      name: '推荐咖啡豆',
      origin: '哥伦比亚',
      roastLevel: 'Medium' as const,
      processingMethod: 'Washed' as const,
      flavorProfile: {
        aroma: [{ name: '坚果', intensity: 3, category: 'Nutty' as const }],
        flavor: [{ name: '巧克力', intensity: 4, category: 'Chocolate' as const }],
        acidity: 3,
        body: 4,
        aftertaste: 3,
        sweetness: 4,
        bitterness: 2,
      },
      createdAt: new Date(),
    };

    navigation.navigate('BrewingGuide', { recipe, bean: mockBean });
  }, [navigation, recipe]);

  const renderStars = (count: number) => {
    return Array.from({ length: 3 }, (_, index) => (
      <Icon
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
        title={recipe.name}
        showBack
        onBack={handleBack}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity>
              <Icon name="favorite-border" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Icon name="share" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Icon name="help-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 教程基本信息 */}
        <Card style={styles.infoCard}>
          <View style={styles.recipeHeader}>
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>☕ {recipe.name}</Text>
              <Text style={styles.recipeSubtitle}>{recipe.equipment.name} Caffè Latte</Text>
              <View style={styles.recipeMeta}>
                <Text style={styles.metaText}>预计时间：{recipe.estimatedTime}分钟</Text>
                <Text style={styles.metaSeparator}> | </Text>
                <Text style={styles.metaText}>已有1.2万人学会</Text>
              </View>
            </View>
            <View style={styles.difficultyContainer}>
              <Text style={styles.difficultyText}>难度: </Text>
              {renderStars(recipe.difficulty)}
            </View>
          </View>
        </Card>

        {/* 所需材料 */}
        <Card style={styles.materialsCard}>
          <Text style={styles.sectionTitle}>📋 所需材料</Text>
          <View style={styles.materialsList}>
            <Text style={styles.materialItem}>• 新鲜咖啡豆 {recipe.parameters.coffeeAmount}g</Text>
            <Text style={styles.materialItem}>• 水 {recipe.parameters.waterAmount}ml</Text>
            {recipe.equipment.type === 'Espresso' && (
              <Text style={styles.materialItem}>• 牛奶 150ml（全脂牛奶效果最佳）</Text>
            )}
            <Text style={styles.materialItem}>• 糖或糖浆（可选）</Text>
          </View>
        </Card>

        {/* 设备要求 */}
        <Card style={styles.equipmentCard}>
          <Text style={styles.sectionTitle}>🔧 设备要求</Text>
          <View style={styles.equipmentList}>
            <Text style={styles.equipmentItem}>• {recipe.equipment.name}</Text>
            <Text style={styles.equipmentItem}>• 咖啡磨豆机</Text>
            {recipe.equipment.type === 'Espresso' && (
              <>
                <Text style={styles.equipmentItem}>• 奶缸（350ml容量推荐）</Text>
                <Text style={styles.equipmentItem}>• 意式咖啡杯（200-240ml）</Text>
              </>
            )}
            {recipe.equipment.type === 'Pour Over' && (
              <>
                <Text style={styles.equipmentItem}>• 滤纸</Text>
                <Text style={styles.equipmentItem}>• 手冲壶</Text>
                <Text style={styles.equipmentItem}>• 电子秤</Text>
              </>
            )}
          </View>
        </Card>

        {/* 设备参数配置 */}
        <Card style={styles.parametersCard}>
          <Text style={styles.sectionTitle}>⚙️ 设备参数配置</Text>
          <View style={styles.parametersList}>
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>研磨度：</Text>
              <Text style={styles.parameterValue}>{recipe.parameters.grindSize}</Text>
            </View>
            {recipe.equipment.type === 'Espresso' && (
              <>
                <View style={styles.parameterRow}>
                  <Text style={styles.parameterLabel}>萃取压力：</Text>
                  <Text style={styles.parameterValue}>9bar</Text>
                </View>
                <View style={styles.parameterRow}>
                  <Text style={styles.parameterLabel}>萃取时间：</Text>
                  <Text style={styles.parameterValue}>25-30秒</Text>
                </View>
                <View style={styles.parameterRow}>
                  <Text style={styles.parameterLabel}>蒸汽温度：</Text>
                  <Text style={styles.parameterValue}>60-70°C</Text>
                </View>
              </>
            )}
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>萃取温度：</Text>
              <Text style={styles.parameterValue}>{recipe.parameters.waterTemp}°C</Text>
            </View>
            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>粉水比：</Text>
              <Text style={styles.parameterValue}>{recipe.parameters.ratio}</Text>
            </View>
            <Button
              title="根据你的设备调整参数"
              variant="outline"
              size="small"
              onPress={() => {}}
              style={styles.adjustButton}
            />
          </View>
        </Card>

        {/* 制作步骤预览 */}
        {recipe.steps.length > 0 && (
          <Card style={styles.stepsCard}>
            <Text style={styles.sectionTitle}>📝 制作步骤预览</Text>
            {recipe.steps.map((step, index) => (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepInstruction}>{step.instruction}</Text>
                  {step.tips && (
                    <Text style={styles.stepTips}>💡 {step.tips}</Text>
                  )}
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* 操作按钮 */}
        <View style={styles.actionButtons}>
          <Button
            title="开始制作"
            onPress={handleStartBrewing}
            style={styles.actionButton}
          />
          <Button
            title="观看视频教程"
            variant="outline"
            onPress={() => {}}
            style={styles.actionButton}
          />
          <Button
            title="参数计算器"
            variant="text"
            onPress={() => {}}
            style={styles.actionButton}
          />
        </View>

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

  infoCard: {
    marginVertical: theme.spacing.sm,
  },

  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  recipeInfo: {
    flex: 1,
  },

  recipeName: {
    fontSize: theme.typography.h5,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  recipeSubtitle: {
    fontSize: theme.typography.body1,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaText: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
  },

  metaSeparator: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
  },

  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  difficultyText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs,
  },

  sectionTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  materialsCard: {
    marginVertical: theme.spacing.sm,
  },

  materialsList: {},

  materialItem: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
  },

  equipmentCard: {
    marginVertical: theme.spacing.sm,
  },

  equipmentList: {},

  equipmentItem: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
  },

  parametersCard: {
    marginVertical: theme.spacing.sm,
  },

  parametersList: {},

  parameterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },

  parameterLabel: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    minWidth: 80,
  },

  parameterValue: {
    fontSize: theme.typography.body2,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },

  adjustButton: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing.md,
  },

  stepsCard: {
    marginVertical: theme.spacing.sm,
  },

  stepItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },

  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },

  stepNumberText: {
    fontSize: theme.typography.caption,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  stepInstruction: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  stepTips: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    fontStyle: 'italic',
  },

  actionButtons: {
    paddingVertical: theme.spacing.lg,
  },

  actionButton: {
    marginVertical: theme.spacing.xs,
  },

  bottomSpacer: {
    height: theme.spacing.xl,
  },
});