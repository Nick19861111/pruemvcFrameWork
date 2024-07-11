class Code {
    OK: number = 0;                                    // 结果正确

    // 通用
    FAIL: number = 1;                                  // 请求失败
    REQUEST_DATA_ERROR: number = 2;                    // 请求数据错误
    SQL_ERROR: number = 3;                             // 数据库操作错误
    INVALID_USERS: number = 4;                         // 无效用户
    PERMISSION_NOT_ENOUGH: number = 6;                 // 权限不足
    SMS_CODE_ERROR: number = 7;                        // 短信验证码错误
    IMG_CODE_ERROR: number = 8;                        // 图形验证码错误
    SMS_SEND_FAILED: number = 9;                       // 短信发送失败
    SERVER_MAINTENANCE: number = 10;                   // 服务器维护
    NOT_ENOUGH_GOLD: number = 11;                      // 钻石不足
    USER_DATA_LOCKED: number = 12;                     // 用户数据被锁定
    NOT_ENOUGH_SCORE: number = 13;                     // 积分不足

    // 帐号相关
    ACCOUNT_OR_PASSWORD_ERROR: number = 101;           // 账号或密码错误
    GET_HALL_SERVERS_FAIL: number = 102;               // 获取大厅服务器失败
    ACCOUNT_EXIST: number = 103;                       // 账号已存在
    ACCOUNT_NOT_EXIST: number = 104;                   // 帐号不存在
    NOT_FIND_BIND_PHONE: number = 105;                 // 该手机号未绑定
    PHONE_ALREADY_BIND: number = 106;                  // 该手机号已被绑定，无法重复绑定
    NOT_FIND_USER: number = 107;                       // 用户不存在

    // 大厅相关
    TOKEN_INFO_ERROR: number = 201;                    // 无效的token
    NOT_ENOUGH_VIP_LEVEL: number = 202;                // vip等级不足
    BLOCKED_ACCOUNT: number = 203;                     // 帐号已冻结
    ALREADY_CREATED_UNION: number = 204;               // 已经创建过牌友圈，无法重复创建
    UNION_NOT_EXIST: number = 205;                     // 联盟不存在
    USER_IN_ROOM_DATA_LOCKED: number = 206;            // 用户在房间中，无法操作数据
    NOT_IN_UNION: number = 207;                        // 用户不在联盟中
    ALREADY_IN_UNION: number = 208;                    // 用户已经在联盟中
    INVITE_ID_ERROR: number = 209;                     // 邀请码错误
    NOT_YOUR_MEMBER: number = 210;                     // 添加的用户不是你的下级成员
    FORBID_GIVE_SCORE: number = 211;                   // 禁止赠送积分
    FORBID_INVITE_SCORE: number = 212;                 // 禁止玩家或代理邀请玩家
    CAN_NOT_CREATE_NEW_HONG_BAO: number = 213;         // 暂时无法分发新的红包

    // 游戏相关
    ROOM_COUNT_REACH_LIMIT: number = 301;              // 房间数量到达上线
    LEAVE_ROOM_GOLD_NOT_ENOUGH_LIMIT: number = 302;    // 金币不足，无法开始游戏
    LEAVE_ROOM_GOLD_EXCEED_LIMIT: number = 303;        // 金币超过最大限度，无法开始游戏
    CAN_NOT_LEAVE_ROOM: number = 305;                  // 正在游戏中无法离开房间
    NOT_IN_ROOM: number = 306;                         // 不在该房间中
    ROOM_PLAYER_COUNT_FULL: number = 307;              // 房间玩家已满
    ROOM_NOT_EXIST: number = 308;                      // 房间不存在
    CAN_NOT_ENTER_NOT_LOCATION: number = 309;          // 无法进入房间，获取定位信息失败
    CAN_NOT_ENTER_TOO_NEAR: number = 310;              // 无法进入房间，与房间中的其他玩家太近

    // 推送相关
    RECHARGE_FAIL: number = 401;                        // 充值失败
    RECHARGE_SUCCESS: number = 402;                     // 充值成功

    // 错误信息映射
    errorMessages: { [key: number]: string } = {};

    constructor() {
        this.errorMessages[this.FAIL] = '请求失败';
        this.errorMessages[this.REQUEST_DATA_ERROR] = '请求数据错误';
        this.errorMessages[this.SQL_ERROR] = '数据库操作错误';
        this.errorMessages[this.INVALID_USERS] = '无效用户';
        this.errorMessages[this.PERMISSION_NOT_ENOUGH] = '权限不足';
        this.errorMessages[this.SMS_CODE_ERROR] = '短信验证码错误';
        this.errorMessages[this.IMG_CODE_ERROR] = '图形验证码错误';
        this.errorMessages[this.SMS_SEND_FAILED] = '短信发送失败';
        this.errorMessages[this.SERVER_MAINTENANCE] = '服务器正在维护中，请稍后再试';
        this.errorMessages[this.NOT_ENOUGH_GOLD] = '钻石不足';
        this.errorMessages[this.USER_DATA_LOCKED] = '用户数据被锁定，请退出房间后重试';
        this.errorMessages[this.NOT_ENOUGH_SCORE] = '积分不足';

        this.errorMessages[this.ACCOUNT_OR_PASSWORD_ERROR] = '账号或密码错误';
        this.errorMessages[this.GET_HALL_SERVERS_FAIL] = '获取大厅服务器失败';
        this.errorMessages[this.ACCOUNT_EXIST] = '账号已存在';
        this.errorMessages[this.ACCOUNT_NOT_EXIST] = '帐号不存在';
        this.errorMessages[this.NOT_FIND_BIND_PHONE] = '该手机号未绑定用户';
        this.errorMessages[this.PHONE_ALREADY_BIND] = '该手机号已被绑定，无法重复绑定';
        this.errorMessages[this.NOT_FIND_USER] = '用户不存在';
        this.errorMessages[this.NOT_IN_ROOM] = '不在该房间中';
        this.errorMessages[this.CAN_NOT_ENTER_NOT_LOCATION] = '无法进入房间，获取定位信息失败';
        this.errorMessages[this.CAN_NOT_ENTER_TOO_NEAR] = '无法进入房间，与房间中的其他玩家太近';

        this.errorMessages[this.TOKEN_INFO_ERROR] = 'token无效';
        this.errorMessages[this.NOT_ENOUGH_VIP_LEVEL] = 'vip等级不足';
        this.errorMessages[this.BLOCKED_ACCOUNT] = '帐号被冻结，禁止登录';
        this.errorMessages[this.ALREADY_CREATED_UNION] = '已经创建过牌友圈，无法创建多个';
        this.errorMessages[this.UNION_NOT_EXIST] = '联盟不存在';
        this.errorMessages[this.USER_IN_ROOM_DATA_LOCKED] = '玩家正在房间中，无法操作数据';
        this.errorMessages[this.NOT_IN_UNION] = '用户不在联盟中';
        this.errorMessages[this.ALREADY_IN_UNION] = '用户已经在联盟中';
        this.errorMessages[this.INVITE_ID_ERROR] = '邀请码错误';
        this.errorMessages[this.NOT_YOUR_MEMBER] = '添加的用户不是你的下级成员';
        this.errorMessages[this.FORBID_GIVE_SCORE] = '当前联盟禁止赠送积分';
        this.errorMessages[this.FORBID_INVITE_SCORE] = '当前联盟禁止玩家或代理邀请新玩家';
        this.errorMessages[this.CAN_NOT_CREATE_NEW_HONG_BAO] = '暂时无法创建新的红包';

        this.errorMessages[this.ROOM_COUNT_REACH_LIMIT] = '房间数量到达上线';
        this.errorMessages[this.LEAVE_ROOM_GOLD_NOT_ENOUGH_LIMIT] = '金币低于房间的金币下限';
        this.errorMessages[this.LEAVE_ROOM_GOLD_EXCEED_LIMIT] = '金币超过房间的金币上限';
        this.errorMessages[this.CAN_NOT_LEAVE_ROOM] = '当前正在游戏中，无法离开房间';
        this.errorMessages[this.ROOM_PLAYER_COUNT_FULL] = '房间玩家已满';
        this.errorMessages[this.ROOM_NOT_EXIST] = '房间不存在';

        this.errorMessages[this.RECHARGE_FAIL] = '充值失败';
        this.errorMessages[this.RECHARGE_SUCCESS] = '充值成功';

        this.errorMessages[500] = '请求超时';
    }

    public getErrorMessage(code: number): string {
        return this.errorMessages[code] || '未知错误';
    }
}

// 导出实例
const CodeInstance = new Code();
export default CodeInstance;