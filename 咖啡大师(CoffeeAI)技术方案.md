# 咖啡大师（CoffeeAI）技术方案文档

**版本：** V1.0  
**日期：** 2025-08-20  
**技术栈：** React Native + TypeScript  
**作者：** 技术架构团队

---

## 一、技术架构总览

### 1.1 整体架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    咖啡大师移动端应用                          │
├─────────────────────────────────────────────────────────────┤
│                  React Native + TypeScript                  │
├─────────────────────────────────────────────────────────────┤
│  UI层    │  业务层     │  数据层     │  服务层     │  AI层    │
│  ────────│──────────── │──────────── │──────────── │────────  │
│ Components│ Hooks/Store │ API Client │ Third-party │ AI SDKs  │
│ Screens   │ Navigation  │ Local DB   │ Services    │ ML Models│
│ UI Kit    │ Utils       │ Cache      │ Push/Auth   │ Vision   │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                      后端服务架构                            │
├─────────────────────────────────────────────────────────────┤
│  API网关  │  微服务集群  │  数据存储   │  AI服务     │  第三方  │
│  ────────│──────────── │──────────── │──────────── │────────  │
│  Nginx    │ User Service│ PostgreSQL  │ Vision API  │ 支付SDK  │
│  Gateway  │ Coffee API  │ Redis       │ NLP Service │ 推送服务  │
│           │ AI Service  │ MinIO       │ ML Pipeline │ 地图服务  │
│           │ Community   │ Elasticsearch│ Model Train│          │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技术选型理由

| 技术分类 | 选型 | 理由 |
|---------|------|------|
| **移动端框架** | React Native 0.73+ | 跨平台开发、性能优异、社区活跃 |
| **开发语言** | TypeScript 5.0+ | 类型安全、开发效率、代码质量 |
| **状态管理** | Redux Toolkit + RTK Query | 数据管理、缓存机制、开发工具 |
| **导航** | React Navigation 6 | 原生体验、手势支持、深度定制 |
| **UI组件** | React Native Elements + 自定义 | 快速开发、设计一致性 |
| **本地存储** | AsyncStorage + SQLite | 轻量数据、复杂查询、离线支持 |
| **网络请求** | Axios + Interceptors | 请求拦截、错误处理、超时控制 |
| **图像处理** | react-native-image-picker + 腾讯云AI | 拍照选择、AI识别、云端处理 |
| **音频处理** | react-native-audio-recorder-player | 录音播放、语音交互 |
| **推送通知** | react-native-firebase + FCM | 消息推送、用户召回 |

---

## 二、前端架构设计

### 2.1 项目目录结构

```
src/
├── components/           # 通用组件
│   ├── common/          # 基础组件
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Loading/
│   ├── business/        # 业务组件
│   │   ├── CoffeeCard/
│   │   ├── RecipeStep/
│   │   ├── RatingWheel/
│   │   └── CameraView/
│   └── layout/          # 布局组件
│       ├── Header/
│       ├── TabBar/
│       └── Container/
├── screens/             # 页面组件
│   ├── Home/
│   ├── Recognition/
│   ├── Recipe/
│   ├── Community/
│   ├── Profile/
│   └── Certification/
├── navigation/          # 导航配置
│   ├── AppNavigator.tsx
│   ├── TabNavigator.tsx
│   └── StackNavigator.tsx
├── store/              # 状态管理
│   ├── slices/         # Redux切片
│   │   ├── authSlice.ts
│   │   ├── coffeeSlice.ts
│   │   ├── recipeSlice.ts
│   │   └── userSlice.ts
│   ├── api/            # RTK Query API
│   │   ├── authApi.ts
│   │   ├── coffeeApi.ts
│   │   └── communityApi.ts
│   └── index.ts        # Store配置
├── services/           # 业务服务
│   ├── ai/             # AI相关服务
│   │   ├── vision.ts
│   │   ├── speech.ts
│   │   └── nlp.ts
│   ├── storage/        # 存储服务
│   │   ├── asyncStorage.ts
│   │   └── database.ts
│   └── notification/   # 推送服务
├── utils/              # 工具函数
│   ├── constants.ts
│   ├── helpers.ts
│   ├── validation.ts
│   └── formatters.ts
├── types/              # TypeScript类型
│   ├── coffee.ts
│   ├── user.ts
│   ├── api.ts
│   └── navigation.ts
├── assets/             # 静态资源
│   ├── images/
│   ├── icons/
│   └── fonts/
└── hooks/              # 自定义Hook
    ├── useCamera.ts
    ├── useAudio.ts
    ├── usePermissions.ts
    └── useOffline.ts
```

### 2.2 核心组件设计

#### 2.2.1 智能识别组件

```typescript
// components/business/CoffeeRecognition/index.tsx
interface CoffeeRecognitionProps {
  onResult: (result: RecognitionResult) => void;
  type: 'bean' | 'equipment' | 'product';
}

export const CoffeeRecognition: React.FC<CoffeeRecognitionProps> = ({
  onResult,
  type
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { takePhoto, pickImage } = useCamera();
  const { recognizeCoffee } = useAIRecognition();

  const handleCapture = async () => {
    try {
      setIsProcessing(true);
      const image = await takePhoto();
      const result = await recognizeCoffee(image, type);
      onResult(result);
    } catch (error) {
      showError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraPreview onCapture={handleCapture} />
      {isProcessing && <AIProcessingOverlay />}
      <CaptureControls onTakePhoto={handleCapture} />
    </View>
  );
};
```

#### 2.2.2 制作指导组件

