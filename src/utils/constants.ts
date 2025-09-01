// 应用常量配置

// 应用信息
export const APP_CONFIG = {
  NAME: 'CoffeeAI',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
};

// API 配置
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'https://dev-api.coffeeai.com' : 'https://api.coffeeai.com',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
};

// 存储键
export const STORAGE_KEYS = {
  USER_TOKEN: '@CoffeeAI:userToken',
  USER_DATA: '@CoffeeAI:userData',
  BREWING_RECORDS: '@CoffeeAI:brewingRecords',
  TASTING_RECORDS: '@CoffeeAI:tastingRecords',
  COFFEE_BEANS: '@CoffeeAI:coffeeBeans',
  USER_PREFERENCES: '@CoffeeAI:userPreferences',
  FIRST_LAUNCH: '@CoffeeAI:firstLaunch',
};

// 咖啡相关常量
export const COFFEE_CONSTANTS = {
  ROAST_LEVELS: ['Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'] as const,
  PROCESSING_METHODS: ['Washed', 'Natural', 'Honey', 'Semi-Washed'] as const,
  EQUIPMENT_TYPES: ['Pour Over', 'Espresso', 'French Press', 'AeroPress', 'Cold Brew'] as const,
  FLAVOR_CATEGORIES: ['Floral', 'Fruity', 'Sweet', 'Nutty', 'Chocolate', 'Spicy', 'Others'] as const,
};

// 制作教程分类
export const RECIPE_CATEGORIES = {
  ALL: '全部',
  POUR_OVER: '手冲',
  ESPRESSO: '意式',
  SPECIALTY: '特调',
  COLD_BREW: '冰饮',
  CREATIVE: '创意',
};

// 难度等级
export const DIFFICULTY_LEVELS = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};

// 评分范围
export const RATING_RANGE = {
  MIN: 1,
  MAX: 5,
};

// 图片配置
export const IMAGE_CONFIG = {
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
  QUALITY: 0.8,
  ALLOWED_TYPES: ['jpg', 'jpeg', 'png'],
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
};

// 默认参数
export const DEFAULT_PARAMETERS = {
  POUR_OVER: {
    grindSize: '中细研磨',
    coffeeAmount: 15,
    waterAmount: 250,
    waterTemp: 92,
    brewTime: 180,
    ratio: '1:15',
  },
  ESPRESSO: {
    grindSize: '细研磨',
    coffeeAmount: 18,
    waterAmount: 36,
    waterTemp: 92,
    brewTime: 25,
    ratio: '1:2',
  },
  FRENCH_PRESS: {
    grindSize: '粗研磨',
    coffeeAmount: 20,
    waterAmount: 300,
    waterTemp: 95,
    brewTime: 240,
    ratio: '1:15',
  },
};

// 通知配置
export const NOTIFICATION_CONFIG = {
  CHANNELS: {
    GENERAL: 'general',
    BREWING_REMINDER: 'brewing_reminder',
    COMMUNITY: 'community',
  },
  TYPES: {
    BREWING_COMPLETE: 'brewing_complete',
    COMMUNITY_UPDATE: 'community_update',
    ACHIEVEMENT: 'achievement',
  },
};

// 错误代码
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  CAMERA_ERROR: 'CAMERA_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
};

// 权限类型
export const PERMISSIONS = {
  CAMERA: 'camera',
  PHOTO_LIBRARY: 'photo_library',
  MICROPHONE: 'microphone',
  NOTIFICATIONS: 'notifications',
};

// 分析事件
export const ANALYTICS_EVENTS = {
  APP_LAUNCH: 'app_launch',
  BEAN_RECOGNITION: 'bean_recognition',
  RECIPE_START: 'recipe_start',
  RECIPE_COMPLETE: 'recipe_complete',
  TASTING_RECORD: 'tasting_record',
  SHARE_RECIPE: 'share_recipe',
  USER_REGISTRATION: 'user_registration',
};

// 成就类型
export const ACHIEVEMENTS = {
  FIRST_RECOGNITION: 'first_recognition',
  FIRST_BREWING: 'first_brewing',
  FIRST_TASTING: 'first_tasting',
  BREWING_MASTER: 'brewing_master',
  TASTING_EXPERT: 'tasting_expert',
  SHARING_ENTHUSIAST: 'sharing_enthusiast',
};

// 用户等级
export const USER_LEVELS = [
  { name: '咖啡新手', minExperience: 0, maxExperience: 499, stars: 1 },
  { name: '初级咖啡师', minExperience: 500, maxExperience: 999, stars: 2 },
  { name: '中级咖啡师', minExperience: 1000, maxExperience: 1999, stars: 3 },
  { name: '高级咖啡师', minExperience: 2000, maxExperience: 4999, stars: 4 },
  { name: '咖啡大师', minExperience: 5000, maxExperience: Infinity, stars: 5 },
];

// 正则表达式
export const REGEX_PATTERNS = {
  EMAIL: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
};

// 时间常量（毫秒）
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
};