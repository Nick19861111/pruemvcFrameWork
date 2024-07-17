/**
 * 配置的相关数据配置表
 */
export default class ConfigModel {

    private Data: any = {}; //数据
    /**
     * 初始化的方法
     */
    public init(datas) {
        this.setData(datas)
    }

    /**
     * 获得数据
     */
    public getData(key) {
        return this.Data[key]
    }

    /**
     * 设置数据
     */
    public setData(datas) {
        for (let key in datas) {
            if (datas.hasOwnProperty(key)) {
                this.Data[key] = datas[key];
            }
        }
    }
}
