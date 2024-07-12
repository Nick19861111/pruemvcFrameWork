
type FuncWithoutParamz = (funYesContinue: () => void) => void

/**
 * 队列的类
 */
export default class Async {
    private constructor() { } //不允许创建

    static serial(...oFunQ: Array<FuncWithoutParamz>): void {
        //如果不成立条件
        if (!oFunQ || oFunQ.length <= 0) {
            return;
        }

        //循环函数
        let funYesContinue = () => {
            if (null == oFunQ || oFunQ.length <= 0) {
                return;
            }

            //执行一次把最上面的进行清除
            let funCurr = oFunQ.shift();
            if (!funCurr) {
                funYesContinue();
                return;
            }

            funCurr(funYesContinue);
        };
        funYesContinue();
    }
}