```typescript
// components/business/RecipeGuide/index.tsx
interface RecipeGuideProps {
  recipe: Recipe;
  onComplete: (result: RecipeResult) => void;
}

export const RecipeGuide: React.FC<RecipeGuideProps> = ({
  recipe,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const { playVoice, stopVoice } = useVoiceGuide();
  const { startTimer, pauseTimer } = useTimer();

  const handleNextStep = async () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      await playVoice(recipe.steps[currentStep + 1].instruction);
    } else {
      onComplete({ steps: recipe.steps, time: timer });
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        current={currentStep + 1}
        total={recipe.steps.length}
        progress={(currentStep + 1) / recipe.steps.length * 100}
      />
      <Timer time={timer} isRunning={true} />
      <StepInstructions
        step={recipe.steps[currentStep]}
        onNext={handleNextStep}
      />
      <VoiceControls
        onPlay={() => playVoice(recipe.steps[currentStep].instruction)}
        onStop={stopVoice}
      />
    </View>
  );
};
```

### 2.3 状态管理架构

#### 2.3.1 Redux Store配置

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authSlice from './slices/authSlice';
import coffeeSlice from './slices/coffeeSlice';
import recipeSlice from './slices/recipeSlice';
import { authApi } from './api/authApi';
import { coffeeApi } from './api/coffeeApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    coffee: coffeeSlice,
    recipe: recipeSlice,
    authApi: authApi.reducer,
    coffeeApi: coffeeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
    .concat(authApi.middleware)
    .concat(coffeeApi.middleware),
});

setupListeners(store.dispatch);
```

#### 2.3.2 API切片设计

```typescript
// store/api/coffeeApi.ts
export const coffeeApi = createApi({
  reducerPath: 'coffeeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/coffee',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Coffee', 'Recipe', 'Recognition'],
  endpoints: (builder) => ({
    recognizeCoffee: builder.mutation<
      RecognitionResult,
      { image: string; type: RecognitionType }
    >({
      query: ({ image, type }) => ({
        url: '/recognize',
        method: 'POST',
        body: { image, type },
      }),
      invalidatesTags: ['Recognition'],
    }),
    getCoffeeLibrary: builder.query<Coffee[], void>({
      query: () => '/library',
      providesTags: ['Coffee'],
    }),
    getRecipes: builder.query<Recipe[], { category?: string }>({
      query: ({ category }) => ({
        url: '/recipes',
        params: { category },
      }),
      providesTags: ['Recipe'],
    }),
  }),
});
```

---

## 三、AI功能技术实现

### 3.1 图像识别架构

#### 3.1.1 咖啡豆识别

```typescript
// services/ai/vision.ts
interface BeanRecognitionService {
  recognizeBean(imageUri: string): Promise<BeanRecognitionResult>;
}

export class TencentVisionService implements BeanRecognitionService {
  private client: TencentCloudSDK;

  constructor(secretId: string, secretKey: string) {
    this.client = new TencentCloudSDK({
      credential: { secretId, secretKey },
      region: 'ap-beijing',
      profile: {
        httpProfile: {
          endpoint: 'tiia.tencentcloudapi.com',
        },
      },
    });
  }

  async recognizeBean(imageUri: string): Promise<BeanRecognitionResult> {
    try {
      // 图像预处理
      const processedImage = await this.preprocessImage(imageUri);
      
      // 调用腾讯云图像识别API
      const response = await this.client.tiia.v20190529.DetectProduct({
        ImageBase64: processedImage,
        Scenes: ['coffee_bean'],
      });

      // 结果后处理
      return this.postprocessResult(response);
    } catch (error) {
      throw new AIServiceError('Bean recognition failed', error);
    }
  }

  private async preprocessImage(imageUri: string): Promise<string> {
    // 压缩图像、调整尺寸、增强对比度
    const processedUri = await ImageProcessor.enhance(imageUri, {
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    });
    return await ImageProcessor.toBase64(processedUri);
  }

  private postprocessResult(response: any): BeanRecognitionResult {
    const products = response.ProductInfo?.Products || [];
    
    if (products.length === 0) {
      throw new Error('No coffee bean detected');
    }

    const topResult = products[0];
    return {
      beanType: topResult.Name,
      confidence: topResult.Score,
      origin: this.extractOrigin(topResult.Name),
      roastLevel: this.extractRoastLevel(topResult.Name),
      processingMethod: this.extractProcessing(topResult.Name),
      flavorProfile: this.generateFlavorProfile(topResult),
      recommendedBrewing: this.getBrewingRecommendations(topResult.Name),
    };
  }
}
```

#### 3.1.2 设备识别与适配

```typescript
// services/ai/equipmentRecognition.ts
export class EquipmentRecognitionService {
  private modelMapping = new Map([
    ['v60', 'hario_v60'],
    ['chemex', 'chemex_classic'],
    ['aeropress', 'aeropress_original'],
    ['espresso_machine', 'delonghi_ec9335'],
  ]);

  async recognizeEquipment(imageUri: string): Promise<EquipmentResult> {
    const result = await this.client.detectObjects(imageUri);
    
    for (const detection of result.detections) {
      if (detection.category in this.modelMapping) {
        const equipment = await this.getEquipmentDetails(detection.category);
        const parameters = await this.getOptimalParameters(equipment.id);
        
        return {
          equipment,
          parameters,
          confidence: detection.confidence,
          suggestions: this.generateSuggestions(equipment),
        };
      }
    }
    
    throw new Error('Equipment not recognized');
  }

  private async getOptimalParameters(equipmentId: string): Promise<BrewingParameters> {
    // 从参数数据库获取最优参数
    const params = await this.parametersDB.findByEquipment(equipmentId);
    
    return {
      grindSize: params.grindSize,
      waterTemp: params.waterTemp,
      brewTime: params.brewTime,
      coffeeToWaterRatio: params.ratio,
      pourPattern: params.pourPattern || null,
    };
  }
}
```

### 3.2 语音交互实现

#### 3.2.1 语音识别与合成

```typescript
// services/ai/speech.ts
export class SpeechService {
  private recognizer: VoiceRecognizer;
  private synthesizer: VoiceSynthesizer;

  constructor() {
    this.recognizer = new iFlyTekRecognizer({
      appId: Config.IFLYTEK_APP_ID,
      apiKey: Config.IFLYTEK_API_KEY,
      language: 'zh_cn',
    });

    this.synthesizer = new iFlyTekSynthesizer({
      appId: Config.IFLYTEK_APP_ID,
      voiceType: 'xiaoyan',
      speed: 50,
      volume: 80,
    });
  }

