# Evals · 技能评测集

> 解决的问题：**改完 skill，你怎么知道是改好了还是改坏了？**
>
> 跑一次 `npm run eval`，得到一张通过率对照表。「带技能」比「不带技能」高出的部分，就是这个 skill 的真实价值。

---

## 怎么跑

```bash
npm run eval                    # 干跑：只列出将要生成的用例与路径，不调用任何 agent
npm run eval:score              # 只对已有产物评分（不调 agent，秒出）
node scripts/run-evals.mjs --eval 1 --eval 3              # 只跑指定用例
node scripts/run-evals.mjs --iteration 2                  # 写进指定迭代
node scripts/run-evals.mjs --agent-cmd "<你的命令>"        # 显式点名 agent 后才真正生成
```

### ⚠️ 本工具不替你选 agent

生成产物意味着**让你本机某个 CLI 真的跑起来、真的消耗额度**。那必须由你显式点名——脚本不会替你决定，也不会默认去调某个产品。

不指定 `--agent-cmd` 时它只做干跑，列出计划就退出。

约定：该命令从 **stdin** 读取完整 prompt，并在**当前工作目录**（即 `outputs/`）下写出产物。

```bash
# 举例（按你实际装的 CLI 来）
node scripts/run-evals.mjs --agent-cmd "claude -p --permission-mode acceptEdits"
node scripts/run-evals.mjs --agent-cmd "codex exec"
```

> 🕳 **踩过的坑**：`claude -p` 默认跑在**计划模式**，只写计划文件、不落地产物——
> 表现为「agent 跑了 87 秒、退出码 0，但 outputs/ 是空的」。
> 必须显式给 `--permission-mode acceptEdits`（允许写文件，但不放开任意命令执行）。
> 运行器会把 agent 的 stdout 存到 `agent-output.txt`，遇到这种情况先看它。

产物落在 `<repo>/agent-html-workspace/iteration-N/`：

```
iteration-1/
├── benchmark.md          ← 先看这个：通过率对照表 + 待人工判定清单
├── benchmark.json
├── 01-dashboard-monitoring/
│   ├── with_skill/
│   │   ├── outputs/artifact.html
│   │   ├── grading.json      ← 逐条判定 + 证据
│   │   └── timing.json
│   └── without_skill/         ← 同样的 prompt，不给技能（基线）
└── ...
```

`run-evals.mjs` 与 `agent-html-workspace/` 都是**维护者工具**，不随技能分发——Agent 不需要它们。（这条区分来自 `references/failures.md` F-016。）

---

## 评分口径：两把尺子

### 机器尺

`evals.json` 里带 `check` 字段的条目，由运行器判定，零 Token、完全可复现。

| `check` | 判定方式 | 需要的字段 |
|---|---|---|
| `no_cdn` | 不含任何 `http(s)://` 的 script/link/@import 外部引用 | — |
| `has` | 正则匹配数 ≥ `min`（默认 1）；给了 `max` 时还要 ≤ `max` | `pattern`, `min?`, `max?` |
| `count` | 同上，语义上强调数量 | `pattern`, `min?`, `max?` |
| `absent` | 正则**不得**命中 | `pattern` |
| `validate_clean` | 跑 `scripts/validate.mjs`，要求 0 项阻断 | — |
| `artifact` | 产出了 HTML 文件（判断型用例：「这里值得做成 HTML」） | — |
| `no_artifact` | **没有**产出 HTML 文件（判断型用例：「这里不该做成 HTML」） | — |
| `reply_has` | agent 的终端回复（`agent-output.txt`）匹配正则 | `pattern`, `min?` |
| `smoke_clean` | 跑 `scripts/smoke.mjs`，要求渲染通过（无 Chrome 时跳过，不计失败） | — |

**正则必须能在加载时编译通过**——运行器在调 agent 之前会先预校验全部 pattern，写错了立刻报，不浪费 agent 调用。

### 人眼尺

标了 `"level": "human"` 的条目，运行器记为 `passed: null`，汇总到 `benchmark.md` 的「待人工判定」清单里。

**这一节不能跳过。** 机器尺能测「代码有没有坏」，测不了「图有没有画对」。

