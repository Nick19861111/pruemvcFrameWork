import RoomProto from "../../../framework/utils/api/RoomProto";
import Gloab from "../../../Gloab";

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
        if (router == "RoomMessagePush") {
            if (msg.type == RoomProto.GET_ROOM_SCENE_INFO_PUSH) {
                this.setEntryRoomData(msg.data);
            }
            else if (msg.type === RoomProto.OTHER_USER_ENTRY_ROOM_PUSH) {
                //进入房间推送
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

            }
            else if (msg.type === RoomProto.ASK_FOR_DISMISS_PUSH) {

            }
            else if (msg.type === RoomProto.ROOM_DISMISS_PUSH) {

            }
            else if (msg.type === RoomProto.USER_CHANGE_SEAT_PUSH) {

            }
            else if (msg.type === RoomProto.ROOM_USER_INFO_CHANGE_PUSH) {

            }
            else if (msg.type === RoomProto.USER_OFF_LINE_PUSH) {

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

    private static addUser(user) {
        for (var i = 0; i < this.roomUserInfoArr.length; ++i) {
            if (this.roomUserInfoArr[i].chairID === user.chairID) {
                this.roomUserInfoArr.splice(i, 1);
            }
        }
        this.roomUserInfoArr.push(user);
    };

    /**
     * 删除椅子上的用户信息
     * @param chairID 
     */
    private static delUser(chairID) {
        for (let i = 0; i < this.roomUserInfoArr.length; ++i) {
            if (this.roomUserInfoArr[i].chairID == chairID) {
                this.roomUserInfoArr.splice(i, 1);
                break;
            }
        }
    };

    /**
     * 获得我当前的作为信息
     * @returns 
     */
    private static getMyChairID() {
        for (let user of this.roomUserInfoArr) {
            if (user.userInfo.uid == this.myUid) {
                this.myChairID = user.chairID;
            }
        }
        return this.myChairID;
    };
}