  async startVoiceRecognition(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.recognizer.start({
        onResult: (text: string) => resolve(text),
        onError: (error: Error) => reject(error),
        onVolumeChanged: (volume: number) => {
          // 实时音量反馈
          EventEmitter.emit('voiceVolume', volume);
        },
      });
    });
  }

  async speakText(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.synthesizer.speak(text, {
        onStart: () => console.log('开始语音播放'),
        onComplete: () => resolve(),
        onError: (error: Error) => reject(error),
      });
    });
  }

  async processVoiceCommand(audioData: string): Promise<VoiceCommandResult> {
    try {
      // 语音转文字
      const text = await this.recognizer.recognize(audioData);
      
      // 意图识别和实体提取
      const intent = await this.parseIntent(text);
      
      return {
        originalText: text,
        intent: intent.intent,
        entities: intent.entities,
        confidence: intent.confidence,
        action: this.mapIntentToAction(intent.intent),
      };
    } catch (error) {
      throw new SpeechProcessingError('Voice command processing failed', error);
    }
  }

  private async parseIntent(text: string): Promise<IntentResult> {
    // 使用本地NLP模型或云端API进行意图识别
    const response = await fetch('/api/nlp/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    return await response.json();
  }
}
```

#### 3.2.2 智能语音助手

```typescript
// services/ai/voiceAssistant.ts
export class CoffeeVoiceAssistant {
  private speechService: SpeechService;
  private contextManager: ConversationContext;

  async handleVoiceInteraction(audioInput: string): Promise<AssistantResponse> {
    const command = await this.speechService.processVoiceCommand(audioInput);
    const context = this.contextManager.getCurrentContext();

    switch (command.intent) {
      case 'ask_brewing_help':
        return await this.handleBrewingQuestion(command, context);
      case 'request_recipe':
        return await this.handleRecipeRequest(command, context);
      case 'quality_feedback':
        return await this.handleQualityFeedback(command, context);
      case 'navigation':
        return await this.handleNavigation(command, context);
      default:
        return await this.handleGenericQuestion(command, context);
    }
  }

  private async handleBrewingQuestion(
    command: VoiceCommandResult,
    context: ConversationContext
  ): Promise<AssistantResponse> {
    const currentRecipe = context.currentRecipe;
    const currentStep = context.currentStep;

    if (command.entities.question_type === 'time') {
      const timeRemaining = currentRecipe.steps[currentStep].duration - context.elapsedTime;
      const response = `还需要${timeRemaining}秒。当前步骤是${currentRecipe.steps[currentStep].instruction}`;
      
      return {
        text: response,
        audio: await this.speechService.synthesize(response),
        actions: ['continue_brewing'],
      };
    }

    // 处理其他类型的问题...
  }
}
```

### 3.3 个性化推荐系统

```typescript
// services/ai/recommendation.ts
export class PersonalizationEngine {
  private userProfile: UserProfile;
  private collaborativeFilter: CollaborativeFilter;
  private contentBasedFilter: ContentBasedFilter;

  async generateRecommendations(userId: string): Promise<Recommendation[]> {
    const userProfile = await this.getUserProfile(userId);
    const contextualFactors = await this.getContextualFactors();

    // 协同过滤推荐
    const collaborativeRecs = await this.collaborativeFilter.recommend(
      userId,
      userProfile.preferences
    );

    // 基于内容的推荐
    const contentRecs = await this.contentBasedFilter.recommend(
      userProfile.tastingHistory,
      userProfile.equipment
    );

    // 情境感知推荐
    const contextualRecs = await this.generateContextualRecommendations(
      userProfile,
      contextualFactors
    );

    // 混合推荐算法
    return this.hybridRecommendation([
      { recs: collaborativeRecs, weight: 0.4 },
      { recs: contentRecs, weight: 0.3 },
      { recs: contextualRecs, weight: 0.3 },
    ]);
  }

  private async generateContextualRecommendations(
    profile: UserProfile,
    context: ContextualFactors
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // 基于时间的推荐
    if (context.timeOfDay === 'morning') {
      recommendations.push(...await this.getMorningRecommendations(profile));
    } else if (context.timeOfDay === 'afternoon') {
      recommendations.push(...await this.getAfternoonRecommendations(profile));
    }

    // 基于天气的推荐
    if (context.weather === 'cold') {
      recommendations.push(...await this.getWarmCoffeeRecommendations());
    } else if (context.weather === 'hot') {
      recommendations.push(...await this.getIcedCoffeeRecommendations());
    }

    // 基于用户历史的推荐
    const recentTrends = await this.analyzeRecentTrends(profile);
    recommendations.push(...recentTrends);

    return recommendations;
  }
}
```

---

## 四、数据架构设计

### 4.1 本地数据存储

#### 4.1.1 SQLite数据库设计

```typescript
// services/storage/database.ts
export class CoffeeDatabase {
  private db: SQLiteDatabase;

