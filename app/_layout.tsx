import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
// import * as Permissions from 'expo-permissions'; // 暂时注释掉，因为新版本Expo中权限处理方式不同

import { theme } from '../src/styles/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // 请求必要权限
    requestPermissions();
    
    // 初始化应用数据
    initializeApp();
  }, []);

  const requestPermissions = async () => {
    try {
      // 权限处理将在具体使用时处理，这里暂时跳过
      console.log('Permissions will be handled when needed');
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const initializeApp = async () => {
    try {
      // 这里可以添加应用初始化逻辑
      // 例如：检查用户登录状态、加载缓存数据等
      console.log('App initialized successfully');
      
      // 隐藏启动屏幕
      await SplashScreen.hideAsync();
    } catch (error) {
      console.error('App initialization error:', error);
      await SplashScreen.hideAsync();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={theme.colors.white} />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="recognition" 
            options={{ 
              presentation: 'modal',
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="recognition-result" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="recipe-detail" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="brewing-guide" 
            options={{ 
              headerShown: false,
              gestureEnabled: false 
            }} 
          />
          <Stack.Screen 
            name="tasting-record" 
            options={{ headerShown: false }} 
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}