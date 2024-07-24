import RoomProto from "../../../framework/utils/api/RoomProto";
import Gloab from "../../../Gloab";
import SZProto from "../SZProto";

/**
 * 三张模型类
 */
export default class SZModel {


    private static gameInited;
    private static roomUserInfoArr;
    private static gameRule;
    private static roomID;
    private static roomCreatorInfo;
    private static gameStatus;
    private static gameStarted;
    private static tick;
    private static bankerChairID;
    private static pourScores;
    private static handCards;
    private static curBureau;
    private static maxBureau;
    private static chairCount;
    private static lookCards;
    private static loser;
    private static round;
    private static curChairID;
    private static curScore;
    private static result;
    private static curScores;
    private static userStatusArray;
    private static userTrustArray;
    private static askForExitArr;
    private static myUid;

    private static myChairID;

    private static roomDismissReason;

    public static init() {
        console.log("SZModel init");

        Gloab.MessageCallback.addListener("RoomMessagePush", this);
        Gloab.MessageCallback.addListener("GameMessagePush", this);
    }

    public static onDestroy() {
        console.log("SZModel onDestroy");
        Gloab.MessageCallback.removeListener("RoomMessagePush", this);
        Gloab.MessageCallback.removeListener("GameMessagePush", this);
    }

    /**
     * 设置房间信息
     * @param msg 
     */
    public static setEntryRoomData(msg) {
        this.gameInited = true;
        this.roomUserInfoArr = msg.roomUserInfoArr;
        this.gameRule = msg.gameRule;
        this.roomID = msg.roomID;
        this.roomCreatorInfo = msg.roomCreatorInfo;

        this.gameStatus = msg.gameData.gameStatus;
        this.gameStarted = msg.gameData.gameStarted;
        this.tick = msg.gameData.tick;
        this.bankerChairID = msg.gameData.bankerChairID;
        this.pourScores = msg.gameData.pourScores;
        this.handCards = msg.gameData.handCards;
        this.curBureau = msg.gameData.curBureau;
        this.maxBureau = msg.gameData.maxBureau;
        this.chairCount = msg.gameData.chairCount;
        this.lookCards = msg.gameData.lookCards;
        this.loser = msg.gameData.loser;
        this.round = msg.gameData.round;
        this.curChairID = msg.gameData.curChairID;
        this.curScore = msg.gameData.curScore;
        this.result = msg.gameData.result;
        this.curScores = msg.gameData.curScores;
        this.userStatusArray = msg.gameData.userStatusArray;
        this.userTrustArray = msg.gameData.userTrustArray;
        this.askForExitArr = null;
        this.myUid = Gloab.UserModel.getProperties("uid");
    }

    /**
     * 获得房间信息
     * @returns 
     */
    public static getRoomData() {
        var msg = {
            gameInited: true,
            roomUserInfoArr: this.roomUserInfoArr,
            gameRule: this.gameRule,
            roomID: this.roomID,
            roomCreatorInfo: this.roomCreatorInfo,
            gameData: {
                gameStatus: this.gameStatus,
                gameStarted: this.gameStarted,
                tick: this.tick,
                bankerChairID: this.bankerChairID,
                pourScores: this.pourScores,
                handCards: this.handCards,
                curBureau: this.curBureau,
                maxBureau: this.maxBureau,
                chairCount: this.chairCount,
                lookCards: this.lookCards,
                loser: this.loser,
                round: this.round,
                curChairID: this.curChairID,
                curScore: this.curScore,
                result: this.result,
                curScores: this.curScores,
                userStatusArray: this.userStatusArray,
                userTrustArray: this.userTrustArray,
                askForExitArr: this.askForExitArr,
                myUid: Gloab.UserModel.getProperties("uid"),
            },
        };
        return msg;
    }

