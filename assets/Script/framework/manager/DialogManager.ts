import Gloab from "../../Gloab";
import LoadingCircieDialog from "../components/LoadingCircieDialog";
import PopDialog from "../components/PopDialog";
import TipDialog from "../components/TipDialog";

export default class DialogManager {

    private createDialogs = {}; //是否创建

    private loadedDialogPrefabs = {};

    private createdDialogs = {};

    private dialogNode: cc.Node = null;//弹窗的节点

    private tipDialog: TipDialog = null; //弹出文字的类

    private fontNode: cc.Node = null;   //弹窗的大小

    private popDialog: PopDialog = null; //弹出对话框出现

    private loadingCircleDialog: LoadingCircieDialog = null;
    //初始化
    public init(rootNode) {
        this.createDialogs = {};
        this.loadedDialogPrefabs = {};
        this.dialogNode = cc.find("Canvas/dialogNode");

        this.fontNode = rootNode.getChildByName("fontNode");
        this.fontNode.width = rootNode.width;
        this.fontNode.height = rootNode.height;

        //弹出文字相关
        this.tipDialog = this.fontNode.getChildByName("TipDilog").getComponent(TipDialog);
        //弹出对话框
        this.popDialog = this.fontNode.getChildByName("PopDialog").getComponent(PopDialog);
        //弹出loading界面控制类
        this.loadingCircleDialog = this.fontNode.getChildByName("LoadingCircieDialog").getComponent(LoadingCircieDialog);
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

    /**
     * 删除dialog
     * @param dialogRes 删除的dialog类型
     * @param isClearPrefabs 是否清除dialog对应的prefab
     */
    destroyDialog(dialogRes, isClearPrefabs) {
        isClearPrefabs = isClearPrefabs || false;
        let createdDialogs = this.createdDialogs;
        let dialog = null;
        let dialogController = null;
        if (typeof (dialogRes) === 'object') {
            dialog = dialogRes.node;
            dialogController = dialogRes;

            for (let key in createdDialogs) {
                if (createdDialogs.hasOwnProperty(key)) {
                    if (createdDialogs[key] === dialog) {
                        dialogRes = key;
                        break;
                    }
                }
            }
        } else {
            dialog = createdDialogs[dialogRes] || null;

            let arr = dialogRes.split('/');
            let dialogType = arr[arr.length - 1];

            if (dialog) {
                dialogController = dialog.getComponent(dialogType);
            }
        }
        if (!dialog) {
            cc.error('destroy dialog not exist:' + dialogRes);
        }
        else {
            let dialogActionWidgetCtrl = dialog.getComponent("DialogActionWidgetCtrl");
            if (!!dialogActionWidgetCtrl) {
                dialogActionWidgetCtrl.dialogOut(function () {
                    // 删除界面
                    dialog.destroy();
                    dialogController.isDestroy = true;
                    // 移除属性
                    delete createdDialogs[dialogRes];
                    if (isClearPrefabs) {
                        cc.loader.releaseRes(dialogRes);
                        delete this.loadedDialogPrefabs[dialogRes];
                    }
                    console.log('destroy dialog succeed', dialogRes);
                }.bind(this))
            } else {
                // 删除界面
                dialog.destroy();
                dialogController.isDestroy = true;
                // 移除属性
                delete createdDialogs[dialogRes];
                if (isClearPrefabs) {
                    cc.loader.releaseRes(dialogRes);
                    delete this.loadedDialogPrefabs[dialogRes];
                }
                console.log('destroy dialog succeed', dialogRes);
            }
        }
    };

    /**
     * 删除所有
     * @param exceptArr 
     */
    destroyAllDialog(exceptArr) {
        console.log('destroyAllDialog');
        for (let key in this.createdDialogs) {
            if (this.createdDialogs.hasOwnProperty(key)) {
                if (!!exceptArr && exceptArr.indexOf(key) >= 0) continue;
                let dialog = this.createdDialogs[key];
                // 删除界面
                dialog.destroy();
                let arr = key.split('/');
                let dialogType = arr[arr.length - 1];
                dialog.getComponent(dialogType).isDestroy = true;
                // 移除属性
                delete this.createdDialogs[key];
            }
        }
    };


    /**
     * 添加文字显示
     * @param content 
     */
    addTipDialog(content) {
        this.tipDialog.addTip(content);
    }

    /**
     * 弹出对话框
     * @param content 
     */
    addPopDialog(content, cbOK, cbCancel, isRotate) {
        this.popDialog.node.active = true;
        this.popDialog.addPopDilog(content, cbOK, cbCancel, isRotate);
    }

    /**
     * 添加loading
     */
    addLoadingCircle(delay) {
        this.loadingCircleDialog.addLoadingCircle(delay);
    }

    removeLoadingCircle() {
        this.loadingCircleDialog.removeLoadingCirle();
    }
}
