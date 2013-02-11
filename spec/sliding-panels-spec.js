describe("The slidingPanel widget", function() {
    var $leftPanel, $centerPanel, $rightPanel, $container;
    beforeEach(function() {
        loadFixtures('panels.html');
        $container = $(".panel-container");
        $container.slidingPanels();
        $leftPanel = $(".panel.left");
        $centerPanel = $(".panel.center");
        $rightPanel = $(".panel.right");
    });

    it("should create the left panel", function() {
        expect($leftPanel).toExist();
    });

    it("should create the center panel", function() {
        expect($centerPanel).toExist();
    });

    it("should create the right panel", function() {
        expect($rightPanel).toExist();
    });

    it("should add span3 to left panel", function() {
        expect($leftPanel).toHaveClass("span3");
    });

    it("should add span6 to center panel", function() {
        expect($centerPanel).toHaveClass("span6");
    });

    it("should add span3 to right panel", function() {
        expect($rightPanel).toHaveClass("span3");
    });

    it("should create header and body to each panel", function() {
        expect($leftPanel.find(".panel-header")).toExist();
        expect($leftPanel.find(".panel-body")).toExist();
    });

    it("should create a header panel-title", function() {
        expect($leftPanel.find(".panel-header .panel-title")).toExist();
    });

    describe("when creating the btn-group", function() {
        it("should put it in the header", function() {
            expect($leftPanel.find(".panel-header .btn-group")).toExist();
        });

        it("should align it accord the side of the panel", function() {
            expect($leftPanel.find(".panel-header .btn-group")).toHaveClass("pull-right");
            expect($rightPanel.find(".panel-header .btn-group")).toHaveClass("pull-left");
        });

        describe("and creating a pushpin button", function() {
            it("should create the button in the btn-group", function() {
                expect($leftPanel.find(".btn.btn-mini.pushpin")).toExist();
            });

            it("should be a toggle button", function() {
                expect($leftPanel.find(".btn.btn-mini.pushpin")).toHaveData("toggle", "button");
            });

            it("should have an icon", function() {
                expect($leftPanel.find(".pushpin").find("i")).toHaveClass("icon-pushpin");
            });
        });
    });

    describe("when floating a panel", function() {
        it('should add the floating class to the panel', function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($leftPanel).toHaveClass("floating");
        });

        it("should append a slide button if panel is left", function() {
            spyOn($.fn, "appendTo").andCallThrough();
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($leftPanel.find(".btn.btn-mini.slide")).toExist();
            expect($.fn.appendTo).toHaveBeenCalled();
        });

        it("should prepend a slide button if panel is right", function() {
            spyOn($.fn, "prependTo").andCallThrough();
            $rightPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($rightPanel.find(".btn.btn-mini.slide")).toExist();
            expect($.fn.prependTo).toHaveBeenCalled();
        });

        it("should add an icon to the left if panel is left", function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($leftPanel.find(".slide i")).toHaveClass("icon-double-angle-left");
        });

        it("should add an icon to the right if panel is right", function() {
            $rightPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($rightPanel.find(".slide i")).toHaveClass("icon-double-angle-right");
        });

        it('should set the top of the panel', function() {
            var top = $leftPanel.offset().top + "px";
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($leftPanel).toHaveCss({"top": top});
        });

        it('should remove the panel from container', function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($container.find('.left')).not.toExist();
        });

        it('should resize the center panel to 9 with one panel floating', function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($centerPanel).toHaveClass("span9");
        });

        it('should resize the center panel to 12 with two panel floating', function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            $rightPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($centerPanel).toHaveClass("span12");
        });
    });

    describe("when docking a panel", function() {
        it('should remove the floating class to the panel', function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($leftPanel).not.toHaveClass("floating");
        });

        it("should remove a slide button", function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($leftPanel.find(".btn.btn-mini.slide")).not.toExist();
        });

        it('should remove the css top of the panel', function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($leftPanel).toHaveCss({"top": "auto"});
        });

        it('should add in the container at left if left panel', function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($container.find(".panel").eq(0)).toHaveClass("left");
        });

        it('should add in the container at right if right panel', function() {
            $rightPanel.find(".btn.btn-mini.pushpin").trigger("click");
            $rightPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($container.find(".panel").eq(2)).toHaveClass("right");
        });

        it('should resize the center panel to 9 with one panel docked', function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($centerPanel).toHaveClass("span9");
        });

        it('should resize the center panel to 6 with two panel docked', function() {
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            $rightPanel.find(".btn.btn-mini.pushpin").trigger("click");
            $leftPanel.find(".btn.btn-mini.pushpin").trigger("click");
            $rightPanel.find(".btn.btn-mini.pushpin").trigger("click");
            expect($centerPanel).toHaveClass("span6");
        });
    });

    describe("when sliding a panel out", function() {
        it("should decrease the left css if panel is left", function() {
            spyOn($.fn, "animate");
            $leftPanel.find(".pushpin").trigger("click");
            $leftPanel.find(".slide").trigger("click");
            var expectedAnimate = {
                "left": "-=" + ($leftPanel.width() - 18)
            };
            expect($.fn.animate).toHaveBeenCalledWith(expectedAnimate, {"queue": false});
        });

        it("should mark the panel as slided", function() {
            spyOn($.fn, "animate");
            $leftPanel.find(".pushpin").trigger("click");
            $leftPanel.find(".slide").trigger("click");
            expect($leftPanel).toHaveData("slided", true);
        });

        it('should change the slide button icon to the right if panel is left', function() {
            spyOn($.fn, "animate");
            $leftPanel.find(".pushpin").trigger("click");
            $leftPanel.find(".slide").trigger("click");
            expect($leftPanel.find(".slide i")).toHaveClass("icon-double-angle-right");
        });

        it('should change the slide button icon to the left if panel is right', function() {
            spyOn($.fn, "animate");
            $rightPanel.find(".pushpin").trigger("click");
            $rightPanel.find(".slide").trigger("click");
            expect($rightPanel.find(".slide i")).toHaveClass("icon-double-angle-left");
        });

        it("should decrease the right css if panel is right", function() {
            spyOn($.fn, "animate");
            $rightPanel.find(".pushpin").trigger("click");
            $rightPanel.find(".slide").trigger("click");
            var expectedAnimate = {
                "right": "-=" + ($leftPanel.width() - 18)
            };
            expect($.fn.animate).toHaveBeenCalledWith(expectedAnimate, {"queue": false});
        });
    });

    describe("when sliding a panel in", function() {
        it("should increase the left css if panel is left", function() {
            spyOn($.fn, "animate");
            $leftPanel.find(".pushpin").trigger("click");
            $leftPanel.find(".slide").trigger("click");
            $leftPanel.find(".slide").trigger("click");
            var expectedAnimate = {
                "left": "+=" + ($leftPanel.width() - 18)
            };
            expect($.fn.animate).toHaveBeenCalledWith(expectedAnimate, {"queue": false});
        });

        it("should mark the panel as not slided", function() {
            spyOn($.fn, "animate");
            $leftPanel.find(".pushpin").trigger("click");
            $leftPanel.find(".slide").trigger("click");
            $leftPanel.find(".slide").trigger("click");
            expect($leftPanel).toHaveData("slided", false);
        });

        it("should increase the right css if panel is right", function() {
            spyOn($.fn, "animate");
            $rightPanel.find(".pushpin").trigger("click");
            $rightPanel.find(".slide").trigger("click");
            $rightPanel.find(".slide").trigger("click");
            var expectedAnimate = {
                "right": "+=" + ($rightPanel.width() - 18)
            };
            expect($.fn.animate).toHaveBeenCalledWith(expectedAnimate, {"queue": false});
        });
    });
});