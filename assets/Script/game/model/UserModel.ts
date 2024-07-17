/**
 * 用户的数据模型
 */
export default class UserModel {

    private data: any = {};
    /**
     * 初始化数据部分
     * @param data 
     */
    public init(data) {
        this.setProperties(data);
    }

    /**
     * 用户相关的数据
     * @param Properties 
     */
    private setProperties(Properties) {
        for (let key in Properties) {
            if (Properties.hasOwnProperty(key)) {
                this.data[key] = Properties[key];
            }
        }
    }

    public getProperties(key) {
        return this.data[key];
    }
}
