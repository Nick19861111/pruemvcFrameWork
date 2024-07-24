
/**
 * 房间消息类
 */

export default class RoomProto {

    public static USER_READY_NOTIFY = 301; // 用户准备的通知
    public static USER_READY_PUSH = 401; // 用户准备的推送

    public static OTHER_USER_ENTRY_ROOM_PUSH = 402; // 用户进入房间的推送

    public static USER_LEAVE_ROOM_NOTIFY = 303; // 用户离开房间的通知
    public static USER_LEAVE_ROOM_RESPONSE = 403; // 用户离开房间的回复
    public static USER_LEAVE_ROOM_PUSH = 404; // 用户离开房间推送

    public static ROOM_DISMISS_PUSH = 405; // 房间解散的推送

    public static ROOM_USER_INFO_CHANGE_PUSH = 406; // 房间用户信息变化的推送

    public static USER_CHAT_NOTIFY = 307; // 用户聊天通知
    public static USER_CHAT_PUSH = 407; // 用户聊天推送

    public static USER_OFF_LINE_PUSH = 408; // 用户掉线的推送

    public static ROOM_DRAW_FINISHED_PUSH = 409; // 开设的房间局数用完推送

    public static ROOM_NOTICE_PUSH = 410; // 房间提示推送

    public static GAME_WIN_RATE_NOTIFY = 311;
    public static GAME_WIN_RATE_PUSH = 411;

    public static USER_RECONNECT_NOTIFY = 312; // 玩家断线重连
    public static USER_RECONNECT_PUSH = 412;

    public static ASK_FOR_DISMISS_NOTIFY = 313; // 玩家请求解散房间
    public static ASK_FOR_DISMISS_PUSH = 413;

    public static GAME_END_PUSH = 414; // 最终结果推送

    public static SORRY_I_WILL_WIN_NOTIFY = 415; // 对不起，这局我要赢

    public static ASK_FOR_DISMISS_STATUS_NOTIFY = 316; // 获取当前请求解散状态
    public static ASK_FOR_DISMISS_STATUS_PUSH = 416;

    public static GET_ROOM_SHOW_USER_INFO_NOTIFY = 317; // 获取房间需要显示的玩家信息通知
    public static GET_ROOM_SHOW_USER_INFO_PUSH = 417; // 获取房间需要显示的玩家信息推送

    public static GET_ROOM_SCENE_INFO_NOTIFY = 318; // 获取房间场景信息的通知
    public static GET_ROOM_SCENE_INFO_PUSH = 418; // 获取房间场景信息的推送

    public static GET_ROOM_ONLINE_USER_INFO_NOTIFY = 319; // 获取房间在线用户信息的通知
    public static GET_ROOM_ONLINE_USER_INFO_PUSH = 419; // 获取房间在线用户信息的推送

    public static USER_CHANGE_SEAT_NOTIFY = 320; // 换座通知
    public static USER_CHANGE_SEAT_PUSH = 420;

    public static EXIT_WAIT_SECOND = 30;
    public static NOANSWER_WAIT_SECOND = 120;
    public static ANSWER_EXIT_SECOND = 10;

    public static userStatusEnum = {		// 玩家状态
        NONE: 0,
        READY: 1,
        PLAYING: 2,
        OFFLINE: 4,
        DISMISS: 8, // 是否参与解散 
    };

    selfEntryRoomPush(gameType) {
        return {
            gameType: gameType
        }
    };

    roomMessagePush(msg) {
        return msg;
    };

    public static userChatNotify(toChairID, msg) {
        return {
            type: this.USER_CHAT_NOTIFY,
            data: {
                toChairID: toChairID,
                msg: msg,
            }
        };
    };

    public static userChatPush(fromChairID, toChairID, msg) {
        return {
            type: this.USER_CHAT_PUSH,
            data: {
                fromChairID: fromChairID,
                toChairID: toChairID,
                msg: msg,
            },
        };
    };

    public static userReadyNotify(isReady) {
        return {
            type: this.USER_READY_NOTIFY,
            data: {
                isReady: isReady
            }
        }
    };

    public static userReadyPush(chairID) {
        return {
            type: this.USER_READY_PUSH,
            data: {
                chairID: chairID
            }
        }
    };

    public static otherUserEntryRoomPush(roomUserInfo) {
        return {
            type: this.OTHER_USER_ENTRY_ROOM_PUSH,
            data: {
                roomUserInfo: roomUserInfo
            }
        }
    };

    public static userLeaveRoomNotify() {
        return {
            type: this.USER_LEAVE_ROOM_NOTIFY,
            data: {}
        }
    };

    public static userLeaveRoomResponse(chairID) {
        return {
            type: this.USER_LEAVE_ROOM_RESPONSE,
            data: {
                chairID: chairID
            }
        }
    };

    public static userLeaveRoomPush(roomUserInfo) {
        return {
            type: this.USER_LEAVE_ROOM_PUSH,
            data: {
                roomUserInfo: roomUserInfo
            }
        }
    };

    roomDismissReason = {
        RDR_NONE: 0,	/* 正常结束 */
        RDR_OWENER_ASK: 1,	/* 未开始游戏,房主解散 */
        RDR_USER_ASK: 2,	/* 游戏中,请求结束 */
        RDR_TIME_OUT: 4,	/* 超时未响应 */
        RDR_NOT_ENOUGH_GOLD: 8,  /* 房费不足*/
    };

