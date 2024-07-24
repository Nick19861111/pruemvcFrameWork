/**
 * 结构常量
 */
export default class enumeration {

    //游戏类型
    public gameType = {
        SZ: 1,//拼三张
        NN: 2,
        PDK: 3,
        SG: 4,
        ZNMJ: 5,
        DGN: 8
    }

    // 房间类型
    roomType = {
        NONE: 0,
        NORMAL: 1,                  // 匹配类型
        CONTINUE: 2,                // 持续房间(类似捕鱼)
        HUNDRED: 3                  // 百人房间
    };

    //房间费用支付方式
    roomPayType = {
        AAZHIFU: 1,                 //AA
        YINGJIAZHIFU: 2,            //一家支付
        WOZHIFU: 3,                 //我支付
    };

    //房间解散原因
    gameRoomDismissReason = {
        NONE: 0,                     // 未知原因
        BUREAU_FINISHED: 1,          // 完成所有局数
        USER_DISMISS: 2,              // 用户解散
        UNION_OWNER_DISMISS: 3,      // 盟主解散
    };

    //房间创建类型
    roomCreatorType = {
        NONE: 0,
        USER_CREATE: 1,             // 玩家创建
        UNION_CREATE: 2             // 联盟创建
    };
}