    /**
     * 收到自定义事件
     * @param router 
     * @param msg 
     */
    public static messageCallbackHandler(router, msg) {
        if (router === 'RoomMessagePush') {
            if (msg.type === RoomProto.GET_ROOM_SCENE_INFO_PUSH) {
                this.setEntryRoomData(msg.data);
            }
            else if (msg.type === RoomProto.OTHER_USER_ENTRY_ROOM_PUSH) {
                if (!this.gameInited) { return; }
                this.addUser(msg.data.roomUserInfo);
            }
            else if (msg.type === RoomProto.USER_LEAVE_ROOM_PUSH) {
                if (!this.gameInited) { return; }
                this.delUser(msg.data.roomUserInfo.chairID);
                if (msg.data.roomUserInfo.chairID === this.getMyChairID()) {
                    this.onDestroy();
                }
            }
            else if (msg.type === RoomProto.USER_READY_PUSH) {
                if (!this.gameInited) { return; }
                this.userReady(msg.data.chairID);
            }
            else if (msg.type === RoomProto.ASK_FOR_DISMISS_PUSH) {
                if (!this.gameInited) { return; }
                this.askForExitArr = msg.data.chairIDArr;
                if (msg.data.chairIDArr.indexOf(false) != -1) {
                    this.askForExitArr = null;
                }
            }
            else if (msg.type === RoomProto.ROOM_DISMISS_PUSH) {
                if (!this.gameInited) { return; }
                this.askForExitArr = null;
                this.roomDismissReason = msg.data.reason;
                if (msg.data.reason != Gloab.Enum.gameRoomDismissReason.BUREAU_FINISHED) {
                    this.onDestroy();
                }
            }
            else if (msg.type === RoomProto.USER_CHANGE_SEAT_PUSH) {
                if (!this.gameInited) { return; }
                for (let user of this.roomUserInfoArr) {
                    if (user.userInfo.uid == msg.data.uid) {
                        user.chairID = msg.data.toChairID;
                    }
                }
            }
            else if (msg.type === RoomProto.ROOM_USER_INFO_CHANGE_PUSH) {
                if (!this.gameInited) { return; }
                for (let i = 0; i < this.roomUserInfoArr.length; ++i) {
                    if (this.roomUserInfoArr[i].userInfo.uid == msg.data.changeInfo.uid) {
                        for (let key in msg.data.changeInfo) {
                            this.roomUserInfoArr[i].userInfo[key] = msg.data.changeInfo[key];
                        }
                    }
                }
            }
            else if (msg.type === RoomProto.USER_OFF_LINE_PUSH) {
                if (!this.gameInited) { return; }
                let user = this.getUserByChairID(msg.data.chairID);
                if (user) {
                    user.userStatus |= RoomProto.userStatusEnum.OFFLINE;
                }
            }
        }
        else if (router === 'GameMessagePush') {
            if (!this.gameInited) { return; }
            if (msg.type === SZProto.GAME_BUREAU_PUSH) {
                this.curBureau = msg.data.curBureau;
            }
            else if (msg.type === SZProto.GAME_ROUND_PUSH) {
                this.round = msg.data.round;
            }
            else if (msg.type === SZProto.GAME_POUR_SCORE_PUSH) {
                this.pourScore(msg.data.chairID, msg.data.score);
            }
            else if (msg.type === SZProto.GAME_LOOK_PUSH) {
                if (msg.data.cards) {
                    this.handCards[msg.data.chairID] = msg.data.cards;
                }
                this.lookCards[msg.data.chairID] = 1;
                this.userStatusArray[msg.data.chairID] |= SZProto.userStatus.LOOK;
            }
            else if (msg.type === SZProto.GAME_RESULT_PUSH) {
                this.result = msg.data.result;
                this.handCards = this.result.handCards;
                this.curScores = this.result.curScores;
                this.tick = 0;
            }
            else if (msg.type === SZProto.GAME_STATUS_PUSH) {
                this.tick = msg.data.tick;
                this.gameStatus = msg.data.gameStatus;
                this.gameStarted = true;
                if (this.gameStatus == SZProto.gameStatus.NONE) {
                    for (let user of this.roomUserInfoArr) {
                        user.userStatus &= ~RoomProto.userStatusEnum.READY;
                    }
                    this.result = null;
                    this.handCards = [null, null, null, null, null, null, null, null, null, null];
                    this.pourScores = [null, null, null, null, null, null, null, null, null, null];
                    this.lookCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.userStatusArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.round = 0;
                }
            }
            else if (msg.type === SZProto.GAME_BANKER_PUSH) {
                this.bankerChairID = msg.data.bankerChairID;
            }
            else if (msg.type === SZProto.GAME_SEND_CARDS_PUSH) {
                this.handCards = msg.data.handCards;
            }
            else if (msg.type === SZProto.GAME_ABANDON_PUSH) {
                this.loser.push(msg.data.chairID);
                this.userStatusArray[msg.data.chairID] = msg.data.userStatus;
            }
            else if (msg.type === SZProto.GAME_COMPARE_PUSH) {
                this.loser.push(msg.data.loseChairID);
                this.userStatusArray[msg.data.loseChairID] |= SZProto.userStatus.LOSE;
                this.userStatusArray[msg.data.winChairID] |= SZProto.userStatus.WIN;
            }
            else if (msg.type === SZProto.GAME_TURN_PUSH) {
                this.curChairID = msg.data.curChairID;
                this.curScore = msg.data.curScore;
            }
            else if (msg.type === SZProto.GAME_TRUST_PUSH) {
                this.userTrustArray[msg.data.chairID] = msg.data.trust;
            }
        }
    }

    public static getGameInited() {
        return this.gameInited;
    };

    public static setGameInited(value) {
        this.gameInited = value;
    };

    public static getRoomCreatorChairID() {
        for (let user of this.roomUserInfoArr) {
            if (user.userInfo.uid == this.roomCreatorInfo.uid) {
                return user.chairID;
            }
        }
        return null;
    };

    public static getGameType() {
        return this.gameRule.gameFrameType;
    };

    public static getGameStarted() {
        return this.gameStarted;
    };

    public static getRoomID = function () {
        return this.roomID;
    };

    public static getCurBureau = function () {
        return this.curBureau;
    };

    public static getMaxBureau = function () {
        return this.maxBureau;
    };

    public static getCurRound() {
        return this.round;
    };

