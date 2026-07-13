/**
 * localStorage / sessionStorage polyfill
 *
 * vitest 3.x + jsdom 25 在某些环境下不会自动初始化 Web Storage，
 * 这里提供一个基于内存 Map 的最小实现，保证测试可访问 getItem/setItem/clear 等 API。
 */
function createStorage() {
  const store = new Map()
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null
    },
    setItem(key, value) {
      store.set(key, String(value))
    },
    removeItem(key) {
      store.delete(key)
    },
    clear() {
      store.clear()
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null
    },
    get length() {
      return store.size
    },
  }
}

// 仅当原生实现缺失或不完整时才替换
function ensureStorage(name) {
  const existing = window[name]
  if (!existing || typeof existing.getItem !== 'function') {
    Object.defineProperty(window, name, {
      value: createStorage(),
      configurable: true,
      writable: true,
    })
  }
}

ensureStorage('localStorage')
ensureStorage('sessionStorage')
