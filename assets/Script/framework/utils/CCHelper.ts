import Gloab from "../../Gloab";

/**
 * 常见的助手
 */
export default class CCHelper {

    /**
     * 加载资源
     * @param dirArr 
     * @param cb 
     */
    loadRes(dirArr, cb) {
        let loadingCount = 0;
        for (let i = 0; i < dirArr.length; i++) {
            cc.loader.loadResDir(dirArr[i], function (err) {
                loadingCount++;
                if (loadingCount >= dirArr.length) {
                    Gloab.Utils.invokeCallback(cb, err);
                }
            }.bind(this));
        }
    }
}
