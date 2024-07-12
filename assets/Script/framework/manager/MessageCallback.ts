
export default class MessageCallback {

    private handlers: any[];
    /**
     * 添加事件
     * @param route 
     * @param handler 
     */
    addListener(route, handler) {
        //初始化
        this.handlers = this.handlers || [];

        let handlers = this.handlers[route] || null;

        if (!!handlers) {
            let isHandlerExist = false;
            for (let i in handlers) {
                //是否有事件注册
                if (handlers.hasOwnProperty(i) && (handlers[i] === handler)) {
                    isHandlerExist = true;
                    break;
                }
            }

            if (!isHandlerExist) {
                handlers.push(handler);//注册到事件中
            }
        }
        else {
            handlers = [];
            handlers.push(handler);
            this.handlers[route] = handler;//注册道对应的事件中
        }
    }

    //删除事件
    removeListener(route, handler) {
        this.handlers = this.handlers || [];
        let handlers = this.handlers[route] || null;
        if (!!handlers) {
            for (let i = 0; i < handlers.length; ++i) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
    }

    //发送事件
    emitMessage(route, msg) {
        this.handlers = this.handlers || [];
        
        let handlers = this.handlers[route] || [];

        if(!!handlers){
            let handlersTemp = handlers.slice();
            for(let i in handlersTemp){
                if (handlersTemp.hasOwnProperty(i) && !!handlersTemp[i].messageCallbackHandler && !handlersTemp[i].isDestroy){
                    handlersTemp[i].messageCallbackHandler(route, msg);
                }
            }
        }
    }
}
