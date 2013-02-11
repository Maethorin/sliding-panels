const floatingClassName = "floating";

function Panel($panel, widget) {
    var self = this;
    self._$baseSlideButton = $('<button type="button" class="btn btn-mini slide"><i></i></button>');
    self.$element = $panel;
    self.$buttonGroup = $panel.find(".btn-group");

    self.$element.delegate(".slide", "click", function() {
        self.slide();
    });

    self.isLeft = function() { return self.$element.hasClass("left"); };

    self.isFloating = function() { return self.$element.hasClass(floatingClassName); };

    self.toggleFloating = function() {
        self.$element.toggleClass(floatingClassName);
        if (self.isFloating()) {
            self.float();
        }
        else {
            self.dock();
        }
    };

    self.setTop = function() {
        self.$element.css("top", self.$element.offset().top + "px");
    };

    self.float = function() {
        self.setTop();
        self.$element.insertAfter(self.$element.parent());
        var $slideButton = self._$baseSlideButton.clone();
        $slideButton.find("i").addClass("icon-double-angle-" + (self.isLeft() ? "left" : "right"));
        $slideButton[(self.isLeft() ? "appendTo" : "prependTo")](self.$buttonGroup);
        self.$slideButton = self.$element.find(".slide");
    };

    self.dock = function() {
        self.$slideButton.remove();
        self.$element.css("top", "");
        self.$element[(self.isLeft() ? "prependTo" : "appendTo")](widget);
    };

    self.resize = function(dockedPanels) {
        self.$element.removeClass("span6").removeClass("span9").removeClass("span12");
        if (dockedPanels == 1) {
            self.$element.addClass("span9")
        }
        else if (dockedPanels == 2) {
            self.$element.addClass("span6")
        }
        else {
            self.$element.addClass("span12")
        }
    };

    self.isSlided = function() {
        return self.$element.data("slided");
    };

    self._getAnimation = function() {
        var distance = self.$element.width() - 18;
        var direction = self.isSlided() ? "+=" : "-=";
        self.$element.data("slided", !self.isSlided());
        return self.isLeft() ? {'left': direction + distance} : {'right': direction + distance};
    };

    self.slide = function() {
        self.$slideButton.find("i").toggleClass("icon-double-angle-left icon-double-angle-right");
        self.$element.animate(self._getAnimation(), {"queue": false});
    };
}

$.widget('ui.slidingPanels', {
    _create: function() {
        var self = this;
        self._leftPanel = self._createPanel("left", "span3");
        self._centerPanel = self._createPanel("center", "span6");
        self._rightPanel = self._createPanel("right", "span3");
        self._on("button.pushpin", {
            "click": function(event) {
                self._floatPanel($(event.currentTarget));
            }
        });
    },
    _createPanel: function(side, spanClass) {
        var $panel = this._createElement("div", ["panel", side, spanClass], this.element);
        $panel.addClass(side);
        $panel.addClass(spanClass);
        var $header = this._createElement("div", ["panel-header"], $panel);
        var pullClass = (side == "left" ? "pull-right" : "pull-left");
        var $btnGroup = this._createElement("div", ["btn-group", pullClass], $header);
        var $pushPinButton = this._createElement(
                "button",
                ["btn", "btn-mini", "pushpin"],
                $btnGroup,
                {"type": "button", "data-toggle": "button"}
        );
        this._createElement("i", ["icon-pushpin"], $pushPinButton);
        this._createElement("div", ["panel-title"], $header);
        this._createElement("div", ["panel-body"], $panel);
        return new Panel($panel, this.element);
    },
    _createElement: function(tag, classes, $parent, attrs) {
        var $element = $("<" + tag + ">", attrs).appendTo($parent);
        for (var i = 0; i < classes.length; i++) {
            $element.addClass(classes[i])
        }
        return $element;
    },
    _clickedPanel: function($button) {
        if ($button.parents(".left").length) {
            return this._leftPanel;
        }
        if ($button.parents(".right").length) {
            return this._rightPanel;
        }
        return this._centerPanel;
    },
    _floatPanel: function($button) {
        this._clickedPanel($button).toggleFloating();
        this._resizingCenterPanel();
    },
    _resizingCenterPanel: function() {
        var dockedPanels = 2;
        if (this._leftPanel.isFloating()) {
            dockedPanels--;
        }
        if (this._rightPanel.isFloating()) {
            dockedPanels--;
        }
        this._centerPanel.resize(dockedPanels);
    }
});