import axios from 'axios';
import News from '../models/News';

interface NewsSource {
  title: string;
  description: string;
  content: string;
  image: string;
  source: string;
  url: string;
  publishedAt: string;
}

class NewsAggregator {
  // Sample data for demonstration
  private sampleNews: NewsSource[] = [
    {
      title: 'AI突破：GPT-5大模型推理速度提升10倍',
      description: '最新研究表明人工智能推理速度显著提升',
      content: '通过新的硬件优化和算法改进，AI模型的推理速度实现了突破性进展，为应用部署开辟了新机遇。',
      image: 'https://via.placeholder.com/600x400?text=AI+Breakthrough',
      source: '科技日报',
      url: 'https://example.com/ai-breakthrough',
      publishedAt: new Date().toISOString()
    },
    {
      title: '区块链技术在供应链中的应用取得重大进展',
      description: '区块链在企业级应用中展现出巨大潜力',
      content: '多家企业成功部署区块链解决方案，实现了供应链的全透明跟踪，降低了欺诈风险。',
      image: 'https://via.placeholder.com/600x400?text=Blockchain',
      source: '比特币新闻',
      url: 'https://example.com/blockchain-supply',
      publishedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      title: '云计算成本优化：新方案可降低40%开支',
      description: '云服务商推出新的成本优化方案',
      content: '通过智能资源调度和按需计费模式，企业可以显著降低云计算的运营成本。',
      image: 'https://via.placeholder.com/600x400?text=Cloud+Computing',
      source: '云计算周刊',
      url: 'https://example.com/cloud-cost',
      publishedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      title: '物联网设备安全漏洞：新威胁浮现',
      description: '研究人员发现物联网设备的重大安全问题',
      content: '数百万物联网设备可能面临远程攻击风险，厂商已发布安全补丁。',
      image: 'https://via.placeholder.com/600x400?text=IoT+Security',
      source: '安全情报',
      url: 'https://example.com/iot-security',
      publishedAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      title: '网络安全：勒索软件攻击创新高',
      description: '2024年勒索软件攻击数量和影响力均创新高',
      content: '企业需要加强安全防御，及时更新系统补丁，实施零信任安全策略。',
      image: 'https://via.placeholder.com/600x400?text=Cybersecurity',
      source: '网络安全新闻',
      url: 'https://example.com/ransomware',
      publishedAt: new Date(Date.now() - 345600000).toISOString()
    },
    {
      title: '移动App开发：React Native优化新进展',
      description: '跨平台开发框架性能提升显著',
      content: '新版本的React Native实现了更好的性能和更丰富的原生API支持。',
      image: 'https://via.placeholder.com/600x400?text=Mobile+Dev',
      source: '移动开发',
      url: 'https://example.com/react-native',
      publishedAt: new Date(Date.now() - 432000000).toISOString()
    }
  ];

  // Seed database with sample data
  async seedDatabase(): Promise<void> {
    try {
      const count = await News.countDocuments();
      
      if (count === 0) {
        console.log('Seeding database with sample news...');
        
        const categorizedNews = this.sampleNews.map((article, index) => {
          const categories = ['AI', 'Blockchain', 'Cloud', 'IoT', 'Security', 'Mobile'];
          return {
            title: article.title,
            description: article.description,
            content: article.content,
            imageUrl: article.image,
            source: article.source,
            url: article.url,
            category: categories[index % categories.length],
            publishedAt: new Date(article.publishedAt),
            author: 'System',
            views: Math.floor(Math.random() * 1000),
            likes: Math.floor(Math.random() * 100)
          };
        });

        await News.insertMany(categorizedNews);
        console.log(`✅ Seeded ${categorizedNews.length} news articles`);
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }

  // Aggregate news from multiple sources
  async aggregateNews(): Promise<void> {
    try {
      console.log('Starting news aggregation...');
      await this.seedDatabase();
      console.log('✅ News aggregation completed');
    } catch (error) {
      console.error('Error in news aggregation:', error);
    }
  }
}

export default new NewsAggregator();
