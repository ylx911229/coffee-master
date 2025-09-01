import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Header, Card } from '../../components/common';
import { theme } from '../../styles/theme';

export const CommunityScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header
        title="社区学习广场"
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity>
              <Icon name="add" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Icon name="search" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Icon name="person" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        }
      />
      
      <ScrollView style={styles.content}>
        {/* 功能开发中提示 */}
        <Card style={styles.comingSoonCard}>
          <View style={styles.comingSoonContent}>
            <Icon name="construction" size={60} color={theme.colors.gray400} />
            <Text style={styles.comingSoonTitle}>社区功能开发中</Text>
            <Text style={styles.comingSoonText}>
              即将上线：
            </Text>
            <Text style={styles.featureText}>• 咖啡作品分享</Text>
            <Text style={styles.featureText}>• 制作参数交流</Text>
            <Text style={styles.featureText}>• 大师课程学习</Text>
            <Text style={styles.featureText}>• 挑战任务打卡</Text>
            <Text style={styles.featureText}>• 问答互动社区</Text>
          </View>
        </Card>
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

  comingSoonCard: {
    marginVertical: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
  },

  comingSoonContent: {
    alignItems: 'center',
  },

  comingSoonTitle: {
    fontSize: theme.typography.h5,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  comingSoonText: {
    fontSize: theme.typography.body1,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },

  featureText: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
});