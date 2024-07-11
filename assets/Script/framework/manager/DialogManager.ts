
export default class DialogManager {

    private createDialogs = {}; //是否创建

    private loaderDialogPrefabs = {};


    //初始化
    public init() {
        this.createDialogs = {};
        this.loaderDialogPrefabs = {};
    }

    //创建dialog
    public createDialog(dialogRes: string, params, cb: Function, dialogkey) {
        console.log("create dialog", dialogRes);
        //url
        let fileName = dialogRes;
        //解析
        let arr = dialogRes.split("/");
        let dialogType = arr[arr.length - 1];
        dialogkey = dialogkey || dialogRes;

        //验证数据开始
        if (!dialogRes) {
            cc.error("Create Dialog failed: dialog type is null");
            return;
        }

        let createDialogs = this.createDialogs;

        //判断是否创建
        let createDialog = createDialogs[dialogkey] || null;

        if (!!createDialog) {
            cc.error("Create dialog is exist");
            createDialog.zIndex += 5;
        } else {
            let loaderDialogPrefabs = this.loaderDialogPrefabs;
            if (!!loaderDialogPrefabs[dialogRes]) {
                createDialog = cc.instantiate(loaderDialogPrefabs[dialogRes]);
                createDialogs[dialogkey] = createDialog;
                createDialog.getComponent(dialogType).dialogParameters = params || {};
                createDialog.getComponent(dialogType).isDestroy = false;
            }
        }
    }
}