  async initializeDatabase(): Promise<void> {
    const db = await SQLite.openDatabase({ name: 'CoffeeAI.db' });
    
    // 用户表
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        profile TEXT,
        preferences TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 咖啡豆表
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS coffee_beans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        origin TEXT,
        roast_level TEXT,
        processing_method TEXT,
        flavor_profile TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 制作记录表
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS brewing_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        recipe_id TEXT,
        coffee_bean_id INTEGER,
        parameters TEXT,
        result TEXT,
        rating REAL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coffee_bean_id) REFERENCES coffee_beans (id)
      );
    `);

    // 品鉴记录表
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS tasting_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        brewing_record_id INTEGER,
        aroma_score REAL,
        flavor_score REAL,
        acidity_score REAL,
        body_score REAL,
        aftertaste_score REAL,
        overall_score REAL,
        flavor_wheel TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (brewing_record_id) REFERENCES brewing_records (id)
      );
    `);

    this.db = db;
  }

  async saveBrewingRecord(record: BrewingRecord): Promise<number> {
    const result = await this.db.executeSql(
      `INSERT INTO brewing_records 
       (user_id, recipe_id, coffee_bean_id, parameters, result, rating, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        record.userId,
        record.recipeId,
        record.coffeeBeanId,
        JSON.stringify(record.parameters),
        JSON.stringify(record.result),
        record.rating,
        record.notes,
      ]
    );

    return result[0].insertId;
  }
}
```

#### 4.1.2 缓存管理

```typescript
// services/storage/cache.ts
export class CacheManager {
  private static instance: CacheManager;
  private memoryCache: Map<string, CacheItem> = new Map();
  private readonly maxMemoryItems = 1000;
  private readonly defaultTTL = 30 * 60 * 1000; // 30分钟

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    // 首先检查内存缓存
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem && !this.isExpired(memoryItem)) {
      return memoryItem.data as T;
    }

    // 检查持久化缓存
    try {
      const cachedData = await AsyncStorage.getItem(`cache_${key}`);
      if (cachedData) {
        const cacheItem: CacheItem = JSON.parse(cachedData);
        if (!this.isExpired(cacheItem)) {
          // 重新放入内存缓存
          this.memoryCache.set(key, cacheItem);
          return cacheItem.data as T;
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    return null;
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    const cacheItem: CacheItem = {
      data,
      expiresAt,
      createdAt: Date.now(),
    };

    // 内存缓存
    this.memoryCache.set(key, cacheItem);
    this.evictIfNeeded();

    // 持久化缓存
    try {
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    // 清除匹配的内存缓存
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }

    // 清除匹配的持久化缓存
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith('cache_') && key.includes(pattern)
      );
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('Cache invalidation error:', error);
    }
  }
}
```

### 4.2 API接口设计

#### 4.2.1 RESTful API架构

```typescript
// services/api/client.ts
export class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;
  private interceptors: RequestInterceptor[] = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.addRequestInterceptor((config) => {
      // 添加认证头
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }

      // 添加请求ID用于追踪
      config.headers['X-Request-ID'] = generateRequestId();

      // 添加设备信息
      config.headers['X-Device-Info'] = JSON.stringify({
        platform: Platform.OS,
        version: Platform.Version,
        appVersion: Config.APP_VERSION,
      });

      return config;
    });

    // 响应拦截器
    this.addResponseInterceptor(
      (response) => {
        // 处理成功响应
        return response;
      },
      (error) => {
        // 统一错误处理
        return this.handleError(error);
      }
    );
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getCommonHeaders(),
        },
        body: JSON.stringify(data),
      });

      return await this.processResponse<T>(response);
    } catch (error) {
      throw new ApiError('Network request failed', error);
    }
  }

  async uploadImage(endpoint: string, imageUri: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'coffee_image.jpg',
    } as any);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          ...this.getCommonHeaders(),
        },
        body: formData,
      });

      return await this.processResponse(response);
    } catch (error) {
      throw new ApiError('Image upload failed', error);
    }
  }
}
```

#### 4.2.2 WebSocket实时通信

```typescript
// services/api/websocket.ts
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private eventEmitter = new EventEmitter();

  async connect(url: string, authToken: string): Promise<void> {
    try {
      this.ws = new WebSocket(`${url}?token=${authToken}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.eventEmitter.emit('connected');
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.eventEmitter.emit('disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.eventEmitter.emit('error', error);
      };
    } catch (error) {
      throw new WebSocketError('Connection failed', error);
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'live_guidance':
        this.eventEmitter.emit('liveGuidance', message.data);
        break;
      case 'community_update':
        this.eventEmitter.emit('communityUpdate', message.data);
        break;
      case 'recognition_progress':
        this.eventEmitter.emit('recognitionProgress', message.data);
        break;
      case 'user_achievement':
        this.eventEmitter.emit('userAchievement', message.data);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  sendMessage(type: string, data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.warn('WebSocket not connected');
    }
  }

  subscribe(event: string, callback: Function): () => void {
    this.eventEmitter.on(event, callback);
    return () => this.eventEmitter.removeListener(event, callback);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

---

## 五、第三方服务集成

### 5.1 AI服务集成

#### 5.1.1 腾讯云AI服务

```typescript
// services/third-party/tencentCloud.ts
export class TencentCloudService {
  private visionClient: TencentVision;
  private nlpClient: TencentNLP;
  private asrClient: TencentASR;

  constructor(config: TencentCloudConfig) {
    this.visionClient = new TencentVision(config);
    this.nlpClient = new TencentNLP(config);
    this.asrClient = new TencentASR(config);
  }

  // 图像识别服务
  async recognizeImage(imageBase64: string, scene: string): Promise<any> {
    try {
      const request = {
        ImageBase64: imageBase64,
        Scenes: [scene],
      };

      const response = await this.visionClient.DetectProduct(request);
      return this.processVisionResult(response, scene);
    } catch (error) {
      throw new TencentCloudError('Image recognition failed', error);
    }
  }

  // 语音识别服务
  async recognizeSpeech(audioData: string): Promise<string> {
    try {
      const request = {
        ProjectId: 0,
        SubServiceType: 2,
        EngSerViceType: '16k_zh',
        SourceType: 1,
        VoiceFormat: 'wav',
        Data: audioData,
      };

      const response = await this.asrClient.SentenceRecognition(request);
      return response.Result;
    } catch (error) {
      throw new TencentCloudError('Speech recognition failed', error);
    }
  }

  // 自然语言处理
  async processText(text: string): Promise<NLPResult> {
    try {
      const intentRequest = {
        Text: text,
        Scene: 'coffee_assistant',
      };

      const [intentResult, entityResult] = await Promise.all([
        this.nlpClient.ParseIntent(intentRequest),
        this.nlpClient.ExtractEntity({ Text: text }),
      ]);

      return {
        intent: intentResult.Intent,
        entities: entityResult.Entities,
        confidence: intentResult.Confidence,
      };
    } catch (error) {
      throw new TencentCloudError('Text processing failed', error);
    }
  }
}
```

#### 5.1.2 百度AI服务

```typescript
// services/third-party/baiduAI.ts
export class BaiduAIService {
  private accessToken: string | null = null;
  private tokenExpireTime = 0;

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpireTime) {
      return this.accessToken;
    }

    try {
      const response = await fetch(
        `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${Config.BAIDU_API_KEY}&client_secret=${Config.BAIDU_SECRET_KEY}`,
        { method: 'POST' }
      );

      const result = await response.json();
      this.accessToken = result.access_token;
      this.tokenExpireTime = Date.now() + (result.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      throw new BaiduAIError('Failed to get access token', error);
    }
  }

  async recognizeImage(imageBase64: string): Promise<any> {
    const token = await this.getAccessToken();
    
    try {
      const response = await fetch(
        `https://aip.baidubce.com/rest/2.0/image-classify/v1/object_detect?access_token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `image=${encodeURIComponent(imageBase64)}`,
        }
      );

      return await response.json();
    } catch (error) {
      throw new BaiduAIError('Image recognition failed', error);
    }
  }
}
```

### 5.2 支付服务集成

```typescript
// services/payment/index.ts
export class PaymentService {
  private wechatPay: WechatPayService;
  private alipay: AlipayService;
  private applePay: ApplePayService;

