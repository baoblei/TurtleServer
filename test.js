const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// 测试用例集合
const testCases = {
  // 1. 测试获取四则故事标题
  async test_get_4_title() {
    console.log('\n测试获取四则故事标题:');
    try {
      const response = await axios.get(`${BASE_URL}/api/get-4-title`);
      console.log('✅ 成功 - 状态码:', response.status);
      console.log('返回数据:', response.data);
      // 验证返回的是否为数组且长度为4
      if (!Array.isArray(response.data) || response.data.length !== 4) {
        console.log('❌ 错误: 返回数据格式不正确');
      }
    } catch (error) {
      console.log('❌ 失败:', error.response?.data || error.message);
    }
  },

  // 2. 测试获取单个故事
  async test_get_story() {
    console.log('\n测试获取单个故事:');
    try {
      const response = await axios.get(`${BASE_URL}/api/get-story`);
      console.log('✅ 成功 - 状态码:', response.status);
      console.log('返回数据:', response.data);
      // 验证返回的数据包含title和story字段
      if (!response.data.title || !response.data.story) {
        console.log('❌ 错误: 返回数据缺少必要字段');
      }
    } catch (error) {
      console.log('❌ 失败:', error.response?.data || error.message);
    }
  },

  // 3. 测试查询用户提问
  async test_get_query() {
    console.log('\n测试查询用户提问:');
    
    // 测试成功情况
    try {
      const response = await axios.get(`${BASE_URL}/api/get-query`, {
        params: { 
          title: '神秘的红房子',
          query: '是不是发生在医院？'
        }
      });
      console.log('✅ 成功 - 状态码:', response.status);
      console.log('返回数据:', response.data);
    } catch (error) {
      console.log('❌ 失败:', error.response?.data || error.message);
    }

    // 测试失败情况 - 不存在的标题
    try {
      const response = await axios.get(`${BASE_URL}/api/get-query`, {
        params: { 
          title: '不存在的标题',
          query: '测试问题'
        }
      });
    } catch (error) {
      console.log('✅ 预期的失败 - 状态码:', error.response?.status);
      console.log('错误信息:', error.response?.data);
    }

    // 测试失败情况 - 缺少标题参数
    try {
      const response = await axios.get(`${BASE_URL}/api/get-query`, {
        params: { query: '测试问题' }
      });
    } catch (error) {
      console.log('✅ 预期的失败 - 状态码:', error.response?.status);
      console.log('错误信息:', error.response?.data);
    }

    // 测试失败情况 - 缺少查询参数
    try {
      const response = await axios.get(`${BASE_URL}/api/get-query`, {
        params: { title: '神秘的红房子' }
      });
    } catch (error) {
      console.log('✅ 预期的失败 - 状态码:', error.response?.status);
      console.log('错误信息:', error.response?.data);
    }
  },

  // 4. 测试查询汤底
  async test_get_answer() {
    console.log('\n测试查询汤底:');
    
    // 测试成功情况
    try {
      const response = await axios.get(`${BASE_URL}/api/get-answer`, {
        params: { title: '神秘的红房子' }
      });
      console.log('✅ 成功 - 状态码:', response.status);
      console.log('返回数据:', response.data);
    } catch (error) {
      console.log('❌ 失败:', error.response?.data || error.message);
    }

    // 测试失败情况 - 不存在的标题
    try {
      const response = await axios.get(`${BASE_URL}/api/get-answer`, {
        params: { title: '不存在的标题' }
      });
    } catch (error) {
      console.log('✅ 预期的失败 - 状态码:', error.response?.status);
      console.log('错误信息:', error.response?.data);
    }

    // 测试失败情况 - 缺少标题参数
    try {
      const response = await axios.get(`${BASE_URL}/api/get-answer`);
    } catch (error) {
      console.log('✅ 预期的失败 - 状态码:', error.response?.status);
      console.log('错误信息:', error.response?.data);
    }
  },

  // 5. 测试获取指定故事
  async test_get_select_story() {
    console.log('\n测试获取指定故事:');
    
    // 测试成功情况
    try {
      const response = await axios.get(`${BASE_URL}/api/get-select-story`, {
        params: { title: '神秘的红房子' }
      });
      console.log('✅ 成功 - 状态码:', response.status);
      console.log('返回数据:', response.data);
      if (!response.data.title || !response.data.story) {
        console.log('❌ 错误: 返回数据缺少必要字段');
      }
    } catch (error) {
      console.log('❌ 失败:', error.response?.data || error.message);
    }

    // 测试失败情况 - 不存在的标题
    try {
      const response = await axios.get(`${BASE_URL}/api/get-select-story`, {
        params: { title: '不存在的标题' }
      });
    } catch (error) {
      console.log('✅ 预期的失败 - 状态码:', error.response?.status);
      console.log('错误信息:', error.response?.data);
    }

    // 测试失败情况 - 缺少标题参数
    try {
      const response = await axios.get(`${BASE_URL}/api/get-select-story`);
    } catch (error) {
      console.log('✅ 预期的失败 - 状态码:', error.response?.status);
      console.log('错误信息:', error.response?.data);
    }
  }
};

// 运行所有测试
async function runTests() {
  console.log('开始运行接口测试...\n');
  for (const [testName, testFunc] of Object.entries(testCases)) {
    console.log(`执行测试: ${testName}`);
    await testFunc();
  }
  console.log('\n测试完成');
}

// 预期的接口返回格式
const expectedResponses = {
  'get-4-title': {
    '成功': [
      '神秘的红房子',
      '奇怪的早餐',
      '电梯里的选择',
      '最后的晚餐'
    ],
    '失败': {
      status: 500,
      body: { error: '服务器内部错误' }
    }
  },
  'get-story': {
    '成功': {
      title: '神秘的红房子',
      story: '一个男人住进了一间红房子，第二天他死了。'
    },
    '失败': {
      status: 500,
      body: { error: '服务器内部错误' }
    }
  },
  'get-query': {
    '成功': {
      response: '对' // 或 '错' 或 '不相关' 或 '猜对了'
    },
    '失败-无标题': {
      status: 400,
      body: { error: '缺少故事标题参数' }
    },
    '失败-标题不存在': {
      status: 404,
      body: { error: '未找到相关故事' }
    }
  },
  'get-answer': {
    '成功': {
      answer: '这是在医院的手术室，手术失败了。'
    },
    '失败-无标题': {
      status: 400,
      body: { error: '缺少故事标题参数' }
    },
    '失败-标题不存在': {
      status: 404,
      body: { error: '未找到相关故事' }
    }
  },
  'get-select-story': {
    '成功': {
      title: '神秘的红房子',
      story: '一个男人住进了一间红房子，第二天他死了。'
    },
    '失败-无标题': {
      status: 400,
      body: { error: '缺少故事标题参数' }
    },
    '失败-标题不存在': {
      status: 404,
      body: { error: '未找到相关故事' }
    }
  }
};

console.log('预期的接口返回格式:', JSON.stringify(expectedResponses, null, 2));
runTests(); 