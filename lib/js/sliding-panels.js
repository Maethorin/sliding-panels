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
    self.$buttonGroup = $panel.find("." + btnGroupClass);

    self.$element.delegate(".slide", "click", function() {
        self.slide();
    });

    self.isLeft = function() {
        return self.$element.hasClass(leftClass); };

    self.isFloating = function() { return self.$element.hasClass(floatingClass); };

    self.toggleFloating = function() {
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

    self.float = function() {
        self.setTop();
        self.$element.insertAfter(self.$element.parent());
        var $slideButton = self._$baseSlideButton.clone();
        $slideButton.find("i").addClass((self.isLeft() ? iconToLeft : iconToRight));
        $slideButton[(self.isLeft() ? "appendTo" : "prependTo")](self.$buttonGroup);
        self.$slideButton = self.$element.find(".slide");
    };

    self.dock = function() {
        self.$slideButton.remove();
        self.$element.css("top", "");
        self.$element[(self.isLeft() ? "prependTo" : "appendTo")](widget);
    };

    self.resize = function(dockedPanels) {
        self.$element.removeClass(span6).removeClass(span9).removeClass(span12);
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
        self.$element.data(slidedData, !self.isSlided());
        return self.isLeft() ? {'left': direction + distance} : {'right': direction + distance};
    };

    self.slide = function() {
        self.$slideButton.find("i").toggleClass(iconToLeft + " " + iconToRight);
        self.$element.animate(self._getAnimation(), {"queue": false});
    };
}

$.widget('ui.slidingPanels', {
    _create: function() {
        var self = this;
        self._leftPanel = self._createPanel(leftClass, span3);
        self._centerPanel = self._createPanel(centerClass, span6);
        self._rightPanel = self._createPanel(rightClass, span3);
        self._on("." + pushpinClass, {
            "click": function(event) {
                self._floatPanel($(event.currentTarget));
            }
        });
    },
    _createPanel: function(side, spanClass) {
        var $panel = this._createElement(divTag, ["panel", side, spanClass], this.element);
        $panel.addClass(side);
        $panel.addClass(spanClass);
        var $header = this._createElement(divTag, ["panel-header"], $panel);
        this._createElement(divTag, ["panel-title"], $header);
        this._createElement(divTag, ["panel-body"], $panel);

        if (side != centerClass) {
            var pullClass = (side == leftClass ? pullRight :pullLeft);
            var $btnGroup = this._createElement(divTag, [btnGroupClass, pullClass], $header);
            var $pushPinButton = this._createElement(
                    button,
                    ["btn", "btn-mini", pushpinClass],
                    $btnGroup,
                    {"type": button, "data-toggle": button}
            );
            this._createElement("i", ["icon-pushpin"], $pushPinButton);
        }

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
        if ($button.parents("." + leftClass).length) {
            return this._leftPanel;
        }
        if ($button.parents("." + rightClass).length) {
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