  constructor() {
    this.wechatPay = new WechatPayService();
    this.alipay = new AlipayService();
    this.applePay = new ApplePayService();
  }

  async processPayment(
    method: PaymentMethod,
    amount: number,
    orderInfo: OrderInfo
  ): Promise<PaymentResult> {
    try {
      switch (method) {
        case 'wechat':
          return await this.wechatPay.pay(amount, orderInfo);
        case 'alipay':
          return await this.alipay.pay(amount, orderInfo);
        case 'apple':
          return await this.applePay.pay(amount, orderInfo);
        default:
          throw new Error('Unsupported payment method');
      }
    } catch (error) {
      throw new PaymentError('Payment processing failed', error);
    }
  }

  async validateReceipt(receipt: string): Promise<boolean> {
    // 验证支付凭证
    try {
      const response = await fetch('/api/payment/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipt }),
      });

      const result = await response.json();
      return result.valid;
    } catch (error) {
      console.error('Receipt validation failed:', error);
      return false;
    }
  }
}
```

### 5.3 推送通知服务

```typescript
// services/notification/index.ts
export class NotificationService {
  private fcmToken: string | null = null;

  async initialize(): Promise<void> {
    try {
      // 请求通知权限
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        throw new Error('Notification permission denied');
      }

      // 获取FCM Token
      this.fcmToken = await messaging().getToken();
      
      // 监听Token刷新
      messaging().onTokenRefresh(token => {
        this.fcmToken = token;
        this.updateTokenOnServer(token);
      });

      // 监听前台消息
      messaging().onMessage(async remoteMessage => {
        this.showLocalNotification(remoteMessage);
      });

      // 监听后台消息点击
      messaging().onNotificationOpenedApp(remoteMessage => {
        this.handleNotificationClick(remoteMessage);
      });

    } catch (error) {
      throw new NotificationError('Notification setup failed', error);
    }
  }

  async scheduleLocalNotification(
    title: string,
    body: string,
    scheduledTime: Date
  ): Promise<void> {
    try {
      await notifee.createTriggerNotification(
        {
          title,
          body,
          android: {
            channelId: 'coffee-reminders',
            smallIcon: 'ic_notification',
          },
          ios: {
            sound: 'default',
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: scheduledTime.getTime(),
        }
      );
    } catch (error) {
      throw new NotificationError('Failed to schedule notification', error);
    }
  }

  private async showLocalNotification(remoteMessage: any): Promise<void> {
    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data,
      android: {
        channelId: 'default',
        smallIcon: 'ic_notification',
      },
    });
  }
}
```

---

## 六、性能优化策略

### 6.1 图像处理优化

```typescript
// utils/imageOptimization.ts
export class ImageOptimizer {
  static async compressImage(
    imageUri: string,
    options: CompressionOptions = {}
  ): Promise<string> {
    const {
      quality = 0.8,
      maxWidth = 1024,
      maxHeight = 1024,
      format = 'JPEG',
    } = options;

    try {
      const result = await ImageResizer.createResizedImage(
        imageUri,
        maxWidth,
        maxHeight,
        format,
        quality * 100,
        0,
        undefined,
        false,
        { mode: 'contain', onlyScaleDown: true }
      );

      return result.uri;
    } catch (error) {
      throw new ImageOptimizationError('Image compression failed', error);
    }
  }

  static async preProcessForAI(imageUri: string): Promise<string> {
    // 针对AI识别的图像预处理
    const compressed = await this.compressImage(imageUri, {
      quality: 0.9,
      maxWidth: 800,
      maxHeight: 800,
    });

    // 增强对比度和清晰度
    const enhanced = await this.enhanceImage(compressed);
    
    return enhanced;
  }

  private static async enhanceImage(imageUri: string): Promise<string> {
    // 使用原生模块进行图像增强
    return await NativeModules.ImageProcessor.enhance(imageUri, {
      brightness: 0.1,
      contrast: 0.2,
      saturation: 0.1,
    });
  }
}
```

### 6.2 内存管理

```typescript
// utils/memoryManager.ts
export class MemoryManager {
  private static imageCache = new Map<string, WeakRef<any>>();
  private static maxCacheSize = 50;

  static cacheImage(key: string, image: any): void {
    if (this.imageCache.size >= this.maxCacheSize) {
      // 清理过期的弱引用
      this.cleanup();
    }

    this.imageCache.set(key, new WeakRef(image));
  }

