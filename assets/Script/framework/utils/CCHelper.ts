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

    //跨域图片或者本地图片
    updateSpriteFrame(imgUrl, target_, cb?: Function) {
        let target = target_;

        cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame) {
            if (!!err) {
                console.error("load local img fail", imgUrl);
                Gloab.Utils.invokeCallback(cb, err);
            } else {
                if (target.isValid) {
                    target.spriteFrame = spriteFrame;
                    Gloab.Utils.invokeCallback(cb);
                }
            }
        });
    }
}
