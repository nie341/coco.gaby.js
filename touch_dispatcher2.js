let tool = require("tool");

cc.Class({
    extends: cc.Component,

    properties: {
        front_node: cc.Node,
        back_node: cc.Node,
        is_top_vertical: true,

        test_button: cc.Node,

        event_start: null,
        touch_vertical: null,
    },

    onLoad: function() {
        let self = this;

        // self.test_button.on(cc.Node.EventType.TOUCH_START, function(ev) {
        //     cc.log("按钮 start");
        // });
        // self.test_button.on(cc.Node.EventType.TOUCH_MOVE, function(ev) {
        //     cc.log("按钮 move");
        // });
        self.test_button.on(cc.Node.EventType.TOUCH_END, function(ev) {
            cc.log("按钮按下");
        });


        self.front_node.on(cc.Node.EventType.TOUCH_START, function(ev) {
            cc.log("top start");
            self.event_start = ev;
            // // 停止事件传递
            // ev.stopPropagation();
        });

        self.front_node.on(cc.Node.EventType.TOUCH_MOVE, function(ev) {
            let start = ev.getStartLocation();
            let end = ev.getLocation();
            let xspan = Math.abs(start.x - end.x);
            let yspan = Math.abs(start.y - end.y);

            // 如果是第一次移动
            if (self.touch_vertical === null && xspan + yspan > 20) {
                // 横向距离更大
                if (xspan >= yspan) {
                    // 标志为横向
                    self.touch_vertical = false;
                } else {
                    // 标志为纵向移动
                    self.touch_vertical = true;
                }
            }


            if (self.touch_vertical !== null) {
                // 如果是纵向
                if (self.touch_vertical) {
                    // 不做操作
                }
                // 如果是横向
                else {
                    // 渗透给下面的横向节点
                    self.back_node.dispatchEvent(self.event_start);
                    self.back_node.dispatchEvent(ev);
                    //停止事件监听
                    ev.stopPropagation();
                }
            }

        });
        self.front_node.on(cc.Node.EventType.TOUCH_END, function(ev) {
            cc.log("top end");
            // if (self.touch_vertical !== null) {
            //     self.touch_vertical.dispatchEvent(ev);
            // }
            // //停止事件监听
            // ev.stopPropagation();
            self.touch_vertical = null;
        });
        self.front_node.on(cc.Node.EventType.TOUCH_CANCEL, function(ev) {
            cc.log("top cancel");
            // if (self.touch_vertical !== null) {
            //     self.touch_vertical.dispatchEvent(ev);
            // }
            // //停止事件监听
            // ev.stopPropagation();
            self.touch_vertical = null;
        });


    },
});
