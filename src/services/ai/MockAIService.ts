import type { RecognitionResult, FlavorProfile } from '../../types';

// 模拟AI服务，用于MVP演示
export class MockAIService {
  // 模拟咖啡豆识别
  static async recognizeCoffeeBean(imageUri: string): Promise<RecognitionResult> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // 模拟识别结果
    const mockResults = [
      {
        beanType: '埃塞俄比亚 耶加雪菲',
        confidence: 0.92,
        origin: '埃塞俄比亚',
        roastLevel: '中浅烘焙',
        processingMethod: '水洗处理',
        flavorProfile: {
          aroma: [
            { name: '花香', intensity: 4, category: 'Floral' as const },
            { name: '柠檬', intensity: 3, category: 'Fruity' as const }
          ],
          flavor: [
            { name: '蜂蜜', intensity: 3, category: 'Sweet' as const },
            { name: '茶感', intensity: 4, category: 'Others' as const }
          ],
          acidity: 4,
          body: 3,
          aftertaste: 4,
          sweetness: 3,
          bitterness: 2,
        },
      },
      {
        beanType: '哥伦比亚 慧兰',
        confidence: 0.88,
        origin: '哥伦比亚',
        roastLevel: '中烘焙',
        processingMethod: '水洗处理',
        flavorProfile: {
          aroma: [
            { name: '坚果', intensity: 4, category: 'Nutty' as const },
            { name: '巧克力', intensity: 3, category: 'Chocolate' as const }
          ],
          flavor: [
            { name: '焦糖', intensity: 4, category: 'Sweet' as const },
            { name: '香草', intensity: 2, category: 'Others' as const }
          ],
          acidity: 3,
          body: 4,
          aftertaste: 3,
          sweetness: 4,
          bitterness: 3,
        },
      },
      {
        beanType: '巴西 圣多斯',
        confidence: 0.85,
        origin: '巴西',
        roastLevel: '中深烘焙',
        processingMethod: '日晒处理',
        flavorProfile: {
          aroma: [
            { name: '巧克力', intensity: 5, category: 'Chocolate' as const },
            { name: '烘烤', intensity: 3, category: 'Others' as const }
          ],
          flavor: [
            { name: '黑巧克力', intensity: 4, category: 'Chocolate' as const },
            { name: '坚果', intensity: 3, category: 'Nutty' as const }
          ],
          acidity: 2,
          body: 5,
          aftertaste: 4,
          sweetness: 2,
          bitterness: 4,
        },
      },
    ];

    const selectedResult = mockResults[Math.floor(Math.random() * mockResults.length)];

    return {
      ...selectedResult,
      recommendedBrewing: this.generateBrewingRecommendations(selectedResult.flavorProfile),
      imageUrl: imageUri,
    };
  }

  // 生成冲泡建议
  private static generateBrewingRecommendations(flavorProfile: FlavorProfile) {
    const recommendations = [
      {
        id: '1',
        name: 'V60手冲',
        equipment: {
          id: '1',
          name: 'Hario V60',
          type: 'Pour Over' as const,
        },
        difficulty: 2,
        estimatedTime: 4,
        steps: [],
        parameters: {
          grindSize: '中细研磨',
          coffeeAmount: 15,
          waterAmount: 250,
          waterTemp: flavorProfile.acidity > 3 ? 90 : 92,
          brewTime: 180,
          ratio: '1:15',
        },
      },
    ];

    // 根据风味特征调整推荐
    if (flavorProfile.body > 3) {
      recommendations.push({
        id: '2',
        name: '法压壶',
        equipment: {
          id: '2',
          name: '法压壶',
          type: 'French Press' as const,
        },
        difficulty: 1,
        estimatedTime: 5,
        steps: [],
        parameters: {
          grindSize: '粗研磨',
          coffeeAmount: 20,
          waterAmount: 300,
          waterTemp: 95,
          brewTime: 240,
          ratio: '1:15',
        },
      });
    }

    return recommendations;
  }

  // 模拟设备识别
  static async recognizeEquipment(imageUri: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const equipmentTypes = [
      {
        name: 'Hario V60',
        type: 'Pour Over',
        confidence: 0.89,
        parameters: {
          grindSize: '中细研磨',
          waterTemp: 92,
          brewTime: 180,
          ratio: '1:15',
        }
      },
      {
        name: '意式咖啡机',
        type: 'Espresso',
        confidence: 0.91,
        parameters: {
          grindSize: '细研磨',
          waterTemp: 92,
          brewTime: 25,
          ratio: '1:2',
        }
      },
    ];

    return equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
  }

  // 模拟成品识别
  static async recognizeProduct(imageUri: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const products = [
      {
        name: '拿铁咖啡',
        confidence: 0.87,
        quality: {
          milkFoam: 4,
          color: 3,
          proportion: 4,
          appearance: 3,
        },
        suggestions: [
          '奶泡质地看起来很细腻',
          '咖啡与牛奶比例合适',
          '可以尝试简单的拉花增加美观度'
        ],
        improvements: [
          '奶泡略厚，建议控制在0.5-1cm',
          '萃取颜色偏浅，可适当延长萃取时间'
        ]
      },
      {
        name: '卡布奇诺',
        confidence: 0.83,
        quality: {
          milkFoam: 5,
          color: 4,
          proportion: 3,
          appearance: 4,
        },
        suggestions: [
          '奶泡打发得很好',
          '咖啡香气浓郁',
          '经典的意式风格'
        ],
        improvements: [
          '牛奶比例稍多，可以减少一些',
          '可以撒少许肉桂粉增加风味'
        ]
      },
    ];

    return products[Math.floor(Math.random() * products.length)];
  }

  // 模拟AI辅助描述
  static generateFlavorDescription(flavorProfile: FlavorProfile): string {
    const descriptions = [];

    // 根据风味特征生成描述
    if (flavorProfile.acidity > 3) {
      descriptions.push('入口有明显的酸味');
    }

    if (flavorProfile.aroma.length > 0) {
      const aromaNames = flavorProfile.aroma.map(a => a.name).join('、');
      descriptions.push(`能感受到${aromaNames}的香气`);
    }

    if (flavorProfile.sweetness > 3) {
      descriptions.push('余韵带有甜味');
    }

    if (flavorProfile.body > 3) {
      descriptions.push('醇厚度适中');
    } else {
      descriptions.push('口感清爽');
    }

    const balanceScore = (flavorProfile.acidity + flavorProfile.sweetness + flavorProfile.body) / 3;
    if (balanceScore > 3.5) {
      descriptions.push('整体平衡度不错');
    }

    return descriptions.join('，') + '。';
  }
}