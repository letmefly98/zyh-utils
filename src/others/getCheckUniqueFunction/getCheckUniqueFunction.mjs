/**
 * 检查唯一性的封装
 * @description 比如用于调用项目名称唯一性接口
 * @description 新建时每次都需查验，编辑时只有值改变时才需查验
 *
 * @example
 * const _checkProjectNameUnique = (name) => ajax.post('https://', { name })
 * const checkWhenCreate = getCheckUniqueFunction(_checkProjectNameUnique);
 * const checkWhenModify = getCheckUniqueFunction(_checkProjectNameUnique, 'modify', '默认项目');
 *
 * @param {async (v: string) => boolean} method 源查验方法
 * @param {'create' | 'modify'} [action="create"] 新建/编辑
 * @param {string} [originValue=""] 编辑时的初始值
 * @returns {async (v: string) => boolean} 包含查验逻辑的方法
 */
export function getCheckUniqueFunction(method, action = 'create', originValue = '') {
  return async (value) => {
    if (!value) return false
    const needCheck = action === 'create' || (action !== 'create' && value !== originValue)
    const isUnique = needCheck ? await method(value) : false
    return isUnique
  }
}
