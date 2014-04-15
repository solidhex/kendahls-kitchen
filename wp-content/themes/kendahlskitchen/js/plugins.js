/*
 * jQuery FlexSlider v2.1
 * http://www.woothemes.com/flexslider/
 *
 * Copyright 2012 WooThemes
 * Free to use under the GPLv2 license.
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Contributing author: Tyler Smith (@mbmufffin)
 */

;
(function ($) {

    //FlexSlider: Object Instance
    $.flexslider = function(el, options) {
        var slider = $(el),
        vars = $.extend({}, $.flexslider.defaults, options),
        namespace = vars.namespace,
        touch = ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch,
        eventType = (touch) ? "touchend" : "click",
        vertical = vars.direction === "vertical",
        reverse = vars.reverse,
        carousel = (vars.itemWidth > 0),
        fade = vars.animation === "fade",
        asNav = vars.asNavFor !== "",
        methods = {};
    
        // Store a reference to the slider object
        $.data(el, "flexslider", slider);
    
        // Privat slider methods
        methods = {
            init: function() {
                slider.animating = false;
                slider.currentSlide = vars.startAt;
                slider.animatingTo = slider.currentSlide;
                slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
                slider.containerSelector = vars.selector.substr(0,vars.selector.search(' '));
                slider.slides = $(vars.selector, slider);
                slider.container = $(slider.containerSelector, slider);
                slider.count = slider.slides.length;
                // SYNC:
                slider.syncExists = $(vars.sync).length > 0;
                // SLIDE:
                if (vars.animation === "slide") vars.animation = "swing";
                slider.prop = (vertical) ? "top" : "marginLeft";
                slider.args = {};
                // SLIDESHOW:
                slider.manualPause = false;
                // TOUCH/USECSS:
                slider.transitions = !vars.video && !fade && vars.useCSS && (function() {
                    var obj = document.createElement('div'),
                    props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
                    for (var i in props) {
                        if ( obj.style[ props[i] ] !== undefined ) {
                            slider.pfx = props[i].replace('Perspective','').toLowerCase();
                            slider.prop = "-" + slider.pfx + "-transform";
                            return true;
                        }
                    }
                    return false;
                }());
                // CONTROLSCONTAINER:
                if (vars.controlsContainer !== "") slider.controlsContainer = $(vars.controlsContainer).length > 0 && $(vars.controlsContainer);
                // MANUAL:
                if (vars.manualControls !== "") slider.manualControls = $(vars.manualControls).length > 0 && $(vars.manualControls);
        
                // RANDOMIZE:
                if (vars.randomize) {
                    slider.slides.sort(function() {
                        return (Math.round(Math.random())-0.5);
                    });
                    slider.container.empty().append(slider.slides);
                }
        
                slider.doMath();
        
                // ASNAV:
                if (asNav) methods.asNav.setup();
        
                // INIT
                slider.setup("init");
        
                // CONTROLNAV:
                if (vars.controlNav) methods.controlNav.setup();
        
                // DIRECTIONNAV:
                if (vars.directionNav) methods.directionNav.setup();
        
                // KEYBOARD:
                if (vars.keyboard && ($(slider.containerSelector).length === 1 || vars.multipleKeyboard)) {
                    $(document).bind('keyup', function(event) {
                        var keycode = event.keyCode;
                        if (!slider.animating && (keycode === 39 || keycode === 37)) {
                            var target = (keycode === 39) ? slider.getTarget('next') :
                            (keycode === 37) ? slider.getTarget('prev') : false;
                            slider.flexAnimate(target, vars.pauseOnAction);
                        }
                    });
                }
                // MOUSEWHEEL:
                if (vars.mousewheel) {
                    slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
                        event.preventDefault();
                        var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
                        slider.flexAnimate(target, vars.pauseOnAction);
                    });
                }
        
                // PAUSEPLAY
                if (vars.pausePlay) methods.pausePlay.setup();
        
                // SLIDSESHOW
                if (vars.slideshow) {
                    if (vars.pauseOnHover) {
                        slider.hover(function() {
                            if (!slider.manualPlay && !slider.manualPause) slider.pause();
                        }, function() {
                            if (!slider.manualPause && !slider.manualPlay) slider.play();
                        });
                    }
                    // initialize animation
                    (vars.initDelay > 0) ? setTimeout(slider.play, vars.initDelay) : slider.play();
                }
        
                // TOUCH
                if (touch && vars.touch) methods.touch();
        
                // FADE&&SMOOTHHEIGHT || SLIDE:
                if (!fade || (fade && vars.smoothHeight)) $(window).bind("resize focus", methods.resize);
        
        
                // API: start() Callback
                setTimeout(function(){
                    vars.start(slider);
                }, 200);
            },
            asNav: {
                setup: function() {
                    slider.asNav = true;
                    slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
                    slider.currentItem = slider.currentSlide;
                    slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
                    slider.slides.click(function(e){
                        e.preventDefault();
                        var $slide = $(this),
                        target = $slide.index();
                        if (!$(vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
                            slider.direction = (slider.currentItem < target) ? "next" : "prev";
                            slider.flexAnimate(target, vars.pauseOnAction, false, true, true);
                        }
                    });
                }
            },
            controlNav: {
                setup: function() {
                    if (!slider.manualControls) {
                        methods.controlNav.setupPaging();
                    } else { // MANUALCONTROLS:
                        methods.controlNav.setupManual();
                    }
                },
                setupPaging: function() {
                    var type = (vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
                    j = 1,
                    item;
          
                    slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');
          
                    if (slider.pagingCount > 1) {
                        for (var i = 0; i < slider.pagingCount; i++) {
                            item = (vars.controlNav === "thumbnails") ? '<img src="' + slider.slides.eq(i).attr("data-thumb") + '"/>' : '<a>' + j + '</a>';
                            slider.controlNavScaffold.append('<li>' + item + '</li>');
                            j++;
                        }
                    }
          
                    // CONTROLSCONTAINER:
                    (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
                    methods.controlNav.set();
          
                    methods.controlNav.active();
        
                    slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
                        event.preventDefault();
                        var $this = $(this),
                        target = slider.controlNav.index($this);

                        if (!$this.hasClass(namespace + 'active')) {
                            slider.direction = (target > slider.currentSlide) ? "next" : "prev";
                            slider.flexAnimate(target, vars.pauseOnAction);
                        }
                    });
                    // Prevent iOS click event bug
                    if (touch) {
                        slider.controlNavScaffold.delegate('a', "click touchstart", function(event) {
                            event.preventDefault();
                        });
                    }
                },
                setupManual: function() {
                    slider.controlNav = slider.manualControls;
                    methods.controlNav.active();
          
                    slider.controlNav.live(eventType, function(event) {
                        event.preventDefault();
                        var $this = $(this),
                        target = slider.controlNav.index($this);
                
                        if (!$this.hasClass(namespace + 'active')) {
                            (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
                            slider.flexAnimate(target, vars.pauseOnAction);
                        }
                    });
                    // Prevent iOS click event bug
                    if (touch) {
                        slider.controlNav.live("click touchstart", function(event) {
                            event.preventDefault();
                        });
                    }
                },
                set: function() {
                    var selector = (vars.controlNav === "thumbnails") ? 'img' : 'a';
                    slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
                },
                active: function() {
                    slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
                },
                update: function(action, pos) {
                    if (slider.pagingCount > 1 && action === "add") {
                        slider.controlNavScaffold.append($('<li><a>' + slider.count + '</a></li>'));
                    } else if (slider.pagingCount === 1) {
                        slider.controlNavScaffold.find('li').remove();
                    } else {
                        slider.controlNav.eq(pos).closest('li').remove();
                    }
                    methods.controlNav.set();
                    (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
                }
            },
            directionNav: {
                setup: function() {
                    var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav fixed"><li><a class="' + namespace + 'prev" href="#">' + vars.prevText + '</a></li><li><a class="' + namespace + 'next" href="#">' + vars.nextText + '</a></li></ul>');
        
                    // CONTROLSCONTAINER:
                    if (slider.controlsContainer) {
                        $(slider.controlsContainer).append(directionNavScaffold);
                        slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
                    } else {
                        slider.append(directionNavScaffold);
                        slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
                    }
        
                    methods.directionNav.update();
        
                    slider.directionNav.bind(eventType, function(event) {
                        event.preventDefault();
                        var target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
                        slider.flexAnimate(target, vars.pauseOnAction);
                    });
                    // Prevent iOS click event bug
                    if (touch) {
                        slider.directionNav.bind("click touchstart", function(event) {
                            event.preventDefault();
                        });
                    }
                },
                update: function() {
                    var disabledClass = namespace + 'disabled';
                    if (slider.pagingCount === 1) {
                        slider.directionNav.addClass(disabledClass);
                    } else if (!vars.animationLoop) {
                        if (slider.animatingTo === 0) {
                            slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass);
                        } else if (slider.animatingTo === slider.last) {
                            slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass);
                        } else {
                            slider.directionNav.removeClass(disabledClass);
                        }
                    } else {
                        slider.directionNav.removeClass(disabledClass);
                    }
                }
            },
            pausePlay: {
                setup: function() {
                    var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a></a></div>');
        
                    // CONTROLSCONTAINER:
                    if (slider.controlsContainer) {
                        slider.controlsContainer.append(pausePlayScaffold);
                        slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
                    } else {
                        slider.append(pausePlayScaffold);
                        slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
                    }

                    methods.pausePlay.update((vars.slideshow) ? namespace + 'pause' : namespace + 'play');

                    slider.pausePlay.bind(eventType, function(event) {
                        event.preventDefault();
                        if ($(this).hasClass(namespace + 'pause')) {
                            slider.manualPause = true;
                            slider.manualPlay = false;
                            slider.pause();
                        } else {
                            slider.manualPause = false;
                            slider.manualPlay = true;
                            slider.play();
                        }
                    });
                    // Prevent iOS click event bug
                    if (touch) {
                        slider.pausePlay.bind("click touchstart", function(event) {
                            event.preventDefault();
                        });
                    }
                },
                update: function(state) {
                    (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').text(vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').text(vars.pauseText);
                }
            },
            touch: function() {
                var startX,
                startY,
                offset,
                cwidth,
                dx,
                startT,
                scrolling = false;
              
                el.addEventListener('touchstart', onTouchStart, false);
                function onTouchStart(e) {
                    if (slider.animating) {
                        e.preventDefault();
                    } else if (e.touches.length === 1) {
                        slider.pause();
                        // CAROUSEL: 
                        cwidth = (vertical) ? slider.h : slider. w;
                        startT = Number(new Date());
                        // CAROUSEL:
                        offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                        (carousel && reverse) ? slider.limit - (((slider.itemW + vars.itemMargin) * slider.move) * slider.animatingTo) :
                        (carousel && slider.currentSlide === slider.last) ? slider.limit :
                        (carousel) ? ((slider.itemW + vars.itemMargin) * slider.move) * slider.currentSlide : 
                        (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                        startX = (vertical) ? e.touches[0].pageY : e.touches[0].pageX;
                        startY = (vertical) ? e.touches[0].pageX : e.touches[0].pageY;

                        el.addEventListener('touchmove', onTouchMove, false);
                        el.addEventListener('touchend', onTouchEnd, false);
                    }
                }

                function onTouchMove(e) {
                    dx = (vertical) ? startX - e.touches[0].pageY : startX - e.touches[0].pageX;
                    scrolling = (vertical) ? (Math.abs(dx) < Math.abs(e.touches[0].pageX - startY)) : (Math.abs(dx) < Math.abs(e.touches[0].pageY - startY));
          
                    if (!scrolling || Number(new Date()) - startT > 500) {
                        e.preventDefault();
                        if (!fade && slider.transitions) {
                            if (!vars.animationLoop) {
                                dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
                            }
                            slider.setProps(offset + dx, "setTouch");
                        }
                    }
                }
        
                function onTouchEnd(e) {
                    if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                        var updateDx = (reverse) ? -dx : dx,
                        target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');
            
                        if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                            slider.flexAnimate(target, vars.pauseOnAction);
                        } else {
                            slider.flexAnimate(slider.currentSlide, vars.pauseOnAction, true);
                        }
                    }
                    // finish the touch by undoing the touch session
                    el.removeEventListener('touchmove', onTouchMove, false);
                    el.removeEventListener('touchend', onTouchEnd, false);
                    startX = null;
                    startY = null;
                    dx = null;
                    offset = null;
                }
            },
            resize: function() {
                if (!slider.animating && slider.is(':visible')) {
                    if (!carousel) slider.doMath();
          
                    if (fade) {
                        // SMOOTH HEIGHT:
                        methods.smoothHeight();
                    } else if (carousel) { //CAROUSEL:
                        slider.slides.width(slider.computedW);
                        slider.update(slider.pagingCount);
                        slider.setProps();
                    }
                    else if (vertical) { //VERTICAL:
                        slider.viewport.height(slider.h);
                        slider.setProps(slider.h, "setTotal");
                    } else {
                        // SMOOTH HEIGHT:
                        if (vars.smoothHeight) methods.smoothHeight();
                        slider.newSlides.width(slider.computedW);
                        slider.setProps(slider.computedW, "setTotal");
                    }
                }
            },
            smoothHeight: function(dur) {
                if (!vertical || fade) {
                    var $obj = (fade) ? slider : slider.viewport;
                    (dur) ? $obj.animate({
                        "height": slider.slides.eq(slider.animatingTo).height()
                        }, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
                }
            },
            sync: function(action) {
                var $obj = $(vars.sync).data("flexslider"),
                target = slider.animatingTo;
        
                switch (action) {
                    case "animate":
                        $obj.flexAnimate(target, vars.pauseOnAction, false, true);
                        break;
                    case "play":
                        if (!$obj.playing && !$obj.asNav) {
                        $obj.play();
                    }
                    break;
                    case "pause":
                        $obj.pause();
                        break;
                }
            }
        }
    
        // public methods
        slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
            if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

            if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
                if (asNav && withSync) {
                    var master = $(vars.asNavFor).data('flexslider');
                    slider.atEnd = target === 0 || target === slider.count - 1;
                    master.flexAnimate(target, true, false, true, fromNav);
                    slider.direction = (slider.currentItem < target) ? "next" : "prev";
                    master.direction = slider.direction;
          
                    if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
                        slider.currentItem = target;
                        slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
                        target = Math.floor(target/slider.visible);
                    } else {
                        slider.currentItem = target;
                        slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
                        return false;
                    }
                }
        
                slider.animating = true;
                slider.animatingTo = target;
                // API: before() animation Callback
                vars.before(slider);
        
                // SLIDESHOW:
                if (pause) slider.pause();
        
                // SYNC:
                if (slider.syncExists && !fromNav) methods.sync("animate");
        
                // CONTROLNAV
                if (vars.controlNav) methods.controlNav.active();
        
                // !CAROUSEL:
                // CANDIDATE: slide active class (for add/remove slide)
                if (!carousel) slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide');
        
                // INFINITE LOOP:
                // CANDIDATE: atEnd
                slider.atEnd = target === 0 || target === slider.last;
        
                // DIRECTIONNAV:
                if (vars.directionNav) methods.directionNav.update();
        
                if (target === slider.last) {
                    // API: end() of cycle Callback
                    vars.end(slider);
                    // SLIDESHOW && !INFINITE LOOP:
                    if (!vars.animationLoop) slider.pause();
                }
        
                // SLIDE:
                if (!fade) {
                    var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
                    margin, slideString, calcNext;
          
                    // INFINITE LOOP / REVERSE:
                    if (carousel) {
                        margin = (vars.itemWidth > slider.w) ? vars.itemMargin * 2 : vars.itemMargin;
                        calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
                        slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
                    } else if (slider.currentSlide === 0 && target === slider.count - 1 && vars.animationLoop && slider.direction !== "next") {
                        slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
                    } else if (slider.currentSlide === slider.last && target === 0 && vars.animationLoop && slider.direction !== "prev") {
                        slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
                    } else {
                        slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
                    }
                    slider.setProps(slideString, "", vars.animationSpeed);
                    if (slider.transitions) {
                        if (!vars.animationLoop || !slider.atEnd) {
                            slider.animating = false;
                            slider.currentSlide = slider.animatingTo;
                        }
                        slider.container.unbind("webkitTransitionEnd transitionend");
                        slider.container.bind("webkitTransitionEnd transitionend", function() {
                            slider.wrapup(dimension);
                        });
                    } else {
                        slider.container.animate(slider.args, vars.animationSpeed, vars.easing, function(){
                            slider.wrapup(dimension);
                        });
                    }
                } else { // FADE:
                    slider.slides.eq(slider.currentSlide).fadeOut(vars.animationSpeed, vars.easing);
                    slider.slides.eq(target).fadeIn(vars.animationSpeed, vars.easing, slider.wrapup);
                }
                // SMOOTH HEIGHT:
                if (vars.smoothHeight) methods.smoothHeight(vars.animationSpeed);
            }
        } 
        slider.wrapup = function(dimension) {
            // SLIDE:
            if (!fade && !carousel) {
                if (slider.currentSlide === 0 && slider.animatingTo === slider.last && vars.animationLoop) {
                    slider.setProps(dimension, "jumpEnd");
                } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && vars.animationLoop) {
                    slider.setProps(dimension, "jumpStart");
                }
            }
            slider.animating = false;
            slider.currentSlide = slider.animatingTo;
            // API: after() animation Callback
            vars.after(slider);
        }
    
        // SLIDESHOW:
        slider.animateSlides = function() {
            if (!slider.animating) slider.flexAnimate(slider.getTarget("next"));
        }
        // SLIDESHOW:
        slider.pause = function() {
            clearInterval(slider.animatedSlides);
            slider.playing = false;
            // PAUSEPLAY:
            if (vars.pausePlay) methods.pausePlay.update("play");
            // SYNC:
            if (slider.syncExists) methods.sync("pause");
        }
        // SLIDESHOW:
        slider.play = function() {
            slider.animatedSlides = setInterval(slider.animateSlides, vars.slideshowSpeed);
            slider.playing = true;
            // PAUSEPLAY:
            if (vars.pausePlay) methods.pausePlay.update("pause");
            // SYNC:
            if (slider.syncExists) methods.sync("play");
        }
        slider.canAdvance = function(target, fromNav) {
            // ASNAV:
            var last = (asNav) ? slider.pagingCount - 1 : slider.last;
            return (fromNav) ? true :
            (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
            (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
            (target === slider.currentSlide && !asNav) ? false :
            (vars.animationLoop) ? true :
            (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
            (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
            true;
        }
        slider.getTarget = function(dir) {
            slider.direction = dir; 
            if (dir === "next") {
                return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
            } else {
                return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
            }
        }
    
        // SLIDE:
        slider.setProps = function(pos, special, dur) {
            var target = (function() {
                var posCheck = (pos) ? pos : ((slider.itemW + vars.itemMargin) * slider.move) * slider.animatingTo,
                posCalc = (function() {
                    if (carousel) {
                        return (special === "setTouch") ? pos :
                        (reverse && slider.animatingTo === slider.last) ? 0 :
                        (reverse) ? slider.limit - (((slider.itemW + vars.itemMargin) * slider.move) * slider.animatingTo) :
                        (slider.animatingTo === slider.last) ? slider.limit : posCheck;
                    } else {
                        switch (special) {
                            case "setTotal":
                                return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                            case "setTouch":
                                return (reverse) ? pos : pos;
                            case "jumpEnd":
                                return (reverse) ? pos : slider.count * pos;
                            case "jumpStart":
                                return (reverse) ? slider.count * pos : pos;
                            default:
                                return pos;
                        }
                    }
                }());
                return (posCalc * -1) + "px";
            }());

            if (slider.transitions) {
                target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
                dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
                slider.container.css("-" + slider.pfx + "-transition-duration", dur);
            }
      
            slider.args[slider.prop] = target;
            if (slider.transitions || dur === undefined) slider.container.css(slider.args);
        }
    
        slider.setup = function(type) {
            // SLIDE:
            if (!fade) {
                var sliderOffset, arr;
            
                if (type === "init") {
                    slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({
                        "overflow": "hidden", 
                        "position": "relative"
                    }).appendTo(slider).append(slider.container);
                    // INFINITE LOOP:
                    slider.cloneCount = 0;
                    slider.cloneOffset = 0;
                    // REVERSE:
                    if (reverse) {
                        arr = $.makeArray(slider.slides).reverse();
                        slider.slides = $(arr);
                        slider.container.empty().append(slider.slides);
                    }
                }
                // INFINITE LOOP && !CAROUSEL:
                if (vars.animationLoop && !carousel) {
                    slider.cloneCount = 2;
                    slider.cloneOffset = 1;
                    // clear out old clones
                    if (type !== "init") slider.container.find('.clone').remove();
                    slider.container.append(slider.slides.first().clone().addClass('clone')).prepend(slider.slides.last().clone().addClass('clone'));
                }
                slider.newSlides = $(vars.selector, slider);
        
                sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
                // VERTICAL:
                if (vertical && !carousel) {
                    slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
                    setTimeout(function(){
                        slider.newSlides.css({
                            "display": "block"
                        });
                        slider.doMath();
                        slider.viewport.height(slider.h);
                        slider.setProps(sliderOffset * slider.h, "init");
                    }, (type === "init") ? 100 : 0);
                } else {
                    slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
                    slider.setProps(sliderOffset * slider.computedW, "init");
                    setTimeout(function(){
                        slider.doMath();
                        slider.newSlides.css({
                            "width": slider.computedW, 
                            "float": "left", 
                            "display": "block"
                        });
                        // SMOOTH HEIGHT:
                        if (vars.smoothHeight) methods.smoothHeight();
                    }, (type === "init") ? 100 : 0);
                }
            } else { // FADE: 
                slider.slides.css({
                    "width": "100%", 
                    "float": "left", 
                    "marginRight": "-100%", 
                    "position": "relative"
                });
                if (type === "init") slider.slides.eq(slider.currentSlide).fadeIn(vars.animationSpeed, vars.easing);
                // SMOOTH HEIGHT:
                if (vars.smoothHeight) methods.smoothHeight();
            }
            // !CAROUSEL:
            // CANDIDATE: active slide
            if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide");
        }
    
        slider.doMath = function() {
            var slide = slider.slides.first(),
            slideMargin = vars.itemMargin,
            minItems = vars.minItems,
            maxItems = vars.maxItems;
      
            slider.w = slider.width();
            slider.h = slide.height();
            slider.boxPadding = slide.outerWidth() - slide.width();

            // CAROUSEL:
            if (carousel) {
                slider.itemT = vars.itemWidth + slideMargin;
                slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
                slider.maxW = (maxItems) ? maxItems * slider.itemT : slider.w;
                slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * minItems))/minItems :
                (slider.maxW < slider.w) ? (slider.w - (slideMargin * maxItems))/maxItems :
                (vars.itemWidth > slider.w) ? slider.w : vars.itemWidth;
                slider.visible = Math.floor(slider.w/(slider.itemW + slideMargin));
                slider.move = (vars.move > 0 && vars.move < slider.visible ) ? vars.move : slider.visible;
                slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
                slider.last =  slider.pagingCount - 1;
                slider.limit = (slider.pagingCount === 1) ? 0 :
                (vars.itemWidth > slider.w) ? ((slider.itemW + (slideMargin * 2)) * slider.count) - slider.w - slideMargin : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
            } else {
                slider.itemW = slider.w;
                slider.pagingCount = slider.count;
                slider.last = slider.count - 1;
            }
            slider.computedW = slider.itemW - slider.boxPadding;
        }
    
        slider.update = function(pos, action) {
            slider.doMath();
      
            // update currentSlide and slider.animatingTo if necessary
            if (!carousel) {
                if (pos < slider.currentSlide) {
                    slider.currentSlide += 1;
                } else if (pos <= slider.currentSlide && pos !== 0) {
                    slider.currentSlide -= 1;
                }
                slider.animatingTo = slider.currentSlide;
            }
      
            // update controlNav
            if (vars.controlNav && !slider.manualControls) {
                if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
                    methods.controlNav.update("add");
                } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
                    if (carousel && slider.currentSlide > slider.last) {
                        slider.currentSlide -= 1;
                        slider.animatingTo -= 1;
                    }
                    methods.controlNav.update("remove", slider.last);
                }
            }
            // update directionNav
            if (vars.directionNav) methods.directionNav.update();
      
        }
    
        slider.addSlide = function(obj, pos) {
            var $obj = $(obj);
      
            slider.count += 1;
            slider.last = slider.count - 1;
      
            // append new slide
            if (vertical && reverse) {
                (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
            } else {
                (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
            }
      
            // update currentSlide, animatingTo, controlNav, and directionNav
            slider.update(pos, "add");
      
            // update slider.slides
            slider.slides = $(vars.selector + ':not(.clone)', slider);
            // re-setup the slider to accomdate new slide
            slider.setup();
      
            //FlexSlider: added() Callback
            vars.added(slider);
        }
        slider.removeSlide = function(obj) {
            var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;
      
            // update count
            slider.count -= 1;
            slider.last = slider.count - 1;
      
            // remove slide
            if (isNaN(obj)) {
                $(obj, slider.slides).remove();
            } else {
                (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
            }
      
            // update currentSlide, animatingTo, controlNav, and directionNav
            slider.doMath();
            slider.update(pos, "remove");
      
            // update slider.slides
            slider.slides = $(vars.selector + ':not(.clone)', slider);
            // re-setup the slider to accomdate new slide
            slider.setup();
      
            // FlexSlider: removed() Callback
            vars.removed(slider);
        }
    
        //FlexSlider: Initialize
        methods.init();
    }
  
    //FlexSlider: Default Settings
    $.flexslider.defaults = {
        namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
        selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
        animation: "fade",              //String: Select your animation type, "fade" or "slide"
        easing: "swing",               //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
        direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
        reverse: false,                 //{NEW} Boolean: Reverse the animation direction
        animationLoop: true,             //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
        smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode  
        startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
        slideshow: true,                //Boolean: Animate slider automatically
        slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
        animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
        initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
        randomize: false,               //Boolean: Randomize slide order
    
        // Usability features
        pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
        pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
        useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
        touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
        video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches
    
        // Primary Controls
        controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
        directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
        prevText: "Previous",           //String: Set the text for the "previous" directionNav item
        nextText: "Next",               //String: Set the text for the "next" directionNav item
    
        // Secondary Navigation
        keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
        multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
        mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
        pausePlay: false,               //Boolean: Create pause/play dynamic element
        pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
        playText: "Play",               //String: Set the text for the "play" pausePlay item
    
        // Special properties
        controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
        manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
        sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
        asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider
    
        // Carousel Options
        itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
        itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
        minItems: 0,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
        maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
        move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
                                    
        // Callback API
        start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
        before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
        after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
        end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
        added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
        removed: function(){}           //{NEW} Callback: function(slider) - Fires after a slide is removed
    }


    //FlexSlider: Plugin Function
    $.fn.flexslider = function(options) {
        if (options === undefined) options = {};
    
        if (typeof options === "object") {
            return this.each(function() {
                var $this = $(this),
                selector = (options.selector) ? options.selector : ".slides > li",
                $slides = $this.find(selector);

                if ($slides.length === 1) {
                    $slides.fadeIn(400);
                    if (options.start) options.start($this);
                } else if ($this.data('flexslider') === undefined) {
                    new $.flexslider(this, options);
                }
            });
        } else {
            // Helper strings to quickly perform functions on the slider
            var $slider = $(this).data('flexslider');
            switch (options) {
                case "play":
                    $slider.play();
                    break;
                case "pause":
                    $slider.pause();
                    break;
                case "next":
                    $slider.flexAnimate($slider.getTarget("next"), true);
                    break;
                case "prev":
                case "previous":
                    $slider.flexAnimate($slider.getTarget("prev"), true);
                    break;
                default:
                    if (typeof options === "number") $slider.flexAnimate(options, true);
            }
        }
    }  

})(jQuery);


