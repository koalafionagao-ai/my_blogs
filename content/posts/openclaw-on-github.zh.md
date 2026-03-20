---
title: "OpenClaw-GitHub虚拟机养一只龙虾"
date: 2026-03-20T15:59:31.431Z
description: "拒绝本地配置折磨，PM 也能上手的云端部署实录。涵盖 Codespaces 避坑指南与 Gemini 模型集成全过程。"
tags: ["AI观察", "实践工坊"]
cover:
  image: "https://images.unsplash.com/photo-1646583288948-24548aedffd8?q=80&w=2071&auto=format&fit=crop"
---

创建时间: 2026年3月13日 18:54
标签: AI观察, 实践工坊
上次更新时间: 2026年3月18日 16:26

<aside>

**Story**

我是一个产品经理，不懂编码（需要的时候，会找AI硅友帮忙）。

我热爱学习AI，龙虾的文档、博客、播客甚至相关论坛我都翻遍了，不过瘾。

我动手能力还不错，但我始终不够勇敢在自己的电脑安装龙虾，我也没有多余的笔记本电脑。

我看到OpenClaw官方的安装文档似乎支持Docker，于是我开始想云端搞一个虚拟机是不是也可以？

由于我早年自己徒手安装过电脑系统，也自己读文档安装过公司的过跳板机和虚拟机，我想安装一个软件总不该更难？

于是我去Github打开了CodeSpace——一个提供Linux虚拟机的好平台，哈哈哈，然后我就成功了！！！

</aside>

# 1 安全提醒

<aside>

**Codespace（虚拟机实例）** 是私有的

- 当你启动 Codespace 时，GitHub 会为这台虚拟机绑定你的个人 Token。
- 这个 Token 其实就是这台机器的“临时房卡”。

`18789` 端口是龙虾官方提供的端口，使用时若有阻塞则设置为 **Public/成功后务必记得改为Private**

- `https://...-18789.app.github.dev` 这个链接，最好不要暴露和公开。

如果你选择了**公共的仓库（public）**

- **仓库里的文件**：全世界都能看到（任何人都可以看到你的 GitHub 仓库代码、甚至 fork 你的项目）
- **虚拟机（Codespace）里的文件**：**只有你自己能看到。**

如果你在虚拟里的龙虾里**配置模型API**

- 不要配置付费API
- 单独创建1个给龙虾用的免费API KEY（做研究和测试用，完全足够）
- 配置的免费API KEY，即便出现了意外，你也可以随时停用/回收这个KEY，一键移除风险

在做任何操作之前，都应该抱有**质疑→验证的思路，随时查阅OpenClaw官方指导**：

