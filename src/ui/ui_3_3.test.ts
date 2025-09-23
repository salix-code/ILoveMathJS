import { Multiply } from './ui_3_3';

describe('Multiply.init_number', () => {
    /**
     * 测试正常输入情况
     * @description 验证方法是否正确处理常规输入
     */
    test('should handle normal inputs', () => {
        const multiply = new Multiply(5, 10);
        expect(multiply['number_layer']).toEqual([5, 10, 0, 5, 50]);
    });

    /**
     * 测试边界输入情况
     * @description 验证方法对最小和最大可能的输入值的处理
     */
    test('should handle boundary inputs', () => {
        const multiply = new Multiply(1, 9999);
        expect(multiply['number_layer']).toEqual([1, 9999, 9, 9, 9, 9, 9999]);
    });

    /**
     * 测试零输入情况
     * @description 验证方法对零的处理
     */
    test('should handle zero input', () => {
        const multiply = new Multiply(0, 10);
        expect(multiply['number_layer']).toEqual([0, 10, 0, 0]);
    });

    /**
     * 测试负数输入情况
     * @description 验证方法对负数的处理（如果支持）
     */
    test('should handle negative inputs', () => {
        const multiply = new Multiply(-5, 10);
        expect(multiply['number_layer']).toEqual([-5, 10, 0, -5, -50]);
    });
});