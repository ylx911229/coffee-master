import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/common';
import { theme } from '../../styles/theme';

export const TastingRecordScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header title="品鉴记录" />
      <View style={styles.content}>
        <Text style={styles.text}>品鉴记录功能开发中...</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.layout.screenPadding,
  },
  text: {
    fontSize: theme.typography.body1,
    color: theme.colors.textSecondary,
  },
});