    public static roomDismissPush(roomDismissReason) {
        return {
            type: this.ROOM_DISMISS_PUSH,
            data: {
                reason: roomDismissReason,
            }
        };
    };

    public static userInfoChangePush(changeInfo) {
        return {
            type: this.ROOM_USER_INFO_CHANGE_PUSH,
            data: {
                changeInfo: changeInfo
            }
        }
    };

    public static userOffLinePush(chairID) {
        return {
            type: this.USER_OFF_LINE_PUSH,
            data: {
                chairID: chairID
            }
        }
    };

    public static roomDrawFinished(allDrawScoreRecord) {
        return {
            type: this.ROOM_DRAW_FINISHED_PUSH,
            data: {
                allDrawScoreRecord: allDrawScoreRecord
            }
        }
    };

    public static getGameWinRateNotifyData(rate) {
        return {
            type: this.GAME_WIN_RATE_NOTIFY,
            data: { rate: rate }
        };
    };

    public static getGameWinRatePushData() {
        return {
            type: this.GAME_WIN_RATE_PUSH,
            data: {}
        }
    };

    // 游戏规则格式
    public static getGameRule(bureau, isOwnerPay, memberCount, diamondCost, gameType, otherRule) {
        return {
            bureau: bureau,				//局数
            isOwnerPay: isOwnerPay,		//是否房主支付
            memberCount: memberCount,	//房间人数
            diamondCost: diamondCost,	//房卡
            gameType: gameType,			//游戏类型
            otherRule: otherRule		//游戏中特殊规则
        };
    };

    public static getUserReconnectNotifyData() {
        return {
            type: this.USER_RECONNECT_NOTIFY,
            data: {}
        };
    };

    public static getUserReconnectPushData(gameData) {
        return {
            type: this.USER_RECONNECT_PUSH,
            data: {
                gameData: gameData
            }
        };
    };

    public static getAskForDismissNotifyData(isExit) {
        return {
            type: this.ASK_FOR_DISMISS_NOTIFY,
            data: {
                isExit: isExit
            }
        };
    };

    public static getAskForDismissPushData(chairIDArr, nameArr, scoreArr, tm, chairID, onlineArr, avatarArr) {
        return {
            type: this.ASK_FOR_DISMISS_PUSH,
            data: {
                nameArr: nameArr,
                scoreArr: scoreArr,
                chairIDArr: chairIDArr,
                tm: tm,
                askChairId: chairID,
                onlineArr: onlineArr,
                avatarArr: avatarArr,
            }
        };
    };

    // 游戏总结算推送
    public static getGameEndPushData(resout) {
        return {
            type: this.GAME_END_PUSH,
            data: {
                resout: resout
            }
        };
    };

    public static getAskDismissStatusNotifyData() {
        return {
            type: this.ASK_FOR_DISMISS_STATUS_NOTIFY,
            data: {}
        };
    };

    public static getAskDismissStatusPushData(isOnDismiss) {
        return {
            type: this.ASK_FOR_DISMISS_STATUS_PUSH,
            data: {
                isOnDismiss: isOnDismiss
            }
        };
    };

    public static getRoomShowUserInfoNotify() {
        return {
            type: this.GET_ROOM_SHOW_USER_INFO_NOTIFY,
            data: {}
        }
    };

    public static getRoomShowUserInfoPush(selfUserInfo, shenSuanZiInfo, fuHaoUserInfoArr) {
        return {
            type: this.GET_ROOM_SHOW_USER_INFO_PUSH,
            data: {
                selfUserInfo: selfUserInfo,
                shenSuanZiInfo: shenSuanZiInfo,
                fuHaoUserInfoArr: fuHaoUserInfoArr
            }
        }
    };

    public static getRoomSceneInfoNotify() {
        return {
            type: this.GET_ROOM_SCENE_INFO_NOTIFY,
            data: {}
        }
    };

    public static getRoomSceneInfoPush(roomID, roomCreatorInfo, gameRule, roomUserInfoArr, gameData) {
        return {
            type: this.GET_ROOM_SCENE_INFO_PUSH,
            data: {
                roomID: roomID,
                roomCreatorInfo: roomCreatorInfo,
                gameRule: gameRule,
                roomUserInfoArr: roomUserInfoArr,
                gameData: gameData
            }
        };
    };

    public static getRoomOnlineUserInfoNotify() {
        return {
            type: this.GET_ROOM_ONLINE_USER_INFO_NOTIFY,
            data: {}
        }
    };

    public static getRoomOnlineUserInfoPush(shenSuanZiInfo, fuHaoUserInfoArr) {
        return {
            type: this.GET_ROOM_ONLINE_USER_INFO_PUSH,
            data: {
                shenSuanZiInfo: shenSuanZiInfo,
                fuHaoUserInfoArr: fuHaoUserInfoArr
            }
        }
    };

    public static getUserChangeSeatNotify(fromChairID, toChairID) {
        return {
            type: this.USER_CHANGE_SEAT_NOTIFY,
            data: {
                fromChairID: fromChairID,
                toChairID: toChairID,
            }
        };
    };

    public static getUserChangeSeatPush(fromChairID, toChairID, uid) {
        return {
            type: this.USER_CHANGE_SEAT_PUSH,
            data: {
                fromChairID: fromChairID,
                toChairID: toChairID,
                uid: uid,
            }
        };
    };
}