/*global jQuery */
/*! 
* FitVids 1.0
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function( $ ){

    $.fn.fitVids = function( options ) {
        var settings = {
            customSelector: null
        }
    
        var div = document.createElement('div'),
        ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];
        
        div.className = 'fit-vids-style';
        div.innerHTML = '&shy;<style>         \
      .fluid-width-video-wrapper {        \
         width: 100%;                     \
         position: relative;              \
         padding: 0;                      \
      }                                   \
                                          \
      .fluid-width-video-wrapper iframe,  \
      .fluid-width-video-wrapper object,  \
      .fluid-width-video-wrapper embed {  \
         position: absolute;              \
         top: 0;                          \
         left: 0;                         \
         width: 100%;                     \
         height: 100%;                    \
      }                                   \
    </style>';
                      
        ref.parentNode.insertBefore(div,ref);
    
        if ( options ) { 
            $.extend( settings, options );
        }
    
        return this.each(function(){
            var selectors = [
            "iframe[src^='http://player.vimeo.com']", 
            "iframe[src^='http://www.youtube.com']", 
            "iframe[src^='https://www.youtube.com']", 
            "iframe[src^='http://www.kickstarter.com']", 
            "object", 
            "embed"
            ];
      
            if (settings.customSelector) {
                selectors.push(settings.customSelector);
            }
      
            var $allVideos = $(this).find(selectors.join(','));

            $allVideos.each(function(){
                var $this = $(this);
                if (this.tagName.toLowerCase() == 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) {
                    return;
                } 
                var height = this.tagName.toLowerCase() == 'object' ? $this.attr('height') : $this.height(),
                aspectRatio = height / $this.width();
                if(!$this.attr('id')){
                    var videoID = 'fitvid' + Math.floor(Math.random()*999999);
                    $this.attr('id', videoID);
                }
                $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
                $this.removeAttr('height').removeAttr('width');
            });
        });
  
    }
})( jQuery );

/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT License.
*/
(function(w){
	
    // This fix addresses an iOS bug, so return early if the UA claims it's something else.
    if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ) ){
        return;
    }
	
    var doc = w.document;

    if( !doc.querySelector ){
        return;
    }

    var meta = doc.querySelector( "meta[name=viewport]" ),
    initialContent = meta && meta.getAttribute( "content" ),
    disabledZoom = initialContent + ",maximum-scale=1",
    enabledZoom = initialContent + ",maximum-scale=10",
    enabled = true,
    x, y, z, aig;

    if( !meta ){
        return;
    }

    function restoreZoom(){
        meta.setAttribute( "content", enabledZoom );
        enabled = true;
    }

    function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false;
    }
	
    function checkTilt( e ){
        aig = e.accelerationIncludingGravity;
        x = Math.abs( aig.x );
        y = Math.abs( aig.y );
        z = Math.abs( aig.z );
				
        // If portrait orientation and in one of the danger zones
        if( !w.orientation && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
            if( enabled ){
                disableZoom();
            }        	
        }
        else if( !enabled ){
            restoreZoom();
        }
    }
	
    w.addEventListener( "orientationchange", restoreZoom, false );
    w.addEventListener( "devicemotion", checkTilt, false );

})(this);


