import Gloab from "../../Gloab";

export default class PlanformHelper {

    private GET_LOCATION_CALLBACK = null;
    /**
     * 获得当前的地址经纬度，这个可以通过请求网络获取到，但是这是一个演示
     */
    public getLocation(cb) {
        this.GET_LOCATION_CALLBACK = cb;
        setTimeout(function () {
            this.getLocationFinished(0, JSON.stringify({
                location: "",
                latitude: Gloab.Utils.getRandomNum(10000, 99999) / 1000,
                longitude: Gloab.Utils.getRandomNum(10000, 99999) / 1000,
            }))
        }.bind(this), 100);
    }

    private getLocationFinished(errCode, result) {
        if (!errCode) {
            result = JSON.parse(result);
            Gloab.Utils.invokeCallback(this.GET_LOCATION_CALLBACK, null, {
                location: result.location,
                address: JSON.stringify({
                    x: result.latitude,
                    y: result.longitude
                })
            });
        }
        else {
            Gloab.Utils.invokeCallback(this.GET_LOCATION_CALLBACK, 1);
        }
    }
}