- [官方安装文档](https://docs.openclaw.ai/install)  |  [官方GitHub社区](https://github.com/openclaw/openclaw/issues)  |  [OpenClaw官网](https://openclaw.ai/)
</aside>

# 2 安装步骤

```yaml
# OpenClaw 在 GitHub Codespaces 虚拟机安装框架

├── Phase 1: 初始化准备 (Preparation)
│   ├── 第1步: 新建一个文件夹
│   │   └── 位置: [GitHub 已选仓库内部]
│   └── 第2步: 新建一个 codespace
│       └── 动作: [关联该文件夹启动云端虚拟机]
│
├── Phase 2: 核心安装 (Installation)
│   └── 第3步: 打开虚拟机安装龙虾
│       └── 执行: [终端运行 Bash 安装脚本]
│
├── Phase 3: 设备授权 (Device Authorization)
│   ├── 第4步: 允许缺失配置运行
│   │   └── 策略: [忽略 Initial Config 强制启动]
│   └── 第5步: 安全拦截 Pairing Required
│       ├── 拦截: [系统提示需要 Pairing Code 才能连接]
│       └── 动作: [查阅Pending设备 -> 成功审批后 -> 成功配对 ->成功登入]
│
├── Phase 4: 模型配置 (Model Setup)
│   └── 第6步: 终端窗口运行 Bash 命令配置模型
│
└── Phase 5: 长期唤醒 (Maintenance)
    └── 第7步: 下次唤醒的步骤
        ├── [打开 GitHub]
        ├── [找到 Codespace 的龙虾虚拟机]
        ├── [终端运行 Bash 命令启动网关]
        └── [Web UI 连接]
```

## 第1步 新建一个文件夹

<aside>

选择1个仓库-> 新建1个文件夹-> 在这个新的文件夹里，随便新建1个占位文件，给虚拟机防呆（有时它检索不到空文件夹）

*如果你图省事儿，直接新建1个仓库，那也是可以的。*

</aside>

![image.png](/my_blogs/zh/openclaw-on-github/images/image.webp)

<aside>

</aside>

![image.png](/my_blogs/zh/openclaw-on-github/images/image 1.webp)

## **第2步 新建一个codespace**

<aside>

- 回到刚才新建文件夹的仓库主页，找到”Code“，点开后选择”Codespaces“，点击➕，创建1个新的codespace
- 如果碰到浏览器让你下载什么插件应用，可以不下载；后续所有流程都可以在浏览器直接操作，不需要本地安装应用
- 等待虚拟机setup，完成之后浏览器就会看到一个加载好的虚拟机页面（左中右结构，中间上下分区是代码区）
</aside>

![image.png](/my_blogs/zh/openclaw-on-github/images/image 2.webp)

![image.png](/my_blogs/zh/openclaw-on-github/images/image 3.webp)

## **第3步 打开虚拟机安装龙虾**

<aside>

在打开的虚拟机界面，找到中间的”终端“或者英文版本叫”Terminal“，对照下面的提示，在蓝色光标后面，一句一句粘贴命令行+enter：

- 第3句执行完之后，如果没有多余报错，就会看到龙虾以“🦞这样的emoji开头”给你的傲娇高冷回应，比如下文的”More Integrations than your therapist’s intake form”，就是它抱怨我啦，哈哈哈~
- 好，下面有报错说，缺失配置，我们进入下一步“允许缺失配置安装”——*就是说啥都没配置用不了，但可以先进页面看看*
- 非新手可以直接在这里setup，这个步骤也就是后续我们在配置环节会讲到的一点内容
- 好——到这里为止，只能看到一个类似登录界面的东西——*哈哈哈，就差临门一脚啦*
</aside>

```bash
#第 1 句：进入你刚才建的空文件夹 (把代码里的名字换成你实际建的，比如 openclaw)
cd openclaw

#第 2 句：全局安装 OpenClaw (这步屏幕上会疯狂滚动进度条，耐心等它跑完，直到再次出现 $ 光标)
npm install -g openclaw@latest

#第 3 句：启动网关
openclaw gateway --port 18789 
```

![image.png](/my_blogs/zh/openclaw-on-github/images/cab5abe4-4d24-4f1d-8002-d0b24ac09c9f.webp)

![image.png](/my_blogs/zh/openclaw-on-github/images/image 4.webp)

## **第4步 允许缺失配置运行**

```bash
##看到这句极其傲娇的开场白（“集成的工具比你心理医生的问卷表还要多”），恭喜你，龙虾的肉身已经成功降临云端了！
🦞 OpenClaw 2026.3.13 (61d171a) — More integrations than your therapist's intake form.
08:36:56 Missing config. Run `openclaw setup` or set gateway.mode=local (or pass --allow-unconfigured).

但是因为缺失配置，所以安装中止，原因：
#因为你现在用的是一台极其纯洁、刚出炉的云端电脑，里面根本没有这些初始化的“大脑配置文件”。出于安全风控，它傲娇地拒绝开启网关大门。

#第一步，按下键盘上的 Ctrl + C（无论 Windows 还是 Mac 都是这个快捷键）。*-->意思是终止当前的运行，我要开始新命令了，这个后面用很多*
屏幕会看到类似"@xxx -> /aaa/bbb/ccc……openclaw (main) $ "的一行，光标在$后面

#第二步，在光标位置粘贴下面命令然后回车 -->*意思是允许无配置运行，在无配置时后续启动都可以用这个命令，可以记下来*
openclaw gateway --port 18789 --allow-unconfigured

#第三步，Chrome右下角会弹出，监听到18789，选择浏览器打开，就会在新tab看到配置页面
```

![image.png](/my_blogs/zh/openclaw-on-github/images/image 5.webp)

![image.png](/my_blogs/zh/openclaw-on-github/images/image 6.webp)

## **第5步 安全拦截Pairing Required→摆烂之后成功了**

<aside>

我在这里卡了十几轮吧，Gemini PRO额度都用完了，GPT压根没啥用一通瞎说……

这个虚拟机的访问验证一直block，OpenClaw这个步骤难住了AI。

于是，我找到了一个网络社区关于[如何修复pairing required的文章](https://openclawlaunch.com/guides/openclaw-gateway-pairing](https://openclawlaunch.com/guides/openclaw-gateway-pairing))

最后吃完晚饭又试了一下，百无聊赖不抱希望的情况下，我竟然成功了。。。

看到OpenClaw Web UI的那一瞬间我好想哭啊😭

</aside>

```bash
简单说就是：Gemini开始一直让我修改JSON文件试图绕过龙虾的Token验证方式，但实际上没用，龙虾底层会有严格的限制和验证。
后来我从报错里看到它是在说我从虚拟机转发了端口之后origin地址被识别到不是local，所以龙虾认为我可能是黑客、就不给我开门。

*By Gemini——
“根据你提供的链接以及 OpenClaw 官方文档中关于 Pairing Required (1008) 错误的深层逻辑，我们之前的死循环终于找到了“官方解法”。
在 GitHub Codespaces 这种云端环境中，你之所以一直被挡在门外，是因为 OpenClaw 有一套**“三位一体”**的安全验证：Token（令牌）+ TrustedProxies（信任代理）+ Device Pairing（设备配对）。我们之前搞定了前两个，但被卡在了最后一个“设备配对”上。”*

# 第1步 打开一个新termial（点击右边的加号，就会看到一个新的bash窗口），运行：
openclaw devices list --> 找到请求设备列表

# 第2步 审批pending的设备 --> 因为bash窗口的内容复制出来格式很奇怪，我看到了pending的设备，复制不出来id哈哈哈，直接一键审批
openclaw devices approve $(openclaw devices list | grep pending | awk '{print $1}')

# 第3步，此时去刷新那个登录界面，点击连接就进去了！！！
此时点开“节点“，英文叫Nodes，就能在Devices里看到刚审批配对的设备列表啦~
```

![image.png](/my_blogs/zh/openclaw-on-github/images/image 7.webp)

![image.png](/my_blogs/zh/openclaw-on-github/images/image 8.webp)

![image.png](/my_blogs/zh/openclaw-on-github/images/image 9.webp)

# 3 配置模型

<aside>

我在web UI里把菜单全部点开研究了一遍，还看完了系统提示词（就是那8个md文件），觉得这个监控平台给管理员用比较好。

于是，我就打算配置一个模型来试试它的工作流；如果成功了，我就看看以后是不是接一个Telegram的API进来模拟一下Bot消息流。

</aside>

```bash
我看来看去，启动配置这事儿在Web UI里没地方做，我还是回虚拟机终端窗口了。

#第1步 运行龙虾 -->它会列出Agent下面的文件
openclaw agents

龙虾的回复格式类似于：
Agents:
- main (default)
  Workspace: ~/.xx/yy
  Agent dir: ~/.xx/yy/zzzzz

#第2步 吊起配置
openclaw agents add main

这里就会看到在终端窗口里，看到小绿点的选项，**用键盘上的方向键来控制选项的选中后，按下回车，就会选中&进入下一项**，例如：

🦞 OpenClaw 2026.3.13 (61d171a) — Your .zshrc wishes it could do what I do.

┌  Add OpenClaw agent
│
◇  Agent "main" already exists. Update it?
│  Yes
│
◇  Workspace directory
│  /home/codespace/.openclaw/workspace
│
◇  Configure model/auth for this agent now?
│  Yes
│
◇  Model/auth provider
│  Google
│
◇  Google auth method
│  Google Gemini API key
│
◇  How do you want to provide this API key?
│  Paste API key now
……此处就省略了

#第3步 这里配置完，后续的配置可以忽略了，一定要记得结束，然后就会看到它跑一堆指令去写文件，然后回复一个Model Configured；
此时就是有配置的龙虾了，然后重新启动龙虾端口，运行下面的指令：
openclaw gateway --port 18789

#第4步，再进入WEB UI界面，就能看到模型变成你设置的（而不是默认的opus）
如果你在终端窗口设置完，进入界面发现模型没变，那么大概率就是没设置成功，去终端窗口看看命令结束了没呀~龙虾有没有回复你搞完了呀~
如果看到Token消耗还挺要命的，没关系，去你配置的模型用量界面查一下花在了哪里，目前我是三条消息跑了50k的token😭
```

![image.png](/my_blogs/zh/openclaw-on-github/images/image 10.webp)

![image.png](/my_blogs/zh/openclaw-on-github/images/image 11.webp)

# 4 下次唤醒

<aside>

- CodeSpaces这个虚拟机一直都在，只要你不删除（另外就看Github回收的政策了）；
- 若一直inactive，或关掉网页，GitHub 会在一段时间后（默认 30 分钟）让机器进入“休眠”状态以节省配额；
- 下次可以直接从Github的仓库里→点击code→找到codespaces→找到这个龙虾虚拟机，点开等它setup就可以访问了。
</aside>

```bash
#第1步 在setup OK的虚拟机窗口终端里，执行：
openclaw gateway --port 18789

#第2步 等待右下角那个弹窗“监听到18789，选择浏览器打开”
如果你之前比较聪明，已经保存/收藏了那个web ui登录界面的URL，直接打开刷新也可以

#第3步 等待一下它会自动连接（因为已经设备配对过了）
如果你不清理缓存、也不更换浏览器，基本可以一直使用；之前的配置都在，Token依然有效（只要你不重装系统，你的身份验证信息是持久化的。）
```

![image.png](/my_blogs/zh/openclaw-on-github/images/image 12.webp)