// make it safe to use console.log always
(function(a){
    function b(){}
    for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){
        a[d]=a[d]||b;
    }
    })
(function(){
    try{
        console.log();
        return window.console;
    }catch(a){
        return (window.console={});
    }
}());

(function($) {
    
    jQuery.fn.labelify = function(settings) {
        settings = jQuery.extend({
            text: "title",
            labelledClass: ""
        }, settings);
        var lookups = {
            title: function(input) {
                return $(input).attr("title");
            },
            label: function(input) {
                return $("label[for=" + input.id +"]").text();
            }
        };
        var lookup;
        var jQuery_labellified_elements = $(this);
        return $(this).each(function() {
            if (typeof settings.text === "string") {
                lookup = lookups[settings.text]; // what if not there?
            } else {
                lookup = settings.text; // what if not a fn?
            };
            // bail if lookup isn't a function or if it returns undefined
            if (typeof lookup !== "function") {
                return;
            }
            var lookupval = lookup(this);
            if (!lookupval) {
                return;
            }

            // need to strip newlines because the browser strips them
            // if you set textbox.value to a string containing them
            $(this).data("label",lookup(this).replace(/\n/g,''));
            $(this).focus(function() {
                if (this.value === $(this).data("label")) {
                    this.value = this.defaultValue;
                    $(this).removeClass(settings.labelledClass);
                }
            }).blur(function(){
                if (this.value === this.defaultValue) {
                    this.value = $(this).data("label");
                    $(this).addClass(settings.labelledClass);
                }
            });

            var removeValuesOnExit = function() {
                jQuery_labellified_elements.each(function(){
                    if (this.value === $(this).data("label")) {
                        this.value = this.defaultValue;
                        $(this).removeClass(settings.labelledClass);
                    }
                })
            };

            $(this).parents("form").submit(removeValuesOnExit);
            $(window).unload(removeValuesOnExit);

            if (this.value !== this.defaultValue) {
                // user already started typing; don't overwrite their work!
                return;
            }
            // actually set the value
            this.value = $(this).data("label");
            $(this).addClass(settings.labelledClass);

        });
    };
})(jQuery);

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

    var types = ['DOMMouseScroll', 'mousewheel'];

    if ($.event.fixHooks) {
        for ( var i=types.length; i; ) {
            $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i=types.length; i; ) {
                    this.addEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },
    
        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i=types.length; i; ) {
                    this.removeEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },
    
        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";
    
        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) {
            delta = orgEvent.wheelDelta/120;
        }
        if ( orgEvent.detail     ) {
            delta = -orgEvent.detail/3;
        }
    
        // New school multidimensional scroll (touchpads) deltas
        deltaY = delta;
    
        // Gecko
        if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaY = 0;
            deltaX = -1*delta;
        }
    
        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) {
            deltaY = orgEvent.wheelDeltaY/120;
        }
        if ( orgEvent.wheelDeltaX !== undefined ) {
            deltaX = -1*orgEvent.wheelDeltaX/120;
        }
    
        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);
    
        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

})(jQuery);

