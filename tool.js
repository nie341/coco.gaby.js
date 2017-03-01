var tool = {

    hide_node: function(node) {
        node.active = false;
    },

    show_node: function(node) {
        node.active = true;
    },

    on_click: function(node, func) {
        node.on(cc.Node.EventType.TOUCH_END, function(ev) {
            var start = ev.getStartLocation();
            var end = ev.getLocation();
            cc.log("start = " + start.x + "," + start.y);
            cc.log("end = " + end.x + "," + end.y);

            var distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
            cc.log("dis= " + distance);
            if (distance < 10) {
                func();
            }
        });
    },

    enter_scene: function(name) {
        cc.director.loadScene(name);
    },

};

module.exports = tool;