> F-015 就是活证据：18 条规则、14 个产物烟测、28 个变异用例**全绿**，而那张水平条形图的数值刻度标在了错误的轴上。没有任何静态检查能发现它。

---

## `evals.json` 的结构

```jsonc
{
  "skill_name": "agent-html",

  // 所有用例共享的条目，避免六份重复。
  // 运行时会合并成 defaults + eval.expectations
  "defaults": [
    { "text": "产物完全离线自包含", "check": "no_cdn" },
    { "text": "【人眼】标题写的是结论", "level": "human" }
  ],

  "evals": [
    {
      "id": 1,
      "name": "dashboard-monitoring",   // 用于目录名，比 "eval-0" 可读
      "prompt": "用户会真的这么说的一句话",
      "expected_output": "散文描述（人读）",
      "files": [],
      "expectations": [
        { "text": "含 4 列 KPI 统计卡", "check": "count", "pattern": "stat|kpi", "min": 4 }
      ]
    }
  ]
}
```

> 📌 关于字段名：skill-creator 的 schema 里这个字段叫 **`expectations`**（不是 `assertions`），
> 而 `grading.json` 用 `{ text, passed, evidence }`。本仓库与 schema 保持一致。
> 唯一的扩展是：条目可以是带 `check` 的**对象**而不只是字符串，这样机器才能判定。

---

## 怎么读结果、怎么用它改进

1. **先看平均通过率**：`带技能 X% vs 不带技能 Y%`。如果两者接近，说明要么这个 skill 没起到作用，要么评测集测不出差异——两种都值得查。
2. **逐条看「未通过的机器条目」**：那是 **skill 没讲清楚**的地方。正确的反应是**补规范**，而不是去改产物让它通过。
3. **人眼那一节必须真的看**：跑一次生成产物，截图，逐条勾。机器全绿不等于图是对的。
4. **改完重跑，比 iteration-N 与 N-1**：涨了说明改对了，跌了说明改坏了。

### 一个容易忽视的坑

断言本身也可能失效。如果某条断言**带技能和不带技能都通过**，它就没有区分度——要么太宽松，要么这个点本来就不需要 skill 教。运行器不自动判这个，需要你在看表时留意。

---

## 两种用例

| 模式 | 包装语 | 测的是什么 |
| :--- | :--- | :--- |
| 默认 | 「把产物写成单个 HTML 文件，保存到 …」 | 做出来的 HTML **质量**：结构、门禁、交互出口 |
| `"mode": "judgment"` | 「由你判断交付形式；不该做成 HTML 就不要建文件，直接回复」 | SKILL.md 第零节的**判断**：要不要 HTML、做多大 |

只有默认模式的话，评测集永远测不到最重要的那一层——每条 prompt 都对应一个母版、每次都强制写 HTML，
测出来的只是「会不会照抄母版」。判断型用例两臂拿到的是**同一句**包装语，差异只来自有没有读技能。

判断型用例的计分规则：

- `defaults`（离线、viewport、暗色……）只在**真的产出了 HTML** 时才计分；
- 用例带 `no_artifact` 条目时，`defaults` 一律不计——不该做成 HTML 却做了，做得再精致也是判断失误，不能让这些条目替错误答案挣分。

## 当前覆盖

12 个用例：

| # | 用例 | 测什么 |
| :--- | :--- | :--- |
| 1–6 | dashboard / report / inspector / compare / timeline / kanban | 六个母版各自的结构与交互 |
| 7 | review-diff | Review 母版：diff 行级视图、逐文件裁决、复制审查结论 |
| 8 | judgment-shell-command | 判断：一条 shell 命令**不该**做成 HTML |
| 9 | judgment-short-answer | 判断：两句话的问答**不该**做成 HTML |
| 10 | granularity-evidence-page | 粒度：「分析一下」应交付证据页，而不是带目录的整页报告 |
| 11 | generalize-hiring-compare-en | 泛化：非运维场景 + 英文，不得被母版的运维示例数据污染、不得混入中文 |
| 12 | form-release-checklist | 表单控件：带 label 的复选框、输入框、复制结果回 Agent |

每例含通用条目（判断型用例按上面的规则计分）+ 2–6 条专有条目，多数用例有 1–2 条 `level: human`。
