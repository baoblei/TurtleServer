const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://root:mh2hkbsg@dbconn.sealoshzh.site:48061/?directConnection=true')
  .then(() => console.log('数据库连接成功'))
  .catch(err => console.error('数据库连接失败:', err));

// 定义Schema
const turtleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    set: v => String(v)
  },
  story: { type: String, required: true },
  answer: { type: String, required: true }
});

const Turtle = mongoose.model('Turtle', turtleSchema);

// 测试数据
const testData = [
  {
    title: "神秘的红房子",
    story: "一个男人住进了一间红房子，第二天他死了。",
    answer: "这是在医院的手术室，手术失败了。"
  },
  {
    title: "奇怪的早餐",
    story: "一个人在餐厅吃早餐，看到对面的人在喝咖啡，突然尖叫着跑出去了。",
    answer: "他在照镜子，发现对面的'人'其实是自己的倒影，但自己并没有在喝咖啡。"
  },
  {
    title: "电梯里的选择",
    story: "一个人走进电梯，按了一个按钮后活了下来。如果他按其他钮就会死。",
    answer: "这人被困在着火的大楼里，只有一层没有着火，他选对了那一层。"
  },
  {
    title: "最后的晚餐",
    story: "一个人点了一份特殊的晚餐，吃完后说'我再也不会点这个了'。",
    answer: "他在死刑前吃最后一顿饭。"
  },
  {
    title: "奇怪的电话",
    story: "一个人接到一个电话，对方说'你已经死了'，然后挂断了。",
    answer: "他接到了110报警电话。"
  },
  {
    title: "测试",
    story: "测试",
    answer: "测试"
  }
];

// 插入测试数据
async function initDatabase() {
  try {
    // 清空现有数据
    console.log('正在清空数据库...');
    await Turtle.deleteMany({});
    
    // 插入新数据
    console.log('正在插入测试数据...');
    const result = await Turtle.insertMany(testData);
    
    console.log('测试数据插入成功，插入的记录数:', result.length);
    console.log('插入的数据:', result);

    // 验证数据
    const count = await Turtle.countDocuments();
    console.log('数据库中的总记录数:', count);
    
    process.exit(0);
  } catch (error) {
    console.error('数据插入失败:', error);
    process.exit(1);
  }
}

initDatabase(); 