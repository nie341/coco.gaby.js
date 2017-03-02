var tool = require("tool");
cc.Class({
    extends: cc.Component,

    properties: {
        custom_view: cc.Node,
        content: cc.Node,

        view_center: cc.Node,

        center_content: cc.Node, // 真正的内容填充区
        back: cc.Node,

        default_left: null,
        default_right: null,

        extra_left: null,
        extra_right: null,

        org_x: null,
        reset_time: 0.2,
    },


    get_left_width: function() {
        let self = this;
        let w = 0;
        // 挂载额外的节点
        if (self.extra_left !== null) {
            // 使用节点宽度
            w = self.extra_left.width;

        }
        // 有默认节点
        else if (self.default_left !== null) {
            // 使用默认节点宽度
            w = self.default_left.width;
        }
        // 没有任何节点
        else {
            w = 0;
        }
        return w;
    },

    get_right_width: function() {
        return 0;
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
        let move = function(event) {

            // 当前点
            var x = event.getLocationX();
            var y = event.getLocationY();
            // 之前的点
            var xp = event.getPreviousLocation().x;
            var yp = event.getPreviousLocation().y;

            // 获取当前方向
            var dt = x - xp;

            // 获取左右控件的宽度
            let w_left = self.get_left_width();
            let w_right = self.get_right_width();
            cc.log("left = " + w_left + " right = " + w_right);
            cc.log("content.x=" + self.content.x + "dt=" + dt);

            // 移动
            self.content.x = self.content.x + dt;

            // 修复
            if (self.content.x < self.org_x - w_right) {
                self.content.x = self.org_x - w_right;
            }
            if (self.content.x > self.org_x + w_left) {
                self.content.x = self.org_x + w_left;
            }
        };
        self.view_center.on(cc.Node.EventType.TOUCH_MOVE, move);
        self.back.on(cc.Node.EventType.TOUCH_MOVE, move);

        // 手指放开
        var touch_end = function(ev) {
            var half_l = self.get_left_width() / 2;
            var half_r = self.get_right_width() / 2;
            var action = null;
            // 如果显示右边的菜单
            if (self.content.x < self.org_x - half_r) {
                action = cc.moveTo(self.reset_time, cc.p(self.org_x - self.get_right_width(), self.content.y));
                // 显示遮罩层
                cc.log("显示遮罩");
                tool.show_node(self.back);
            }
            // 如果显示左边的
            else if (self.content.x > self.org_x + half_l) {
                action = cc.moveTo(self.reset_time, cc.p(self.org_x + self.get_left_width(), self.content.y));
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
            touch_end(event);
        });

        // 初始化的时候extra是关闭的
        tool.hide_node(self.extra_left);
        tool.hide_node(self.extra_right);
    },

    add_default_left: function(node) {
        var self = this;
        self.default_left = node;
        self.content.addChild(node);
        self.default_left.x = 0 - self.view_center.width / 2;
    },

    add_default_right: function(node) {},

    add_center: function(node) {
        var self = this;
        self.center_content.addChild(node);
    },

    show_extra_left: function(node) {
        var self = this;
        // 添加额外的view
        self.extra_left = node;
        self.content.addChild(node);
        self.extra_left.x = 0 - self.view_center.width / 2;

        // 隐藏默认的view
        tool.hide(self.default_left);
    },

    // 显示左边的菜单
    show_left: function() {
        var self = this;
        var action = cc.moveTo(self.reset_time, cc.p(self.org_x + self.get_left_width(), self.content.y));
        self.content.runAction(action);
        tool.show_node(self.back);
    },

    // 显示右边菜单
    show_right: function() {
        var self = this;
        var action = cc.moveTo(self.reset_time, cc.p(self.org_x - self.get_right_width(), self.content.y));
        self.content.runAction(action);
        tool.show_node(self.back);
    },
});