  static getCachedImage(key: string): any | null {
    const ref = this.imageCache.get(key);
    if (ref) {
      const image = ref.deref();
      if (image) {
        return image;
      } else {
        // 对象已被垃圾回收，清理引用
        this.imageCache.delete(key);
      }
    }
    return null;
  }

  private static cleanup(): void {
    const keysToDelete: string[] = [];
    
    for (const [key, ref] of this.imageCache) {
      if (!ref.deref()) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.imageCache.delete(key));
  }

  static clearAll(): void {
    this.imageCache.clear();
    // 强制垃圾回收
    if (global.gc) {
      global.gc();
    }
  }
}
```

### 6.3 网络优化

```typescript
// services/network/optimizer.ts
export class NetworkOptimizer {
  private requestQueue: RequestQueue = new RequestQueue();
  private retryPolicy: RetryPolicy = new ExponentialBackoffRetry();

  async optimizedRequest<T>(
    request: ApiRequest,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      priority = 'normal',
      timeout = 10000,
      retries = 3,
      cacheable = true,
    } = options;

    // 检查缓存
    if (cacheable) {
      const cached = await CacheManager.getInstance().get<T>(request.cacheKey);
      if (cached) return cached;
    }

    // 网络状态检查
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      throw new NetworkError('No internet connection');
    }

    // 请求排队和优先级处理
    return this.requestQueue.add(() => this.executeRequest<T>(request), priority);
  }

  private async executeRequest<T>(request: ApiRequest): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < request.retries; attempt++) {
      try {
        const response = await this.performRequest<T>(request);
        
        // 缓存成功的响应
        if (request.cacheable) {
          await CacheManager.getInstance().set(
            request.cacheKey,
            response,
            request.cacheTTL
          );
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        
        // 判断是否需要重试
        if (!this.shouldRetry(error, attempt)) {
          break;
        }

        // 等待重试
        await this.retryPolicy.wait(attempt);
      }
    }

    throw lastError!;
  }

  private shouldRetry(error: any, attempt: number): boolean {
    // 网络错误或服务器错误才重试
    if (error.code === 'NETWORK_ERROR' || error.status >= 500) {
      return attempt < 2; // 最多重试2次
    }
    return false;
  }
}
```

---

## 七、测试策略

### 7.1 单元测试

```typescript
// __tests__/services/coffeeRecognition.test.ts
import { CoffeeRecognitionService } from '../services/ai/coffeeRecognition';

describe('CoffeeRecognitionService', () => {
  let service: CoffeeRecognitionService;

  beforeEach(() => {
    service = new CoffeeRecognitionService();
  });

  describe('recognizeBean', () => {
    it('should recognize coffee bean from valid image', async () => {
      const mockImageUri = 'mock://image.jpg';
      const result = await service.recognizeBean(mockImageUri);

      expect(result).toBeDefined();
      expect(result.beanType).toBeTruthy();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should throw error for invalid image', async () => {
      const invalidImageUri = '';
      
      await expect(service.recognizeBean(invalidImageUri))
        .rejects.toThrow('Invalid image URI');
    });

    it('should handle AI service failure gracefully', async () => {
      const mockImageUri = 'mock://image.jpg';
      
      // Mock AI service failure
      jest.spyOn(service, 'callAIService').mockRejectedValue(
        new Error('AI service unavailable')
      );

      await expect(service.recognizeBean(mockImageUri))
        .rejects.toThrow('Bean recognition failed');
    });
  });

  describe('generateRecommendations', () => {
    it('should generate brewing recommendations for recognized bean', () => {
      const beanResult = {
        beanType: 'Arabica',
        origin: 'Ethiopia',
        roastLevel: 'Medium',
      };

      const recommendations = service.generateRecommendations(beanResult);

      expect(recommendations).toHaveLength(3);
      expect(recommendations[0].method).toBe('Pour Over');
      expect(recommendations[0].parameters).toBeDefined();
    });
  });
});
```

### 7.2 集成测试

```typescript
// __tests__/integration/coffeeFlow.test.ts
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { RecognitionScreen } from '../screens/Recognition/RecognitionScreen';

describe('Coffee Recognition Flow', () => {
  it('should complete full recognition flow', async () => {
    const { getByTestId, getByText } = render(<RecognitionScreen />);

    // 点击拍照按钮
    const cameraButton = getByTestId('camera-capture-button');
    fireEvent.press(cameraButton);

    // 模拟拍照完成
    const mockImage = { uri: 'mock://captured-image.jpg' };
    fireEvent(cameraButton, 'onCapture', mockImage);

    // 等待AI识别完成
    await waitFor(() => {
      expect(getByText('识别完成')).toBeTruthy();
    });

    // 验证识别结果显示
    expect(getByText('埃塞俄比亚 耶加雪菲')).toBeTruthy();
    expect(getByTestId('recognition-confidence')).toBeTruthy();

    // 点击查看制作指导
    const guidanceButton = getByText('开始制作指导');
    fireEvent.press(guidanceButton);

    // 验证导航到制作指导页面
    await waitFor(() => {
      expect(getByText('制作指导')).toBeTruthy();
    });
  });
});
```

### 7.3 E2E测试

```typescript
// e2e/coffeeApp.e2e.ts
import { device, element, by, expect } from 'detox';