/*
 * jScrollPane - v2.0.0beta12 - 2012-05-14
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2010 Kelvin Luck
 * Dual licensed under the MIT and GPL licenses.
 */
(function(b,a,c){
    b.fn.jScrollPane=function(e){
        function d(D,O){
            var ay,Q=this,Y,aj,v,al,T,Z,y,q,az,aE,au,i,I,h,j,aa,U,ap,X,t,A,aq,af,am,G,l,at,ax,x,av,aH,f,L,ai=true,P=true,aG=false,k=false,ao=D.clone(false,false).empty(),ac=b.fn.mwheelIntent?"mwheelIntent.jsp":"mousewheel.jsp";
            aH=D.css("paddingTop")+" "+D.css("paddingRight")+" "+D.css("paddingBottom")+" "+D.css("paddingLeft");
            f=(parseInt(D.css("paddingLeft"),10)||0)+(parseInt(D.css("paddingRight"),10)||0);
            function ar(aQ){
                var aL,aN,aM,aJ,aI,aP,aO=false,aK=false;
                ay=aQ;
                if(Y===c){
                    aI=D.scrollTop();
                    aP=D.scrollLeft();
                    D.css({
                        overflow:"hidden",
                        padding:0
                    });
                    aj=D.innerWidth()+f;
                    v=D.innerHeight();
                    D.width(aj);
                    Y=b('<div class="jspPane" />').css("padding",aH).append(D.children());
                    al=b('<div class="jspContainer" />').css({
                        width:aj+"px",
                        height:v+"px"
                        }).append(Y).appendTo(D)
                    }else{
                    D.css("width","");
                    aO=ay.stickToBottom&&K();
                    aK=ay.stickToRight&&B();
                    aJ=D.innerWidth()+f!=aj||D.outerHeight()!=v;
                    if(aJ){
                        aj=D.innerWidth()+f;
                        v=D.innerHeight();
                        al.css({
                            width:aj+"px",
                            height:v+"px"
                            })
                        }
                        if(!aJ&&L==T&&Y.outerHeight()==Z){
                        D.width(aj);
                        return
                    }
                    L=T;
                    Y.css("width","");
                    D.width(aj);
                    al.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()
                    }
                    Y.css("overflow","auto");
                if(aQ.contentWidth){
                    T=aQ.contentWidth
                    }else{
                    T=Y[0].scrollWidth
                    }
                    Z=Y[0].scrollHeight;
                Y.css("overflow","");
                y=T/aj;
                q=Z/v;
                az=q>1;
                aE=y>1;
                if(!(aE||az)){
                    D.removeClass("jspScrollable");
                    Y.css({
                        top:0,
                        width:al.width()-f
                        });
                    n();
                    E();
                    R();
                    w()
                    }else{
                    D.addClass("jspScrollable");
                    aL=ay.maintainPosition&&(I||aa);
                    if(aL){
                        aN=aC();
                        aM=aA()
                        }
                        aF();
                    z();
                    F();
                    if(aL){
                        N(aK?(T-aj):aN,false);
                        M(aO?(Z-v):aM,false)
                        }
                        J();
                    ag();
                    an();
                    if(ay.enableKeyboardNavigation){
                        S()
                        }
                        if(ay.clickOnTrack){
                        p()
                        }
                        C();
                    if(ay.hijackInternalLinks){
                        m()
                        }
                    }
                if(ay.autoReinitialise&&!av){
                av=setInterval(function(){
                    ar(ay)
                    },ay.autoReinitialiseDelay)
                }else{
                if(!ay.autoReinitialise&&av){
                    clearInterval(av)
                    }
                }
            aI&&D.scrollTop(0)&&M(aI,false);
        aP&&D.scrollLeft(0)&&N(aP,false);
        D.trigger("jsp-initialised",[aE||az])
        }
        function aF(){
        if(az){
            al.append(b('<div class="jspVerticalBar" />').append(b('<div class="jspCap jspCapTop" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragTop" />'),b('<div class="jspDragBottom" />'))),b('<div class="jspCap jspCapBottom" />')));
            U=al.find(">.jspVerticalBar");
            ap=U.find(">.jspTrack");
            au=ap.find(">.jspDrag");
            if(ay.showArrows){
                aq=b('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp",aD(0,-1)).bind("click.jsp",aB);
                af=b('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp",aD(0,1)).bind("click.jsp",aB);
                if(ay.arrowScrollOnHover){
                    aq.bind("mouseover.jsp",aD(0,-1,aq));
                    af.bind("mouseover.jsp",aD(0,1,af))
                    }
                    ak(ap,ay.verticalArrowPositions,aq,af)
                }
                t=v;
            al.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function(){
                t-=b(this).outerHeight()
                });
            au.hover(function(){
                au.addClass("jspHover")
                },function(){
                au.removeClass("jspHover")
                }).bind("mousedown.jsp",function(aI){
                b("html").bind("dragstart.jsp selectstart.jsp",aB);
                au.addClass("jspActive");
                var s=aI.pageY-au.position().top;
                b("html").bind("mousemove.jsp",function(aJ){
                    V(aJ.pageY-s,false)
                    }).bind("mouseup.jsp mouseleave.jsp",aw);
                return false
                });
            o()
            }
        }
    function o(){
    ap.height(t+"px");
    I=0;
    X=ay.verticalGutter+ap.outerWidth();
    Y.width(aj-X-f);
    try{
        if(U.position().left===0){
            Y.css("margin-left",X+"px")
            }
        }catch(s){}
    }
    function z(){
    if(aE){
        al.append(b('<div class="jspHorizontalBar" />').append(b('<div class="jspCap jspCapLeft" />'),b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragLeft" />'),b('<div class="jspDragRight" />'))),b('<div class="jspCap jspCapRight" />')));
        am=al.find(">.jspHorizontalBar");
        G=am.find(">.jspTrack");
        h=G.find(">.jspDrag");
        if(ay.showArrows){
            ax=b('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp",aD(-1,0)).bind("click.jsp",aB);
            x=b('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp",aD(1,0)).bind("click.jsp",aB);
            if(ay.arrowScrollOnHover){
                ax.bind("mouseover.jsp",aD(-1,0,ax));
                x.bind("mouseover.jsp",aD(1,0,x))
                }
                ak(G,ay.horizontalArrowPositions,ax,x)
            }
            h.hover(function(){
            h.addClass("jspHover")
            },function(){
            h.removeClass("jspHover")
            }).bind("mousedown.jsp",function(aI){
            b("html").bind("dragstart.jsp selectstart.jsp",aB);
            h.addClass("jspActive");
            var s=aI.pageX-h.position().left;
            b("html").bind("mousemove.jsp",function(aJ){
                W(aJ.pageX-s,false)
                }).bind("mouseup.jsp mouseleave.jsp",aw);
            return false
            });
        l=al.innerWidth();
        ah()
        }
    }
function ah(){
    al.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function(){
        l-=b(this).outerWidth()
        });
    G.width(l+"px");
    aa=0
    }
    function F(){
    if(aE&&az){
        var aI=G.outerHeight(),s=ap.outerWidth();
        t-=aI;
        b(am).find(">.jspCap:visible,>.jspArrow").each(function(){
            l+=b(this).outerWidth()
            });
        l-=s;
        v-=s;
        aj-=aI;
        G.parent().append(b('<div class="jspCorner" />').css("width",aI+"px"));
        o();
        ah()
        }
        if(aE){
        Y.width((al.outerWidth()-f)+"px")
        }
        Z=Y.outerHeight();
    q=Z/v;
    if(aE){
        at=Math.ceil(1/y*l);
        if(at>ay.horizontalDragMaxWidth){
            at=ay.horizontalDragMaxWidth
            }else{
            if(at<ay.horizontalDragMinWidth){
                at=ay.horizontalDragMinWidth
                }
            }
        h.width(at+"px");
    j=l-at;
    ae(aa)
    }
    if(az){
    A=Math.ceil(1/q*t);
    if(A>ay.verticalDragMaxHeight){
        A=ay.verticalDragMaxHeight
        }else{
        if(A<ay.verticalDragMinHeight){
            A=ay.verticalDragMinHeight
            }
        }
    au.height(A+"px");
i=t-A;
ad(I)
}
}
function ak(aJ,aL,aI,s){
    var aN="before",aK="after",aM;
    if(aL=="os"){
        aL=/Mac/.test(navigator.platform)?"after":"split"
        }
        if(aL==aN){
        aK=aL
        }else{
        if(aL==aK){
            aN=aL;
            aM=aI;
            aI=s;
            s=aM
            }
        }
    aJ[aN](aI)[aK](s)
}
function aD(aI,s,aJ){
    return function(){
        H(aI,s,this,aJ);
        this.blur();
        return false
        }
    }
function H(aL,aK,aO,aN){
    aO=b(aO).addClass("jspActive");
    var aM,aJ,aI=true,s=function(){
        if(aL!==0){
            Q.scrollByX(aL*ay.arrowButtonSpeed)
            }
            if(aK!==0){
            Q.scrollByY(aK*ay.arrowButtonSpeed)
            }
            aJ=setTimeout(s,aI?ay.initialDelay:ay.arrowRepeatFreq);
        aI=false
        };
        
    s();
    aM=aN?"mouseout.jsp":"mouseup.jsp";
    aN=aN||b("html");
    aN.bind(aM,function(){
        aO.removeClass("jspActive");
        aJ&&clearTimeout(aJ);
        aJ=null;
        aN.unbind(aM)
        })
    }
    function p(){
    w();
    if(az){
        ap.bind("mousedown.jsp",function(aN){
            if(aN.originalTarget===c||aN.originalTarget==aN.currentTarget){
                var aL=b(this),aO=aL.offset(),aM=aN.pageY-aO.top-I,aJ,aI=true,s=function(){
                    var aR=aL.offset(),aS=aN.pageY-aR.top-A/2,aP=v*ay.scrollPagePercent,aQ=i*aP/(Z-v);
                    if(aM<0){
                        if(I-aQ>aS){
                            Q.scrollByY(-aP)
                            }else{
                            V(aS)
                            }
                        }else{
                    if(aM>0){
                        if(I+aQ<aS){
                            Q.scrollByY(aP)
                            }else{
                            V(aS)
                            }
                        }else{
                    aK();
                    return
                }
            }
            aJ=setTimeout(s,aI?ay.initialDelay:ay.trackClickRepeatFreq);
            aI=false
            },aK=function(){
            aJ&&clearTimeout(aJ);
            aJ=null;
            b(document).unbind("mouseup.jsp",aK)
            };
            
        s();
        b(document).bind("mouseup.jsp",aK);
        return false
        }
    })
}
if(aE){
    G.bind("mousedown.jsp",function(aN){
        if(aN.originalTarget===c||aN.originalTarget==aN.currentTarget){
            var aL=b(this),aO=aL.offset(),aM=aN.pageX-aO.left-aa,aJ,aI=true,s=function(){
                var aR=aL.offset(),aS=aN.pageX-aR.left-at/2,aP=aj*ay.scrollPagePercent,aQ=j*aP/(T-aj);
                if(aM<0){
                    if(aa-aQ>aS){
                        Q.scrollByX(-aP)
                        }else{
                        W(aS)
                        }
                    }else{
                if(aM>0){
                    if(aa+aQ<aS){
                        Q.scrollByX(aP)
                        }else{
                        W(aS)
                        }
                    }else{
                aK();
                return
            }
        }
        aJ=setTimeout(s,aI?ay.initialDelay:ay.trackClickRepeatFreq);
        aI=false
        },aK=function(){
        aJ&&clearTimeout(aJ);
        aJ=null;
        b(document).unbind("mouseup.jsp",aK)
        };
        
    s();
    b(document).bind("mouseup.jsp",aK);
    return false
    }
})
}
}
function w(){
    if(G){
        G.unbind("mousedown.jsp")
        }
        if(ap){
        ap.unbind("mousedown.jsp")
        }
    }
function aw(){
    b("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");
    if(au){
        au.removeClass("jspActive")
        }
        if(h){
        h.removeClass("jspActive")
        }
    }
function V(s,aI){
    if(!az){
        return
    }
    if(s<0){
        s=0
        }else{
        if(s>i){
            s=i
            }
        }
    if(aI===c){
    aI=ay.animateScroll
    }
    if(aI){
    Q.animate(au,"top",s,ad)
    }else{
    au.css("top",s);
    ad(s)
    }
}
function ad(aI){
    if(aI===c){
        aI=au.position().top
        }
        al.scrollTop(0);
    I=aI;
    var aL=I===0,aJ=I==i,aK=aI/i,s=-aK*(Z-v);
    if(ai!=aL||aG!=aJ){
        ai=aL;
        aG=aJ;
        D.trigger("jsp-arrow-change",[ai,aG,P,k])
        }
        u(aL,aJ);
    Y.css("top",s);
    D.trigger("jsp-scroll-y",[-s,aL,aJ]).trigger("scroll")
    }
    function W(aI,s){
    if(!aE){
        return
    }
    if(aI<0){
        aI=0
        }else{
        if(aI>j){
            aI=j
            }
        }
    if(s===c){
    s=ay.animateScroll
    }
    if(s){
    Q.animate(h,"left",aI,ae)
}else{
    h.css("left",aI);
    ae(aI)
    }
}
function ae(aI){
    if(aI===c){
        aI=h.position().left
        }
        al.scrollTop(0);
    aa=aI;
    var aL=aa===0,aK=aa==j,aJ=aI/j,s=-aJ*(T-aj);
    if(P!=aL||k!=aK){
        P=aL;
        k=aK;
        D.trigger("jsp-arrow-change",[ai,aG,P,k])
        }
        r(aL,aK);
    Y.css("left",s);
    D.trigger("jsp-scroll-x",[-s,aL,aK]).trigger("scroll")
    }
    function u(aI,s){
    if(ay.showArrows){
        aq[aI?"addClass":"removeClass"]("jspDisabled");
        af[s?"addClass":"removeClass"]("jspDisabled")
        }
    }
function r(aI,s){
    if(ay.showArrows){
        ax[aI?"addClass":"removeClass"]("jspDisabled");
        x[s?"addClass":"removeClass"]("jspDisabled")
        }
    }
function M(s,aI){
    var aJ=s/(Z-v);
    V(aJ*i,aI)
    }
    function N(aI,s){
    var aJ=aI/(T-aj);
    W(aJ*j,s)
    }
    function ab(aV,aQ,aJ){
    var aN,aK,aL,s=0,aU=0,aI,aP,aO,aS,aR,aT;
    try{
        aN=b(aV)
        }catch(aM){
        return
    }
    aK=aN.outerHeight();
    aL=aN.outerWidth();
    al.scrollTop(0);
    al.scrollLeft(0);
    while(!aN.is(".jspPane")){
        s+=aN.position().top;
        aU+=aN.position().left;
        aN=aN.offsetParent();
        if(/^body|html$/i.test(aN[0].nodeName)){
            return
        }
    }
    aI=aA();
aO=aI+v;
if(s<aI||aQ){
    aR=s-ay.verticalGutter
    }else{
    if(s+aK>aO){
        aR=s-v+aK+ay.verticalGutter
        }
    }
if(aR){
    M(aR,aJ)
    }
    aP=aC();
aS=aP+aj;
if(aU<aP||aQ){
    aT=aU-ay.horizontalGutter
    }else{
    if(aU+aL>aS){
        aT=aU-aj+aL+ay.horizontalGutter
        }
    }
if(aT){
    N(aT,aJ)
    }
}
function aC(){
    return -Y.position().left
    }
    function aA(){
    return -Y.position().top
    }
    function K(){
    var s=Z-v;
    return(s>20)&&(s-aA()<10)
    }
    function B(){
    var s=T-aj;
    return(s>20)&&(s-aC()<10)
    }
    function ag(){
    al.unbind(ac).bind(ac,function(aL,aM,aK,aI){
        var aJ=aa,s=I;
        Q.scrollBy(aK*ay.mouseWheelSpeed,-aI*ay.mouseWheelSpeed,false);
        return aJ==aa&&s==I
        })
    }
    function n(){
    al.unbind(ac)
    }
    function aB(){
    return false
    }
    function J(){
    Y.find(":input,a").unbind("focus.jsp").bind("focus.jsp",function(s){
        ab(s.target,false)
        })
    }
    function E(){
    Y.find(":input,a").unbind("focus.jsp")
    }
    function S(){
    var s,aI,aK=[];
    aE&&aK.push(am[0]);
    az&&aK.push(U[0]);
    Y.focus(function(){
        D.focus()
        });
    D.attr("tabindex",0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp",function(aN){
        if(aN.target!==this&&!(aK.length&&b(aN.target).closest(aK).length)){
            return
        }
        var aM=aa,aL=I;
        switch(aN.keyCode){
            case 40:case 38:case 34:case 32:case 33:case 39:case 37:
                s=aN.keyCode;
                aJ();
                break;
            case 35:
                M(Z-v);
                s=null;
                break;
            case 36:
                M(0);
                s=null;
                break
                }
                aI=aN.keyCode==s&&aM!=aa||aL!=I;
        return !aI
        }).bind("keypress.jsp",function(aL){
        if(aL.keyCode==s){
            aJ()
            }
            return !aI
        });
    if(ay.hideFocus){
        D.css("outline","none");
        if("hideFocus" in al[0]){
            D.attr("hideFocus",true)
            }
        }else{
    D.css("outline","");
    if("hideFocus" in al[0]){
        D.attr("hideFocus",false)
        }
    }
function aJ(){
    var aM=aa,aL=I;
    switch(s){
        case 40:
            Q.scrollByY(ay.keyboardSpeed,false);
            break;
        case 38:
            Q.scrollByY(-ay.keyboardSpeed,false);
            break;
        case 34:case 32:
            Q.scrollByY(v*ay.scrollPagePercent,false);
            break;
        case 33:
            Q.scrollByY(-v*ay.scrollPagePercent,false);
            break;
        case 39:
            Q.scrollByX(ay.keyboardSpeed,false);
            break;
        case 37:
            Q.scrollByX(-ay.keyboardSpeed,false);
            break
            }
            aI=aM!=aa||aL!=I;
    return aI
    }
}
function R(){
    D.attr("tabindex","-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")
    }
    function C(){
    if(location.hash&&location.hash.length>1){
        var aK,aI,aJ=escape(location.hash.substr(1));
        try{
            aK=b("#"+aJ+', a[name="'+aJ+'"]')
            }catch(s){
            return
        }
        if(aK.length&&Y.find(aJ)){
            if(al.scrollTop()===0){
                aI=setInterval(function(){
                    if(al.scrollTop()>0){
                        ab(aK,true);
                        b(document).scrollTop(al.position().top);
                        clearInterval(aI)
                        }
                    },50)
            }else{
            ab(aK,true);
            b(document).scrollTop(al.position().top)
            }
        }
}
}
function m(){
    if(b(document.body).data("jspHijack")){
        return
    }
    b(document.body).data("jspHijack",true);
    b(document.body).delegate("a[href*=#]","click",function(s){
        var aI=this.href.substr(0,this.href.indexOf("#")),aK=location.href,aO,aP,aJ,aM,aL,aN;
        if(location.href.indexOf("#")!==-1){
            aK=location.href.substr(0,location.href.indexOf("#"))
            }
            if(aI!==aK){
            return
        }
        aO=escape(this.href.substr(this.href.indexOf("#")+1));
        aP;
        try{
            aP=b("#"+aO+', a[name="'+aO+'"]')
            }catch(aQ){
            return
        }
        if(!aP.length){
            return
        }
        aJ=aP.closest(".jspScrollable");
        aM=aJ.data("jsp");
        aM.scrollToElement(aP,true);
        if(aJ[0].scrollIntoView){
            aL=b(a).scrollTop();
            aN=aP.offset().top;
            if(aN<aL||aN>aL+b(a).height()){
                aJ[0].scrollIntoView()
                }
            }
        s.preventDefault()
    })
}
function an(){
    var aJ,aI,aL,aK,aM,s=false;
    al.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp",function(aN){
        var aO=aN.originalEvent.touches[0];
        aJ=aC();
        aI=aA();
        aL=aO.pageX;
        aK=aO.pageY;
        aM=false;
        s=true
        }).bind("touchmove.jsp",function(aQ){
        if(!s){
            return
        }
        var aP=aQ.originalEvent.touches[0],aO=aa,aN=I;
        Q.scrollTo(aJ+aL-aP.pageX,aI+aK-aP.pageY);
        aM=aM||Math.abs(aL-aP.pageX)>5||Math.abs(aK-aP.pageY)>5;
        return aO==aa&&aN==I
        }).bind("touchend.jsp",function(aN){
        s=false
        }).bind("click.jsp-touchclick",function(aN){
        if(aM){
            aM=false;
            return false
            }
        })
}
function g(){
    var s=aA(),aI=aC();
    D.removeClass("jspScrollable").unbind(".jsp");
    D.replaceWith(ao.append(Y.children()));
    ao.scrollTop(s);
    ao.scrollLeft(aI);
    if(av){
        clearInterval(av)
        }
    }
b.extend(Q,{
    reinitialise:function(aI){
        aI=b.extend({},ay,aI);
        ar(aI)
        },
    scrollToElement:function(aJ,aI,s){
        ab(aJ,aI,s)
        },
    scrollTo:function(aJ,s,aI){
        N(aJ,aI);
        M(s,aI)
        },
    scrollToX:function(aI,s){
        N(aI,s)
        },
    scrollToY:function(s,aI){
        M(s,aI)
        },
    scrollToPercentX:function(aI,s){
        N(aI*(T-aj),s)
        },
    scrollToPercentY:function(aI,s){
        M(aI*(Z-v),s)
        },
    scrollBy:function(aI,s,aJ){
        Q.scrollByX(aI,aJ);
        Q.scrollByY(s,aJ)
        },
    scrollByX:function(s,aJ){
        var aI=aC()+Math[s<0?"floor":"ceil"](s),aK=aI/(T-aj);
        W(aK*j,aJ)
        },
    scrollByY:function(s,aJ){
        var aI=aA()+Math[s<0?"floor":"ceil"](s),aK=aI/(Z-v);
        V(aK*i,aJ)
        },
    positionDragX:function(s,aI){
        W(s,aI)
        },
    positionDragY:function(aI,s){
        V(aI,s)
        },
    animate:function(aI,aL,s,aK){
        var aJ={};
        
        aJ[aL]=s;
        aI.animate(aJ,{
            duration:ay.animateDuration,
            easing:ay.animateEase,
            queue:false,
            step:aK
        })
        },
    getContentPositionX:function(){
        return aC()
        },
    getContentPositionY:function(){
        return aA()
        },
    getContentWidth:function(){
        return T
        },
    getContentHeight:function(){
        return Z
        },
    getPercentScrolledX:function(){
        return aC()/(T-aj)
        },
    getPercentScrolledY:function(){
        return aA()/(Z-v)
        },
    getIsScrollableH:function(){
        return aE
        },
    getIsScrollableV:function(){
        return az
        },
    getContentPane:function(){
        return Y
        },
    scrollToBottom:function(s){
        V(i,s)
        },
    hijackInternalLinks:b.noop,
    destroy:function(){
        g()
        }
    });
ar(O)
}
e=b.extend({},b.fn.jScrollPane.defaults,e);
b.each(["mouseWheelSpeed","arrowButtonSpeed","trackClickSpeed","keyboardSpeed"],function(){
    e[this]=e[this]||e.speed
    });
return this.each(function(){
    var f=b(this),g=f.data("jsp");
    if(g){
        g.reinitialise(e)
        }else{
        g=new d(f,e);
        f.data("jsp",g)
        }
    })
};

b.fn.jScrollPane.defaults={
    showArrows:false,
    maintainPosition:true,
    stickToBottom:false,
    stickToRight:false,
    clickOnTrack:true,
    autoReinitialise:false,
    autoReinitialiseDelay:500,
    verticalDragMinHeight:0,
    verticalDragMaxHeight:99999,
    horizontalDragMinWidth:0,
    horizontalDragMaxWidth:99999,
    contentWidth:c,
    animateScroll:false,
    animateDuration:300,
    animateEase:"linear",
    hijackInternalLinks:false,
    verticalGutter:4,
    horizontalGutter:4,
    mouseWheelSpeed:0,
    arrowButtonSpeed:0,
    arrowRepeatFreq:50,
    arrowScrollOnHover:false,
    trackClickSpeed:0,
    trackClickRepeatFreq:70,
    verticalArrowPositions:"split",
    horizontalArrowPositions:"split",
    enableKeyboardNavigation:true,
    hideFocus:false,
    keyboardSpeed:0,
    initialDelay:300,
    speed:30,
    scrollPagePercent:0.8
}
})(jQuery,this);

