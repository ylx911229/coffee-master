import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export class ImagePickerService {
  // 请求权限
  static async requestPermissions(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '权限需要',
        '咖啡大师需要相机权限来拍照识别咖啡豆。',
        [
          { text: '取消', style: 'cancel' },
          { text: '去设置', onPress: () => console.log('开启设置') },
        ]
      );
      return false;
    }

    const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaLibraryStatus.status !== 'granted') {
      console.warn('Media library permission not granted');
    }

    return true;
  }

  // 拍照
  static async takePhoto(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Take photo error:', error);
      Alert.alert('错误', '拍照时出现错误，请重试。');
      return null;
    }
  }

  // 从相册选择
  static async pickFromGallery(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Pick from gallery error:', error);
      Alert.alert('错误', '选择图片时出现错误，请重试。');
      return null;
    }
  }

  // 显示选择对话框
  static async showImagePicker(): Promise<string | null> {
    return new Promise((resolve) => {
      Alert.alert(
        '选择照片',
        '请选择获取照片的方式',
        [
          {
            text: '拍照',
            onPress: async () => {
              const uri = await this.takePhoto();
              resolve(uri);
            },
          },
          {
            text: '从相册选择',
            onPress: async () => {
              const uri = await this.pickFromGallery();
              resolve(uri);
            },
          },
          {
            text: '取消',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true }
      );
    });
  }
}