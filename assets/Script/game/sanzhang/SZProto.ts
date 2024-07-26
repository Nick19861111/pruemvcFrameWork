
/**
 * 炸金花的协议号相关
 */
export default class SZProto {
    public static GAME_STATUS_PUSH = 401; //游戏推动

    public static GAME_SEND_CARDS_PUSH = 402; //发牌设置

    public static GAME_LOOK_NOTIFY = 303; //看牌请求
    public static GAME_LOOK_PUSH = 403;

    public static GAME_POUR_SCORE_NOTIFY = 304; /* 下分请求 */
    public static GAME_POUR_SCORE_PUSH = 404;

    public static GAME_COMPARE_NOTIFY = 305; /* 比牌请求 */
    public static GAME_COMPARE_PUSH = 405;

    public static GAME_TURN_PUSH = 406; //操作推送

    public static GAME_RESULT_PUSH = 407; //结果推送

    public static GAME_END_PUSH = 409; //结果推送

    public static GAME_CHAT_NOTIFY = 310; //聊天
    public static GAME_CHAT_PUSH = 410;

    public static GAME_BUREAU_PUSH = 411;//局数推送

    public static GAME_ABANDON_NOTIFY = 312; /* 弃牌请求 */
    public static GAME_ABANDON_PUSH = 412;

    public static GAME_ROUND_PUSH = 413; /* 轮数推送 */
    public static GAME_BANKER_PUSH = 414; /* 庄家推送 */

    public static GAME_TRUST_NOTIFY = 315; /* 托管 */
    public static GAME_TRUST_PUSH = 415; /* 托管 */

    public static GAME_REVIEW_NOTIFY = 316; /* 牌面回顾 */
    public static GAME_REVIEW_PUSH = 416;

    public static gameStatus = {
        NONE: 0, /* 等待操作 */
        SEND_CARDS: 1, /* 发牌中 */
        POUR_SCORE: 2, /* 下分中 */
        RESULT: 4, /* 显示结果 */
        SHOW_CARDS: 3 /**显示牌 */
    };

    public static gameStatusTm = {
        NONE: 0, /* 等待操作 */
        SEND_CARDS: 1, /* 发牌中 */
        POUR_SCORE: 15, /* 下分中 */
        RESULT: 5, /* 显示结果 */
    };

    public static gameType = {
        NONE: 0, /* 不闷 */
        MEN1: 1, /* 闷一轮 */
        MEN2: 2, /* 闷二轮 */
        MEN3: 3, /* 闷三轮 */
    };

    public static roundType = { /* 轮数 */
        ROUND10: 1, /* 10轮 */
        ROUND15: 2, /* 15轮 */
        ROUND20: 3, /* 20轮 */
    };

    public static cardsType = {
        DANZHANG: 1, /* 单牌 */
        DUIZI: 2, /* 对子 */
        SHUNZI: 3, /* 顺子 */
        JINHUA: 4, /* 金花 */
        SHUNJIN: 5, /* 顺金 */
        BAOZI: 6, /* 豹子 */
    };

    public static userStatus = { /* 玩家状态 */
        NONE: 0,
        ABANDON: 1,  /* 放弃 */
        TIMEOUTABANDON: 2,  /* 超时放弃 */
        LOOK: 4,  /* 看牌 */
        LOSE: 8,  /* 比牌失败 */
        WIN: 16, /* 胜利 */
    };

    /*
    * 状态推送
    */
    public static gameStatusPush(gameStatus, tick) {
        return {
            type: this.GAME_STATUS_PUSH,
            data: {
                gameStatus: gameStatus,
                tick: tick,
            },
        };
    };

    public static gameSendCardPush(handCards) {
        return {
            type: this.GAME_SEND_CARDS_PUSH,
            data: {
                handCards: handCards,
            },
        };
    };

    /*
     * 看牌
     */
    public static gameLookCardsNotify(cuopai?) {
        return {
            type: this.GAME_LOOK_NOTIFY,
            data: {
                cuopai: cuopai,
            },
        };
    };

