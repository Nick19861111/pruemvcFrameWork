import HallApi from "./api/HallApi";

/**
 * 根据不通的api进行选择
 */
export default class Api {

    public hallApi: HallApi = null; //大厅的相关操作

    constructor() {
        this.hallApi = new HallApi();
    }
}
