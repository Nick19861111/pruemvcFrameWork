// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html


export default class utils {

    /**
     * 是否返回函数
     * @param cb 返回参数
     */
    public invokeCallback(cb) {
        //其中！！代表不能为null 和undefine操作
        if (!!cb && typeof cb === 'function') {
            cb.apply(null, Array.prototype.slice.call(arguments, 1));
        }
    }

    /**
     * 生成随机字符串
     * @param len 
     */
    public randomString(len) {
        len = len || 16;
        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        let maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    /**
     * 获得相关的大小点滴
     * @param Min 小数据
     * @param Max 大数据
     */
    public getRandomNum(Min, Max) {
        let Range = Max - Min;
        let Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    /**
    * 讲输入的数字格式化每个3位增加一个逗号的输出
    * @param num 数字
    * @returns 
    */
   public formatNumberWithCommas(num: number): string {
       const numStr = num.toString();

       const formattedStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

       return formattedStr;
   }
}
