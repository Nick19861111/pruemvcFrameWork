import Gloab from "../../Gloab";

/**
 * http的相关操作
 */
export default class HttpManager {

    /**
    * post的方式
    * @param url       post的url 
    * @param param     json对象
    * @param callback  返回函数
    * @returns 
    */
    public POST(url, param: object = {}, callback) {
        // url = HttpUtil.baseUrl + url;
        var xhr = cc.loader.getXMLHttpRequest();
        let dataStr = '';
        Object.keys(param).forEach(key => {
            dataStr += key + '=' + encodeURIComponent(param[key]) + '&';
        })
        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) { // 请求完成
                let response = xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 300) { // 请求成功
                    try {
                        // 尝试解析 JSON 响应
                        let jsonResponse = JSON.parse(response);
                        callback(true, jsonResponse);
                    } catch (e) {
                        // JSON 解析失败
                        callback(false, "Response parsing error: " + e.message);
                    }
                } else { // 请求失败
                    callback(false, JSON.stringify({ code: Gloab.Code.FAIL }));
                    //Gloab.Utils.invokeCallback(callback, 1);
                }
            }
        };

        //处理请求错误
        xhr.onerror = function () {
            callback(false, JSON.stringify({ code: Gloab.Code.FAIL }));
            //Gloab.Utils.invokeCallback(callback, 1);
        }

        xhr.ontimeout = function () {
            callback(false, JSON.stringify({ code: Gloab.Code.FAIL }));
            console.log("请求超时");
            //Gloab.Utils.invokeCallback(callback, 1);
        }

        xhr.timeout = 5000;

        xhr.send(JSON.stringify(param));
        return xhr;
    }

    /**
     * get的方式
     * @param url           请求地址 
     * @param callback      返回的函数
     */
    public sendHttpGet(url: string, callback: (statusCode: number, resp: string, respText: string) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let resp: string = xhr.responseText;
                callback && callback(xhr.status, resp, xhr.responseText);
            }
        };
        xhr.onerror = function (err) {
            callback && callback(-1, "", "Network error");
        };
        xhr.send();
    }
}
