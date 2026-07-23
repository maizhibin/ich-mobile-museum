# CosyVoice 3 远端讲解音频服务

新展馆的 AI 合成讲解音频由内网 CosyVoice 3 服务生成：<http://10.8.1.50:8766>。

服务运行在 ARM64 NVIDIA DGX Spark（GB10）上，使用 `Fun-CosyVoice3-0.5B-2512`。它只用于已获得授权的讲解员音色，或模型自带示例音色；不得把合成声音冒充真人馆员、艺术家或传承人。

## 生成与导入

1. 打开服务网页，选择已保存的预设音色，或上传已授权的 5–15 秒参考音频并保存为预设。
2. 粘贴馆内讲解文稿，确认授权后生成。服务会按句输出 WAV，并给出逐句时长。
3. 在试听结果中点击“下载项目音频包（WAV + manifest）”。压缩包包含 `001.wav`、`002.wav` 等逐句音频与 `manifest.json`。
4. 将每个 WAV 用 FFmpeg 转为单声道 48kHz、128kbps AAC/M4A，放入 `public/audio/guides/<馆别>/`。
5. 以实际转码后音频时长更新对应的 `content/audio/*-three-minute-guide.json`：每句的 `src`、`durationSeconds`、`start`、`end` 以及章节起点和总时长都必须重新计算。
6. 保留并在页面显示 AI 合成语音披露、文稿来源、更新时间及权利信息。随后运行完整质量检查。

现有的 [`scripts/generate-cosyvoice-guides.py`](../scripts/generate-cosyvoice-guides.py) 可作为音频编码、停顿处理和时间轴写回的参考实现。

## 服务维护

服务由远端用户级 systemd 单元 `cosyvoice3.service` 管理，可使用下列命令检查或重启：

```bash
ssh maizb@10.8.1.50 'systemctl --user status cosyvoice3.service'
ssh maizb@10.8.1.50 'systemctl --user restart cosyvoice3.service'
```

生成结果保存在远端 `/home/maizb/dev/cosyvoice3_app/data/projects/`。模型权重不会放入本仓库。
