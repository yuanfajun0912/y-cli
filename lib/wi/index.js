const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const sharp = require('sharp');

// 设备类型及其对应宽度
const DEVICE_WIDTHS = {
  desktop: 4800,
  mobile: 2700
};

async function selectDeviceType() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'deviceType',
      message: '请选择设备类型:',
      choices: [
        { name: '电脑/平板 (桌面设备)', value: 'desktop' },
        { name: '手机 (移动设备)', value: 'mobile' }
      ],
      default: 'mobile'
    }
  ]);
  return answers.deviceType;
}

async function main(path) {  
  // 确定设备类型（通过参数或交互选择）
  let deviceType = 'mobile';
  
  try {
    deviceType = await selectDeviceType();
  } catch (promptError) {
    console.error(chalk.red('❌ 设备类型选择失败, 默认使用 mobile'));
    deviceType = 'mobile';
  }

  try {
    await processImage(path, deviceType);
  } catch (error) {
    console.error(chalk.red(`❌ 错误: ${error.message}`));
    process.exit(1);
  }
}

async function processImage(inputPath, deviceType) {
  console.log(chalk.blue(`🔍 正在处理: ${inputPath}`));
  console.log(chalk.blue(`📱 设备类型: ${deviceType === 'desktop' ? '电脑/平板' : '手机'}`));
  
  // 确定目标宽度
  const targetWidth = DEVICE_WIDTHS[deviceType];
  
  // 验证文件是否存在
  let fileExists = fs.existsSync(inputPath);
  
  // 如果输入的是绝对路径且文件不存在，直接报错
  if (path.isAbsolute(inputPath) && !fileExists) {
    throw new Error('文件不存在');
  }
  
  // 如果仍然找不到文件，尝试使用当前工作目录解析相对路径
  if (!fileExists) {
    const cwd = process.cwd();
    const relativePath = path.join(cwd, inputPath);
    if (fs.existsSync(relativePath)) {
      inputPath = relativePath;
      fileExists = true;
    }
  }
  
  if (!fileExists) {
    throw new Error('文件不存在');
  }
  
  // 检查是否为图片文件
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'];
  const ext = path.extname(inputPath).toLowerCase();
  
  if (!validExtensions.includes(ext)) {
    throw new Error('不支持的图片格式');
  }
  
  // 获取文件元数据
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  // 计算新高度
  const newHeight = Math.round(targetWidth * metadata.height / metadata.width);
  
  // 显示输入文件大小
  const inputStats = fs.statSync(inputPath);
  const inputSize = (inputStats.size / 1024).toFixed(2);
  console.log(chalk.yellow(`📥 输入文件大小: ${inputSize} KB`));
  console.log(chalk.yellow(`🖼️ 原始尺寸: ${metadata.width}×${metadata.height}`));
  console.log(chalk.yellow(`🆕 目标尺寸: ${targetWidth}×${newHeight}`));
  
  // 创建输出路径
  const parsed = path.parse(inputPath);
  let outputFileName;

  if (deviceType === 'desktop') {
    outputFileName = `${parsed.name}_pc.png`;
  } else {
    outputFileName = `${parsed.name}_iphone.png`;
  }

  const outputPath = path.join(parsed.dir, outputFileName);
  
  // 处理图片
  console.log(chalk.blue('⚙️ 正在转换并优化...'));
  
  const startTime = Date.now();
  
  await image
    .resize({
      width: targetWidth,
      height: newHeight,
      fit: 'contain',
      withoutEnlargement: true
    })
    .toFormat('png', {
      compressionLevel: 9,
      quality: 90,
      effort: 10,
      palette: true,
      colors: 256,
      dither: 1.0,
      force: true
    })
    .toFile(outputPath);
  
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
  
  // 获取输出文件大小
  const outputStats = fs.statSync(outputPath);
  const outputSize = (outputStats.size / 1024).toFixed(2);
  
  // 输出结果
  console.log(chalk.green(`✅ 转换成功! (耗时: ${elapsedTime}秒)`));
  console.log(chalk.green(`📉 文件大小: 原始 ${inputSize} KB → 转换后 ${outputSize} KB`));
  console.log(chalk.green(`📁 输出文件: ${outputPath}`));
}

module.exports = main;