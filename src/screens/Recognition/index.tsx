import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header, Card, Button } from '../../components/common';
import { theme } from '../../styles/theme';

export const RecognitionScreen: React.FC = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleTakePhoto = async () => {
    setIsProcessing(true);
    
    // 模拟处理过程
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert('提示', '照片识别功能正在开发中');
    }, 2000);
  };

  const handleSelectFromGallery = async () => {
    Alert.alert('提示', '相册选择功能正在开发中');
  };

  return (
    <View style={styles.container}>
      <Header
        title="拍照识豆"
        leftComponent={
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <Card style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>📸 如何获得最佳识别效果</Text>
          <Text style={styles.instructionText}>
            • 确保咖啡豆清晰可见{'\n'}
            • 光线充足，避免阴影{'\n'}
            • 豆子占据画面主要部分{'\n'}
            • 背景简洁干净
          </Text>
        </Card>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cameraButton]}
            onPress={handleTakePhoto}
            disabled={isProcessing}
          >
            <Ionicons name="camera-outline" size={48} color={theme.colors.white} />
            <Text style={styles.actionButtonText}>
              {isProcessing ? '正在处理...' : '拍照识别'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.galleryButton]}
            onPress={handleSelectFromGallery}
          >
            <Ionicons name="images-outline" size={48} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, styles.galleryButtonText]}>
              从相册选择
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.tipText}>
          💡 提示：支持识别常见的咖啡豆品种，包括阿拉比卡、罗布斯塔等
        </Text>
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
    padding: theme.layout.screenPadding,
  },
  instructionCard: {
    marginBottom: theme.spacing.lg,
  },
  instructionTitle: {
    fontSize: theme.typography.h6,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  instructionText: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  actionButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  cameraButton: {
    backgroundColor: theme.colors.primary,
  },
  galleryButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  actionButtonText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.body1,
    fontWeight: '600',
    color: theme.colors.white,
  },
  galleryButtonText: {
    color: theme.colors.primary,
  },
  tipText: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
});