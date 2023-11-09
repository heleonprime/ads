'use strict';

window.getVPAIDAd = function () {

    //md5
    let md5cycle = function (_, $) { var f = _[0], h = _[1], i = _[2], n = _[3]; f = ff(f, h, i, n, $[0], 7, -680876936), n = ff(n, f, h, i, $[1], 12, -389564586), i = ff(i, n, f, h, $[2], 17, 606105819), h = ff(h, i, n, f, $[3], 22, -1044525330), f = ff(f, h, i, n, $[4], 7, -176418897), n = ff(n, f, h, i, $[5], 12, 1200080426), i = ff(i, n, f, h, $[6], 17, -1473231341), h = ff(h, i, n, f, $[7], 22, -45705983), f = ff(f, h, i, n, $[8], 7, 1770035416), n = ff(n, f, h, i, $[9], 12, -1958414417), i = ff(i, n, f, h, $[10], 17, -42063), h = ff(h, i, n, f, $[11], 22, -1990404162), f = ff(f, h, i, n, $[12], 7, 1804603682), n = ff(n, f, h, i, $[13], 12, -40341101), i = ff(i, n, f, h, $[14], 17, -1502002290), h = ff(h, i, n, f, $[15], 22, 1236535329), f = gg(f, h, i, n, $[1], 5, -165796510), n = gg(n, f, h, i, $[6], 9, -1069501632), i = gg(i, n, f, h, $[11], 14, 643717713), h = gg(h, i, n, f, $[0], 20, -373897302), f = gg(f, h, i, n, $[5], 5, -701558691), n = gg(n, f, h, i, $[10], 9, 38016083), i = gg(i, n, f, h, $[15], 14, -660478335), h = gg(h, i, n, f, $[4], 20, -405537848), f = gg(f, h, i, n, $[9], 5, 568446438), n = gg(n, f, h, i, $[14], 9, -1019803690), i = gg(i, n, f, h, $[3], 14, -187363961), h = gg(h, i, n, f, $[8], 20, 1163531501), f = gg(f, h, i, n, $[13], 5, -1444681467), n = gg(n, f, h, i, $[2], 9, -51403784), i = gg(i, n, f, h, $[7], 14, 1735328473), h = gg(h, i, n, f, $[12], 20, -1926607734), f = hh(f, h, i, n, $[5], 4, -378558), n = hh(n, f, h, i, $[8], 11, -2022574463), i = hh(i, n, f, h, $[11], 16, 1839030562), h = hh(h, i, n, f, $[14], 23, -35309556), f = hh(f, h, i, n, $[1], 4, -1530992060), n = hh(n, f, h, i, $[4], 11, 1272893353), i = hh(i, n, f, h, $[7], 16, -155497632), h = hh(h, i, n, f, $[10], 23, -1094730640), f = hh(f, h, i, n, $[13], 4, 681279174), n = hh(n, f, h, i, $[0], 11, -358537222), i = hh(i, n, f, h, $[3], 16, -722521979), h = hh(h, i, n, f, $[6], 23, 76029189), f = hh(f, h, i, n, $[9], 4, -640364487), n = hh(n, f, h, i, $[12], 11, -421815835), i = hh(i, n, f, h, $[15], 16, 530742520), h = hh(h, i, n, f, $[2], 23, -995338651), f = ii(f, h, i, n, $[0], 6, -198630844), n = ii(n, f, h, i, $[7], 10, 1126891415), i = ii(i, n, f, h, $[14], 15, -1416354905), h = ii(h, i, n, f, $[5], 21, -57434055), f = ii(f, h, i, n, $[12], 6, 1700485571), n = ii(n, f, h, i, $[3], 10, -1894986606), i = ii(i, n, f, h, $[10], 15, -1051523), h = ii(h, i, n, f, $[1], 21, -2054922799), f = ii(f, h, i, n, $[8], 6, 1873313359), n = ii(n, f, h, i, $[15], 10, -30611744), i = ii(i, n, f, h, $[6], 15, -1560198380), h = ii(h, i, n, f, $[13], 21, 1309151649), f = ii(f, h, i, n, $[4], 6, -145523070), n = ii(n, f, h, i, $[11], 10, -1120210379), i = ii(i, n, f, h, $[2], 15, 718787259), h = ii(h, i, n, f, $[9], 21, -343485551), _[0] = add32(f, _[0]), _[1] = add32(h, _[1]), _[2] = add32(i, _[2]), _[3] = add32(n, _[3]) }, cmn = function (_, $, f, h, i, n) { return $ = add32(add32($, _), add32(h, n)), add32($ << i | $ >>> 32 - i, f) }, ff = function (_, $, f, h, i, n, r) { return cmn($ & f | ~$ & h, _, $, i, n, r) }, gg = function (_, $, f, h, i, n, r) { return cmn($ & h | f & ~h, _, $, i, n, r) }, hh = function (_, $, f, h, i, n, r) { return cmn($ ^ f ^ h, _, $, i, n, r) }, ii = function (_, $, f, h, i, n, r) { return cmn(f ^ ($ | ~h), _, $, i, n, r) }, md51 = function (_) { var $, f = _.length, h = [1732584193, -271733879, -1732584194, 271733878]; for ($ = 64; $ <= _.length; $ += 64)md5cycle(h, md5blk(_.substring($ - 64, $))); _ = _.substring($ - 64); var i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; for ($ = 0; $ < _.length; $++)i[$ >> 2] |= _.charCodeAt($) << ($ % 4 << 3); if (i[$ >> 2] |= 128 << ($ % 4 << 3), $ > 55) for (md5cycle(h, i), $ = 0; $ < 16; $++)i[$] = 0; return i[14] = 8 * f, md5cycle(h, i), h }, md5blk = function (_) { var $, f = []; for ($ = 0; $ < 64; $ += 4)f[$ >> 2] = _.charCodeAt($) + (_.charCodeAt($ + 1) << 8) + (_.charCodeAt($ + 2) << 16) + (_.charCodeAt($ + 3) << 24); return f }; var hex_chr = "0123456789abcdef".split(""); let rhex = function (_) { for (var $ = "", f = 0; f < 4; f++)$ += hex_chr[_ >> 8 * f + 4 & 15] + hex_chr[_ >> 8 * f & 15]; return $ }, hex = function (_) { for (var $ = 0; $ < _.length; $++)_[$] = rhex(_[$]); return _.join("") }, md5 = function (_) { return hex(md51(_)) }, add32 = function (_, $) { return _ + $ & 4294967295 }; md5("hello");

    let uuidv4 = function () {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    // Options
    let o = {
        debug: 0, // Disabled by default, change if needed
        debugPref: '%cMPSU VPAID Image Driver',
        debugPrefStyle: 'color:white; background-color: #3f8be8; padding: 2px 5px; border-radius: 3px;',
        maxAdDurationTime: 30, // for timeout, will be multiplied to 1000
        adUnitDivIdPrefix: 'ad-',
        iframeStyles: {
            border: '0',
            width: "100%",
            height: "100%",
        },
        imageStyles: {

        }
    };

    let adUnitTimeout = null;

    // URL parameters handle
    let s = window.location.search;
    let urlParams = new URLSearchParams(s);

    // Debug logs handle
    if (urlParams.get('debug') == 1) // Debug will work if the page has a debug param equals 1
        o.debug = 1;

    let l = function (...args) {
        if (o.debug) {
            console.log(o.debugPref, o.debugPrefStyle, ...args);
        }
    }

    var subscriberEvents = ['AdLoaded', 'AdSkipped', 'AdStarted', 'AdStopped',
        'AdLinearChange', 'AdExpandedChange',
        'AdRemainingTimeChange', 'AdVolumeChange',
        'AdImpression', 'AdVideoStart', 'AdVideoFirstQuartile', 'AdVideoMidpoint', 'AdVideoThirdQuartile', 'AdVideoComplete', 'AdClickThru', 'AdInteraction',
        'AdUserAcceptInvitation', 'AdUserMinimize', 'AdUserClose', 'AdPaused', 'AdPlaying', 'AdLog', 'AdError',
        'AdDurationChange',
        'AdSizeChange', 'AdSkippableStateChange', 'allAdsCompleted'];

    var VPAIDAd = function () {
        this.owner = "mpsu";
        this.version = "2.0";
        this.timeouts = {
            "handshakeVersion": 100,
            "initAd": 100,
            "startAd": 100,
            "stopAd": 100,
            "pauseAd": 100,
            "resumeAd": 100,
        };
        this._creative = null;
        this._slot = null;
        this._videoSlot = null;
        this._videoSlotCanAutoPlay = null;

        this.widgetID = 0;
        this.adLinear = true;

        this.adParameters = {};
        this.adViewMode = ''; //“normal”, “thumbnail”, or “fullscreen” a
        this.adDesiredBitrate = 0;

        this.imageUrl = null;
        this.linkUrl = null;
        this.completeTimeoutDuration = null;
        this.impressionTimeoutDuration = null;
        this.inIframe = false;
        this.title = null;
        this.inNewTab = false;

        this.completeTimeout = null;
        this.impressionTimeout = null;
        this.firstQuartTimeout = null;
        this.secondQuartTimeout = null;
        this.thirdQuartTimeout = null;

        this.startTime = null;
        this.passedTime = 0;

        this.container = null;
        this.iframe = null;
        this.image = null;

        this.adWidth = null;
        this.adHeight = null;
        this.adExpanded = false;
        this.adSkippableState = false;
        this.adVolume = null;
        this.adDuration = 0;
        this.adRemainingTime = 0;
        this.adCompanions = '';
        this.adIcons = false;

        this.inited = false;
        this.started = false;
        this.paused = false;
        this.stopped = false;
        this.isVideo = null;

        this.creativeinprogress = null;

        this.subscribers = {};
        for (var i in subscriberEvents) {
            this.subscribers[subscriberEvents[i]] = {};
        }


        /*skip handler "AdSkippableStateChange" */
    }
    VPAIDAd.prototype.eventHandler = function (eventName) {
        l('Event handler fires on "' + eventName + '" event');
        if ((typeof this.subscribers[eventName]) != 'undefined') {
            for (var i in this.subscribers[eventName]) {
                let item = this.subscribers[eventName][i];
                item.fn.call(item.context, { type: eventName, data: {} });
            }
        }
    };
    VPAIDAd.prototype.subscribe = function (callback, eventName, context) {
        l('Subscribing on "' + eventName + '" event with context:', context);
        if ((typeof this.subscribers[eventName]) != 'undefined') {
            l('Type of subscriber is not undefined');
            this.subscribers[eventName][md5(callback.toString())] = { fn: callback, context: context || null };
            l('Successfully subscribed');
        }
    };
    VPAIDAd.prototype.unsubscribe = function (callback, eventName) {
        l('Unsubscribing on "' + eventName + '" event');
        if ((typeof this.subscribers[eventName]) != 'undefined' && (typeof this.subscribers[eventName][md5(callback.toString())]) != 'undefined') {
            delete this.subscribers[eventName][md5(callback.toString())];
            l('Successfully unsubscribed');
        }
    }
    VPAIDAd.prototype.handshakeVersion = function () {
        l('Sending handshake version equals ' + this.version);
        return this.version;
    }
    VPAIDAd.prototype.setAdVolume = function (volume) {
        l('setAdVolume(' + volume + ')');
        if (volume >= 1) volume = 1;
        if (volume < 0) volume = 0;
        l('Volume will be set on ' + volume)

        if (this.adVolume === volume) return;

        this.adVolume = volume;

        if (this.creativeinprogress !== null) {
            this._creative.setAdVolume(this.adVolume);
        }

        l('Will fire AdVolumeChange event')
        this.eventHandler('AdVolumeChange');
    }
    VPAIDAd.prototype.getAdVolume = function () {
        //l('getAdVolume', this.adVolume);
        return this.adVolume;
    }
    VPAIDAd.prototype.getAdDuration = function () {
        //l('getAdDuration', this.adDuration);
        return this.adDuration;
    }
    VPAIDAd.prototype.getAdRemainingTime = function () {
        //l('getAdRemainingTime', this.adRemainingTime);
        return this.adRemainingTime;
    }
    VPAIDAd.prototype.getAdWidth = function () {
        //l('getAdWidth', this.adWidth);
        return this.adWidth;
    }
    VPAIDAd.prototype.getAdHeight = function () {
        //l('getAdHeight', this.adHeight);
        return this.adHeight;
    }
    VPAIDAd.prototype.getAdExpanded = function () {
        //l('getAdExpanded', this.adExpanded);
        return this.adExpanded;
    }
    VPAIDAd.prototype.getAdSkippableState = function () {
        //l('getAdSkippableState', this.adSkippableState);
        return this.adSkippableState;
    }
    VPAIDAd.prototype.getAdLinear = function () {
        //l('getAdLinear', this.adLinear);
        return this.adLinear;
    }
    VPAIDAd.prototype.getAdIcons = function () {
        //l('getAdIcons', 'always false');
        return false;
    }
    VPAIDAd.prototype.getAdCompanions = function () {
        //l('getAdCompanions', 'always empty string');
        return '';
    }


    VPAIDAd.prototype.initAd = function (width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
        l('initAd method fired');
        l('There\'s what we have:', 'width:', width, 'height:', height, 'viewMode:', viewMode, 'desiredBitrate:', desiredBitrate, 'creativeData:', creativeData, 'environmentVars:', environmentVars)

        if (this.inited) {
            l('Already inited, return false');
            return false;
        }
        if (this.stopped) {
            l('Already stopped, return false');
            return false;
        }

        this.inited = true;
        l('Inited now');
        this.adWidth = width;
        l('adWidth = ' + this.adWidth);
        this.adHeight = height;
        l('adHeight = ' + this.adHeight);
        this.adViewMode = viewMode;
        l('adViewMode = ' + this.adViewMode);
        this.adDesiredBitrate = desiredBitrate;
        l('adDesiredBitrate = ' + this.adDesiredBitrate);

        if ((typeof creativeData) == 'object' && (typeof creativeData.AdParameters) == 'string') {
            l('Creative data is object and AdParameters is string')
            this.adParameters = JSON.parse(creativeData.AdParameters || '{}');
            l('adParameters JSON:', this.adParameters)
        }

        this._slot = environmentVars.slot;
        l('_slot', this._slot)
        this._videoSlot = environmentVars.videoSlot;
        l('_videoSlot', this._videoSlot)
        this._videoSlotCanAutoPlay = (typeof environmentVars.videoSlotCanAutoPlay) != 'undefined' ? environmentVars.videoSlotCanAutoPlay : true;
        l('_videoSlotCanAutoPlay', this._videoSlotCanAutoPlay)

        this.imageUrl = this.adParameters.imageUrl;
        l('imageUrl', this.imageUrl);
        this.linkUrl = this.adParameters.linkUrl;
        l('linkUrl', this.linkUrl);
        this.completeTimeoutDuration = this.adParameters.completeTimeoutDuration;
        l('completeTimeoutDuration', this.completeTimeoutDuration);
        this.inIframe = (typeof adParameters.inIframe) != 'undefined' ? adParameters.inIframe : this.inIframe;
        l('inIframe', this.inIframe);
        this.inNewTab = (typeof adParameters.inNewTab) != 'undefined' ? adParameters.inNewTab : this.inNewTab;
        l('inNewTab', this.inNewTab);
        this.title = (typeof adParameters.title) != 'undefined' ? adParameters.title : this.title;
        l('title', this.title);

        this.impressionTimeoutDuration = (typeof environmentVars.impressionTimeoutDuration) != 'undefined' ? environmentVars.impressionTimeoutDuration : this.impressionTimeoutDuration;
        l('impressionTimeoutDuration', this.impressionTimeoutDuration)

        this.addAdUnitContainer();
        this.renderAdUnit();
        this.eventHandler('AdLoaded');
    }

    VPAIDAd.prototype.handleTimeouts = function () {
        if (this.pauseTime) {
            this.passedTime += this.pauseTime - this.startTime
            this.pauseTime = null;
        }
        if (this.passedTime < this.completeTimeoutDuration) {
            this.completeTimeout = setTimeout(() => {
                l('completeTimeout');
                this.stopped = true;
                this.eventHandler('AdVideoComplete');
            }, this.completeTimeout - this.passedTime);
        }
        if (this.passedTime < (this.completeTimeoutDuration * 0.25)) {
            this.firstQuartTimeout = setTimeout(() => {
                l('firstQuartTimeout');
                this.eventHandler('AdVideoFirstQuartile');
            }, (this.completeTimeoutDuration * 0.25) - this.passedTime);
        }
        if (this.passedTime < (this.completeTimeoutDuration * 0.5)) {
            this.secondQuartTimeout = setTimeout(() => {
                l('secondQuartTimeout');
                this.eventHandler('AdVideoMidpoint');
            }, (this.completeTimeoutDuration * 0.5) - this.passedTime);
        }
        if (this.passedTime < (this.completeTimeoutDuration * 0.75)) {
            this.thirdQuartTimeout = setTimeout(() => {
                l('thirdQuartTimeout');
                this.eventHandler('AdVideoThirdQuartile');
            }, (this.completeTimeoutDuration * 0.75) - this.passedTime);
        }
        if (this.passedTime < this.impressionTimeoutDuration) {
            this.impressionTimeout = setTimeout(() => {
                l('impressionTimeout');
                this.eventHandler('AdImpression');
            }, this.impressionTimeoutDuration - this.passedTime);
        }
    }

    VPAIDAd.prototype.dropTimeouts = function () {
        clearTimeout(this.completeTimeout);
        clearTimeout(this.firstQuartTimeout);
        clearTimeout(this.secondQuartTimeout);
        clearTimeout(this.thirdQuartTimeout);
        clearTimeout(this.impressionTimeout);
    }

    VPAIDAd.prototype.startAd = function () {
        l('StartAd fired');
        if (!this.inited) return false;
        if (this.started) return false;
        if (this.stopped) return false;
        this.startTime = new Date();
        this.handleTimeouts();
    }
    VPAIDAd.prototype.skipAd = function () {
        l('SkipAd fired');
        if (!this.inited) return false;
        if (!this.started) return false;
        if (this.stopped) return false;
        if (!this.adSkippableState) return false;
        /*close mpsu vpaid*/
        clearTimeout(adUnitTimeout);
        this.dropTimeouts();
        this.eventHandler('AdSkipped');
    }
    VPAIDAd.prototype.stopAd = function () {
        l('StopAd fired');
        /*close mpsu vpaid*/
        clearTimeout(adUnitTimeout);
        this.dropTimeouts();
        this.eventHandler('AdStopped');
    }
    VPAIDAd.prototype.resizeAd = function (width, height, viewMode) {
        l('ResizeAd fired');
        if (!this.inited) return false;
        if (this.stopped) return false;
        this.adWidth = width;
        this.adHeight = height;
        this.adViewMode = viewMode;
        if (this.creativeinprogress !== null) {
            this._creative.resizeAd(this.adWidth, this.adHeight, this.adViewMode);
        }

        this.eventHandler('AdSizeChange');
    }
    VPAIDAd.prototype.pauseAd = function () {
        l('PauseAd fired');
        if (!this.inited) return false;
        if (!this.started) return false;
        if (this.stopped) return false;
        if (this.paused) return false;

        this.paused = true;
        this.pauseTime = new Date();

        if (this.creativeinprogress !== null) {
            this._creative.pauseAd();
        }

        this.eventHandler('AdPaused');
    }
    VPAIDAd.prototype.resumeAd = function () {
        l('ResumeAd fired');
        if (!this.inited) return false;
        if (!this.started) return false;
        if (this.stopped) return false;
        if (!this.paused) return false;

        this.paused = false;
        this.startTime = new Date();

        if (this.creativeinprogress !== null) {
            this._creative.resumeAd();
        }

        this.eventHandler('AdPlaying');
    }

    VPAIDAd.prototype.expandAd = function () {
        l('ExpandAd fired');
        if (!this.inited) return false;
        if (!this.started) return false;
        if (this.stopped) return false;
        if (this.adExpanded) return false;

        this.adExpanded = true;

        if (this.creativeinprogress !== null) {
            this._creative.expandAd();
        }

        this.eventHandler('AdExpandedChange');
    }
    VPAIDAd.prototype.collapseAd = function () {
        l('CollapseAd fired');
        if (!this.inited) return false;
        if (!this.started) return false;
        if (this.stopped) return false;
        if (!this.adExpanded) return false;
        this.adExpanded = false;
        if (this.creativeinprogress !== null) {
            this._creative.collapseAd();
        }
        this.eventHandler('AdExpandedChange');
    }

    VPAIDAd.prototype.getAdUnitContainerId = function () {
        return o.adUnitDivIdPrefix + uuidv4();
    }

    VPAIDAd.prototype.addAdUnitContainer = function () {
        l('addAdUnitContainer started');
        this.container = document.createElement('div');
        this.container.id = this.getAdUnitContainerId();
        this._slot.append(this.container);
        l('New AdUnit container: ', this.container);
    }

    VPAIDAd.prototype.renderAdUnit = function () {
        l('Rendering the AdUnit');
        let _self = this;
        l('window.yaContextCb before pushing the Ad:', window.yaContextCb);

        this.addCode();
    }

    VPAIDAd.prototype.addCode = function () {
        if (this.container && this.imageUrl) {
            let c = null;
            if (this.inIframe) {
                this.iframe = document.createElement('iframe');
                this.setIframeStyles();
                this.container.appendChild(this.iframe);
                c = this.iframe.contentWindow.document.body;
                c.style.margin = '0';
            }
            else {
                c = this.container;
            }
            let target = null;
            this.image = document.createElement('img');
            this.image.src = this.imageUrl;
            this.image.onload = () => {
                l('==> AdUnit "Render" fired');
                this.started = true;
                this.eventHandler('AdStarted');
                this.setAdUnitTimeout();
                this.handleTimeouts();
            };
            if (!this.linkUrl) {
                this.image.addEventListener('click', () => {
                    this.eventHandler('AdClickThru');
                })
            }
            if (this.linkUrl) {
                let link = document.createElement('a');
                link.href = this.linkUrl;
                if (this.inNewTab) {
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                }
                if (this.title) {
                    link.title = this.title;
                }
                link.addEventListener('click', () => {
                    this.eventHandler('AdClickThru');
                })
                link.appendChild(this.image);
                target = link;
            }
            else {
                target = this.image;
            }
            l(c);
            c.appendChild(target);
        }
    }

    VPAIDAd.prototype.setIframeStyles = function () {
        if (this.o.iframeStyles) {
            Object.keys(this.options.iframeStyles).forEach((k) => {
                this.iframe.style[k] = this.options.iframeStyles[k];
            });
        }
    }

    VPAIDAd.prototype.setAdUnitTimeout = function () {
        let time = o.maxAdDurationTime * 1000;
        adUnitTimeout = setTimeout(() => {
            l('AdUnit disable timeout fire now after ' + o.maxAdDurationTime + 'sec');
            this.stopped = true;
            this.eventHandler('AdStopped');
        }, time);
        l('AdUnit disable timeout set to ' + o.maxAdDurationTime + 'sec');
    }

    return new VPAIDAd();
}