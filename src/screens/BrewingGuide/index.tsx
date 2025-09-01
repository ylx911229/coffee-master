import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Header, Card, Button } from '../../components/common';
import { theme } from '../../styles/theme';
import type { RootStackParamList, BrewingStep } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'BrewingGuide'>;

const { width } = Dimensions.get('window');

export const BrewingGuideScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { recipe, bean } = route.params;

  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(recipe.steps.length).fill(false)
  );

  // 扩展步骤数据（模拟完整步骤）
  const [steps] = useState<BrewingStep[]>([
    {
      id: 1,
      title: '准备工作',
      instruction: '准备器具和咖啡豆，检查研磨度和水温',
      duration: 30,
      tips: '确保所有器具清洁干净',
    },
    {
      id: 2,
      title: '闷蒸',
      instruction: '从中心开始顺时针缓慢注水，观察粉层膨胀',
      duration: 30,
      waterAmount: 50,
      temperature: 92,
      tips: '注水速度要均匀，水流要细',
    },
    {
      id: 3,
      title: '第一次注水',
      instruction: '继续注水至150ml，保持均匀的水流',
      duration: 45,
      waterAmount: 100,
      tips: '观察萃取颜色变化',
    },
    {
      id: 4,
      title: '第二次注水',
      instruction: '最后注水至250ml，完成萃取',
      duration: 60,
      waterAmount: 100,
      tips: '注意控制总萃取时间',
    },
    {
      id: 5,
      title: '等待滤完',
      instruction: '等待咖啡完全滤完，观察咖啡液颜色',
      duration: 45,
      tips: '不要按压或搅拌滤杯',
    },
    {
      id: 6,
      title: '完成',
      instruction: '制作完成！享受您的手冲咖啡',
      duration: 0,
      tips: '趁热品尝，感受香气和风味',
    },
  ]);

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const handleBack = useCallback(() => {
    Alert.alert(
      '确认退出',
      '制作过程尚未完成，确定要退出吗？',
      [
        { text: '继续制作', style: 'cancel' },
        { text: '退出', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  }, [navigation]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const handleNextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const newCompletedSteps = [...completedSteps];
      newCompletedSteps[currentStep] = true;
      setCompletedSteps(newCompletedSteps);
      setCurrentStep(currentStep + 1);
    } else {
      // 完成制作
      handleComplete();
    }
  }, [currentStep, steps.length, completedSteps]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    
    Alert.alert(
      '制作完成！',
      '恭喜您完成了咖啡制作，是否要记录品鉴？',
      [
        { text: '跳过', onPress: () => navigation.goBack() },
        {
          text: '品鉴记录',
          onPress: () => {
            // 创建制作记录
            const brewingRecord = {
              id: Date.now().toString(),
              userId: 'user1',
              recipeId: recipe.id,
              coffeeBeanId: bean.id,
              parameters: recipe.parameters,
              result: {
                actualTime: timer,
                yield: recipe.parameters.waterAmount,
              },
              rating: 0,
              notes: '',
              createdAt: new Date(),
            };
            
            navigation.navigate('TastingRecord', { brewingRecord });
          }
        },
      ]
    );
  }, [navigation, recipe, bean, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <View style={styles.container}>
      <Header
        title="手冲制作指导"
        showBack
        onBack={handleBack}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handlePause}>
              <Icon 
                name={isPaused ? "play-arrow" : "pause"} 
                size={24} 
                color={theme.colors.text} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleComplete} style={styles.headerAction}>
              <Icon name="done" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.content}>
        {/* 进度条和计时器 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.stepInfo}>
              步骤 {currentStep + 1}/{steps.length}：{currentStepData.title}
            </Text>
            <Text style={styles.timer}>⏱️ {formatTime(timer)}</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        </View>

        {/* 语音指导提示 */}
        <View style={styles.voiceContainer}>
          <Icon name="volume-up" size={20} color={theme.colors.primary} />
          <Text style={styles.voiceText}>
            "现在开始{currentStepData.title}，{currentStepData.instruction}"
          </Text>
        </View>

        {/* 视频指导区域 */}
        <Card style={styles.videoCard}>
          <View style={styles.videoPlaceholder}>
            <Icon name="play-circle-filled" size={60} color={theme.colors.primary} />
            <Text style={styles.videoTitle}>📹 实时视频指导</Text>
            <Text style={styles.videoSubtitle}>大师演示标准手冲技法</Text>
          </View>
        </Card>

        {/* 当前参数显示 */}
        <Card style={styles.parametersCard}>
          <Text style={styles.parametersTitle}>📋 当前参数</Text>
          <View style={styles.parametersGrid}>
            <View style={styles.parameterItem}>
              <Text style={styles.parameterLabel}>已注水</Text>
              <Text style={styles.parameterValue}>
                {currentStepData.waterAmount || 0}ml / {recipe.parameters.waterAmount}ml
              </Text>
            </View>
            <View style={styles.parameterItem}>
              <Text style={styles.parameterLabel}>时间</Text>
              <Text style={styles.parameterValue}>
                {formatTime(timer)} / {formatTime(recipe.parameters.brewTime)}
              </Text>
            </View>
            {currentStepData.temperature && (
              <View style={styles.parameterItem}>
                <Text style={styles.parameterLabel}>水温</Text>
                <Text style={styles.parameterValue}>
                  {currentStepData.temperature}°C
                </Text>
              </View>
            )}
          </View>
          
          {currentStep < steps.length - 1 && (
            <Text style={styles.nextStepHint}>
              下一步：{steps[currentStep + 1].title}
            </Text>
          )}
        </Card>

        {/* 实时提醒 */}
        <Card style={styles.hintsCard}>
          <Text style={styles.hintsTitle}>💡 实时提醒</Text>
          <View style={styles.hintsList}>
            <View style={styles.hintItem}>
              <Icon name="check-circle" size={16} color={theme.colors.success} />
              <Text style={styles.hintText}>注水速度很好！</Text>
            </View>
            {currentStepData.tips && (
              <View style={styles.hintItem}>
                <Icon name="lightbulb" size={16} color={theme.colors.warning} />
                <Text style={styles.hintText}>{currentStepData.tips}</Text>
              </View>
            )}
            <View style={styles.hintItem}>
              <Icon name="notifications" size={16} color={theme.colors.info} />
              <Text style={styles.hintText}>准备进入下一个注水阶段</Text>
            </View>
          </View>
        </Card>

        {/* 控制按钮 */}
        <View style={styles.controlButtons}>
          <Button
            title="上一步"
            variant="outline"
            size="small"
            onPress={handlePreviousStep}
            disabled={currentStep === 0}
            style={styles.controlButton}
          />
          
          <Button
            title={isRunning ? (isPaused ? "继续" : "暂停") : "开始"}
            variant="primary"
            size="small"
            onPress={isRunning ? handlePause : handleStart}
            style={styles.controlButton}
          />
          
          <Button
            title="跳过"
            variant="text"
            size="small"
            onPress={handleNextStep}
            style={styles.controlButton}
          />
          
          <Button
            title="语音问答"
            variant="text"
            size="small"
            onPress={() => Alert.alert('语音问答', '功能开发中...')}
            style={styles.controlButton}
          />
        </View>
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

  progressContainer: {
    marginVertical: theme.spacing.md,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },

  stepInfo: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    flex: 1,
  },

  timer: {
    fontSize: theme.typography.h6,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },

  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.gray300,
    borderRadius: 3,
    marginRight: theme.spacing.sm,
  },

  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },

  progressText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    minWidth: 35,
  },

  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
  },

  voiceText: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
    fontStyle: 'italic',
  },

  videoCard: {
    marginVertical: theme.spacing.sm,
    height: 200,
  },

  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.md,
  },

  videoTitle: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },

  videoSubtitle: {
    fontSize: theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },

  parametersCard: {
    marginVertical: theme.spacing.sm,
  },

  parametersTitle: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },

  parameterItem: {
    width: '50%',
    marginBottom: theme.spacing.sm,
  },

  parameterLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },

  parameterValue: {
    fontSize: theme.typography.body2,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },

  nextStepHint: {
    fontSize: theme.typography.body2,
    color: theme.colors.primary,
    fontStyle: 'italic',
  },

  hintsCard: {
    marginVertical: theme.spacing.sm,
  },

  hintsTitle: {
    fontSize: theme.typography.body1,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  hintsList: {},

  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },

  hintText: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },

  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
  },

  controlButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});