describe('Coffee App E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete coffee recognition and brewing flow', async () => {
    // 首页
    await expect(element(by.id('home-screen'))).toBeVisible();
    
    // 点击拍照识别
    await element(by.id('camera-recognition-button')).tap();

    // 相机页面
    await expect(element(by.id('camera-screen'))).toBeVisible();
    
    // 拍照
    await element(by.id('capture-button')).tap();

    // 等待识别结果
    await waitFor(element(by.id('recognition-result')))
      .toBeVisible()
      .withTimeout(10000);

    // 验证识别结果
    await expect(element(by.id('bean-name'))).toBeVisible();
    await expect(element(by.id('confidence-score'))).toBeVisible();

    // 开始制作
    await element(by.id('start-brewing-button')).tap();

    // 制作指导页面
    await expect(element(by.id('brewing-guide-screen'))).toBeVisible();
    
    // 验证步骤指导
    await expect(element(by.id('step-instruction'))).toBeVisible();
    await expect(element(by.id('progress-bar'))).toBeVisible();

    // 完成制作
    for (let i = 0; i < 6; i++) {
      await element(by.id('next-step-button')).tap();
      await device.sleep(1000);
    }

    // 验证完成页面
    await expect(element(by.text('制作完成！'))).toBeVisible();
  });
});
```

---

## 八、部署与发布

### 8.1 构建配置

#### 8.1.1 Android构建配置

```gradle
// android/app/build.gradle
android {
    compileSdkVersion 34
    buildToolsVersion "34.0.0"

    defaultConfig {
        applicationId "com.coffeeai.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
        
        ndk {
            abiFilters "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
        }
    }

    signingConfigs {
        release {
            storeFile file('coffee-ai-release.keystore')
            storePassword System.getenv("STORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        debug {
            debuggable true
            applicationIdSuffix ".debug"
            buildConfigField "String", "API_BASE_URL", '"https://dev-api.coffeeai.com"'
        }
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
            buildConfigField "String", "API_BASE_URL", '"https://api.coffeeai.com"'
        }
    }

    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
        }
    }
}
```

#### 8.1.2 iOS构建配置

```ruby
# ios/Podfile
platform :ios, '11.0'
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

target 'CoffeeAI' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => false
  )

  # AI服务相关Pod
  pod 'TencentCloudSDK', '~> 3.0'
  pod 'BaiduAI', '~> 4.0'
  
  # 相机和媒体处理
  pod 'RNImageCropPicker', :path => '../node_modules/react-native-image-crop-picker'
  pod 'react-native-camera', :path => '../node_modules/react-native-camera'

  target 'CoffeeAITests' do
    inherit! :complete
  end

  post_install do |installer|
    react_native_post_install(installer)
  end
