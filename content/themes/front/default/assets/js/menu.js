jQuery(function() {
    'use strict';
    document['addEventListener']('touchstart', function() {}, false);
    jQuery(function() {
        jQuery('.header')['wrapInner']('<div class="isaMenuContainer" />');
        jQuery('<div class="overlapblackbg"></div>')['prependTo']('.isaMenu');
        jQuery('#isaNavToggle')['click'](function() {
            jQuery('body')['toggleClass']('isaActive')
        });
        jQuery('.overlapblackbg')['click'](function() {
            jQuery('body')['removeClass']('isaActive')
        });
        jQuery('.isaMenu-list> li')['has']('.sub-menu')['prepend']('<span class="isaMenu-click"><i class="isaMenu-arrow"></i></span>');
        jQuery('.isaMenu-list > li')['has']('.isaShopTabing')['prepend']('<span class="isaMenu-click"><i class="isaMenu-arrow"></i></span>');
        jQuery('.isaMenu-list > li')['has']('.isaMegaMenu')['prepend']('<span class="isaMenu-click"><i class="isaMenu-arrow"></i></span>');
        jQuery('.isaMenu-click')['on']('click', function() {
            jQuery(this)['toggleClass']('isaActiveArrow')['parent']()['siblings']()['children']()['removeClass']('isaActiveArrow');
            jQuery('.sub-menu, .isaShopTabing, .isaMegaMenu')['not'](jQuery(this)['siblings']('.sub-menu, .isaShopTabing, .isaMegaMenu'))['slideUp']('slow');
            jQuery(this)['siblings']('.sub-menu')['slideToggle']('slow');
            jQuery(this)['siblings']('.isaShopTabing')['slideToggle']('slow');
            jQuery(this)['siblings']('.isaMegaMenu')['slideToggle']('slow');
            return false
        });
        jQuery('.isaTabItem > li')['has']('.isaTitemRight')['prepend']('<span class="isaMenu-click02"><i class="isaMenu-arrow"></i></span>');
        jQuery('.isaMenu-click02')['on']('click', function() {
            jQuery(this)['siblings']('.isaTitemRight')['slideToggle']('slow');
            jQuery(this)['toggleClass']('isaActiveArrow02')['parent']()['siblings']()['children']()['removeClass']('isaActiveArrow02');
            jQuery('.isaTitemRight')['not'](jQuery(this)['siblings']('.isaTitemRight'))['slideUp']('slow');
            return false
        });
        jQuery('.isaTabItem02 > li')['has']('.isaBrandBottom')['prepend']('<span class="isaMenu-click03"><i class="isaMenu-arrow"></i></span>');
        jQuery('.isaMenu-click03')['on']('click', function() {
            jQuery(this)['siblings']('.isaBrandBottom')['slideToggle']('slow');
            jQuery(this)['toggleClass']('isaActiveArrow03')['parent']()['siblings']()['children']()['removeClass']('isaActiveArrow03');
            jQuery('.isaBrandBottom')['not'](jQuery(this)['siblings']('.isaBrandBottom'))['slideUp']('slow');
            return false
        });
        jQuery(window)['ready'](function() {
            jQuery('.isaShopTabing.isaDepartmentMenu > .isaShopwp > .isaTabItem > li')['on']('mouseenter', function() {
                jQuery(this)['addClass']('isaShopLink-active')['siblings'](this)['removeClass']('isaShopLink-active');
                return false
            });
            jQuery('.isaShopTabing.isaBrandMenu > .isaShopTabingwp > .isaTabItem02 > li')['on']('mouseenter', function() {
                jQuery(this)['addClass']('isaShopLink-active')['siblings'](this)['removeClass']('isaShopLink-active');
                return false
            })
        });
        _0x291ax2();
        jQuery(window)['on']('load resize', function() {
            var _0x291ax1 = jQuery(window)['outerWidth']();
            if (_0x291ax1 <= 991) {
                jQuery('.isaShopwp')['css']('height', '100%');
                jQuery('.isaTitemRight')['css']('height', '100%')
            } else {
                _0x291ax2()
            }
        });

        function _0x291ax2() {
            var _0x291ax3 = 1;
            jQuery('.isaTabItem > li')['each'](function() {
                var _0x291ax4 = jQuery(this)['find']('.isaTitemRight')['innerHeight']();
                _0x291ax3 = _0x291ax4 > _0x291ax3 ? _0x291ax4 : _0x291ax3;
                jQuery(this)['find']('.isaTitemRight')['css']('height', 'auto')
            });
            jQuery('.isaShopwp')['css']('height', _0x291ax3 + 0)
        }
        jQuery(document)['ready'](function(_0x291ax5) {
            function _0x291ax6() {
                if (_0x291ax5(window)['outerWidth']() >= 991) {
                    _0x291ax5('.isaShopTabing, .isaTitemRight, .isaBrandBottom, .isaMegaMenu, ul.sub-menu')['css']({
                        "display": ''
                    })
                }
            }
            _0x291ax6();
            _0x291ax5(window)['resize'](_0x291ax6)
        });
        jQuery(window)['on']('resize', function() {
            if (jQuery(window)['outerWidth']() <= 991) {
                jQuery('.isaMenu')['css']('height', jQuery(this)['height']() + 'px');
                jQuery('.isaMenuContainer')['css']('min-width', jQuery(this)['width']() + 'px')
            } else {
                jQuery('.isaMenu')['removeAttr']('style');
                jQuery('.isaMenuContainer')['removeAttr']('style');
                jQuery('body')['removeClass']('isaActive');
                jQuery('.isaMenu-click')['removeClass']('isaActiveArrow');
                jQuery('.isaMenu-click02')['removeClass']('isaActiveArrow02');
                jQuery('.isaMenu-click03')['removeClass']('isaActiveArrow03')
            }
        });
        jQuery(window)['trigger']('resize')
    });
    jQuery(window)['on']('load', function() {
        jQuery('.isaSearchToggler')['on']('click', function() {
            jQuery('body')['addClass']('searchOpen')
        });
        jQuery('.searchClose, .searchBackDropPanel')['on']('click', function() {
            jQuery('body')['removeClass']('searchOpen')
        });
        // jQuery('.isaSearch, .isaSearchform form')['on']('click', function(_0x291ax7) {
        //     _0x291ax7['stopPropagation']()
        // })
    })
}())