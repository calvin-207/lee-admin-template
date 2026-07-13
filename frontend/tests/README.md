# 前端测试说明

## 环境准备

```bash
cd frontend

# 安装依赖（包含测试工具 vitest、@vue/test-utils、jsdom）
npm install --registry=https://registry.npmmirror.com
```

## 运行测试

```bash
# 运行所有测试（单次）
npm test

# 监听模式（开发时实时运行）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

## 测试结构

```
tests/
├── util.test.js        # token 管理 / autoStorage 存储读写
└── helpers.test.js     # deepClone、safeDelete 等纯工具函数
```

## 编写新测试

1. 在 `tests/` 下新建 `xxx.test.js`
2. 对于依赖 `@/config`、`@/api/api` 的模块，用 `vi.mock` 隔离
3. 组件测试使用 `@vue/test-utils` 的 `mount` / `shallowMount`

```javascript
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

it('组件应正确渲染', () => {
  const wrapper = mount(MyComponent)
  expect(wrapper.text()).toContain('预期文本')
})
```

## 测试原则

- **隔离性**：通过 `vi.mock` 避免触发完整模块依赖链
- **纯函数优先**：优先测试无副作用的工具函数
- **快照可选**：UI 稳定后可补充组件快照测试
