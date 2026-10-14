# GitHub 连接问题修复方案

机器：`yjmx@MacBook-Pro-7.local`　仓库：`kyreemeng/ModelAny_web`
诊断时间：2026-10-14

---

## 一、先说结论

**这不是 hosts 能修的问题。**

之前 `git push` 失败时的报错（连不上 443）看起来像 DNS 被污染，但实测证明：

- 域名当前解析到的 `20.205.243.166` **就是 GitHub 官方 IP**（来自 `api.github.com/meta`），不是错误地址；
- 同一个 IP 刚才连续测试 **12/12 全部成功**；
- 反而是一小时前"可用"的备用 IP（`140.82.112.3` 等）现在 **0/8 全部失败**。

所以真正的原因是**上游网络对 GitHub 的间歇性限速/中断**，不是解析错误。改 hosts 只是把某个此刻碰巧能通的 IP 写死，几十分钟后大概率失效，属于治标且不可靠。

真正耐用的方案是 **SSH over 443**（GitHub 官方为 443 受限网络提供的通道），实测 `ssh.github.com:443` **12/12 稳定可达**。

---

## 二、证据

| 测试项 | 结果 | 说明 |
|---|---|---|
| `dig +short github.com` | `20.205.243.166` | 与官方 meta 一致，解析正确 |
| 直连 `https://github.com` × 12 | **12/12 成功** | 当前通畅 |
| `git ls-remote` × 3 | **3/3 成功** | 真实使用场景通畅 |
| 备用 IP `140.82.112.3` × 8 | 0/8 失败 | 反而不可用 |
| 备用 IP `140.82.113.3` / `140.82.114.3` × 8 | 0/8 失败 | 反而不可用 |
| `ssh.github.com:443` × 12 | **12/12 可达** | 最稳定的通道 |
| `raw.githubusercontent.com` | 不可达 | 该域名单独被限（不影响 push） |
| `vercel.com` / `www.modelany.app` | 200 | 其余网络正常 |

**解读**：连通性在"通"与"不通"之间抖动，与选哪个 IP 无关。写死 IP 无法解决抖动。

---

## 三、方案 A（推荐）：SSH over 443

GitHub 为 HTTPS 端口受限的网络提供 `ssh.github.com:443` 作为替代通道。配置一次，长期有效，且不再依赖 IP 是否抖动。

### 1）把本机公钥加到 GitHub

本机已有公钥：

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILYnNxWyBwk+0/JqFjCB4JdM6tj4lFSQU6JGj/eIbwk2 yjmx@MacBook-Pro-7.local
```

操作：打开 https://github.com/settings/keys → **New SSH key** → 粘贴上面整行 → 保存。

当前该公钥**尚未注册**到 GitHub（所以现在 `ssh -T` 会返回 `Permission denied (publickey)`），必须先做这一步。

### 2）新建 `~/.ssh/config`

本机当前没有该文件，创建并写入：

```sshconfig
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  ServerAliveInterval 30
  ServerAliveCountMax 6
```

命令：

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  ServerAliveInterval 30
  ServerAliveCountMax 6
EOF
chmod 600 ~/.ssh/config
```

### 3）把远程地址切成 SSH

```bash
git remote set-url origin git@github.com:kyreemeng/ModelAny_web.git
```

### 4）验证

```bash
ssh -T git@github.com          # 期望：Hi kyreemeng! You've successfully authenticated...
git ls-remote origin HEAD      # 期望：返回一个 commit hash
```

成功后正常的 `git push origin main` 即可，无需任何代理或 hosts。

> 回退：`git remote set-url origin https://github.com/kyreemeng/ModelAny_web.git`

---

## 四、方案 B：走 HTTP(S) 代理（若你已有代理）

如果本机有可用代理（Clash/V2Ray 等，假设端口 7890）：

```bash
# 仅对 GitHub 生效，不动其他域名
git config --global http.https://github.com.proxy http://127.0.0.1:7890

# 验证
git ls-remote origin HEAD

# 取消
# git config --global --unset http.https://github.com.proxy
```

本机当前**没有**任何代理环境变量，也没有配置过 git 代理，所以这条仅在你有代理时使用。

---

## 五、方案 C（备选，不推荐）：hosts

仅当你确认 `dig +short github.com` 返回的**不是** GitHub 官方段内地址时，才值得动 hosts。当前不满足这个条件。

需要的 IP 段（来自 `https://api.github.com/meta` 的 `git` 字段）：

- `140.82.112.0/20`（含 `140.82.112.3` 等）
- `20.205.243.166`（当前解析值，官方）

如仍要写，命令如下（需要你的 sudo 密码，我这边没有权限代改）：

```bash
sudo cp /etc/hosts /etc/hosts.bak
sudo tee -a /etc/hosts >/dev/null <<'EOF'

# GitHub (2026-10-14) - see github-connectivity-fix.md
20.205.243.166 github.com
20.205.243.165 codeload.github.com
185.199.108.133 raw.githubusercontent.com
185.199.109.133 raw.githubusercontent.com
185.199.110.133 raw.githubusercontent.com
185.199.111.133 raw.githubusercontent.com
EOF

# 刷新 DNS 缓存
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

回退：`sudo cp /etc/hosts.bak /etc/hosts`

**为什么仍不推荐**：上面这些 IP 与 DNS 当前给出的地址是一致的，改完不会带来提升；而 IP 本身稳定性会随上游策略变化，写死反而可能在 IP 变更后彻底失联。

---

## 六、建议的执行顺序

1. 先做**方案 A**（SSH over 443）——一次配置，长期免疫这类抖动；
2. 若你本来就有代理，方案 B 也可叠加；
3. 除非确认解析被污染，否则**不要**动 hosts。

另：`raw.githubusercontent.com` 在本网络单独不可达，但只影响 `raw` 链接访问，不影响 `git push` / `git clone`，可暂时忽略。
