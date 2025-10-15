# librivoxreading

一个朗读工具，帮助你跟着librivox 有声书完成朗读练习

## 📁 Project Structure (Updated)

```
librivoxreading
└──src/
    ├── main                # 后端程序    
         └──lib/index.ts    # 音频文件获取，朗读准确度，语音转文本
    ├── preload     # IPC 接口
    └── renderer    # 前端代码
          └──src/compnents
                ├──MediaCaption.tsx  #录音和朗读准确度评估
                └──Mp3player.tsx     #音频播放器
```
    

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```