    public static getMaxRound() {
        return [0, 10, 15, 20][this.gameRule.roundType];
    };

    public static getCurScore() {
        return this.curScore;
    };

    public static getCurChairID() {
        return this.curChairID;
    };

    public static pourScore = function (chairID, score) {
        if (!this.pourScores[chairID]) {
            this.pourScores[chairID] = [];
        }
        this.pourScores[chairID].push(score);
    };

    public static userReady = function (chairID) {
        let user = this.getUserByChairID(chairID);
        if (user) {
            user.userStatus |= RoomProto.userStatusEnum.READY;
            user.userStatus |= RoomProto.userStatusEnum.DISMISS;
        }
    };

    public static getGameRule = function () {
        return this.gameRule;
    };

    public static getGameStatus = function () {
        return this.gameStatus;
    };

    public static getTick = function () {
        return this.tick;
    };

    public static subTick = function (dt) {
        this.tick -= dt;
    };

    public static setTick = function (tick) {
        this.tick = tick;
    };

    public static getBankerChairID = function () {
        return this.bankerChairID;
    };

    public static getChairCount = function () {
        return this.gameRule.maxPlayerCount;
    };

    public static getMyChairID = function () {
        for (let user of this.roomUserInfoArr) {
            if (user.userInfo.uid == this.myUid) {
                this.myChairID = user.chairID;
            }
        }
        return this.myChairID;
    };

    public static getUserByChairID = function (chairID) {
        for (let user of this.roomUserInfoArr) {
            if (user.chairID == chairID) {
                return user;
            }
        }
        return null;
    };

    public static addUser = function (user) {
        for (var i = 0; i < this.roomUserInfoArr.length; ++i) {
            if (this.roomUserInfoArr[i].chairID === user.chairID) {
                this.roomUserInfoArr.splice(i, 1);
            }
        }
        this.roomUserInfoArr.push(user);
    };

    public static delUser = function (chairID) {
        for (let i = 0; i < this.roomUserInfoArr.length; ++i) {
            if (this.roomUserInfoArr[i].chairID == chairID) {
                this.roomUserInfoArr.splice(i, 1);
                break;
            }
        }
    };

    public static getPourScoreByChairID = function (chairID) {
        let scores = 0;
        if (!this.pourScores[chairID]) {
            this.pourScores[chairID] = [];
        }
        for (let score of this.pourScores[chairID]) {
            scores += score;
        }
        return scores;
    };

    public static getPourScores = function () {
        return this.pourScores;
    };

    public static getHandCardsByChairID = function (chairID) {
        return this.handCards[chairID] || null;
    };

    public static getResult = function () {
        return this.result;
    };

    public static getHandCards = function () {
        return this.handCards;
    };

    public static getIsPlayingByChairID = function (chairID) {
        let user = this.getUserByChairID(chairID);
        if (user && ((user.userStatus & RoomProto.userStatusEnum.READY) > 0 || (user.userStatus & RoomProto.userStatusEnum.PLAYING) > 0)) {
            return true;
        }
        return false;
    };

    public static getPlayingUserCount = function () {
        let count = 0;
        for (let user of this.roomUserInfoArr) {
            if (user && ((user.userStatus & RoomProto.userStatusEnum.READY) > 0 || (user.userStatus & RoomProto.userStatusEnum.PLAYING) > 0)) {
                ++count;
            }
        }
        return count;
    };

    public static getUserStatusByChairID = function (chairID) {
        return this.userStatusArray[chairID];
    };

    public static getCanCompareChairIDs = function () {
        let array = [];
        for (let user of this.roomUserInfoArr) {
            let userStatus = this.userStatusArray[user.chairID];
            if (((user.userStatus & RoomProto.userStatusEnum.READY) > 0 || (user.userStatus & RoomProto.userStatusEnum.PLAYING) > 0)) {
                if ((userStatus & SZProto.userStatus.ABANDON) == 0 && (userStatus & SZProto.userStatus.LOSE) == 0) {
                    array.push(user.chairID);
                }
            }
        }
        return array;
    };

    public static getTrustByChairID = function (chairID) {
        return this.userTrustArray[chairID];
    };

    public static getAddScores = function () {
        return this.gameRule.addScores;
    };

    public static getCurScoreByChairID = function (chairID) {
        let user = this.getUserByChairID(chairID);
        if (!user) { return 0; }
        if (this.isUnionCreate()) {
            return Math.floor(user.userInfo.score - this.getPourScoreByChairID(chairID));
        }
        else {
            return Math.floor(user.userInfo.score);
        }
    };

    public static getRoomCreator = function () {
        return this.roomCreatorInfo;
    };

    public static isUnionCreate = function () {
        return (this.roomCreatorInfo && this.roomCreatorInfo.creatorType == Gloab.Enum.roomCreatorType.UNION_CREATE);
    };

    public static getLookCardByChairID = function (chairID) {
        return this.lookCards[chairID];
    };

    public static getMyUid = function () {
        return this.myUid;
    };

    public static getRoomDismissReason = function () {
        return this.roomDismissReason;
    };

    public static isDismissing = function () {
        return !!this.askForExitArr;
    };
}
