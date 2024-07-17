import Gloab from "../../../Gloab";

/**
 * 用户相关的操作在这个地方
 */
export default class AccoutApi {

    /**
     * 重新链接
     */
    public recoonectRequest(token, cbSuccess, cbFail) {
        let route = "/reconnection";
        let requestData = {
            token: token
        }

        Gloab.Http.POST("http://127.0.0.1:13000" + route, requestData, function (response, data) {
            if (data.code == 200) {
                cbSuccess();
            }
        }.bind(this));
    }
}
