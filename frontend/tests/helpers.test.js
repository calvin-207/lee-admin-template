/**
 * util.js 纯工具函数测试
 *
 * deepClone、safeDelete 等函数无外部副作用，可直接验证行为。
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/config', () => ({
  default: { STORAGE_METHOD: 'localStorage', LS_ENCRYPTION: '', LS_ENCRYPTION_KEY: '' },
}))
vi.mock('@/api/api', () => ({ default: {} }))
vi.mock('@/utils/message', () => ({
  MsgError: vi.fn(),
  MsgOk: vi.fn(),
  MsgWarn: vi.fn(),
}))
vi.mock('vue-clipboard3', () => ({
  default: () => ({ toClipboard: vi.fn() }),
}))

const { deepClone, safeDelete } = await import('@/utils/util')

describe('deepClone', () => {
  it('应深拷贝对象，修改副本不影响原对象', () => {
    const original = { a: 1, nested: { b: 2 } }
    const copy = deepClone(original)

    copy.nested.b = 999
    expect(original.nested.b).toBe(2)
    expect(copy.nested.b).toBe(999)
  })

  it('应深拷贝数组', () => {
    const original = [1, [2, 3], { x: 4 }]
    const copy = deepClone(original)

    copy[1][0] = 99
    expect(original[1][0]).toBe(2)
  })

  it('空值应原样返回', () => {
    expect(deepClone(null)).toBeNull()
    expect(deepClone(undefined)).toBeUndefined()
    expect(deepClone(0)).toBe(0)
  })
})

describe('safeDelete', () => {
  it('应安全删除对象属性', () => {
    const obj = { a: 1, b: 2 }
    safeDelete(obj, 'a')
    expect(obj).toEqual({ b: 2 })
  })

  it('删除不存在的属性不应报错', () => {
    const obj = { a: 1 }
    expect(() => safeDelete(obj, 'ghost')).not.toThrow()
  })

  it('对 null/undefined 调用不应报错', () => {
    expect(() => safeDelete(null, 'x')).not.toThrow()
    expect(() => safeDelete(undefined, 'x')).not.toThrow()
  })
})
