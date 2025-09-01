import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../../styles/theme';

export interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
  testID?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightComponent,
  leftComponent,
  backgroundColor = theme.colors.white,
  style,
  testID,
}) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]} testID={testID}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View style={styles.header}>
        <View style={styles.left}>
          {leftComponent || (showBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        
        <View style={styles.right}>
          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: theme.spacing.md,
  },
  
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  
  center: {
    flex: 1,
    alignItems: 'center',
  },
  
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  
  backButton: {
    padding: theme.spacing.xs,
  },
  
  title: {
    fontSize: theme.typography.h5,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
  },
});