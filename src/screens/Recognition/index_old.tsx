import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Header, Card, Button, Loading } from '../../components/common';
import { theme } from '../../styles/theme';
import type { RootStackParamList, RecognitionResult } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

export const RecognitionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTakePhoto = useCallback(() => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setSelectedImage(imageUri);
          processImage(imageUri);
        }
      }
    });
  }, []);

  const handlePickFromLibrary = useCallback(() => {
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
          setSelectedImage(imageUri);
          processImage(imageUri);
        }
      }
    });
  }, []);

  const processImage = useCallback(async (imageUri: string) => {
    setIsProcessing(true);
    
    try {
      // 使用Mock AI服务
      const { MockAIService } = await import('../../services/ai/MockAIService');
      const result = await MockAIService.recognizeCoffeeBean(imageUri);

      navigation.navigate('RecognitionResult', { result });
    } catch (error) {
      Alert.alert('识别失败', '请重新尝试或选择其他图片');
    } finally {
      setIsProcessing(false);
    }
  }, [navigation]);

  const handleHelp = useCallback(() => {
    Alert.alert(
      '拍摄技巧',
      '• 使用自然光或均匀照明\n• 将5-10颗豆子平铺在白纸上\n• 保持手机稳定，距离30cm左右\n• 确保咖啡豆清晰可见'
    );
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="识别咖啡豆"
        showBack
        onBack={handleBack}
        rightComponent={
          <TouchableOpacity onPress={() => {}}>
            <Icon name="flash-on" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* 相机预览区域 */}
        <View style={styles.cameraContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Icon name="camera-alt" size={60} color={theme.colors.gray400} />
              <View style={styles.guidanceContainer}>
                <Text style={styles.guidanceText}>请将咖啡豆放在</Text>
                <Text style={styles.guidanceText}>白色背景上拍摄</Text>
              </View>
            </View>
          )}
        </View>

        {/* 拍摄技巧 */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 拍摄技巧：</Text>
          <Text style={styles.tipsText}>• 使用自然光或均匀照明</Text>
          <Text style={styles.tipsText}>• 将5-10颗豆子平铺在白纸上</Text>
          <Text style={styles.tipsText}>• 保持手机稳定，距离30cm左右</Text>
        </Card>

        {/* 操作按钮 */}
        <View style={styles.actionButtons}>
          <Button
            title="📷 拍照识别"
            onPress={handleTakePhoto}
            disabled={isProcessing}
            style={styles.actionButton}
          />
          <Button
            title="📁 相册选择"
            variant="outline"
            onPress={handlePickFromLibrary}
            disabled={isProcessing}
            style={styles.actionButton}
          />
          <Button
            title="❓ 帮助说明"
            variant="text"
            onPress={handleHelp}
            disabled={isProcessing}
            style={styles.actionButton}
          />
        </View>
      </View>

      {/* AI处理加载覆盖层 */}
      <Loading
        visible={isProcessing}
        text="AI正在识别中..."
        overlay
      />
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

  cameraContainer: {
    flex: 1,
    marginVertical: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },

  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray100,
  },

  previewImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },

  guidanceContainer: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },

  guidanceText: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  tipsCard: {
    marginVertical: theme.spacing.md,
  },

  tipsTitle: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  tipsText: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },

  actionButtons: {
    paddingVertical: theme.spacing.lg,
  },

  actionButton: {
    marginVertical: theme.spacing.xs,
  },
});