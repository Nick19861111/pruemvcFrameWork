import Gloab from "../../Gloab";


/**
 * 一些常见的常量在此
 */
export default class Constant extends cc.Component {

    // 游戏主界面
    public gameDialogList = [
        { gameType: 3, gameDialog: "Game/PaoDeKuai/PDKMainDialog", loadDirArr: ["Game/PaoDeKuai"] },
        { gameType: 2, gameDialog: "Game/Niuniu/NNMainDialog", loadDirArr: ["Game/Niuniu"] },
        { gameType: 4, gameDialog: "Game/Sangong/SGMainDialog", loadDirArr: ["Game/Sangong"] },
        { gameType: 1, gameDialog: "Game/Sanzhang/SZMainDialog", loadDirArr: ["Game/Sanzhang"] },
        { gameType: 5, gameDialog: "Game/Majiang/MJMainDialog", loadDirArr: ["Game/Majiang"] },
        { gameType: 8, gameDialog: "Game/Dougongniu/DGNMainDialog", loadDirArr: ["Game/Niuniu, Game/Dougongniu"] },
    ]
}
