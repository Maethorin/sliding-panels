const floatingClass = "floating";
const panelSpanWidthWhenSlided = 18;
const leftClass = "left";
const centerClass = "center";
const rightClass = "right";
const pushpinClass = "pushpin";
const btnGroupClass = "btn-group";
const iconToLeft = "icon-double-angle-left";
const iconToRight = "icon-double-angle-right";
const divTag = "div";
const button = "button";
const span3 = "span3";
const span6 = "span6";
const span9 = "span9";
const span12 = "span12";
const pullRight = "pull-right";
const pullLeft = "pull-left";
const slidedData = "slided";

function Panel($panel, widget) {
    var self = this;
    self._$baseSlideButton = $('<button type="button" class="btn btn-mini slide"><i></i></button>');
    self.$element = $panel;
    self.$buttonGroup = $panel.find(".panel-header ." + btnGroupClass);

    self.$element.delegate(".slide", "click", function() {
        self.slide();
    });

    self.isLeft = function() {
        return self.$element.hasClass(leftClass); };

    self.isFloating = function() { return self.$element.hasClass(floatingClass); };

    self.toggleFloating = function(deactivateButton) {
        if (deactivateButton) {
            self.$element.find("." + pushpinClass).removeClass("active");
        }
        self.$element.toggleClass(floatingClass);
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

    self._changeStorageVariables = function(value, variable) {
        localStorage[self._getStorageVariable(variable)] = value;
    };

    self.float = function() {
        self.setTop();
        self.$element.insertAfter(self.$element.parent());
        var $slideButton = self._$baseSlideButton.clone();
        $slideButton.find("i").addClass((self.isLeft() ? iconToLeft : iconToRight));
        $slideButton[(self.isLeft() ? "appendTo" : "prependTo")](self.$buttonGroup);
        self.$slideButton = self.$element.find(".slide");
        self._changeStorageVariables(true, "Floating");
    };

    self.dock = function() {
        self.$slideButton.remove();
        self.$element.css("top", "");
        self.$element[(self.isLeft() ? "prependTo" : "appendTo")](widget);
        self._changeStorageVariables(false, "Floating");
    };

    self.resize = function(dockedPanels) {
        self.$element.removeClass(span3).removeClass(span6).removeClass(span9).removeClass(span12);
        if (dockedPanels == 1) {
            self.$element.addClass(span9)
        }
        else if (dockedPanels == 2) {
            self.$element.addClass(span6)
        }
        else {
            self.$element.addClass(span12)
        }
    };

    self.isSlided = function() {
        return self.$element.data(slidedData);
    };

    self._getAnimation = function() {
        var distance = self.$element.width() - panelSpanWidthWhenSlided;
        var direction = self.isSlided() ? "+=" : "-=";
        return self.isLeft() ? {'left': direction + distance} : {'right': direction + distance};
    };

    self.slide = function() {
        self.$slideButton.find("i").toggleClass(iconToLeft + " " + iconToRight);
        self.$element.animate(self._getAnimation(), {"queue": false});
        self.$element.data(slidedData, !self.isSlided());
        self._changeStorageVariables(self.isSlided(), "Slided");
    };

    self.hasStorage = function(variable) {
        return localStorage[self._getStorageVariable(variable)] == "true";
    };

    self._getStorageVariable = function(variable) {
        return (self.isLeft() ? "leftPanel" : "rightPanel") + variable;
    };

    self._deleteStorage = function() {
        delete localStorage[self._getStorageVariable("Floating")];
        delete localStorage[self._getStorageVariable("Slided")];
    };

    self.destroy = function() {
        self._deleteStorage();
        self.$element.empty();
        self.$element.remove();
        self.$element = null;
    }
}

$.widget('ui.slidingPanels', {
    options: {
        "panels": ["left", "center", "right"],
        "useFloatingStorage": true,
        "panelTitle": {
            "left": "",
            "center": "",
            "right": ""
        },
        "panelBody": {
            "left": "",
            "center": "",
            "right": ""
        }
    },
    _getPanel: function(side) {
        return this["_" + side + "Panel"];
    },
    _create: function() {
        var self = this;
        for (var i = 0; i < this.options.panels.length; i++) {
            var side = this.options.panels[i];
            self["_" + side + "Panel"] = self._createPanel(side, span3);
        }
        self._on("." + pushpinClass, {
            "click": function(event) {
                self._floatPanel($(event.currentTarget));
            }
        });
        if (self.options.useFloatingStorage) {
            self._updateStateBasedInStorage();
        }
    },
    _destroy: function() {
        for (var i = 0; i < this.options.panels.length; i++) {
            var panel = this._getPanel(this.options.panels[i]);
            panel.destroy();
        }
    },
    _updateStateBasedInStorage: function() {
        for (var i = 0; i < this.options.panels.length; i++) {
            if (this.options.panels[i] == "center") {
                continue;
            }
            var panel = this._getPanel(this.options.panels[i]);
            if (panel.hasStorage("Floating")) {
                panel.toggleFloating(true);
            }
            if (panel.hasStorage("Slided")) {
                panel.slide();
            }
        }
        this._resizingCenterPanel();
    },
    _getPanelTitle: function(side) {
        return this.options.panelTitle[side];
    },
    _getPanelBody: function(side) {
        var body = this.options.panelBody[side];
        if (typeof body === "string") {
            return $(body);
        }
        return body;
    },
    _createPanel: function(side, spanClass) {
        var $panel = this._createElement(divTag, ["panel", side, spanClass], this.element);
        $panel.addClass(side);
        $panel.addClass(spanClass);
        var $header = this._createElement(divTag, ["panel-header"], $panel);
        this._createElement(divTag, ["panel-body"], $panel).append(this._getPanelBody(side));

        if (side != centerClass) {
            var pullClass = (side == leftClass ? pullRight :pullLeft);
            var $btnGroup = this._createElement(divTag, [btnGroupClass, pullClass], $header);
            var $pushPinButton = this._createElement(
                    button,
                    ["btn", "btn-mini", pushpinClass, "active"],
                    $btnGroup,
                    {"type": button, "data-toggle": button}
            );
            this._createElement("i", ["icon-pushpin"], $pushPinButton);
        }
        this._createElement(divTag, ["panel-title"], $header).text(this._getPanelTitle(side));
        return new Panel($panel, this.element);
    },
    _createElement: function(tag, classes, $parent, attrs) {
        var $element = $("<" + tag + ">", attrs).appendTo($parent);
        if (typeof classes === "string") {
            $element.addClass(classes);
        }
        else {
            for (var i = 0; i < classes.length; i++) {
                $element.addClass(classes[i]);
            }
        }
        return $element;
    },
    _clickedPanel: function($button) {
        if ($button.parents(".panel").hasClass(leftClass)) {
            return this._getPanel(leftClass);
        }
        if ($button.parents(".panel").hasClass(rightClass)) {
            return this._getPanel(rightClass);
        }
        return this._centerPanel;
    },
    _floatPanel: function($button) {
        this._clickedPanel($button).toggleFloating();
        this._resizingCenterPanel();
    },
    _resizingCenterPanel: function() {
        var dockedPanels = this.options.panels.length - 1;
        for (var i = 0; i < this.options.panels.length; i++) {
            if (this.options.panels[i] == "center") {
                continue;
            }
            var panel = this._getPanel(this.options.panels[i]);
            if (panel.isFloating()) {
                dockedPanels--;
            }
        }
        this._centerPanel.resize(dockedPanels);
    }
});