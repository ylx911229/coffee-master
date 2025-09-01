import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Header, Card } from '../../components/common';
import { theme } from '../../styles/theme';
import type { RootStackParamList, BrewingMethod } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORIES = ['全部', '手冲', '意式', '特调', '冰饮'];

export const RecipesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchText, setSearchText] = useState('');
  const [recipes, setRecipes] = useState<BrewingMethod[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<BrewingMethod[]>([]);

  useEffect(() => {
    // 模拟数据加载
    const mockRecipes: BrewingMethod[] = [
      {
        id: '1',
        name: '经典拿铁',
        equipment: { id: '1', name: '意式咖啡机', type: 'Espresso' },
        difficulty: 2,
        estimatedTime: 15,
        steps: [
          {
            id: 1,
            title: '研磨咖啡豆',
            instruction: '使用细研磨，准备18-20g咖啡粉',
            duration: 30,
            tips: '确保研磨度均匀，避免粉末过细'
          },
          {
            id: 2,
            title: '萃取浓缩咖啡',
            instruction: '萃取双份浓缩咖啡，时间控制在25-30秒',
            duration: 30,
            tips: '观察咖啡流速，调整研磨度'
          },
          {
            id: 3,
            title: '蒸汽打奶',
            instruction: '将牛奶加热到60-70°C，打出细腻奶泡',
            duration: 60,
            tips: '蒸汽棒要插入牛奶中心位置'
          }
        ],
        parameters: {
          grindSize: '细研磨',
          coffeeAmount: 18,
          waterAmount: 30,
          waterTemp: 92,
          brewTime: 30,
          ratio: '1:2',
        }
      },
      {
        id: '2',
        name: 'V60手冲',
        equipment: { id: '2', name: 'Hario V60', type: 'Pour Over' },
        difficulty: 2,
        estimatedTime: 5,
        steps: [
          {
            id: 1,
            title: '准备器具',
            instruction: '将滤纸放入V60，用热水冲洗滤纸和温杯',
            duration: 30,
          },
          {
            id: 2,
            title: '加入咖啡粉',
            instruction: '倒入研磨好的咖啡粉，轻轻晃动使粉层平整',
            duration: 15,
          }
        ],
        parameters: {
          grindSize: '中细研磨',
          coffeeAmount: 15,
          waterAmount: 250,
          waterTemp: 92,
          brewTime: 180,
          ratio: '1:15',
        }
      },
      {
        id: '3',
        name: '小黄油咖啡',
        equipment: { id: '3', name: '搅拌器', type: 'Others' as any },
        difficulty: 1,
        estimatedTime: 3,
        steps: [
          {
            id: 1,
            title: '准备黑咖啡',
            instruction: '冲泡一杯浓郁的黑咖啡',
            duration: 60,
          },
          {
            id: 2,
            title: '添加黄油',
            instruction: '加入1-2茶匙无盐黄油',
            duration: 10,
          }
        ],
        parameters: {
          grindSize: '中研磨',
          coffeeAmount: 20,
          waterAmount: 200,
          waterTemp: 95,
          brewTime: 240,
          ratio: '1:10',
        }
      }
    ];

    setRecipes(mockRecipes);
    setFilteredRecipes(mockRecipes);
  }, []);

  useEffect(() => {
    let filtered = recipes;

    // 按类别筛选
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(recipe => {
        switch (selectedCategory) {
          case '手冲':
            return recipe.equipment.type === 'Pour Over';
          case '意式':
            return recipe.equipment.type === 'Espresso';
          case '特调':
            return !['Pour Over', 'Espresso'].includes(recipe.equipment.type);
          default:
            return true;
        }
      });
    }

    // 按搜索文本筛选
    if (searchText) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredRecipes(filtered);
  }, [recipes, selectedCategory, searchText]);

  const renderRecipeCard = ({ item }: { item: BrewingMethod }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      <Card style={styles.recipeCard}>
        <View style={styles.recipeHeader}>
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeName}>☕ {item.name}</Text>
            <View style={styles.recipeMeta}>
              <Text style={styles.metaText}>{item.estimatedTime}分钟</Text>
              <Text style={styles.metaSeparator}> | </Text>
              <Text style={styles.metaText}>需要{item.equipment.name}</Text>
              <Text style={styles.metaSeparator}> | </Text>
              <Text style={styles.metaText}>1.2万人学过</Text>
            </View>
          </View>
          <View style={styles.difficultyContainer}>
            <Text style={styles.difficultyText}>难度: </Text>
            {Array.from({ length: 3 }, (_, i) => (
              <Icon
                key={i}
                name="star"
                size={14}
                color={i < item.difficulty ? theme.colors.warning : theme.colors.gray300}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.recipeActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>查看教程</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="favorite-border" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.actionButtonText}>收藏</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.categoryButtonTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="咖啡制作大全"
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity>
              <Icon name="search" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Icon name="favorite" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.content}>
        {/* 搜索栏 */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索制作方法或选择分类"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        {/* 分类筛选 */}
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map(renderCategoryButton)}
        </View>

        {/* 设备检测推荐 */}
        <Card style={styles.equipmentCard}>
          <Text style={styles.equipmentTitle}>🎯 根据你的设备推荐</Text>
          <View style={styles.equipmentInfo}>
            <Text style={styles.equipmentText}>检测到：德龙EC9335意式咖啡机</Text>
            <Text style={styles.equipmentRecommend}>推荐：拿铁、卡布奇诺、美式咖啡</Text>
            <TouchableOpacity>
              <Text style={styles.equipmentLink}>查看完整参数配置</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 热门教程列表 */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>📝 热门教程</Text>
        </View>

        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginVertical: theme.spacing.md,
  },

  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.body2,
    color: theme.colors.text,
  },

  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },

  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.full,
  },

  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },

  categoryButtonText: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
  },

  categoryButtonTextActive: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium,
  },

  equipmentCard: {
    marginBottom: theme.spacing.lg,
  },

  equipmentTitle: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  equipmentInfo: {},

  equipmentText: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  equipmentRecommend: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  equipmentLink: {
    fontSize: theme.typography.body2,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },

  listHeader: {
    marginBottom: theme.spacing.md,
  },

  listTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
  },

  listContainer: {
    paddingBottom: theme.spacing.xl,
  },

  recipeCard: {
    marginBottom: theme.spacing.md,
  },

  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },

  recipeInfo: {
    flex: 1,
  },

  recipeName: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  metaSeparator: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  difficultyText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  recipeActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },

  actionButtonText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
});