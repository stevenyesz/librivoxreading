# librivoxreading

一个朗读工具，帮助你跟着librivox 有声书完成朗读练习

![screenshot](librivoxreading.png)

## quickstart

download the dmg, install on your MacOS then use it.

* [download  macOS Apple Silicon ](https://github.com/stevenyesz/librivoxreading/releases/download/v1.0.0/shadowreading-1.0.0-arm64.dmg)

* [download  macOS Apple Intel  ](https://github.com/stevenyesz/librivoxreading/releases/download/v1.0.0/shadowreading-1.0.0-x64.dmg)

* [download windows x86 ](https://github.com/stevenyesz/librivoxreading/releases/download/v1.0.0/shadowreading-1.0.0-setup.exe)


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