    public static gameLookCardsPush(chairID, cards, cuopai) {
        return {
            type: this.GAME_LOOK_PUSH,
            data: {
                chairID: chairID,
                cards: cards,
                cuopai: cuopai,
            },
        };
    };

    /*
     * 下分
     * @param Number score 分数
     * @param Number type 类型 1跟注 2加注 0其他方式（底或比牌）
     */
    public static gamePourScoreNotify(score, type) {
        return {
            type: this.GAME_POUR_SCORE_NOTIFY,
            data: {
                score: score,
                type: type,
            },
        };
    };

    public static gamePourScorePush(chairID, score, chairScore, scores, type) {
        return {
            type: this.GAME_POUR_SCORE_PUSH,
            data: {
                chairID: chairID,
                score: score,
                chairScore: chairScore,
                scores: scores,
                type: type,
            },
        };
    };

    /*
     * 可压分推送
     */
    public static gameCanPourScorePush() {

    };

    /*
     * 比牌
     * @param chairID Number 比牌的chairID
     */
    public static gameCompareNotify(chairID) {

        return {
            type: this.GAME_COMPARE_NOTIFY,
            data: {
                chairID: chairID,
            },
        };
    };

    public static gameComparePush(fromChairID, toChairID, winChairID, loseChairID) {
        return {
            type: this.GAME_COMPARE_PUSH,
            data: {
                fromChairID: fromChairID,
                toChairID: toChairID,
                winChairID: winChairID,
                loseChairID: loseChairID,
            },
        };
    };

    public static gameResultPush(result) {
        return {
            type: this.GAME_RESULT_PUSH,
            data: {
                result: result,
            },
        };
    };

    public static gameChatNotify(type, msg, recipientID) {
        return {
            type: this.GAME_CHAT_NOTIFY,
            data: {
                type: type,
                msg: msg,
                recipientID: recipientID,
            },
        };
    };

    public static gameChatPush(chairID, type, msg, recipientID) {
        return {
            type: this.GAME_CHAT_PUSH,
            data: {
                chairID: chairID,
                type: type,
                msg: msg,
                recipientID: recipientID,
            },
        };
    };

    public static gameBureauPush(curBureau) {
        return {
            type: this.GAME_BUREAU_PUSH,
            data: {
                curBureau: curBureau,
            },
        };
    };

    /*
     * @param Number type 1主动弃牌 0其他
     */
    public static gameAbandonNotify(type) {
        return {
            type: this.GAME_ABANDON_NOTIFY,
            data: {
                type: type,
            },
        };
    };

    public static gameAbandonPush(chairID, userStatus, type) {
        return {
            type: this.GAME_ABANDON_PUSH,
            data: {
                chairID: chairID,
                userStatus: userStatus,
                type: type,
            },
        };
    };

    public static gameRoundPush(round) {
        return {
            type: this.GAME_ROUND_PUSH,
            data: {
                round: round,
            },
        };
    };

    public static gameBankerPush(bankerChairID) {
        return {
            type: this.GAME_BANKER_PUSH,
            data: {
                bankerChairID: bankerChairID,
            },
        };
    };

    public static gameTurnPush(curChairID, curScore) {
        return {
            type: this.GAME_TURN_PUSH,
            data: {
                curChairID: curChairID,
                curScore: curScore,
            },
        };
    };

    public static gameEndPush(result, winMost, loseMost, creater) {
        return {
            type: this.GAME_END_PUSH,
            data: {
                result: result,
                winMost: winMost,
                loseMost: loseMost,
                creater: creater,
            },
        };
    };

    public static gameTrushNotify(trust) {
        return {
            type: this.GAME_TRUST_NOTIFY,
            data: {
                trust: trust,
            },
        };
    };

    public static gameTrushPush(chairID, trust) {
        return {
            type: this.GAME_TRUST_PUSH,
            data: {
                chairID: chairID,
                trust: trust,
            },
        };
    };

    public static gameReviewNotify() {
        return {
            type: this.GAME_REVIEW_NOTIFY,
            data: {
            },
        };
    };

    public static gameReviewPush(list) {
        return {
            type: this.GAME_REVIEW_PUSH,
            data: {
                list: list,
            },
        };
    };

}
