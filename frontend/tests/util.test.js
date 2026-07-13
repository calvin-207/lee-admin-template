/**
 * util.js token 管理 / autoStorage 测试
 *
 * 通过 vi.mock 隔离 @/config、@/api/api、@/utils/message、vue-clipboard3 等外部依赖，
 * 仅验证 getToken/setToken/autoStorage 的存储读写逻辑。
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// mock 外部依赖，避免触发完整模块图及 CommonJS/ESM 冲突
vi.mock('@/config', () => ({
  default: {
    STORAGE_METHOD: 'localStorage',
    LS_ENCRYPTION: '', // 不加密，测试纯存储逻辑
    LS_ENCRYPTION_KEY: '',
  },
}))
vi.mock('@/api/api', () => ({ default: {} }))
vi.mock('@/utils/message', () => ({
  MsgError: vi.fn(),
  MsgOk: vi.fn(),
  MsgWarn: vi.fn(),
}))
// vue-clipboard3 是 CommonJS 包，在 ESM 环境会报错，这里 mock 掉
vi.mock('vue-clipboard3', () => ({
  default: () => ({ toClipboard: vi.fn() }),
}))

const { autoStorage, getToken, setToken, getRereshToken, setRefreshToken } =
  await import('@/utils/util')

describe('autoStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('set/get 应能正确存取字符串值', () => {
    autoStorage.set('foo', 'bar')
    expect(autoStorage.get('foo')).toBe('bar')
  })

  it('get 未设置的 key 应返回 null', () => {
    expect(autoStorage.get('not_exist')).toBeNull()
  })

  it('remove 应删除指定 key', () => {
    autoStorage.set('toRemove', 'val')
    expect(autoStorage.get('toRemove')).toBe('val')
    autoStorage.remove('toRemove')
    expect(autoStorage.get('toRemove')).toBeNull()
  })

  it('字符串 "true"/"false" 应转为布尔值', () => {
    autoStorage.set('flagTrue', 'true')
    autoStorage.set('flagFalse', 'false')
    expect(autoStorage.get('flagTrue')).toBe(true)
    expect(autoStorage.get('flagFalse')).toBe(false)
  })
})

describe('getToken / setToken', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('setToken 后 getToken 应返回相同的值', () => {
    setToken('logintoken', 'my-access-token-123')
    expect(getToken()).toBe('my-access-token-123')
  })

  it('未设置 token 时 getToken 应返回 null', () => {
    expect(getToken()).toBeNull()
  })

  it('自定义 key 应正确存取', () => {
    setToken('custom_key', 'value')
    expect(getToken('custom_key')).toBe('value')
  })
})

describe('getRereshToken / setRefreshToken', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('refresh token 存取应正确', () => {
    setRefreshToken('refreshtoken', 'my-refresh-token-456')
    expect(getRereshToken()).toBe('my-refresh-token-456')
  })

  it('默认 key 应为 refreshtoken', () => {
    expect(getRereshToken()).toBeNull()
    setRefreshToken('refreshtoken', 'rt')
    expect(getRereshToken('refreshtoken')).toBe('rt')
  })
})
