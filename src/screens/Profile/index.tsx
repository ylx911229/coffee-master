import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Header, Card } from '../../components/common';
import { theme } from '../../styles/theme';
import type { RootStackParamList, User } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 模拟用户数据
    setUser({
      id: 'user1',
      username: '咖啡爱好者',
      email: 'coffee@example.com',
      avatar: 'https://example.com/avatar.jpg',
      level: '中级咖啡师',
      experience: 1560,
      preferences: {
        favoriteOrigins: ['埃塞俄比亚', '哥伦比亚'],
        preferredRoastLevel: ['中浅烘焙', '中烘焙'],
        equipmentPreferences: ['V60', '意式咖啡机'],
        flavorPreferences: {
          aroma: [{ name: '花香', intensity: 4, category: 'Floral' }],
          flavor: [{ name: '柑橘', intensity: 3, category: 'Fruity' }],
          acidity: 4,
          body: 3,
          aftertaste: 4,
          sweetness: 3,
          bitterness: 2,
        },
      },
      equipment: [],
      createdAt: new Date(),
    });
  }, []);

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="star"
        size={16}
        color={index < count ? theme.colors.warning : theme.colors.gray300}
      />
    ));
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="我的" />
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="我的" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 用户信息卡片 */}
        <Card style={styles.userCard}>
          <View style={styles.userHeader}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="person" size={40} color={theme.colors.gray400} />
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.username}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.levelContainer}>
                <Text style={styles.levelText}>{user.level}</Text>
                {renderStars(3)}
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Icon name="edit" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.experienceContainer}>
            <Text style={styles.experienceLabel}>经验值</Text>
            <View style={styles.experienceBar}>
              <View style={styles.experienceBarBackground}>
                <View style={[styles.experienceBarFill, { width: '78%' }]} />
              </View>
              <Text style={styles.experienceText}>{user.experience}/2000</Text>
            </View>
          </View>
        </Card>

        {/* 成就系统 */}
        <Card style={styles.achievementCard}>
          <Text style={styles.sectionTitle}>🏆 成就系统</Text>
          <View style={styles.achievementStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>已品尝豆子</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>制作咖啡</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>89</Text>
              <Text style={styles.statLabel}>品鉴记录</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>获得徽章</Text>
            </View>
          </View>
          
          <View style={styles.badgesContainer}>
            <Text style={styles.badgesTitle}>最新徽章</Text>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>🥉</Text>
                <Text style={styles.badgeText}>手冲新手</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>☕</Text>
                <Text style={styles.badgeText}>品鉴达人</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>📸</Text>
                <Text style={styles.badgeText}>识别专家</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* 学习路径 */}
        <Card style={styles.learningCard}>
          <Text style={styles.sectionTitle}>📚 学习路径</Text>
          <View style={styles.learningPath}>
            <Text style={styles.pathTitle}>咖啡师进阶之路</Text>
            <View style={styles.pathProgress}>
              <View style={styles.pathStep}>
                <View style={[styles.pathDot, styles.pathDotCompleted]} />
                <Text style={styles.pathStepText}>基础知识</Text>
              </View>
              <View style={styles.pathLine} />
              <View style={styles.pathStep}>
                <View style={[styles.pathDot, styles.pathDotCompleted]} />
                <Text style={styles.pathStepText}>器具使用</Text>
              </View>
              <View style={styles.pathLine} />
              <View style={styles.pathStep}>
                <View style={[styles.pathDot, styles.pathDotCurrent]} />
                <Text style={styles.pathStepText}>制作技巧</Text>
              </View>
              <View style={styles.pathLine} />
              <View style={styles.pathStep}>
                <View style={styles.pathDot} />
                <Text style={styles.pathStepText}>专业认证</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* 设备管理 */}
        <Card style={styles.equipmentCard}>
          <Text style={styles.sectionTitle}>🔧 我的设备</Text>
          <View style={styles.equipmentList}>
            <View style={styles.equipmentItem}>
              <Icon name="coffee-maker" size={24} color={theme.colors.primary} />
              <Text style={styles.equipmentName}>Hario V60</Text>
              <TouchableOpacity>
                <Icon name="edit" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.equipmentItem}>
              <Icon name="coffee-maker" size={24} color={theme.colors.primary} />
              <Text style={styles.equipmentName}>德龙 EC9335</Text>
              <TouchableOpacity>
                <Icon name="edit" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addEquipmentButton}>
              <Icon name="add" size={20} color={theme.colors.primary} />
              <Text style={styles.addEquipmentText}>添加设备</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 功能菜单 */}
        <Card style={styles.menuCard}>
          <Text style={styles.sectionTitle}>⚙️ 更多功能</Text>
          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="history" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.menuItemText}>制作历史</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="favorite" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.menuItemText}>我的收藏</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="bar-chart" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.menuItemText}>数据统计</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="settings" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.menuItemText}>设置</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
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

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  userCard: {
    marginVertical: theme.spacing.sm,
  },

  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },

  avatarContainer: {
    marginRight: theme.spacing.md,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  userEmail: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  levelText: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },

  editButton: {
    padding: theme.spacing.xs,
  },

  experienceContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },

  experienceLabel: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  experienceBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  experienceBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.gray300,
    borderRadius: 4,
    marginRight: theme.spacing.md,
  },

  experienceBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },

  experienceText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  achievementCard: {
    marginVertical: theme.spacing.sm,
  },

  sectionTitle: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  achievementStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    fontSize: theme.typography.h5,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },

  statLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  badgesContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },

  badgesTitle: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  badges: {
    flexDirection: 'row',
  },

  badge: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },

  badgeIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },

  badgeText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  learningCard: {
    marginVertical: theme.spacing.sm,
  },

  learningPath: {},

  pathTitle: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  pathProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pathStep: {
    alignItems: 'center',
  },

  pathDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.gray300,
    marginBottom: theme.spacing.xs,
  },

  pathDotCompleted: {
    backgroundColor: theme.colors.success,
  },

  pathDotCurrent: {
    backgroundColor: theme.colors.primary,
  },

  pathStepText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  pathLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.gray300,
    marginHorizontal: theme.spacing.sm,
  },

  equipmentCard: {
    marginVertical: theme.spacing.sm,
  },

  equipmentList: {},

  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  equipmentName: {
    flex: 1,
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },

  addEquipmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },

  addEquipmentText: {
    fontSize: theme.typography.body2,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },

  menuCard: {
    marginVertical: theme.spacing.sm,
  },

  menuItems: {},

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  menuItemText: {
    flex: 1,
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },

  bottomSpacer: {
    height: theme.spacing.xl,
  },
});