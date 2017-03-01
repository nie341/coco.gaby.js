var tool = require("tool");
cc.Class({
    extends: cc.Component,

    properties: {
        custom_view: cc.Node,
        content: cc.Node,

        view_center: cc.Node,

        view_left: cc.Node,
        center_content: cc.Node,
        back: cc.Node,

        view_right: cc.Node,

        org_x: null,
        reset_time: 0.2,
    },


    // use this for initialization
    onLoad: function() {
        var self = this;
        tool.hide_node(self.back);

        var self = this;
        var canvas = cc.find("Canvas");
        self.view_center.width = canvas.width;

        cc.log("content=", self.content);

        // 记录原始点
        if (self.org_x == null) {
            self.org_x = self.content.x;
        }

        // 鼠标移动
        self.content.on(cc.Node.EventType.TOUCH_MOVE, function(event) {

            // 当前点
            var x = event.getLocationX();
            var y = event.getLocationY();
            // 之前的点
            var xp = event.getPreviousLocation().x;
            var yp = event.getPreviousLocation().y;

            // 获取当前方向
            var dt = x - xp;

            // 获取左右控件的宽度
            var w_left = self.view_left.width;
            var w_right = self.view_right.width;
            // cc.log("content=" + self.content.x + "dt=" + dt);

            // 移动
            self.content.x = self.content.x + dt;

            // 修复
            if (self.content.x < self.org_x - w_left) {
                self.content.x = self.org_x - w_left;
            }
            if (self.content.x > self.org_x + w_right) {
                self.content.x = self.org_x + w_right;
            }
        });


        // 手指放开
        var touch_end = function(ev) {
            var half_l = self.view_left.width / 2;
            var half_r = self.view_right.width / 2;
            var action = null;
            // 如果显示右边的菜单
            if (self.content.x < self.org_x - half_l) {
                action = cc.moveTo(self.reset_time, cc.p(self.org_x - self.view_right.width, self.content.y));
                // 显示遮罩层
                cc.log("显示遮罩");
                tool.show_node(self.back);
            }
            // 如果显示左边的
            else if (self.content.x > self.org_x + half_r) {
                action = cc.moveTo(self.reset_time, cc.p(self.org_x + self.view_left.width, self.content.y));
                // 显示遮罩层
                cc.log("显示遮罩");
                tool.show_node(self.back);
            }
            // 否则中间
            else {
                action = cc.moveTo(self.reset_time, cc.p(self.org_x, self.content.y));
                // 隐藏遮罩层
                tool.hide_node(self.back);
            }
            self.content.runAction(action);
        };

        tool.on_click(self.content, function(event) {
            touch_end(event);
        });

        self.content.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
            touch_end(event);
        });

        // 点击了back
        tool.on_click(self.back, function(event) {
            cc.log("点击了遮罩层");

            // 还原
            var action = cc.moveTo(self.reset_time, cc.p(self.org_x, self.content.y));
            var seq = cc.sequence(action, cc.callFunc(function() {
                // 隐藏遮罩层
                tool.hide_node(self.back);
            }, this))
            self.content.runAction(seq);
        });

    },

    add_left: function(node) {
        var self = this;
        self.view_left.addChild(node);
    },

    add_right: function(node) {
        var self = this;
        self.view_right.addChild(node);
    },

    add_center: function(node) {
        var self = this;
        self.center_content.addChild(node);
    },

    // 显示左边的菜单
    show_left: function() {
        var self = this;
        var action = cc.moveTo(self.reset_time, cc.p(self.org_x + self.view_left.width, self.content.y));
        self.content.runAction(action);
        tool.show_node(self.back);
    },

    // 显示右边菜单
    show_right: function() {
        var self = this;
        var action = cc.moveTo(self.reset_time, cc.p(self.org_x - self.view_right.width, self.content.y));
        self.content.runAction(action);
        tool.show_node(self.back);
    },
});
