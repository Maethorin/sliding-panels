Sliding Panels - [![Build Status](https://travis-ci.org/Maethorin/sliding-panels.png?branch=master)](https://travis-ci.org/Maethorin/sliding-panels)
==============

Introduction
------------

This is a simple JQuery widget to create three panels (using Twitter Bootstrap) with left and right sides with float/dock and slide funcionalities.

The index.html file, in the project root folder, has a basic example on how to using it.

Dependencies
------------

* [JQuery](http://jquery.com/)
* [JQuery UI Widget](http://jqueryui.com/widget/)
* [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
* [Font Awesome](http://fortawesome.github.com/Font-Awesome/)

You can use the files in `components` project folder for these dependencies

Instalation
-----------

You just need to put in your HTML file the dependencies and the files `dist/js/sliding-panel-min.js` and `dist/css/sliding-panel.css`

Basic use
---------

You need to create container element for the sliding panels:

    <div class="panel-container></div>

And define the elements that will be the body of each panel::

    <div class="left-panel-body>Left DOM</div>
    <div class="center-panel-body>Center DOM</div>
    <div class="right-panel-body>Right DOM</div>

These elements will be appended to each panel-body.

Your JavaScript code to create the panels should be::

    $(".panel-container").slidingPanels({
        panelTitle: {
            "left": "Left Panel",
            "center": "Center Panel",
            "right": "Right Panel"
        },
        panelBody: { // can use the selector or the JQuery object.
            "left": ".left-panel-body",
            "center": ".center-panel-body",
            "right": ".right-panel-body"
        }
    });

Gerated HTML
------------

The HTML code generated are::

    <div class="panel-container">
        <div class="panel left span3">
            <div class="panel-header">
                <div class="btn-group pull-right">
                    <button type="button" data-toggle="button" class="btn btn-mini pushpin active"><i class="icon-pushpin"></i></button>
                </div>
                <div class="panel-title">Left Panel</div>
            </div>
            <div class="panel-body">
                <div class="left-panel-body">
                    Left DOM
                </div>
            </div>
        </div>
        <div class="panel center span6">
            <div class="panel-header">
                <div class="panel-title">Center Panel</div>
            </div>
            <div class="panel-body">
                <div class="center-panel-body">
                    Center DOM
                </div>
            </div>
        </div>
        <div class="panel right span3">
            <div class="panel-header">
                <div class="btn-group pull-left">
                    <button type="button" data-toggle="button" class="btn btn-mini pushpin active"><i class="icon-pushpin"></i></button>
                </div>
                <div class="panel-title">Right Panel</div>
            </div>
            <div class="panel-body">
                <div class="right-panel-body">
                    Right DOM
                </div>
            </div>
        </div>
    </div>

More Options
------------

If you want to exclude some panel, pass an option panels which should be an Array::

    ```javascript
    $(".panel-container").slidingPanels({
        panels: ["left", "center"],
        panelTitle: {
            "left": "Left Panel",
            "center": "Center Panel",
        },
        panelBody: { // can use the selector or the JQuery object.
            "left": ".left-panel-body",
            "center": ".center-panel-body",
        }
    });
    ```

This will create the left and center panels only.

Storage
-------

This widget will save the panels states in `localStorage`. There is two states for each panel: floating and slided. If you reload the page, the panels will maintain the states saved in localStorage.

If you dont want to use storage, pass `useFloatingStorage = false` in options.

More will come
--------------

Thing that will be implementing soon:

* Elements could be created directly in HTML.