/*
 * In-Field Label jQuery Plugin
 * http://fuelyourcoding.com/scripts/infield.html
 *
 * Copyright (c) 2009 Doug Neiner
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://docs.jquery.com/License
 *
 * @version 0.1
 */
(function($){
	
    $.InFieldLabels = function(label,field, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of each element
        base.$label = $(label);
        base.label = label;

        base.$field = $(field);
        base.field = field;
        
        base.orignalLabelText = base.$label.text();
        
        base.$label.data("InFieldLabels", base);
        base.showing = true;
        
        base.init = function(){
            // Merge supplied options with default options
            base.options = $.extend({},$.InFieldLabels.defaultOptions, options);

            

            // Check if the field is already filled in
            if(base.$field.val() != ""){
                base.$label.hide();
                base.showing = false;
            };
			
            base.$field.focus(function(){
                base.setFadeText(true)
                base.fadeOnFocus();
            }).blur(function(){
                base.setFadeText(false)
                base.checkForEmpty(true);
            }).bind('keydown.infieldlabel',function(e){
                // Use of a namespace (.infieldlabel) allows us to
                // unbind just this method later
                base.hideOnChange(e);
            }).change(function(e){
                base.checkForEmpty();
            }).bind('onPropertyChange', function(){
                base.checkForEmpty();
            });
        };
        
        base.setFadeText = function(flag){
            if(flag){
                if(base.options.fadeText != ''){
                    base.$label.text(base.options.fadeText);
                }
            }else{
                base.$label.text(base.orignalLabelText);
            }
        }

        // If the label is currently showing
        // then fade it down to the amount
        // specified in the settings
        base.fadeOnFocus = function(){
            if(base.showing){
                base.setOpacity(base.options.fadeOpacity);
            };
        };
		
        base.setOpacity = function(opacity){
            base.$label.stop().animate({
                opacity: opacity
            }, base.options.fadeDuration);
            base.showing = (opacity > 0.0);
        };
		
        // Checks for empty as a fail safe
        // set blur to true when passing from
        // the blur event
        base.checkForEmpty = function(blur){
            if(base.$field.val() == ""){
                base.prepForShow();
                base.setOpacity( blur ? 1.0 : base.options.fadeOpacity );
            } else {
                base.setOpacity(0.0);
            };
        };
                
                
		
        base.prepForShow = function(e){
            if(!base.showing) {
                // Prepare for a animate in...
                base.$label.css({
                    opacity: 0.0
                }).show();
				
                // Reattach the keydown event
                base.$field.bind('keydown.infieldlabel',function(e){
                    base.hideOnChange(e);
                });
            };
        };

        base.hideOnChange = function(e){
            if(
                (e.keyCode == 16) || // Skip Shift
                (e.keyCode == 9) // Skip Tab
                    ) return; 
			
            if(base.showing){
                base.$label.hide();
                base.showing = false;
            };
			
            // Remove keydown event to save on CPU processing
            base.$field.unbind('keydown.infieldlabel');
        };
      
        // Run the initialization method
        base.init();
    };
	
    $.InFieldLabels.defaultOptions = {
        fadeOpacity: 0.5, // Once a field has focus, how transparent should the label be
        fadeDuration: 300, // How long should it take to animate from 1.0 opacity to the fadeOpacity
        fadeText: ''
    };
	

    $.fn.inFieldLabels = function(options){
        return this.each(function(){
            // Find input or textarea based on for= attribute
            // The for attribute on the label must contain the ID
            // of the input or textarea element
            var for_attr = $(this).attr('for');
            if( !for_attr ) return; // Nothing to attach, since the for field wasn't used
			
			
            // Find the referenced input or textarea element
            var $field = $(
                "input#" + for_attr + "[type='text']," + 
                "input#" + for_attr + "[type='email']," + 
                "input#" + for_attr + "[type='url']," + 
                "input#" + for_attr + "[type='password']," + 
                "textarea#" + for_attr
                );
				
            if( $field.length == 0) return; // Again, nothing to attach
			
            // Only create object for input[text], input[password], or textarea
            (new $.InFieldLabels(this, $field[0], options));
        });
    };
	
})(jQuery);

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;
(function(d){
    var k=d.scrollTo=function(a,i,e){
        d(window).scrollTo(a,i,e)
        };
        
    k.defaults={
        axis:'xy',
        duration:parseFloat(d.fn.jquery)>=1.3?0:1
        };
        
    k.window=function(a){
        return d(window)._scrollable()
        };
        
    d.fn._scrollable=function(){
        return this.map(function(){
            var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;
            if(!i)return a;
            var e=(a.contentWindow||a).document||a.ownerDocument||a;
            return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement
            })
        };
        
    d.fn.scrollTo=function(n,j,b){
        if(typeof j=='object'){
            b=j;
            j=0
            }
            if(typeof b=='function')b={
            onAfter:b
        };
        
        if(n=='max')n=9e9;
        b=d.extend({},k.defaults,b);
        j=j||b.speed||b.duration;
        b.queue=b.queue&&b.axis.length>1;
        if(b.queue)j/=2;
        b.offset=p(b.offset);
        b.over=p(b.over);
        return this._scrollable().each(function(){
            var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');
            switch(typeof f){
                case'number':case'string':
                    if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){
                    f=p(f);
                    break
                }
                f=d(f,this);
                case'object':
                    if(f.is||f.style)s=(f=d(f)).offset()
                    }
                    d.each(b.axis.split(''),function(a,i){
                var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);
                if(s){
                    g[c]=s[h]+(u?0:l-r.offset()[h]);
                    if(b.margin){
                        g[c]-=parseInt(f.css('margin'+e))||0;
                        g[c]-=parseInt(f.css('border'+e+'Width'))||0
                        }
                        g[c]+=b.offset[h]||0;
                    if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]
                        }else{
                    var o=f[h];
                    g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o
                    }
                    if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);
                if(!a&&b.queue){
                    if(l!=g[c])t(b.onAfterFirst);
                    delete g[c]
                }
            });
        t(b.onAfter);
            function t(a){
            r.animate(g,j,b.easing,a&&function(){
                a.call(this,n,b)
                })
            }
        }).end()
    };
    
