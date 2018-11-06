/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {


window.jQuery.entwine('ss', function ($) {
    $('.queuedjob__progress').entwine({
        onmatch: function onmatch() {
            $(this).find('.progress-bar').popover({
                container: $(this).parents('.field').get(0),
                placement: 'top'
            }).popover("show").on('hide.bs.popover', function () {
                return false;
            });

            $(this).find('.bs-popover-bottom').removeClass('bs-popover-bottom').addClass('bs-popover-top');

            var link = $(this).data('live'),
                self = $(this);

            if (link) {
                setTimeout(function () {
                    self.fetchData();
                }, self.getInterval());
            }

            this._super();
        },
        onunmatch: function onunmatch() {
            this._super();

            $(this).find('.progress-bar').popover('dispose');
        },
        getInterval: function getInterval() {
            var interval = $(this).data('interval');

            if (!interval || interval < 5000) {
                interval = 5000;
            }

            return interval;
        },
        fetchData: function fetchData() {
            var self = this;
            var progress = $(this).find('.progress-bar'),
                popover = progress.data('bs.popover'),
                link = $(this).data('live');

            $.getJSON(link, function (resp) {
                if (resp && resp.Percentage) {
                    var changed = $(self).parents('.field').find('.popover-header').text() !== resp.Title || $(self).parents('.field').find('.popover-body').text() !== resp.Content;

                    progress.css('width', resp.Percentage + '%');

                    if (!progress.hasClass(resp.Status)) {
                        progress.removeClass('bg-info bg-success bg-danger bg-warning');
                        progress.addClass(resp.Status);

                        changed = true;
                    }

                    if (resp.Animated) {
                        progress.addClass('progress-bar-animated');
                    } else {
                        progress.removeClass('progress-bar-animated');

                        $('body').trigger('queuedjob-finished');
                    }

                    $(self).parents('.field').find('.messages').html(resp.Messages);

                    if (changed) {
                        progress.popover('hide').popover('dispose');

                        $(self).parents('.field').find('.popover-header').text(resp.Title);
                        $(self).parents('.field').find('.popover-body').text(resp.Content);
                        $(self).find('.progress-bar').attr('title', resp.Title).data('title', resp.Title).data('content', resp.Content).attr('data-content', resp.Content);

                        progress.popover('show');
                    } else {
                        progress.popover('show');
                    }

                    if (resp.Status !== 'bg-success') {
                        setTimeout(function () {
                            self.fetchData();
                        }, self.getInterval());
                    }
                }
            });
        }
    });
});

/***/ })
/******/ ]);
//# sourceMappingURL=queuedjobprogressfield.js.map