end
```

### 8.2 CI/CD配置

```yaml
# .github/workflows/build-and-deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Run tests
        run: yarn test --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build-android:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Build Android
        run: |
          cd android
          ./gradlew assembleRelease
        env:
          STORE_PASSWORD: ${{ secrets.ANDROID_STORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
      
      - name: Upload to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
          packageName: com.coffeeai.app
          releaseFiles: android/app/build/outputs/apk/release/*.apk
          track: internal

  build-ios:
    needs: test
    runs-on: macos-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Install iOS dependencies
        run: cd ios && pod install
      
      - name: Build iOS
        run: |
          xcodebuild -workspace ios/CoffeeAI.xcworkspace \
                     -scheme CoffeeAI \
                     -configuration Release \
                     -archivePath ios/CoffeeAI.xcarchive \
                     archive
      
      - name: Export IPA
        run: |
          xcodebuild -exportArchive \
                     -archivePath ios/CoffeeAI.xcarchive \
                     -exportPath ios/build \
                     -exportOptionsPlist ios/ExportOptions.plist
      
      - name: Upload to App Store
        uses: apple-actions/upload-testflight-build@v1
        with:
          app-path: ios/build/CoffeeAI.ipa
          issuer-id: ${{ secrets.APPSTORE_ISSUER_ID }}
          api-key-id: ${{ secrets.APPSTORE_API_KEY_ID }}
          api-private-key: ${{ secrets.APPSTORE_API_PRIVATE_KEY }}
```

---

## 九、监控与性能

### 9.1 性能监控

```typescript
// services/monitoring/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(operation: string): void {
    this.metrics.set(operation, {
      startTime: performance.now(),
      operation,
    });
  }

  endTimer(operation: string): number {
    const metric = this.metrics.get(operation);
    if (!metric) {
      console.warn(`No timer found for operation: ${operation}`);
      return 0;
    }

    const duration = performance.now() - metric.startTime;
    this.metrics.delete(operation);

    // 记录性能数据
    this.recordMetric(operation, duration);
    
    return duration;
  }

  private recordMetric(operation: string, duration: number): void {
    // 发送到分析服务
    Analytics.track('performance_metric', {
      operation,
      duration,
      timestamp: Date.now(),
      app_version: Config.APP_VERSION,
      platform: Platform.OS,
    });

    // 本地日志
    console.log(`Performance: ${operation} took ${duration.toFixed(2)}ms`);

    // 性能警告
    if (duration > this.getThreshold(operation)) {
      console.warn(`Slow operation detected: ${operation} (${duration}ms)`);
      
      // 上报性能问题
      this.reportPerformanceIssue(operation, duration);
    }
  }

  private getThreshold(operation: string): number {
    const thresholds = {
      'ai_recognition': 5000, // 5秒
      'image_processing': 3000, // 3秒
      'api_request': 2000, // 2秒
      'database_query': 500, // 0.5秒
    };

    return thresholds[operation] || 1000;
  }
}
```

### 9.2 错误监控

```typescript
// services/monitoring/crashlytics.ts
export class CrashlyticsService {
  static initialize(): void {
    // 全局错误处理
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      this.recordError(error, isFatal);
    });

    // Promise rejection处理
    global.addEventListener('unhandledrejection', (event) => {
      this.recordPromiseRejection(event.reason);
    });
  }

  static recordError(error: Error, isFatal: boolean = false): void {
    console.error('App Error:', error);

    // 记录到Crashlytics
    crashlytics().recordError(error);

    // 记录用户操作路径
    const breadcrumbs = BreadcrumbTracker.getBreadcrumbs();
    crashlytics().log(`Breadcrumbs: ${JSON.stringify(breadcrumbs)}`);

    // 记录用户信息
    const userInfo = UserManager.getCurrentUserInfo();
    crashlytics().setUserId(userInfo?.id || 'anonymous');
    crashlytics().setAttributes({
      userType: userInfo?.type || 'guest',
      appVersion: Config.APP_VERSION,
      buildNumber: Config.BUILD_NUMBER,
    });

    // 严重错误立即上报
    if (isFatal || this.isCriticalError(error)) {
      this.sendImmediateReport(error);
    }
  }

  private static isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      'AI service unavailable',
      'Payment processing failed',
      'Database corruption',
      'Authentication failure',
    ];

    return criticalPatterns.some(pattern => 
      error.message.includes(pattern)
    );
  }
}
```

---

## 十、安全策略

### 10.1 数据安全

```typescript
// services/security/encryption.ts
export class EncryptionService {
  private static readonly ALGORITHM = 'AES-256-GCM';
  private static encryptionKey: string;

  static async initialize(): Promise<void> {
    // 从Keychain获取或生成加密密钥
    try {
      this.encryptionKey = await Keychain.getInternetCredentials('encryption_key');
    } catch (error) {
      this.encryptionKey = await this.generateEncryptionKey();
      await Keychain.setInternetCredentials(
        'encryption_key',
        'app',
        this.encryptionKey
      );
    }
  }

  static async encryptData(data: string): Promise<string> {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
      return encrypted;
    } catch (error) {
      throw new EncryptionError('Data encryption failed', error);
    }
  }

  static async decryptData(encryptedData: string): Promise<string> {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new EncryptionError('Data decryption failed', error);
    }
  }

  private static async generateEncryptionKey(): Promise<string> {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }

  // 敏感数据存储
  static async storeSecureData(key: string, value: string): Promise<void> {
    const encrypted = await this.encryptData(value);
    await AsyncStorage.setItem(`secure_${key}`, encrypted);
  }

  static async getSecureData(key: string): Promise<string | null> {
    const encrypted = await AsyncStorage.getItem(`secure_${key}`);
    if (!encrypted) return null;
    
    try {
      return await this.decryptData(encrypted);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }
}
```

### 10.2 API安全

```typescript
// services/security/apiSecurity.ts
export class APISecurityService {
  private static readonly TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5分钟

  static generateRequestSignature(
    method: string,
    url: string,
    body: string,
    timestamp: number
  ): string {
    const data = `${method}${url}${body}${timestamp}`;
    return CryptoJS.HmacSHA256(data, Config.API_SECRET).toString();
  }

  static async secureApiCall<T>(
    request: ApiRequest
  ): Promise<T> {
    // 添加安全头
    const timestamp = Date.now();
    const signature = this.generateRequestSignature(
      request.method,
      request.url,
      request.body || '',
      timestamp
    );

    request.headers = {
      ...request.headers,
      'X-Timestamp': timestamp.toString(),
      'X-Signature': signature,
      'X-App-Version': Config.APP_VERSION,
      'X-Device-ID': await this.getDeviceId(),
    };

    // 检查Token有效性
    await this.ensureValidToken();

    // 执行请求
    return await ApiClient.getInstance().request<T>(request);
  }

  private static async ensureValidToken(): Promise<void> {
    const authService = AuthService.getInstance();
    const tokenInfo = await authService.getTokenInfo();

    if (!tokenInfo || this.isTokenExpiringSoon(tokenInfo)) {
      await authService.refreshToken();
    }
  }

  private static isTokenExpiringSoon(tokenInfo: TokenInfo): boolean {
    const expiryTime = tokenInfo.expiresAt;
    const currentTime = Date.now();
    
    return (expiryTime - currentTime) < this.TOKEN_REFRESH_THRESHOLD;
  }

  private static async getDeviceId(): Promise<string> {
    let deviceId = await AsyncStorage.getItem('device_id');
    
    if (!deviceId) {
      deviceId = await DeviceInfo.getUniqueId();
      await AsyncStorage.setItem('device_id', deviceId);
    }
    
    return deviceId;
  }
}
```

---

## 十一、总结

本技术方案为咖啡大师（CoffeeAI）应用提供了完整的React Native + TypeScript实现架构，涵盖了：

### 核心技术特点：
- **跨平台架构**：基于React Native 0.73+，支持iOS和Android
- **类型安全**：全面使用TypeScript，提供完整的类型定义
- **AI驱动**：集成图像识别、语音交互、智能推荐等AI功能
- **性能优化**：图像压缩、内存管理、网络优化等多维度优化
- **数据安全**：端到端加密、安全存储、API签名验证

### 架构优势：
- **模块化设计**：清晰的代码组织和职责分离
- **可扩展性**：预留硬件集成、国际化等扩展接口
- **可维护性**：完善的测试覆盖和监控体系
- **用户体验**：原生性能、离线支持、实时交互

### 实施建议：
1. **MVP阶段**：优先实现核心AI识别和制作指导功能
2. **迭代优化**：基于用户反馈持续优化AI模型和用户体验
3. **性能监控**：建立完善的性能指标和错误监控系统
4. **安全合规**：确保用户数据安全和隐私保护

该技术方案为产品的成功实施提供了坚实的技术基础，支持快速开发、稳定运行和持续迭代。

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"id": "1", "content": "\u5206\u6790PRD\u6587\u6863\uff0c\u63d0\u53d6\u6838\u5fc3\u6280\u672f\u9700\u6c42", "status": "completed"}, {"id": "2", "content": "\u8bbe\u8ba1React Native + TypeScript\u6574\u4f53\u67b6\u6784", "status": "completed"}, {"id": "3", "content": "\u5236\u5b9aAI\u529f\u80fd\u6280\u672f\u5b9e\u73b0\u65b9\u6848", "status": "completed"}, {"id": "4", "content": "\u8bbe\u8ba1\u6570\u636e\u5e93\u7ed3\u6784\u548cAPI\u67b6\u6784", "status": "completed"}, {"id": "5", "content": "\u5236\u5b9a\u7b2c\u4e09\u65b9\u670d\u52a1\u96c6\u6210\u65b9\u6848", "status": "completed"}, {"id": "6", "content": "\u7f16\u5199\u5b8c\u6574\u6280\u672f\u65b9\u6848\u6587\u6863", "status": "completed"}]