import Gloab from "../../Gloab";

export default class DialogManager {

    private createDialogs = {}; //是否创建

    private loadedDialogPrefabs = {};

    private createdDialogs = {};

    private dialogNode:cc.Node = null;//弹窗的节点
    //初始化
    public init() {
        this.createDialogs = {};
        this.loadedDialogPrefabs = {};
        this.dialogNode = cc.find("Canvas/dialogNode");
    }

    /**
     * 创建dialog
     * @param dialogRes dialog种类，必须与prefab和dialog对应的管理js脚本名字相同
     * @param params 创建dialog需要传入的参数
     * @param cb 创建完成的会调
     * @param dialogKey 设置特殊dialogKey，一个界面需要多次创建时所用
     */
    public createDialog(dialogRes: string, params: any, cb?: Function, dialogKey?: string) {
        console.log('create dialog', dialogRes);
        let fileName = dialogRes;
        let arr = dialogRes.split('/');
        let dialogType = arr[arr.length - 1];
        dialogKey = dialogKey || dialogRes;

        if (!dialogRes) {
            Gloab
            cc.error('Create Dialog failed: dialog type is null');
            Gloab.Utils.invokeCallback(cb, Gloab.Code.FAIL);
            return;
        }

        let createdDialogs = this.createdDialogs;
        // 判定是否已创建
        let createDialog = createdDialogs[dialogKey] || null;
        if (!!createDialog) {
            cc.error('Create dialog is exist');
            createDialog.zIndex += 5;
            Gloab.Utils.invokeCallback(cb, null, createDialog);
        }
        else {
            // 加载过则直接创建
            let loadedDialogPrefabs = this.loadedDialogPrefabs;
            if (!!loadedDialogPrefabs[dialogRes]) {
                createDialog = cc.instantiate(loadedDialogPrefabs[dialogRes]);
                createdDialogs[dialogKey] = createDialog;
                createDialog.getComponent(dialogType).dialogParameters = params || {};
                createDialog.getComponent(dialogType).isDestroy = false;
                createDialog.parent = this.dialogNode;
                Gloab.Utils.invokeCallback(cb, null, createDialog);
            } else {
                cc.loader.loadRes(fileName, function (err, data) {
                    if (!!err) {
                        cc.error(err);
                        Gloab.Utils.invokeCallback(cb, err);
                    }
                    else {
                        loadedDialogPrefabs[dialogRes] = data;
                        createDialog = cc.instantiate(data);
                        createdDialogs[dialogKey] = createDialog;
                        let clazz = createDialog.getComponent(dialogType);
                        console.log(clazz);
                        
                        createDialog.getComponent(dialogType).dialogParameters = params || {};
                        createDialog.getComponent(dialogType).isDestroy = false;
                        createDialog.parent = this.dialogNode;
                        Gloab.Utils.invokeCallback(cb, null, createDialog);
                    }
                }.bind(this));
            }
        }
    }
}