k.max=function(a,i){
    var e=i=='x'?'Width':'Height',h='scroll'+e;
    if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();
    var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;
    return Math.max(l[h],m[h])-Math.min(l[c],m[c])
    };
    
function p(a){
    return typeof a=='object'?a:{
        top:a,
        left:a
    }
}
})(jQuery);
            
(function($) {
    $.fn.pinItButton = function(){
        
        var pinterest_url = 'http://pinterest.com/pin/create/button/';
        
        this.each(function(){
            var obj = $(this);
            
            if(obj.parent("a").length){
                obj = obj.parent("a")
            }
            var wrapper = '<div class="pinit-wrapper" />'
            
            obj.wrap(wrapper);

            obj.parent('.pinit-wrapper').hover(
                function() {
                    var media_url = $(this).find('img').prop( 'src' ),
                    title_txt = $(this).find('img').prop( 'title' );
                                    
                    var pin_url = '';
                    if($(this).parents('.post').find('.entry-header').find('h1 a').length){
                        pin_url = $(this).parents('.post').find('.entry-header').find('h1 a').attr('href');
                    }else{
                        pin_url = window.location.href;
                    }
					
                    $(this).prepend(
                        $('<a class="rolling-pin" href="'+pinterest_url+'?url='+pin_url+'&media='+media_url+'&description='+title_txt+'" target="_blank">Pin It</a>')
                        );
                },
                function() {
                    $('.rolling-pin', this).remove();
                }
                );
        });
    }
})(jQuery);


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright В© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright В© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */