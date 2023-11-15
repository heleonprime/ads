/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/drivers/html_driver.js":
/*!************************************!*\
  !*** ./src/drivers/html_driver.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HTMLDriver)
/* harmony export */ });
class HTMLDriver {
    debug = 0;
    debugLabel = "%cMPSU HTML Driver";
    debugStyles = "color:white; background-color: #3f8be8; padding: 2px 5px; border-radius: 3px;";
    debugGroupOpened = false;

    container = null;

    html = '';
    inIframe = false;
    iframe = null;

    impressionTimeoutDuration = 2000;
    impressionTimeout = null;

    options = {
        iframeStyles: {
            border: '0',
            width: "100%",
            height: "100%",
        }
    };

    clickHandler = null;
    clickTarget = null;

    scriptsLoaded = {};

    codePosition = 'beforeend';

    constructor(settings, events) {
        this.setOption(settings, 'debug');
        this.setOption(settings, 'container');
        this.setOption(settings, 'html');
        this.setOption(settings, 'inIframe');
        this.setOption(settings, 'impressionTimeoutDuration');

        this.setEvents(events)
        this.mergeOptions(settings);
    }

    setOption(s, o) {
        if (typeof s[o] !== 'undefined') {
            this[o] = s[o];
        }
    }

    setImpressionTimeout() {
        this.impressionTimeout = setTimeout(() => {
            this.l('Impression Timeout fired');
            this.events.onImpression();
        }, this.impressionTimeoutDuration);
    }

    drop(onEvent = false) {
        //this. = null;
    }

    setEvents = (events) => {
        const eventsDefault = {
            onClose: () => { },
            onStop: () => { },
            onError: () => { },
            onImpression: () => { },
            onClick: () => { },
        }
        this.events = { ...eventsDefault, ...events }
    }

    // Settings 

    mergeOptions(o1, o2) {
        this.l('Options are object', this.isObject(o2));
        if (this.isObject(o2))
            o1 = {
                ...o1,
                ...o2
            }
        this.l('Options: ', o1);
        return o1;
    }
    isObject(e) {
        return typeof e === 'object' &&
            !Array.isArray(e) &&
            e !== null;
    }

    show(container) {
        if (container) this.container = container;
        this.clearContainer();
        this.addCode();
        this.setImpressionTimeout();
    }

    clearContainer() {
        this.l('Clearing container');
        this.l(this.clickTarget);
        this.l(this.clickHandler);
        if (this.clickTarget && this.clickHandler) {
            this.clickTarget.removeEventListener("click", this.clickHandler);
        }
        this.l(this.container);
        if (this.container) {
            this.container.innerHTML = "";
        }
    }

    hide() {
        this.clearContainer();
        this.events.onStop();
    }

    reload() {
        this.clearContainer();
        this.show();
    }

    addCode() {
        if (this.container && this.html) {
            let c;
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
            c.insertAdjacentHTML(this.codePosition, this.html);
            let scripts = c.querySelectorAll('script');
            if (scripts.length) {
                scripts.forEach((script) => {
                    this.recreateScript(script);
                })
            }
            this.clickHandler = this.click.bind(this)
            this.l('Click handler:', this.clickHandler);
            this.clickTarget = c; //this.iframe ?? this.container;
            this.l('Click target:', this.clickTarget);
            this.clickTarget.addEventListener("click", this.clickHandler);
        }
    }

    setIframeStyles() {
        if (this.options.iframeStyles) {
            Object.keys(this.options.iframeStyles).forEach((k) => {
                this.iframe.style[k] = this.options.iframeStyles[k];
            });
        }
    }

    copyAttributes(source, target) {
        return Array.from(source.attributes).forEach(attribute => {
            target.setAttribute(
                attribute.nodeName === 'id' ? 'data-id' : attribute.nodeName,
                attribute.nodeValue,
            );
        });
    }

    recreateScript(script) {
        let s = document.createElement('script');
        this.copyAttributes(script, s);
        script.before(s);
        s.innerHTML = script.innerHTML;
        script.remove();
    }

    click() {
        this.l('Click event fired')
        this.events.onClick();
    }

    // Debug

    l(...args) {
        if (this.debug) {
            if (!this.debugGroupOpened)
                console.log(this.debugLabel, this.debugStyles, ...args);
            else
                console.log(...args);
        }
    }

    lg(label = "") {
        if (this.debug && !this.debugGroupOpened) {
            this.debugGroupOpened = true;
            console.groupCollapsed(this.debugLabel, this.debugStyles, label);
        }
    }

    lge() {
        if (this.debug && this.debugGroupOpened) {
            this.debugGroupOpened = false;
            console.groupEnd();
        }
    }
}

/***/ }),

/***/ "./src/drivers/image_driver.js":
/*!*************************************!*\
  !*** ./src/drivers/image_driver.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImageDriver)
/* harmony export */ });
class ImageDriver {
    debug = 0;
    debugLabel = "%cMPSU Image Driver";
    debugStyles = "color:white; background-color: #3f8be8; padding: 2px 5px; border-radius: 3px;";
    debugGroupOpened = false;

    container = null;

    url = '';
    link = null;
    title = null;
    inNewTab = false;
    inIframe = false;
    iframe = null;

    impressionTimeoutDuration = 2000;
    impressionTimeout = null;

    options = {
        iframeStyles: {
            border: '0',
            width: "100%",
            height: "100%",
        },
        imageStyles: {

        }
    };

    clickHandler = null;
    clickTarget = null;

    scriptsLoaded = {};

    codePosition = 'beforeend';

    image = null;

    constructor(settings, events) {
        this.setOption(settings, 'debug');
        this.setOption(settings, 'container');
        this.setOption(settings, 'url');
        this.setOption(settings, 'inIframe');
        this.setOption(settings, 'link');
        this.setOption(settings, 'inNewTab');
        this.setOption(settings, 'title');
        this.setOption(settings, 'impressionTimeoutDuration');

        this.setEvents(events);
        this.mergeOptions(settings);
    }

    setOption(s, o) {
        if (typeof s[o] !== 'undefined') {
            this[o] = s[o];
        }
    }

    setImpressionTimeout() {
        this.impressionTimeout = setTimeout(() => {
            this.l('Impression Timeout fired');
            this.events.onImpression();
        }, this.impressionTimeoutDuration);
    }


    drop(onEvent = false) {
        //this. = null;
    }

    setEvents = (events) => {
        const eventsDefault = {
            onClose: () => { },
            onStop: () => { },
            onError: () => { },
            onImpression: () => { },
            onClick: () => { },
        }
        this.events = { ...eventsDefault, ...events }
    }

    // Settings 

    mergeOptions(o1, o2) {
        this.l('Options are object', this.isObject(o2));
        if (this.isObject(o2))
            o1 = {
                ...o1,
                ...o2
            }
        this.l('Options: ', o1);
        return o1;
    }
    isObject(e) {
        return typeof e === 'object' &&
            !Array.isArray(e) &&
            e !== null;
    }

    show(container) {
        if (container) this.container = container;
        this.clearContainer();
        this.addCode();
        this.setImpressionTimeout();
    }

    clearContainer() {
        this.l('Clearing container');
        this.l(this.clickTarget);
        this.l(this.clickHandler);
        if (this.clickTarget && this.clickHandler) {
            this.clickTarget.removeEventListener("click", this.clickHandler);
        }
        this.l(this.container);
        if (this.container) {
            this.container.innerHTML = "";
        }
    }

    hide() {
        this.clearContainer();
        this.events.onStop();
    }

    reload() {
        this.clearContainer();
        this.show();
    }

    addCode() {
        if (this.container && this.url) {
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
            this.image.src = this.url;

            if (this.link) {
                let link = document.createElement('a');
                link.href = this.link;
                if (this.inNewTab) {
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                }
                if (this.title) {
                    link.title = this.title;
                }
                link.appendChild(this.image);
                target = link;
            }
            else {
                target = this.image;
            }

            this.l(c);
            c.appendChild(target);

            this.clickHandler = this.click.bind(this)
            this.l('Click handler:', this.clickHandler);
            this.clickTarget = c; //this.iframe ?? this.container;
            this.l('Click target:', this.clickTarget);
            this.clickTarget.addEventListener("click", this.clickHandler);
        }
    }

    setIframeStyles() {
        if (this.options.iframeStyles) {
            Object.keys(this.options.iframeStyles).forEach((k) => {
                this.iframe.style[k] = this.options.iframeStyles[k];
            });
        }
    }

    click() {
        this.l('Click event fired')
        this.events.onClick();
    }

    // Debug

    l(...args) {
        if (this.debug) {
            if (!this.debugGroupOpened)
                console.log(this.debugLabel, this.debugStyles, ...args);
            else
                console.log(...args);
        }
    }

    lg(label = "") {
        if (this.debug && !this.debugGroupOpened) {
            this.debugGroupOpened = true;
            console.groupCollapsed(this.debugLabel, this.debugStyles, label);
        }
    }

    lge() {
        if (this.debug && this.debugGroupOpened) {
            this.debugGroupOpened = false;
            console.groupEnd();
        }
    }
}

/***/ }),

/***/ "./src/drivers/prebid_driver.js":
/*!**************************************!*\
  !*** ./src/drivers/prebid_driver.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PrebidDriver)
/* harmony export */ });
class PrebidDriver {
  adUnitId = null;
  parentContainer = null;
  bannerContainer = null;
  debug = 0;
  debug = 0;
  debugLabel = "%cMPSU Prebid Driver";
  debugStyles = "color:white; background-color: #3f8be8; padding: 2px 5px; border-radius: 3px;";
  debugGroupOpened = false;
  timeout = 2000;
  adUnit = null;
  iframeClickedLast = false;
  requestBidsObj = null;
  preferredCurrency = 'RUB';
  unsoldRefreshTimeout = 1000;
  maxFailedRequests = 2;
  failedRequestsCount = 0;
  impressionTimeoutDuration = 2000;
  impressionTimeout = null;
  clickHandler = null;
  clickTarget = null;
  iframe = null;
  elementUnderMouse = null;
  iframeClickedLast = false;
  firstBlur = false;
  focusHandler = null;
  blurHandler = null;
  mouseMoveHandler = null;

  pbConfig = {
    currency: {
      adServerCurrency: "RUB",
      granularityMultiplier: 1,
      defaultRates: {
        "USD": { "RUB": 96.21 },
        "EUR": { "RUB": 102.80 },
      }
    },
    firstPartyData: {
      uaHints: [
        "architecture",
        "model",
        "platform",
        "platformVersion",
        "fullVersionList"
      ]
    },
    userSync: {
      userIds: [{
        name: "sharedId",
        storage: {
          type: "cookie",
          name: "_sharedid",
          expires: 180
        }
      },
      {
        name: "adriverId"
      },
      {
        name: 'pairId'
      }
      ]
    },
    realTimeData: {
      auctionDelay: 100,
      dataProviders: [
        {
          "name": "intersection",
          "waitForIt": true
        }
      ],
    },
    enableTIDs: true,
    deviceAccess: true,
    allowActivities: {
      syncUser: {
        default: true,
        rules: [
          { allow: true }
        ]
      },
      accessDevice: {
        default: true,
        rules: [
          { allow: true }
        ]
      }
    }
  };

  constructor(settings, events) {
    if (!settings.id) {
      this.l("No Ad unit ID set for Prebid driver");
      return false;
    }
    this.adUnitId = settings.id;
    if (!settings.config) {
      this.l(this.adUnitId + " No Ad unit Prebid config found");
      return false;
    }
    this.adUnit = settings.config;
    if (settings.pbConfig) this.pbConfig = settings.pbConfig;
    if (settings.timeout) this.timeout = settings.timeout;
    if (settings.debug) this.debug = settings.debug;
    if (new URLSearchParams(window.location.search).get('pbjs_debug') == 'true')
      this.debug = 1;

    this.requestBidsObj = {
      timeout: this.timeout,
      bidsBackHandler: this.responseHandler.bind(this)
    };

    window.pbjs = window.pbjs || {};
    window.pbjs.que = window.pbjs.que || [];

    window.pbjs.que.push(() => {
      window.pbjs.setConfig(this.pbConfig);
    });

    this.setEvents(events)
  }

  setOption(s, o) {
    if (typeof s[o] !== 'undefined') {
      this[o] = s[o];
    }
  }

  setEvents = (events) => {
    const eventsDefault = {
      onClose: () => { },
      onStop: () => { },
      onError: () => { },
      onImpression: () => { },
      onClick: () => { },
    }

    this.events = { ...eventsDefault, ...events }
  }

  setImpressionTimeout() {
    this.impressionTimeout = setTimeout(() => {
      this.l('Impression Timeout fired');
      this.events.onImpression();
    }, this.impressionTimeoutDuration);
  }

  show(parentContainer) {
    if (parentContainer)
      this.parentContainer = parentContainer;

    if (!this.parentContainer) {
      console.log(this.adUnitId + " Container is not available for this banner, can't show");
      return false;
    }
    this.bannerContainer = document.createElement('div');
    this.bannerContainer.id = this.adUnitId;
    this.parentContainer.append(this.bannerContainer);

    this.requestBids();
  }

  hide() {
    this.clearContainer();
    if (this.focusHandler)
      window.removeEventListener('focus', this.focusHandler);
    if (this.blurHandler)
      window.removeEventListener('blur', this.blurHandler);
    if (this.mouseMoveHandler)
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    this.events.onStop();
  }

  clearContainer() {
    this.l('Clearing container');
    this.l(this.clickTarget);
    this.l(this.clickHandler);
    if (this.clickTarget && this.clickHandler) {
      this.clickTarget.removeEventListener("click", this.clickHandler);
    }
    this.l(this.container);
    if (this.bannerContainer) {
      this.bannerContainer.innerHTML = "";
    }
  }

  refresh() {
    this.requestBids();
  }

  requestBids() {
    this.l(this.adUnitId + ' Requesting bids');
    window.pbjs.que.push(() => {
      window.pbjs.addAdUnits([this.adUnit]);
      window.pbjs.requestBids(this.requestBidsObj);
      window.pbjs.removeAdUnit(this.adUnit.code);
    });
  }

  addCode(bid, position = 'beforeend') {
    this.l(this.adUnitId + ' adding code');
    this.iframe = document.createElement('iframe');
    this.iframe.style = 'width:' + bid.width + 'px;height:' + bid.height + 'px;overflow:hidden; border: 0; overflow: hidden;';
    this.clearContainer();
    if (bid.ad) {
      this.bannerContainer.appendChild(this.iframe);
      let iframeDoc = this.iframe.contentWindow.document;
      iframeDoc.body.style = 'margin: 0;';
      iframeDoc.body.insertAdjacentHTML(position, bid.ad);
      let scripts = iframeDoc.body.querySelectorAll('script');
      if (scripts.length) {
        scripts.forEach((script) => {
          this.createScript(script);
        })
      }
    }
    else if (bid.adUrl) {
      this.iframe.src = bid.adUrl;
      this.bannerContainer.appendChild(this.iframe);
    }
    this.setWindowEvents();
  }

  setWindowEvents() {
    this.focusHandler = ((e) => { this.windowFocussed(e) }).bind(this);
    window.addEventListener('focus', this.focusHandler, true);
    this.blurHandler = ((e) => { this.windowBlurred(e) }).bind(this);
    window.addEventListener('blur', this.blurHandler, true);
    this.mouseMoveHandler = ((e) => { this.windowMouseMove(e) }).bind(this);
    window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
  }

  windowBlurred(e) {
    var el = document.activeElement;
    if (el === this.iframe) {
      this.l('Iframe CLICKED ON');
      this.iframeClickedLast = true;
      this.events.onClick();
    }
  }

  windowFocussed(e) {
    if (this.iframeClickedLast) {
      this.iframeClickedLast = false;
      this.l('Iframe CLICKED OFF');
    }
  }

  windowMouseMove(e) {
    let elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY)
    if (elementUnderMouse !== this.elementUnderMouse) {
      if (elementUnderMouse === this.container || elementUnderMouse === this.iframe) {
        this.l("The container is under mouse");
      }
      else {
        window.focus();
        this.iframeClickedLast = false;
      }
      this.elementUnderMouse = elementUnderMouse;
      this.l("Element under mouse:", this.elementUnderMouse);
    }
  }

  copyAttributes(source, target) {
    return Array.from(source.attributes).forEach(attribute => {
      target.setAttribute(
        attribute.nodeName,
        attribute.nodeValue,
      );
    });
  }
  createScript(script) {
    let s = document.createElement('script');
    this.copyAttributes(script, s);
    script.before(s);
    s.innerHTML = script.innerHTML;
    script.remove();
  }

  responseHandler(bidResponses) {
    this.l(this.adUnitId + ' Responses recieved:', bidResponses);
    let adUnitsIds = Object.keys(bidResponses);
    if (adUnitsIds.length) {
      this.failedRequestsCount = 0;
      adUnitsIds.forEach((adUnitId) => {
        const winningBid = bidResponses[adUnitId].bids.reduce((prev, current) => (prev.cpm > current.cpm ? prev : current));
        this.l(this.adUnitId + ' Winning bid:', winningBid);

        if (this.bannerContainer) {
          this.addCode(winningBid);
          this.setImpressionTimeout();
        }
        else {
          this.l(this.adUnitId + " No container with Ad unit ID in DOM");
          return false;
        }
      });
    }
    else {
      this.failedRequestsCount++;
      this.l(this.adUnitId + ' No bids recieved');
      if (this.failedRequestsCount >= this.maxFailedRequests) {
        this.failedRequestsCount = 0;
        this.l(this.adUnitId + ' Already tried refresh. Failed again. Quit');
      }
      else {
        this.l(this.adUnitId + ' Will retry in ' + (this.unsoldRefreshTimeout / 1000) + 'sec');
        let _self = this;
        setTimeout(() => {
          this.l(this.adUnitId + ' Refreshing now!');
          this.refresh();
        }, this.unsoldRefreshTimeout);
      }
    }
  }

  click() {
    this.l('Click event fired')
    this.events.onClick();
  }

  // Debug

  l(...args) {
    if (this.debug) {
      if (!this.debugGroupOpened)
        console.log(this.debugLabel, this.debugStyles, ...args);
      else
        console.log(...args);
    }
  }

  lg(label = "") {
    if (this.debug && !this.debugGroupOpened) {
      this.debugGroupOpened = true;
      console.groupCollapsed(this.debugLabel, this.debugStyles, label);
    }
  }

  lge() {
    if (this.debug && this.debugGroupOpened) {
      this.debugGroupOpened = false;
      console.groupEnd();
    }
  }

}

/***/ }),

/***/ "./src/drivers/rewarded_driver.js":
/*!****************************************!*\
  !*** ./src/drivers/rewarded_driver.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RewardedDriver)
/* harmony export */ });
class RewardedDriver {
    debug = 0;
    debugLabel = "%cMPSU Yandex Rewarded Driver";
    debugStyles = "color:white; background-color: #3f8be8; padding: 2px 5px; border-radius: 3px;";
    debugGroupOpened = false;

    selector = null;
    button = null;
    btnEvent = null;

    options = {};

    scriptsLoaded = {};
    sdkURL = 'https://yandex.ru/ads/system/context.js';
    status = 'created';
    timeout = 5000;

    impressionTimeoutDuration = 2000;
    impressionTimeout = null;

    buttonEvents = {
        onRewarded: (e) => {
            if (e) {
                this.l('Successfully rewarded');
                this.status = 'rewarded';
                this.events.onRewarded();
            }
            else {
                this.l('User has cancelled the ad');
                this.status = 'cancelled';
            }
            this.events.onClose();
            this.button.disabled = false;
            this.hide();
        },
        onRender: () => {
            this.status = 'rendered';
            this.l('Ad rendered');
            this.setImpressionTimeout();
        },
        onError: (d) => {
            this.status = 'error';
            this.l('Error:', d);
            this.events.onError();
            this.button.disabled = false;
            this.hide();
        },
    }

    constructor(settings, events) {
        this.debug = settings?.debug ?? 0
        this.selector = settings?.selector ?? null;

        window.yaContextCb = window.yaContextCb || [];

        this.loadSDK(this.sdkURL)
        this.setEvents(events)
        this.mergeOptions(settings);
    }


    drop(onEvent = false) {
        //this. = null;
    }

    setEvents = (events) => {
        const eventsDefault = {
            onClose: () => { },
            onStop: () => { },
            onError: () => { },
            onRewarded: () => { },
            onImpression: () => { },
            onClick: () => { },
        }
        this.events = { ...eventsDefault, ...events }
    }

    setImpressionTimeout() {
        this.impressionTimeout = setTimeout(() => {
            this.l('Impression Timeout fired');
            this.events.onImpression();
        }, this.impressionTimeoutDuration);
    }

    // Settings 

    mergeOptions(o) {
        this.l('Options are object', this.isObject(o));
        if (this.isObject(o))
            this.options = {
                ...this.options,
                ...o
            }
        this.l('Options: ', this.options)
    }
    isObject(e) {
        return typeof e === 'object' &&
            !Array.isArray(e) &&
            e !== null;
    }

    show(selector) {
        if (selector) this.selector = selector;
        this.button = document.querySelector(this.selector);
        if (this.button) {
            this.handleButton();
            this.status = 'ready';
        }
        else {
            this.l('Can\'t find button element in DOM')
        }
    }

    handleButton() {
        this.btnEvent = (e) => { this.buttonClickEvent(e) };
        this.button.addEventListener('click', this.btnEvent);
    }

    buttonClickEvent(e) {
        this.l('Button click fired');
        e.preventDefault();
        e.stopPropagation();
        if (this.button.disabled) {
            // Doing nothing
            this.l('Already in use');
        }
        else {
            this.status = 'clicked';
            setTimeout(() => {
                if (this.status === 'clicked') {
                    this.l('The Ad was not rendered. Stopping the script');
                    this.hide();
                }
            }, this.timeout);
            this.button.disabled = true;
            this.l('Starting to show the ad')
            window.yaContextCb.push(() => {
                this.l('Platform', Ya?.Context?.AdvManager?.getPlatform());
                this.l('AdvManager', Ya?.Context?.AdvManager);
                let adOpts = this.options.ads[(Ya.Context.AdvManager.getPlatform() === 'desktop' ? 'desktop' : 'mobile')];
                this.setAdsEvents(adOpts);
                Ya.Context.AdvManager.render(adOpts);
            });
        }
    }

    setAdsEvents(adOpts) {
        adOpts.onRewarded = this.buttonEvents.onRewarded;
        adOpts.onRender = this.buttonEvents.onRender;
        adOpts.onError = this.buttonEvents.onError;
    }

    hide() {
        if (this.button) {
            this.button.removeEventListener('click', this.btnEvent ?? (() => { }));
            this.button.disabled = false;
        }
        this.events.onStop();
    }

    reload() {
        this.handleButton();
    }

    loadSDK(url, callback) {
        this.l('LOADING SDK');
        if (typeof this.scriptsLoaded[this.sdkURL] === 'undefined' && !document.querySelector('script[src="' + this.sdkURL + '"]')) {
            this.l('Starting to load SDK');
            this.scriptsLoaded[this.sdkURL] = { isLoaded: false }
            var script = document.createElement('script');
            script.src = url;
            this.scriptsLoaded[this.sdkURL].script = script;
            document.body.appendChild(script);
            this.l('SCRIPT!', script);
        }
    }

    // Debug

    l(...args) {
        if (this.debug) {
            if (!this.debugGroupOpened)
                console.log(this.debugLabel, this.debugStyles, ...args);
            else
                console.log(...args);
        }
    }

    lg(label = "") {
        if (this.debug && !this.debugGroupOpened) {
            this.debugGroupOpened = true;
            console.groupCollapsed(this.debugLabel, this.debugStyles, label);
        }
    }

    lge() {
        if (this.debug && this.debugGroupOpened) {
            this.debugGroupOpened = false;
            console.groupEnd();
        }
    }
}

/***/ }),

/***/ "./src/drivers/vk_driver.js":
/*!**********************************!*\
  !*** ./src/drivers/vk_driver.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VkDriver)
/* harmony export */ });
class VkDriver {
    debug = 0;
    debugLabel = "%cMPSU Vk Driver";
    debugStyles = "color:white; background-color: #3f8be8; padding: 2px 5px; border-radius: 3px;";
    debugGroupOpened = false;

    container = null;
    slotId = null;
    adContainer = null;

    adStyles = {
        display: 'inline-block',
        width: '240px',
        height: '400px',
        textDecoration: "none",
    }

    options = {};

    impressionTimeoutDuration = 2000;
    impressionTimeout = null;
    clickHandler = null;
    clickTarget = null;

    scriptsLoaded = {};
    sdkURL = 'https://ad.mail.ru/static/ads-async.js';

    adOptions = {
        onAdsLoaded: (data) => {
            this.l('onAdsLoaded', data)
            this.setImpressionTimeout();
            this.clickHandler = this.click.bind(this)
            this.l('Click handler:', this.clickHandler);
            this.clickTarget = this.adContainer; //this.iframe ?? this.container;
            this.l('Click target:', this.clickTarget);
            this.clickTarget.addEventListener("click", this.clickHandler);
        },
        onAdsRefreshed: () => {
            this.l('onAdsRefreshed')
        },
        onAdsClosed: (slot) => {
            this.l('onAdsClosed', slot)
            this.events.onClose();
            this.hide();
        },
        onNoAds: (data) => {
            this.l('No ads recieved for ' + data.slot)
            this.l(data.slot);
            this.l(data.el);
            this.hide();
        },
        onAdsSuccess: (data) => {
            this.l('onAdsSuccess');
            this.l(data.slot);
            this.l(data.el);
            this.l(data.data);
        },
        onAdsClicked: (data) => {
            this.l(data.slot);
            this.l('Going to ' + data.link)
        },
        onScriptError: (data) => {
            this.l('onScriptError');
            this.l(data.slot);
            this.l(data.el);
            this.l(data.error);
            this.events.onError();
        },
        iframeMode: true,
        singleRequest: true,
        preventAutoLoad: true,
        disableCollect: true,
    }

    constructor(settings, events) {
        if (settings) {
            this.debug = settings?.debug ?? 0
            this.container = settings?.container ?? null;
            this.slotId = settings?.slotId ?? null;
            if (settings.adOptions) {
                this.adOptions = this.mergeOptions(this.adOptions, settings.adOptions);
                this.l(this.adOptions);
            }
            if (settings.adStyles) {
                this.adStyles = this.mergeOptions(this.adStyles, settings.adStyles);
                this.l(this.adStyles);
            }
        }
        window.MRGtag = window.MRGtag || [];

        this.loadSDK(this.sdkURL);
        this.setEvents(events)
        this.mergeOptions(settings);
    }


    drop(onEvent = false) {
        //this. = null;
    }

    setEvents = (events) => {
        const eventsDefault = {
            onClose: () => { },
            onStop: () => { },
            onError: () => { },
            onImpression: () => { },
            onClick: () => { },
        }
        this.events = { ...eventsDefault, ...events }
    }

    setImpressionTimeout() {
        this.impressionTimeout = setTimeout(() => {
            this.l('Impression Timeout fired');
            this.events.onImpression();
        }, this.impressionTimeoutDuration);
    }

    // Settings 

    mergeOptions(o1, o2) {
        this.l('Options are object', this.isObject(o2));
        if (this.isObject(o2))
            o1 = {
                ...o1,
                ...o2
            }
        this.l('Options: ', o1);
        return o1;
    }
    isObject(e) {
        return typeof e === 'object' &&
            !Array.isArray(e) &&
            e !== null;
    }

    show(container) {
        if (container) this.container = container;
        this.clearContainer();
        this.createAdContainer();
        this.adOptions.element = this.adContainer;
        (window.MRGtag = window.MRGtag || []).push(this.adOptions);
    }

    clearContainer() {
        this.l('Clearing container');
        this.l(this.clickTarget);
        this.l(this.clickHandler);
        if (this.clickTarget && this.clickHandler) {
            this.clickTarget.removeEventListener("click", this.clickHandler);
        }
        this.l(this.container);
        if (this.container) {
            this.container.innerHTML = "";
        }
    }

    createAdContainer() {
        if (this.container) {
            this.adContainer = document.createElement('ins');
            this.container.appendChild(this.adContainer)
            this.adContainer.id = 'ad-test-' + this.slotId;
            this.adContainer.dataset['adClient'] = 'ad-' + this.slotId;
            this.adContainer.dataset['adSlot'] = this.slotId;
            this.adContainer.classList.add('mrg-tag');
            this.setAdContainerStyles();
            this.l('Ad container successfully created', this.adContainer);
        }
        else {
            this.l('Container was not specified')
        }
    }

    setAdContainerStyles() {
        Object.keys(this.adStyles).forEach((key) => {
            this.adContainer.style[key] = this.adStyles[key];
        });
    }

    hide() {
        this.clearContainer();
        this.events.onStop();
    }

    reload() {
        this.show();
    }

    loadSDK(url, callback) {
        this.l('LOADING SDK');
        if (typeof this.scriptsLoaded[this.sdkURL] === 'undefined' && !document.querySelector('script[src="' + this.sdkURL + '"]')) {
            this.l('Starting to load SDK');
            this.scriptsLoaded[this.sdkURL] = { isLoaded: false }
            var script = document.createElement('script');
            script.src = url;
            this.scriptsLoaded[this.sdkURL].script = script;
            document.body.appendChild(script);
            this.l('SCRIPT!', script);
            script.onload = () => this.l('SDK LOADED!');
        }
    }

    click() {
        this.l('Click event fired')
        this.events.onClick();
    }

    // Debug

    l(...args) {
        if (this.debug) {
            if (!this.debugGroupOpened)
                console.log(this.debugLabel, this.debugStyles, ...args);
            else
                console.log(...args);
        }
    }

    lg(label = "") {
        if (this.debug && !this.debugGroupOpened) {
            this.debugGroupOpened = true;
            console.groupCollapsed(this.debugLabel, this.debugStyles, label);
        }
    }

    lge() {
        if (this.debug && this.debugGroupOpened) {
            this.debugGroupOpened = false;
            console.groupEnd();
        }
    }
}

/***/ }),

/***/ "./src/drivers/vk_inpage_driver.js":
/*!*****************************************!*\
  !*** ./src/drivers/vk_inpage_driver.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VKInPageDriver)
/* harmony export */ });
class VKInPageDriver {
    debug = 0;
    debugLabel = "%cMPSU Vk InPage Driver";
    debugStyles = "color:white; background-color: #3f8be8; padding: 2px 5px; border-radius: 3px;";
    debugGroupOpened = false;

    container = null;
    slotId = null;
    adContainer = null;

    adStyles = {
        display: 'inline-block',
        width: '640px',
        height: '360px',
    }

    options = {};

    impressionTimeoutDuration = 2000;
    impressionTimeout = null;

    scriptsLoaded = {};
    sdkURL = 'https://ad.mail.ru/static/vk-adman.js';

    adOptions = {
        onReady: () => { this.l('onReady') },
        onError: (data) => {
            switch (data.error) {
                case 105:
                    this.l(data.error, 'Media chunk error'); break;
                case 311:
                    this.l(data.error, 'No container on the page'); break;
                case 312:
                    this.l(data.error, 'No place in container'); break;
                case 313:
                    this.l(data.error, 'RenderRunner load error'); break;
                case 314:
                    this.l(data.error, 'Message system error'); break;
                case 315:
                    this.l(data.error, 'Unacceptable creative'); break;
                case 316:
                    this.l(data.error, 'Container link error'); break;
                case 321:
                    this.l(data.error, 'Empty ad section'); break;
                case 322:
                    this.l(data.error, 'Visit is not an object'); break;
                case 323:
                    this.l(data.error, 'Server error'); break;
                case 331:
                    this.l(data.error, 'Config error'); break;
                case 332:
                    this.l(data.error, 'Slot is not specified'); break;
                case 333:
                    this.l(data.error, 'Container is not specified'); break;
                case 341:
                    this.l(data.error, 'Wrong inline banner (base64)'); break;
                case 342:
                    this.l(data.error, 'Wrong inline config. Check the "src" attribute'); break;
                case 351:
                    this.l(data.error, 'No media in section'); break;
                case 352:
                    this.l(data.error, 'Invalid JSON server response'); break;
                case 353:
                    this.l(data.error, 'Config is not an object'); break;
                case 361:
                    this.l(data.error, 'Video element error'); break;
                case 362:
                    this.l(data.error, 'Old browser (IntersectionObserver);)'); break;
                case 5001:
                    this.l(data.error, 'Common error'); break;
                case 5002:
                    this.l(data.error, 'Already initialized'); break;
                case 5003:
                    this.l(data.error, 'Not initialized'); break;
                case 5004:
                    this.l(data.error, 'Not in play status'); break;
                case 5005:
                    this.l(data.error, 'Not in pause status'); break;
                case 5006:
                    this.l(data.error, 'The ad is already started'); break;
                case 5007:
                    this.l(data.error, 'Destroyed'); break;
                case 5008:
                    this.l(data.error, 'Forbidden in stream mode (playMode="stream")'); break;
                case 1100:
                    this.l(data.error, 'Empty ad response'); break;
                default:
                    this.l(data.error, 'Unknown error'); break;
            }
            if (data.error === 1100) {
                this.events.onStop();
            }
            else {
                this.events.onError();
            }

        },
        onStarted: () => {
            this.l('onStarted');
            this.setImpressionTimeout();
        },
        onPaused: () => { this.l('onPaused') },
        onPlayed: () => { this.l('onPlayed') },
        onCompleted: () => { this.l('onCompleted') },
        onClosed: () => { this.l('onClosed'); this.events.onClose(); },
        onSkipped: () => { this.l('onSkipped') },
        onClicked: () => {
            this.l('onClicked')
            this.events.onClick();
        },
        adMidrollPoint: () => { this.l('adMidrollPoint') },
        onTimeRemained: () => { this.l('onTimeRemained') },
        onDurationChanged: () => { this.l('onDurationChanged') },
        onVPAIDStarted: () => { this.l('onVPAIDStarted') }
    }

    f = function () {
        this.push(Array.prototype.slice.apply(arguments));
    }

    constructor(settings, events) {
        if (settings) {
            this.debug = settings?.debug ?? 0
            this.container = settings?.container ?? null;
            this.slotId = settings?.slotId ?? null;
            if (settings.adOptions) {
                this.adOptions = this.mergeOptions(this.adOptions, settings.adOptions);
                this.l(this.adOptions);
            }
            if (settings.adStyles) {
                this.adStyles = this.mergeOptions(this.adStyles, settings.adStyles);
                this.l(this.adStyles);
            }
        }

        window.AdManPlayer = this.f.bind(window._AdManPlayerInit = []);
        window.AdManSDK = this.f.bind(window._AdManSDKInit = []);

        this.loadSDK(this.sdkURL);
        this.setEvents(events)
        this.mergeOptions(settings);
    }


    drop(onEvent = false) {
        this.clearContainer();
    }

    setEvents = (events) => {
        const eventsDefault = {
            onClose: () => { },
            onStop: () => { },
            onError: () => { },
            onImpression: () => { },
            onClick: () => { },
        }
        this.events = { ...eventsDefault, ...events }
    }

    setImpressionTimeout() {
        this.impressionTimeout = setTimeout(() => {
            this.l('Impression Timeout fired');
            this.events.onImpression();
        }, this.impressionTimeoutDuration);
    }

    // Settings 

    mergeOptions(o1, o2) {
        this.l('Options are object', this.isObject(o2));
        if (this.isObject(o2))
            o1 = {
                ...o1,
                ...o2
            }
        this.l('Options: ', o1);
        return o1;
    }
    isObject(e) {
        return typeof e === 'object' &&
            !Array.isArray(e) &&
            e !== null;
    }

    show(container) {
        if (container) this.container = container;
        this.clearContainer();
        this.createAdContainer();
        this.l(this.adContainer.id);
        this.l('Ad options:', this.adOptions);
        this.l('slotId', this.slotId);

        window.AdManPlayer({
            container: "#ad-" + this.slotId,
            slot: this.slotId,
            ...this.adOptions
        });
    }

    clearContainer() {
        this.l(this.container);
        if (this.container) {
            this.container.innerHTML = "";
        }
    }

    createAdContainer() {
        if (this.container) {
            this.adContainer = document.createElement('div');
            this.adContainer.id = "ad-" + this.slotId;
            this.setAdContainerStyles();
            this.container.appendChild(this.adContainer);
            this.l('Ad container successfully created', this.adContainer);
        }
        else {
            this.l('Container was not specified')
        }
    }

    setAdContainerStyles() {
        Object.keys(this.adStyles).forEach((key) => {
            this.adContainer.style[key] = this.adStyles[key];
        });
    }

    hide() {
        this.clearContainer();
        this.events.onStop();
    }

    reload() {
        this.show();
    }

    loadSDK(url, callback) {
        this.l('LOADING SDK');
        if (typeof this.scriptsLoaded[this.sdkURL] === 'undefined' && !document.querySelector('script[src="' + this.sdkURL + '"]')) {
            this.l('Starting to load SDK');
            this.scriptsLoaded[this.sdkURL] = { isLoaded: false }
            var script = document.createElement('script');
            script.src = url;
            this.scriptsLoaded[this.sdkURL].script = script;
            document.body.appendChild(script);
            this.l('SCRIPT!', script);
            script.onload = () => this.l('SDK LOADED!');
        }
    }

    // Debug

    l(...args) {
        if (this.debug) {
            if (!this.debugGroupOpened)
                console.log(this.debugLabel, this.debugStyles, ...args);
            else
                console.log(...args);
        }
    }

    lg(label = "") {
        if (this.debug && !this.debugGroupOpened) {
            this.debugGroupOpened = true;
            console.groupCollapsed(this.debugLabel, this.debugStyles, label);
        }
    }

    lge() {
        if (this.debug && this.debugGroupOpened) {
            this.debugGroupOpened = false;
            console.groupEnd();
        }
    }
}

/***/ }),

/***/ "./src/drivers/vpaid_driver.js":
/*!*************************************!*\
  !*** ./src/drivers/vpaid_driver.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ VPAIDDriver)
/* harmony export */ });
class VPAIDDriver {

  debug = 0;
  debugLabel = "%cMPSU Player";
  debugStyles = "color:white; background-color: #3f8be8; padding: 2px 5px; border-radius: 3px;";
  debugGroupOpened = false;

  hash = null;
  widgetId = null;
  loop = 0;
  disableControls = 0;

  logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 757.84 120"> <defs> <style>.cls-1{fill:#ff6d00;}.cls-2{fill:#fff;}</style> </defs> <title>Лого в кривых</title> <g id="Слой_2" data-name="Слой 2"> <g id="Слой_1-2" data-name="Слой 1"> <path class="cls-1" d="M451.84,0H726.4a31.44,31.44,0,0,1,31.44,31.44V88.56A31.44,31.44,0,0,1,726.4,120H483.28a31.44,31.44,0,0,1-31.44-31.44V0A0,0,0,0,1,451.84,0Z"/> <path class="cls-2" d="M62.95,96.56l-.1-41.5L42.49,89.25H35.28L15,55.95V96.56H0V27.39H13.24l25.89,43,25.49-43H77.77L78,96.56Z"/> <path class="cls-2" d="M139.92,81.74H107.8l-6.13,14.82H85.27L116.1,27.39h15.81l30.93,69.17H146Zm-5-12.15-11-26.48-11,26.48Z"/> <path class="cls-2" d="M214.12,96.56,200.78,77.29H186.06V96.56h-16V27.39H200c18.48,0,30,9.58,30,25.1,0,10.38-5.24,18-14.23,21.84l15.51,22.23Zm-15-56.13h-13V64.54h13c9.78,0,14.72-4.54,14.72-12.06S208.89,40.43,199.1,40.43Z"/> <path class="cls-2" d="M267.88,69.38l-9.29,9.68V96.56H242.68V27.39h15.91V59.7l30.63-32.31H307L278.35,58.22l30.34,38.34H290Z"/> <path class="cls-2" d="M369.35,83.71V96.56H315.8V27.39h52.27V40.23H331.71v15h32.12V67.7H331.71v16Z"/> <path class="cls-2" d="M396.43,40.43H374.29v-13h60.28v13H412.43V96.56h-16Z"/> <path class="cls-2" d="M489.88,65.52V88.15a4.05,4.05,0,0,1-1,3.11,6,6,0,0,1-6.2,0,4.07,4.07,0,0,1-.95-3.06V29.65q0-4,4.05-4H507q9.19,0,14.33,5.19t5.14,14.48q0,9.29-4.73,14.72t-14.29,5.43Zm0-31.92v24H508.1a9.84,9.84,0,0,0,4.82-1.09,8.83,8.83,0,0,0,3.15-2.87,12.59,12.59,0,0,0,1.72-4,17.91,17.91,0,0,0,.54-4.35A15.36,15.36,0,0,0,517.5,40a10.19,10.19,0,0,0-2.27-3.66,8.51,8.51,0,0,0-3.3-2.08A12.05,12.05,0,0,0,508,33.6Z"/> <path class="cls-2" d="M540,91.61q-4.15,0-4.15-4.05V29.16q0-4,4.15-4a4.28,4.28,0,0,1,3,.89,4.11,4.11,0,0,1,.94,3.06V83.7h28.85q3.75,0,3.75,3.85,0,4.05-3.75,4.05Z"/> <path class="cls-2" d="M617.45,76.59H591.85l-4.35,12.85A3.41,3.41,0,0,1,584,92a5.59,5.59,0,0,1-1.78-.3,3.93,3.93,0,0,1-2.17-1.28,3.28,3.28,0,0,1-.69-2.08,4.22,4.22,0,0,1,.2-1.48L599,29.45a8.11,8.11,0,0,1,1.53-2.87,3.74,3.74,0,0,1,2.82-.89h2.87a3.75,3.75,0,0,1,2.82.89,8.16,8.16,0,0,1,1.53,2.87L629.9,86.86a4.23,4.23,0,0,1,.3,1.48q0,2.27-2.57,3.26a7.59,7.59,0,0,1-2,.3,3.7,3.7,0,0,1-3.75-2.47Zm-22.83-7.9h20.26L604.8,37.36h-.2Z"/> <path class="cls-2" d="M654.1,91.61a19.3,19.3,0,0,1-6.82-1.19,14.85,14.85,0,0,1-5.52-3.61,17,17,0,0,1-3.7-6.13A25.21,25.21,0,0,1,636.71,72V45.36a23.65,23.65,0,0,1,1.45-8.65,17.36,17.36,0,0,1,3.9-6.13,16.54,16.54,0,0,1,5.57-3.66,17.66,17.66,0,0,1,6.57-1.24h20.65q3.75,0,3.75,4t-3.75,4H655a9.29,9.29,0,0,0-7.51,3.16,12.44,12.44,0,0,0-2.67,8.3V72.34a12.54,12.54,0,0,0,2.57,8.25,8.94,8.94,0,0,0,7.31,3.11h20.16q3.75,0,3.75,3.85,0,4.05-3.75,4.05Z"/> <path class="cls-2" d="M691.36,91.61q-4.15,0-4.15-4.05V29.65q0-4,4.15-4h32.9q3.75,0,3.75,4t-3.75,4h-29V52.67H720q3.56,0,3.56,4T720,60.58h-24.7V83.7h29q3.75,0,3.75,3.85,0,4.05-3.75,4.05Z"/> </g> </g> <script xmlns="" id="professor prebid injected bundle"/></svg>`;
  logoLink = 'https://market-place.su';
  disableLogo = 1;

  adMuted = true;
  soundBtn = null;
  disableSoundBtn = 0;

  playBtn = null;
  disablePlayBtn = 1;

  closeBtn = null;
  disableCloseBtn = 1;

  stylesElement = null;
  controlsStyles = `
  .mpsu-logo {
    position:absolute;
    top: 0px;
    right: 0px; 
    width: 110px;
    height: 25px;
    background-color: rgba(0,0,0,.8);
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  .mpsu-player-controls {
    position: absolute; 
    left: 10px; 
    top: 10px;
  }

  .mpsu-control {
    width: 26px; 
    height: 26px; 
    background-color: rgba(0,0,0,.8); 
    color: white;
    border-radius: 50%;
    float: left;
    cursor: pointer;
    margin-left: 10px
  }

  .mpsu-control:first-child {
    margin-left: 0;
  }

  .mpsu-control:hover {
    background-color: rgba(0,0,0,1);
  }

  .mpsu-close-button  {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .mpsu-sound-button svg {
    margin-top: 5px;
    margin-left: 2px;
  }
  
  .mpsu-sound-button .muted {
    display: none;
  }

  .mpsu-sound-button.muted .muted {
    display: inline-block;
  }

  .mpsu-sound-button.muted .unmuted {
    display: none;
  }
  
  .mpsu-play-button .pause {
    display: none;
    margin-top: 5px;
    margin-left: 8px;
  }

  .mpsu-play-button .play {
    margin-top: 5px;
    margin-left: 8px;
  }

  .mpsu-play-button.playing .pause {
    display: inline-block;
  }

  .mpsu-play-button.playing .play {
    display: none;
  }
  `;

  playerContainer = null;
  scriptsLoaded = {};
  que = [];

  timeout = null;
  timeoutDuration = 2000

  ima = null;

  options = { // Default options
    video: {
      style: 'width: 100%; height: 100%;'
    }
  };

  sdkURL = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
  url = 'https://v1.mpsuadv.ru/bh_v2/[hash]?hash=mpsu';
  videoUrl = 'video.mp4';

  constructor(settings, events) {
    this.dropAdLoader();
    this.hash = settings.hash;
    this.widgetId = settings.widgetId;

    this.setOption(settings, 'debug');
    this.setOption(settings, 'loop');
    this.setOption(settings, 'disableControls');
    this.setOption(settings, 'disableLogo');
    this.setOption(settings, 'disableCloseBtn');
    this.setOption(settings, 'disablePlayBtn');
    this.setOption(settings, 'disableSoundBtn');

    this.url = this.url.replace('[hash]', this.hash);
    this.l('URL: ', this.url);
    this.url = 'https://statika.mpsuadv.ru/test/test.xml'; // temporary url, remove on production
    if (settings.videoUrl) this.videoUrl = settings.videoUrl;
    this.playerContainer = settings.container;
    this.clearContainer();

    this.loadSDK(this.sdkURL, () => { this.init(); })
    this.setEvents(events)

    this.mergeOptions(settings);
    this.l("Settings: ", this.options);
  }

  setOption(s, o) {
    if (typeof s[o] !== 'undefined') {
      this[o] = s[o];
    }
  }

  dropAdLoader(onEvent = false) {
    this.l('Dropping Ad Loader');
    if (this.adsManager) {
      this.adsManager.destroy();
    }
    this.adsLoader = null;
    this.adDisplayContainer = null;
    this.adsManager = null;
    this.adsLoaded = false;
    this.adsRenderingSettings = null;
    this.videoElement = null;
    this.videoContainer = null;
    this.adContainer = null;
    this.videoStatus = null;
    this.status = onEvent ? 'dropped' : null;
    this.isRunning = false;
    clearTimeout(this.timeout);
  }

  setEvents = (events) => {
    const eventsDefault = {
      onClose: () => { },
      onStop: () => { },
      onError: () => { },
      onImpression: () => { },
      onClick: () => { },
    }
    this.events = { ...eventsDefault, ...events }
  }

  addControls() {
    this.l('Adding controls', !this.disableControls)
    if (!this.disableControls) {
      if (!this.controlsElement) {
        this.controlsElement = document.createElement('div');
        this.controlsElement.classList.add('mpsu-player-controls');
        this.playerContainer.appendChild(this.controlsElement);
      }

      this.l('Creating close button')
      if (!this.closeBtn && !this.disableCloseBtn) {
        this.closeBtn = document.createElement('div');
        this.closeBtn.classList.add('mpsu-control');
        this.closeBtn.classList.add('mpsu-close-button');

        let closeIconSvg = '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';

        this.closeBtn.insertAdjacentHTML('beforeend', closeIconSvg);

        this.controlsElement.appendChild(this.closeBtn);

        this.addCloseButtonEvents();
      }
      else {
        this.l('Close button already exists');
      }

      this.l('Creating sound button')
      if (!this.soundBtn && !this.disableSoundBtn) {
        this.soundBtn = document.createElement('div');
        this.soundBtn.classList.add('mpsu-control');
        this.soundBtn.classList.add('mpsu-sound-button');
        this.soundBtn.classList.add('muted');

        let mutedIconSvg = '<svg class="muted" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>';
        let unmutedIconSvg = '<svg class="unmuted" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>';

        this.soundBtn.insertAdjacentHTML('beforeend', mutedIconSvg);
        this.soundBtn.insertAdjacentHTML('beforeend', unmutedIconSvg);

        this.controlsElement.appendChild(this.soundBtn);

        this.addSoundButtonEvents();
      }
      else {
        this.l('Sound button already exists')
      }

      this.l('Creating play button');
      if (!this.playBtn && !this.disablePlayBtn) {
        this.playBtn = document.createElement('div');
        this.playBtn.classList.add('mpsu-control');
        this.playBtn.classList.add('mpsu-play-button');
        this.playBtn.classList.add('playing');

        let playIconSvg = '<svg class="play" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';
        let pauseIconSvg = '<svg class="pause" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>';

        this.playBtn.insertAdjacentHTML('beforeend', playIconSvg);
        this.playBtn.insertAdjacentHTML('beforeend', pauseIconSvg);

        this.controlsElement.appendChild(this.playBtn);

        this.addPlayButtonEvents();
      }
      else {
        this.l('Play button already exists');
      }
    }
    else {
      this.l('Controls option disabled')
    }
  }

  addControlsStyles() {
    this.l('Adding controls styles', !this.disableControls)
    this.l(!this.stylesElement ? 'Adding styles element' : 'Styles element already exists')
    if (!this.stylesElement) {
      this.stylesElement = document.createElement('style');
      this.stylesElement.insertAdjacentHTML('beforeend', this.controlsStyles);
      this.l(this.playerContainer);
      this.playerContainer.appendChild(this.stylesElement);
    }
  }

  addLogo() {
    if (!this.logo && !this.disableLogo) {
      this.logo = document.createElement('a');
      this.logo.href = this.logoLink;
      this.logo.insertAdjacentHTML('beforeend', this.logoSvg);
      this.logo.classList.add('mpsu-logo');
      this.playerContainer.appendChild(this.logo);
    }
  }

  // Actions

  show(container) {

    this.l('Showing ads');
    this.l('Status:', this.status);

    if (container && container !== this.playerContainer) {
      this.clearContainer();
      this.l('Setting new player container:', container);
      this.playerContainer = container;
      this.clearContainer();
      this.handleElements();
    }

    if (window.google?.ima && !this.adsLoader && this.videoElement && this.adContainer) {
      this.initAdsLoader();
    }

    if (this.status === 'dropped') {
      this.reInit();
    }

    if (!this.isRunning) {
      this.isRunning = true;
      this.l('isRunning', this.isRunning);
      this.que.push(this.loadAds.bind(this))
      if (this.adsManager)
        this.processQueue();
    }

    this.l('!this.disableControls', !this.disableControls)
    if (!this.disableControls) {
      this.addControlsStyles();
      this.addControls();
      this.addLogo();
    }
  }

  hide() {
    this.isRunning = false;
    this.events.onStop();
    this.dropAdLoader(true);
    this.clearContainer();
  }

  reload() {
    this.l('Refreshing player');
    if (this.status === 'dropped') {
      this.reInit();
      this.show();
    }
    else if (this.status !== 'dropped' && this.adsLoader) {
      this.playNextAd()
    }
  }

  resume() {
    this.adsManager?.resume()
  }

  pause() {
    this.adsManager?.pause()
  }

  playNextAd() {
    this.l('Playing next Ad')
    this.adsManager.destroy();
    this.adsLoader.contentComplete();
    this.que.push(this.loadAds.bind(this))
    this.adsLoaded = false;
    this.adsLoader.requestAds(this.adsRequest);
  }

  mute() {
    this.adMuted = true;
    this.adsManager?.setVolume(0);
  }

  unmute() {
    this.adMuted = false;
    this.adsManager?.setVolume(1);
  }

  playVideo() {
    if (this.videoStatus && this.videoStatus !== 'playing') {
      this.l('Video play fires');
      this.l('Video status: ', this.videoStatus);
      if (this.videoElement.play())
        this.videoStatus = 'playing';
      return this;
    }
    if (!this.status) {
      console.warn("Please init player first");
    }
    if (this.videoStatus === 'playing') {
      this.l("Already playing")
    }
  }

  stopVideo() {
    if (this.videoStatus === 'playing') {
      this.videoElement.pause();
      this.videoElement.currentTime = 0;
      this.videoStatus = 'stopped';
      return this;
    }
    console.warn("Please start the video first");
  }

  pauseVideo() {
    if (this.videoStatus === 'playing') {
      this.videoElement.pause();
      this.videoStatus = 'paused';
      return this;
    }
    console.warn("Please start the video first");
  }

  // Queue 

  processQueue() {
    this.l('Processing queue');
    if (this.que.length && window.google?.ima) {
      this.l('Have ' + this.que.length + ' job(s)');
      this.l('Queue', this.que)
      this.que.forEach((task, index) => {
        this.l('[' + index + ']', task);
        task();
        delete this.que[index];
      });
    }
    else {
      this.l('Queue is empty');
    }
  }

  // Initialization

  init() {
    this.l("Initializing IMA");

    this.setWindowResizeEvent();

    if (this.playerContainer) {
      this.handleElements();
    }

    this.l('window.google', window.google);
    this.initAdsLoader();
  }

  initAdsLoader() {
    if (this.adContainer && this.videoElement) {
      this.l('Initializing Ads Loader');
      this.adDisplayContainer = new window.google.ima.AdDisplayContainer(this.adContainer, this.videoElement);
      // this.adContainer.addEventListener('click', this.adContainerClick.bind(this));
      this.adsLoader = new window.google.ima.AdsLoader(this.adDisplayContainer);
      this.adsLoader.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (e) => { this.onAdsManagerLoaded(e) },
        false);
      this.adsLoader.addEventListener(
        window.google.ima.AdErrorEvent.Type.AD_ERROR,
        (e) => { this.onAdError(e) },
        false);

      this.adsRequest = new window.google.ima.AdsRequest();
      this.adsRequest.adTagUrl = this.url;

      this.adsRequest.linearAdSlotWidth = this.videoElement.clientWidth;
      this.adsRequest.linearAdSlotHeight = this.videoElement.clientHeight;
      this.adsRequest.nonLinearAdSlotWidth = this.videoElement.clientWidth;
      this.adsRequest.nonLinearAdSlotHeight = this.videoElement.clientHeight / 3;

      this.adsRequest.setContinuousPlayback(true);
      this.adsRequest.setAdWillAutoPlay(true);

      this.adsLoader.requestAds(this.adsRequest);

      this.status = "initiated";
      this.l('Status:', this.status);
    }
    else {
      this.l('Can\'t initialize Ads Loader, no proper video element or ad container. Ads Loader will be initialized on show()');
    }
  }

  reInit() {
    this.l('Reinitializing player');
    this.dropAdLoader(true);
    this.clearContainer();
    this.init();
  }

  clearContainer() {
    this.l('Clearing container');
    if (this.playerContainer)
      this.playerContainer.innerHTML = "";
  }

  loadSDK(url, callback) {
    this.l('LOADING SDK');
    if (window.google?.ima && callback) {
      this.l('IMA loaded & have a callback');
      callback();
    }
    else if (typeof this.scriptsLoaded[this.sdkURL] === 'undefined' && !document.querySelector('script[src="' + this.sdkURL + '"]')) {
      this.l('Starting to load SDK');
      this.scriptsLoaded[this.sdkURL] = { isLoaded: false }
      var script = document.createElement('script');
      script.src = url;
      this.scriptsLoaded[this.sdkURL].script = script;
      if (callback) script.onload = () => {
        this.l('IMA SDK just loaded');
        this.scriptsLoaded[this.sdkURL].loaded = true;

        callback();
      };
      document.body.appendChild(script);
      this.l('SCRIPT!', script);
    }
  }

  handleElements() {
    this.l('Handling Elements');
    if (!this.videoStatus) {
      this.l("Creating Video Element");
      this.videoElement = document.createElement('video');
      this.videoElement.setAttribute("playsinline", "")
      this.videoElement.setAttribute("autoplay", "")
      this.videoElement.setAttribute("style", this.options.video.style);
      this.videoElement.style.maxWidth = "100%";
      this.videoElement.style.pointerEvents = "none";
      this.videoElement.muted = true;
      this.videoElement.controls = false;
      this.l("Video Element", this.videoElement);

      this.l("Creating Video Container");
      this.videoContainer = document.createElement('div');
      this.videoContainer.classList.add('mpsu-player-container');
      this.videoContainer.style.position = "relative";
      this.videoContainer.style.width = this.options.video.width + "px";
      this.videoContainer.style.height = this.options.video.height + "px";
      this.videoElement.before(this.videoContainer);
      this.videoContainer.appendChild(this.videoElement);
      this.l("Video Container", this.videoContainer);

      this.l("Creating Ad Container");
      this.adContainer = document.createElement('div');
      this.adContainer.classList.add('mpsu-ad-container');
      this.adContainer.style.position = "absolute";
      this.adContainer.style.top = 0;
      this.adContainer.style.left = 0;
      this.adContainer.style.width = "100%";
      this.adContainer.style.height = "100%";
      this.videoContainer.appendChild(this.adContainer);
      this.l("Ad Container", this.adContainer);

      this.clearContainer();
      this.playerContainer.appendChild(this.videoContainer);

      this.addVideoEvents();

      this.videoStatus = "initiated";
      this.l('Video status:', this.videoStatus);
    }
    else {
      this.l('Video elements already initiated');
    }
  }

  loadAds(event) {
    this.l("Loading ads");
    if (this.adsLoaded) {
      this.l("Ads already loaded");
      return;
    }
    this.adsLoaded = true;
    this.videoElement.load();
    this.l("Video element loaded");
    this.adDisplayContainer.initialize();
    this.l("Display Container initialized");
    var width = this.videoElement.clientWidth;
    var height = this.videoElement.clientHeight;
    try {
      this.l("Trying to init ads manager");
      this.l("Ads Manager: ", this.adsManager);
      this.l("window.google.ima", window.google.ima);
      this.adsManager.init(width, height, window.google.ima.ViewMode.NORMAL);
      this.l("Starting ads manager");
      this.adsManager.start();
      this.l("Ads Manager Started");
    } catch (adError) {
      // Play the video without ads, if an error occurs
      this.l("AdsManager could not be started", adError);
      this.hide();
      this.events.onError()
    }
  }

  // Settings 

  mergeOptions(o) {
    this.l('Options are object', this.isObject(o));
    if (this.isObject(o))
      this.options = {
        ...this.options,
        ...o
      }
  }
  isObject(e) {
    return typeof e === 'object' &&
      !Array.isArray(e) &&
      e !== null;
  }

  // Events

  addVideoEvents() {
    this.l('Adding video events');
    this.videoElement.addEventListener("ended", () => {
      this.l("ended event triggered");
      if (this.adsLoader) {
        this.playNextAd();
      }
    });
    this.videoElement.addEventListener("error", () => {
      this.l("error event triggered");
    });
    this.videoElement.addEventListener("pause", () => {
      this.l("pause event triggered");
    });
    this.videoElement.addEventListener("play", () => {
      this.l("play event triggered");
    });
  }

  onAdsManagerLoaded(adsManagerLoadedEvent) {
    this.l("Ads Manager Loaded");
    this.adsRenderingSettings = new window.google.ima.AdsRenderingSettings()
    this.adsRenderingSettings.uiElements = [
      window.google.ima.UiElements.AD_ATTRIBUTION,
      window.google.ima.UiElements.COUNTDOWN,
    ]
    this.l('IMA', window.google.ima);
    this.adsManager = adsManagerLoadedEvent.getAdsManager(this.videoElement, this.adsRenderingSettings);

    this.adsManager.setVolume(0);
    this.adMuted = true;

    this.l('Error types: ', window.google.ima.AdErrorEvent.Type);
    this.l('Event types: ', window.google.ima.AdEvent.Type);

    this.l("this.adsManager", this.adsManager);
    this.adsManager.addEventListener(
      window.google.ima.AdErrorEvent.Type.AD_ERROR,
      (e) => { this.onAdError(e) });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      (e) => { this.onContentPauseRequested(e) });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      (e) => { this.onContentResumeRequested(e) });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.LOADED,
      (e) => { this.onAdLoaded(e) });


    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.STARTED,
      (e) => {
        this.eventInfo(e);
        this.status = this.videoStatus = "playing";
        this.l('The timeout will be cleared');
        clearTimeout(this.timeout);
      });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.FIRST_QUARTILE,
      (e) => { this.eventInfo(e); });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.MIDPOINT,
      (e) => { this.eventInfo(e); });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.THIRD_QUARTILE,
      (e) => { this.eventInfo(e); });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.COMPLETE,
      (e) => {
        this.eventInfo(e);
        this.status = this.videoStatus = "complete";
        this.l('Setting timeout to disable the ads if "complete" status will exceed timeout duration');
        this.timeout = setTimeout(() => {
          this.l('Timeout fired');
          if (['paused', 'playing', 'all_complete'].includes(this.status)) {
            this.l('It\'s ok, going on');
          }
          else if (this.status === 'complete') {
            this.l('Status is still "complete" on timeout, hiding');
            this.hide();
          }
        }, this.timeoutDuration);

      });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      (e) => {
        this.eventInfo(e);
        this.status = "all_complete";
        this.l('The timeout will be cleared');
        clearTimeout(this.timeout);
        this.controlsElement.remove();
        this.logo.remove();
        if (this.loop) {
          this.reload();
        }
      });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.PAUSED,
      (e) => {
        this.eventInfo(e);
        this.status = this.videoStatus = "paused";
      });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.RESUMED,
      (e) => {
        this.eventInfo(e);
        this.status = this.videoStatus = "playing";
      });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.VIDEO_CLICKED,
      (e) => {
        this.eventInfo(e);
        this.events.onClick();
      });
    this.adsManager.addEventListener(
      window.google.ima.AdEvent.Type.IMPRESSION,
      (e) => {
        this.eventInfo(e);
        this.events.onImpression();
      });


    this.processQueue();
  }

  eventInfo(e) {
    let ad = e.getAd();
    let podInfo = ad.getAdPodInfo();
    this.lg(e.type + ' fired (' + podInfo.getAdPosition() + ')');
    this.l('Ad data:', ad)
    this.l('Remaining Time', this.adsManager.getRemainingTime());
    this.l('Time has passed', ad.getDuration() - this.adsManager.getRemainingTime());
    this.l('Ad Position', podInfo.getAdPosition());
    this.l('Total Ads', podInfo.getTotalAds());
    this.l('Max Duration', podInfo.getMaxDuration());

    this.lge();
  }

  onAdError(adErrorEvent) {
    this.l('Error fired', adErrorEvent.getError());
    this.dropAdLoader(true);
    this.hide();
    this.events.onError();
  }

  onContentPauseRequested() {
    this.l("Content pause requested");
    this.videoElement.pause();
  }

  onContentResumeRequested() {
    this.l("Content resume requested");
    if (this.loop) {
      this.reload();
    }
  }

  adContainerClick(event) {
    this.l("Ad container clicked");
    if (this.videoElement.paused) {
      this.l("Playing video");
      this.videoElement.play();
    } else {
      this.l("Pausing video");
      this.videoElement.pause();
    }
  }

  onAdLoaded(adEvent) {
    this.l("The ad is loaded");
    var ad = adEvent.getAd();
    if (!ad.isLinear()) {
      this.videoElement.play();
    }
  }

  setWindowResizeEvent() {
    window.addEventListener('resize', (event) => {
      this.l("window resized");
      if (this.adsManager) {
        var width = this.videoElement.clientWidth;
        var height = this.videoElement.clientHeight;
        this.adsManager.resize(width, height, window.google.ima.ViewMode.NORMAL);
      }
    });
  }

  addSoundButtonEvents() {
    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', () => {
        this.l('adMuted', this.adMuted)
        if (this.adMuted) {
          this.l('UNMUTING')
          this.soundBtn.classList.remove('muted');
          this.unmute();
        }
        else {
          this.l('MUTING')
          this.soundBtn.classList.add('muted');
          this.mute();
        }
      });
    }
  }

  addPlayButtonEvents() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        this.l('videoStatus', this.videoStatus)
        if (this.videoStatus === 'playing') {
          this.l('pausing')
          this.playBtn.classList.remove('playing');
          this.pause();
        }
        else {
          this.l('playing')
          this.playBtn.classList.add('playing');
          this.resume();
        }
      });
    }
  }

  addCloseButtonEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.l('Close button clicked');
        this.hide();
      });
    }
  }


  // Getters

  getAdContainer() {
    return this.adContainer;
  }

  getVideoElement() {
    return this.videoElement;
  }

  getVideoContainer() {
    return this.videoContainer;
  }

  // Debug

  l(...args) {
    if (this.debug) {
      if (!this.debugGroupOpened)
        console.log(this.debugLabel, this.debugStyles, ...args);
      else
        console.log(...args);
    }
  }

  lg(label = "") {
    if (this.debug && !this.debugGroupOpened) {
      this.debugGroupOpened = true;
      console.groupCollapsed(this.debugLabel, this.debugStyles, label);
    }
  }

  lge() {
    if (this.debug && this.debugGroupOpened) {
      this.debugGroupOpened = false;
      console.groupEnd();
    }
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _drivers_html_driver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drivers/html_driver */ "./src/drivers/html_driver.js");
/* harmony import */ var _drivers_image_driver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./drivers/image_driver */ "./src/drivers/image_driver.js");
/* harmony import */ var _drivers_prebid_driver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./drivers/prebid_driver */ "./src/drivers/prebid_driver.js");
/* harmony import */ var _drivers_rewarded_driver__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./drivers/rewarded_driver */ "./src/drivers/rewarded_driver.js");
/* harmony import */ var _drivers_vk_driver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./drivers/vk_driver */ "./src/drivers/vk_driver.js");
/* harmony import */ var _drivers_vk_inpage_driver__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./drivers/vk_inpage_driver */ "./src/drivers/vk_inpage_driver.js");
/* harmony import */ var _drivers_vpaid_driver__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./drivers/vpaid_driver */ "./src/drivers/vpaid_driver.js");

//import HTMLDriver_test from "./drivers/html_driver_test";







var driver = (new URLSearchParams(window.location.search).get('driver')) ?? 'html';
var adUnit = null;
var container = document.querySelector("#ad-container");
////////////// HTML //////////////
/*if (driver === 'html_test') {
    adUnit = new HTMLDriver_test({
        html: `
            <div style="height:100%; overflow: hidden">
                <iframe style="width: 100%; height: 100%; overflow: hidden" src="https://kinorole.ru/user_evgen/public/?driver=html"></iframe>
            </div>`,
        debug: 1,       // optional
        inIframe: true, // optional
    });

    adUnit.show(container);
}*/
////////////// HTML - for iframe test purposes //////////////
if (driver === 'html') {
    adUnit = new _drivers_html_driver__WEBPACK_IMPORTED_MODULE_0__["default"]({
        html: `
            <div style="height:100%; overflow: hidden">
                <a href="?driver=image"
                        target="_blank"
                        style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden">
                    <span class="some-class">Some text to show that the code is working<\/span>
                <\/a>
                <script>
                    console.log(1);
                <\/script>
            </div>`,
        debug: 1,       // optional
        inIframe: false, // optional
    });

    adUnit.show(container);
}
////////////// Image //////////////
else if (driver === 'image') {
    adUnit = new _drivers_image_driver__WEBPACK_IMPORTED_MODULE_1__["default"]({
        url: 'https://ih0.redbubble.net/image.234961683.5516/raf,360x360,075,t,fafafa:ca443f4786.jpg',
        debug: 1,                                     // optional
        inIframe: true,                               // optional
        link: '?driver=html', // optional, next available if the link is set
        inNewTab: true,                               // optional
        title: 'Some string',                         // optional
    });

    adUnit.show(container);
}
////////////// VK //////////////
else if (driver === 'vk') {
    adUnit = new _drivers_vk_driver__WEBPACK_IMPORTED_MODULE_4__["default"]({
        slotId: 1303253,
        adStyles: { // optional
            width: '300px',
            height: '250px'
        },
        debug: 1,   // optional
    });

    adUnit.show(container);
}
////////////// VK InPage //////////////
else if (driver === 'inpage') {
    adUnit = new _drivers_vk_inpage_driver__WEBPACK_IMPORTED_MODULE_5__["default"]({
        adStyles: {
            width: '640px',
            height: '360px'
        },
        slotId: 1351437,
        debug: 1,
    });

    adUnit.show(container);
}

////////////// VPAID //////////////
else if (driver === 'vpaid') {
    adUnit = new _drivers_vpaid_driver__WEBPACK_IMPORTED_MODULE_6__["default"]({
        // container: document.getElementById('container-for-ad'), // optional
        hash: 'SlpDFRDRBMzM1MzNBNzYwT01RPQ==',
        widgetId: '3353',
        debug: 1,          // optional
        loop: true,        // optional
    });

    adUnit.show(container);
}
////////////// VK Revarded //////////////
else if (driver === 'rewarded') {
    adUnit = new _drivers_rewarded_driver__WEBPACK_IMPORTED_MODULE_3__["default"]({
        ads: {
            desktop: {
                blockId: "R-A-3400167-4",
                type: "fullscreen",
                platform: "desktop"

            },
            mobile: {
                blockId: "R-A-3400167-3",
                type: "fullscreen",
                platform: "touch"
            }
        },
        debug: 1

    });

    let button = document.createElement('button');
    button.id = 'button';
    button.innerHTML = 'Click me!';
    document.body.appendChild(button);

    adUnit.show('#button');
}
////////////// Prebid.js (one ad unit per time) //////////////
else if (driver === 'prebid') {

    let pbUrl = 'js/prebid.js';
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = pbUrl;
    document.head.appendChild(script);

    let adUnitConfig = {
        code: 'div-gpt-ad-300x250_stat',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]]
            }
        },
        bids: [
            {
                bidder: "adriver",
                params: {
                    siteid: '381',
                    placementId: '63:kinorole_prebid_stat_v2',
                }
            },
            {
                bidder: "mytarget",
                params: {
                    placementId: '1400510',
                }
            },
            {
                bidder: "hybrid",
                params: {
                    placement: "banner",
                    placeId: "64f880bab7ea06156069e73b",
                }
            },
            {
                bidder: 'rtbsape',
                params: {
                    placeId: 860346,
                }
            },
            {
                bidder: 'buzzoola',
                params: {
                    placementId: '1253679',
                }
            },
            {
                bidder: 'between',
                params: {
                    s: '4713710',
                }
            },
            {
                bidder: 'otm',
                params: {
                    tid: '48885',
                }
            },
        ]
    };

    let pbConfig = {
        currency: {
            adServerCurrency: "RUB",
            granularityMultiplier: 1,
            defaultRates: {
                "USD": { "RUB": 98.308839595044 },
                "EUR": { "RUB": 105.29277544434 },
            }
        },
        firstPartyData: {
            uaHints: [
                "architecture",
                "model",
                "platform",
                "platformVersion",
                "fullVersionList"
            ]
        },
        userSync: {
            userIds: [{
                name: "sharedId",
                storage: {
                    type: "cookie",
                    name: "_sharedid",
                    expires: 180
                }
            },
            {
                name: "adriverId"
            },
            {
                name: 'pairId'
            }
            ]
        },
        realTimeData: {
            auctionDelay: 100,
            dataProviders: [
                {
                    "name": "customGeolocation",
                    "waitForIt": true,
                    "params": {
                        geo: {
                            coords: {
                                latitude: 47.235072,
                                longitude: 39.796736,
                            },
                            timestamp: 1695021033029
                        }
                    }
                },
                {
                    "name": "intersection",
                    "waitForIt": true
                }
            ],
        },
        enableTIDs: true,
        deviceAccess: true,
        allowActivities: {
            syncUser: {
                default: true,
                rules: [
                    { allow: true }
                ]
            },
            accessDevice: {
                default: true,
                rules: [
                    { allow: true }
                ]
            }
        }
    };

    container.style.width = "300px";
    container.style.height = "250px";

    let adUnit = new _drivers_prebid_driver__WEBPACK_IMPORTED_MODULE_2__["default"]({ id: adUnitConfig.code, config: adUnitConfig, pbConfig: pbConfig, debug: 1 });
    adUnit.show(container);
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDRCQUE0QjtBQUM3QztBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsbUJBQW1CO0FBQ2xDO0FBQ0E7QUFDQSxlQUFlLGlDQUFpQztBQUNoRDtBQUNBO0FBQ0EsZUFBZSxrQ0FBa0M7QUFDakQ7QUFDQTtBQUNBLGVBQWUsb0JBQW9CO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsZUFBZSxvQkFBb0I7QUFDbkM7QUFDQTtBQUNBLGVBQWUsb0JBQW9CO0FBQ25DO0FBQ0E7QUFDQSxlQUFlLG9CQUFvQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxQkFBcUIsOERBQVksR0FBRywyRUFBMkU7QUFDL0c7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Fkcy8uL3NyYy9kcml2ZXJzL2h0bWxfZHJpdmVyLmpzIiwid2VicGFjazovL2Fkcy8uL3NyYy9kcml2ZXJzL2ltYWdlX2RyaXZlci5qcyIsIndlYnBhY2s6Ly9hZHMvLi9zcmMvZHJpdmVycy9wcmViaWRfZHJpdmVyLmpzIiwid2VicGFjazovL2Fkcy8uL3NyYy9kcml2ZXJzL3Jld2FyZGVkX2RyaXZlci5qcyIsIndlYnBhY2s6Ly9hZHMvLi9zcmMvZHJpdmVycy92a19kcml2ZXIuanMiLCJ3ZWJwYWNrOi8vYWRzLy4vc3JjL2RyaXZlcnMvdmtfaW5wYWdlX2RyaXZlci5qcyIsIndlYnBhY2s6Ly9hZHMvLi9zcmMvZHJpdmVycy92cGFpZF9kcml2ZXIuanMiLCJ3ZWJwYWNrOi8vYWRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Fkcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYWRzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYWRzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYWRzLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEhUTUxEcml2ZXIge1xyXG4gICAgZGVidWcgPSAwO1xyXG4gICAgZGVidWdMYWJlbCA9IFwiJWNNUFNVIEhUTUwgRHJpdmVyXCI7XHJcbiAgICBkZWJ1Z1N0eWxlcyA9IFwiY29sb3I6d2hpdGU7IGJhY2tncm91bmQtY29sb3I6ICMzZjhiZTg7IHBhZGRpbmc6IDJweCA1cHg7IGJvcmRlci1yYWRpdXM6IDNweDtcIjtcclxuICAgIGRlYnVnR3JvdXBPcGVuZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb250YWluZXIgPSBudWxsO1xyXG5cclxuICAgIGh0bWwgPSAnJztcclxuICAgIGluSWZyYW1lID0gZmFsc2U7XHJcbiAgICBpZnJhbWUgPSBudWxsO1xyXG5cclxuICAgIGltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24gPSAyMDAwO1xyXG4gICAgaW1wcmVzc2lvblRpbWVvdXQgPSBudWxsO1xyXG5cclxuICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgaWZyYW1lU3R5bGVzOiB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogJzAnLFxyXG4gICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjbGlja0hhbmRsZXIgPSBudWxsO1xyXG4gICAgY2xpY2tUYXJnZXQgPSBudWxsO1xyXG5cclxuICAgIHNjcmlwdHNMb2FkZWQgPSB7fTtcclxuXHJcbiAgICBjb2RlUG9zaXRpb24gPSAnYmVmb3JlZW5kJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgZXZlbnRzKSB7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdkZWJ1ZycpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnY29udGFpbmVyJyk7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdodG1sJyk7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdpbklmcmFtZScpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnaW1wcmVzc2lvblRpbWVvdXREdXJhdGlvbicpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50cyhldmVudHMpXHJcbiAgICAgICAgdGhpcy5tZXJnZU9wdGlvbnMoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE9wdGlvbihzLCBvKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzW29dICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aGlzW29dID0gc1tvXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW1wcmVzc2lvblRpbWVvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5pbXByZXNzaW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0ltcHJlc3Npb24gVGltZW91dCBmaXJlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkltcHJlc3Npb24oKTtcclxuICAgICAgICB9LCB0aGlzLmltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGRyb3Aob25FdmVudCA9IGZhbHNlKSB7XHJcbiAgICAgICAgLy90aGlzLiA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RXZlbnRzID0gKGV2ZW50cykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50c0RlZmF1bHQgPSB7XHJcbiAgICAgICAgICAgIG9uQ2xvc2U6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25TdG9wOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uRXJyb3I6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25JbXByZXNzaW9uOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHsgfSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7IC4uLmV2ZW50c0RlZmF1bHQsIC4uLmV2ZW50cyB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0dGluZ3MgXHJcblxyXG4gICAgbWVyZ2VPcHRpb25zKG8xLCBvMikge1xyXG4gICAgICAgIHRoaXMubCgnT3B0aW9ucyBhcmUgb2JqZWN0JywgdGhpcy5pc09iamVjdChvMikpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzT2JqZWN0KG8yKSlcclxuICAgICAgICAgICAgbzEgPSB7XHJcbiAgICAgICAgICAgICAgICAuLi5vMSxcclxuICAgICAgICAgICAgICAgIC4uLm8yXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB0aGlzLmwoJ09wdGlvbnM6ICcsIG8xKTtcclxuICAgICAgICByZXR1cm4gbzE7XHJcbiAgICB9XHJcbiAgICBpc09iamVjdChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBlID09PSAnb2JqZWN0JyAmJlxyXG4gICAgICAgICAgICAhQXJyYXkuaXNBcnJheShlKSAmJlxyXG4gICAgICAgICAgICBlICE9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coY29udGFpbmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lcikgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvbnRhaW5lcigpO1xyXG4gICAgICAgIHRoaXMuYWRkQ29kZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0SW1wcmVzc2lvblRpbWVvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckNvbnRhaW5lcigpIHtcclxuICAgICAgICB0aGlzLmwoJ0NsZWFyaW5nIGNvbnRhaW5lcicpO1xyXG4gICAgICAgIHRoaXMubCh0aGlzLmNsaWNrVGFyZ2V0KTtcclxuICAgICAgICB0aGlzLmwodGhpcy5jbGlja0hhbmRsZXIpO1xyXG4gICAgICAgIGlmICh0aGlzLmNsaWNrVGFyZ2V0ICYmIHRoaXMuY2xpY2tIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuY29udGFpbmVyKTtcclxuICAgICAgICBpZiAodGhpcy5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5ldmVudHMub25TdG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVsb2FkKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb2RlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciAmJiB0aGlzLmh0bWwpIHtcclxuICAgICAgICAgICAgbGV0IGM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmluSWZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJZnJhbWVTdHlsZXMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuaWZyYW1lKTtcclxuICAgICAgICAgICAgICAgIGMgPSB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgICAgICBjLnN0eWxlLm1hcmdpbiA9ICcwJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGMgPSB0aGlzLmNvbnRhaW5lcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjLmluc2VydEFkamFjZW50SFRNTCh0aGlzLmNvZGVQb3NpdGlvbiwgdGhpcy5odG1sKTtcclxuICAgICAgICAgICAgbGV0IHNjcmlwdHMgPSBjLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICBpZiAoc2NyaXB0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHNjcmlwdHMuZm9yRWFjaCgoc2NyaXB0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNyZWF0ZVNjcmlwdChzY3JpcHQpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNsaWNrSGFuZGxlciA9IHRoaXMuY2xpY2suYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB0aGlzLmwoJ0NsaWNrIGhhbmRsZXI6JywgdGhpcy5jbGlja0hhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrVGFyZ2V0ID0gYzsgLy90aGlzLmlmcmFtZSA/PyB0aGlzLmNvbnRhaW5lcjtcclxuICAgICAgICAgICAgdGhpcy5sKCdDbGljayB0YXJnZXQ6JywgdGhpcy5jbGlja1RhcmdldCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SWZyYW1lU3R5bGVzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWZyYW1lU3R5bGVzKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5pZnJhbWVTdHlsZXMpLmZvckVhY2goKGspID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlW2tdID0gdGhpcy5vcHRpb25zLmlmcmFtZVN0eWxlc1trXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvcHlBdHRyaWJ1dGVzKHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oc291cmNlLmF0dHJpYnV0ZXMpLmZvckVhY2goYXR0cmlidXRlID0+IHtcclxuICAgICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5ub2RlTmFtZSA9PT0gJ2lkJyA/ICdkYXRhLWlkJyA6IGF0dHJpYnV0ZS5ub2RlTmFtZSxcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZS5ub2RlVmFsdWUsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVjcmVhdGVTY3JpcHQoc2NyaXB0KSB7XHJcbiAgICAgICAgbGV0IHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICB0aGlzLmNvcHlBdHRyaWJ1dGVzKHNjcmlwdCwgcyk7XHJcbiAgICAgICAgc2NyaXB0LmJlZm9yZShzKTtcclxuICAgICAgICBzLmlubmVySFRNTCA9IHNjcmlwdC5pbm5lckhUTUw7XHJcbiAgICAgICAgc2NyaXB0LnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsaWNrKCkge1xyXG4gICAgICAgIHRoaXMubCgnQ2xpY2sgZXZlbnQgZmlyZWQnKVxyXG4gICAgICAgIHRoaXMuZXZlbnRzLm9uQ2xpY2soKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZWJ1Z1xyXG5cclxuICAgIGwoLi4uYXJncykge1xyXG4gICAgICAgIGlmICh0aGlzLmRlYnVnKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5kZWJ1Z0xhYmVsLCB0aGlzLmRlYnVnU3R5bGVzLCAuLi5hcmdzKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coLi4uYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxnKGxhYmVsID0gXCJcIikge1xyXG4gICAgICAgIGlmICh0aGlzLmRlYnVnICYmICF0aGlzLmRlYnVnR3JvdXBPcGVuZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCh0aGlzLmRlYnVnTGFiZWwsIHRoaXMuZGVidWdTdHlsZXMsIGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGdlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRlYnVnICYmIHRoaXMuZGVidWdHcm91cE9wZW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlYnVnR3JvdXBPcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEltYWdlRHJpdmVyIHtcclxuICAgIGRlYnVnID0gMDtcclxuICAgIGRlYnVnTGFiZWwgPSBcIiVjTVBTVSBJbWFnZSBEcml2ZXJcIjtcclxuICAgIGRlYnVnU3R5bGVzID0gXCJjb2xvcjp3aGl0ZTsgYmFja2dyb3VuZC1jb2xvcjogIzNmOGJlODsgcGFkZGluZzogMnB4IDVweDsgYm9yZGVyLXJhZGl1czogM3B4O1wiO1xyXG4gICAgZGVidWdHcm91cE9wZW5lZCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnRhaW5lciA9IG51bGw7XHJcblxyXG4gICAgdXJsID0gJyc7XHJcbiAgICBsaW5rID0gbnVsbDtcclxuICAgIHRpdGxlID0gbnVsbDtcclxuICAgIGluTmV3VGFiID0gZmFsc2U7XHJcbiAgICBpbklmcmFtZSA9IGZhbHNlO1xyXG4gICAgaWZyYW1lID0gbnVsbDtcclxuXHJcbiAgICBpbXByZXNzaW9uVGltZW91dER1cmF0aW9uID0gMjAwMDtcclxuICAgIGltcHJlc3Npb25UaW1lb3V0ID0gbnVsbDtcclxuXHJcbiAgICBvcHRpb25zID0ge1xyXG4gICAgICAgIGlmcmFtZVN0eWxlczoge1xyXG4gICAgICAgICAgICBib3JkZXI6ICcwJyxcclxuICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW1hZ2VTdHlsZXM6IHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjbGlja0hhbmRsZXIgPSBudWxsO1xyXG4gICAgY2xpY2tUYXJnZXQgPSBudWxsO1xyXG5cclxuICAgIHNjcmlwdHNMb2FkZWQgPSB7fTtcclxuXHJcbiAgICBjb2RlUG9zaXRpb24gPSAnYmVmb3JlZW5kJztcclxuXHJcbiAgICBpbWFnZSA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGV2ZW50cykge1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnZGVidWcnKTtcclxuICAgICAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ2NvbnRhaW5lcicpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAndXJsJyk7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdpbklmcmFtZScpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnbGluaycpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnaW5OZXdUYWInKTtcclxuICAgICAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ3RpdGxlJyk7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdpbXByZXNzaW9uVGltZW91dER1cmF0aW9uJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKGV2ZW50cyk7XHJcbiAgICAgICAgdGhpcy5tZXJnZU9wdGlvbnMoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE9wdGlvbihzLCBvKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzW29dICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aGlzW29dID0gc1tvXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW1wcmVzc2lvblRpbWVvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5pbXByZXNzaW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0ltcHJlc3Npb24gVGltZW91dCBmaXJlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkltcHJlc3Npb24oKTtcclxuICAgICAgICB9LCB0aGlzLmltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcm9wKG9uRXZlbnQgPSBmYWxzZSkge1xyXG4gICAgICAgIC8vdGhpcy4gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEV2ZW50cyA9IChldmVudHMpID0+IHtcclxuICAgICAgICBjb25zdCBldmVudHNEZWZhdWx0ID0ge1xyXG4gICAgICAgICAgICBvbkNsb3NlOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uU3RvcDogKCkgPT4geyB9LFxyXG4gICAgICAgICAgICBvbkVycm9yOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uSW1wcmVzc2lvbjogKCkgPT4geyB9LFxyXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZXZlbnRzID0geyAuLi5ldmVudHNEZWZhdWx0LCAuLi5ldmVudHMgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldHRpbmdzIFxyXG5cclxuICAgIG1lcmdlT3B0aW9ucyhvMSwgbzIpIHtcclxuICAgICAgICB0aGlzLmwoJ09wdGlvbnMgYXJlIG9iamVjdCcsIHRoaXMuaXNPYmplY3QobzIpKTtcclxuICAgICAgICBpZiAodGhpcy5pc09iamVjdChvMikpXHJcbiAgICAgICAgICAgIG8xID0ge1xyXG4gICAgICAgICAgICAgICAgLi4ubzEsXHJcbiAgICAgICAgICAgICAgICAuLi5vMlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sKCdPcHRpb25zOiAnLCBvMSk7XHJcbiAgICAgICAgcmV0dXJuIG8xO1xyXG4gICAgfVxyXG4gICAgaXNPYmplY3QoZSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZSA9PT0gJ29iamVjdCcgJiZcclxuICAgICAgICAgICAgIUFycmF5LmlzQXJyYXkoZSkgJiZcclxuICAgICAgICAgICAgZSAhPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KGNvbnRhaW5lcikge1xyXG4gICAgICAgIGlmIChjb250YWluZXIpIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLmFkZENvZGUoKTtcclxuICAgICAgICB0aGlzLnNldEltcHJlc3Npb25UaW1lb3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJDb250YWluZXIoKSB7XHJcbiAgICAgICAgdGhpcy5sKCdDbGVhcmluZyBjb250YWluZXInKTtcclxuICAgICAgICB0aGlzLmwodGhpcy5jbGlja1RhcmdldCk7XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgICBpZiAodGhpcy5jbGlja1RhcmdldCAmJiB0aGlzLmNsaWNrSGFuZGxlcikge1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubCh0aGlzLmNvbnRhaW5lcik7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvbnRhaW5lcigpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzLm9uU3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbG9hZCgpIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29kZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250YWluZXIgJiYgdGhpcy51cmwpIHtcclxuICAgICAgICAgICAgbGV0IGMgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pbklmcmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SWZyYW1lU3R5bGVzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmlmcmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjID0gdGhpcy5pZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICAgICAgYy5zdHlsZS5tYXJnaW4gPSAnMCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjID0gdGhpcy5jb250YWluZXI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlLnNyYyA9IHRoaXMudXJsO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMubGluaykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSB0aGlzLmxpbms7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbk5ld1RhYikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsudGFyZ2V0ID0gXCJfYmxhbmtcIjtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rLnJlbCA9IFwibm9vcGVuZXIgbm9yZWZlcnJlclwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGl0bGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rLnRpdGxlID0gdGhpcy50aXRsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQodGhpcy5pbWFnZSk7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBsaW5rO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGhpcy5pbWFnZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5sKGMpO1xyXG4gICAgICAgICAgICBjLmFwcGVuZENoaWxkKHRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNsaWNrSGFuZGxlciA9IHRoaXMuY2xpY2suYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB0aGlzLmwoJ0NsaWNrIGhhbmRsZXI6JywgdGhpcy5jbGlja0hhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrVGFyZ2V0ID0gYzsgLy90aGlzLmlmcmFtZSA/PyB0aGlzLmNvbnRhaW5lcjtcclxuICAgICAgICAgICAgdGhpcy5sKCdDbGljayB0YXJnZXQ6JywgdGhpcy5jbGlja1RhcmdldCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SWZyYW1lU3R5bGVzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWZyYW1lU3R5bGVzKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5pZnJhbWVTdHlsZXMpLmZvckVhY2goKGspID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlW2tdID0gdGhpcy5vcHRpb25zLmlmcmFtZVN0eWxlc1trXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsaWNrKCkge1xyXG4gICAgICAgIHRoaXMubCgnQ2xpY2sgZXZlbnQgZmlyZWQnKVxyXG4gICAgICAgIHRoaXMuZXZlbnRzLm9uQ2xpY2soKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZWJ1Z1xyXG5cclxuICAgIGwoLi4uYXJncykge1xyXG4gICAgICAgIGlmICh0aGlzLmRlYnVnKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5kZWJ1Z0xhYmVsLCB0aGlzLmRlYnVnU3R5bGVzLCAuLi5hcmdzKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coLi4uYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxnKGxhYmVsID0gXCJcIikge1xyXG4gICAgICAgIGlmICh0aGlzLmRlYnVnICYmICF0aGlzLmRlYnVnR3JvdXBPcGVuZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCh0aGlzLmRlYnVnTGFiZWwsIHRoaXMuZGVidWdTdHlsZXMsIGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGdlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRlYnVnICYmIHRoaXMuZGVidWdHcm91cE9wZW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlYnVnR3JvdXBPcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZWJpZERyaXZlciB7XHJcbiAgYWRVbml0SWQgPSBudWxsO1xyXG4gIHBhcmVudENvbnRhaW5lciA9IG51bGw7XHJcbiAgYmFubmVyQ29udGFpbmVyID0gbnVsbDtcclxuICBkZWJ1ZyA9IDA7XHJcbiAgZGVidWcgPSAwO1xyXG4gIGRlYnVnTGFiZWwgPSBcIiVjTVBTVSBQcmViaWQgRHJpdmVyXCI7XHJcbiAgZGVidWdTdHlsZXMgPSBcImNvbG9yOndoaXRlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjM2Y4YmU4OyBwYWRkaW5nOiAycHggNXB4OyBib3JkZXItcmFkaXVzOiAzcHg7XCI7XHJcbiAgZGVidWdHcm91cE9wZW5lZCA9IGZhbHNlO1xyXG4gIHRpbWVvdXQgPSAyMDAwO1xyXG4gIGFkVW5pdCA9IG51bGw7XHJcbiAgaWZyYW1lQ2xpY2tlZExhc3QgPSBmYWxzZTtcclxuICByZXF1ZXN0Qmlkc09iaiA9IG51bGw7XHJcbiAgcHJlZmVycmVkQ3VycmVuY3kgPSAnUlVCJztcclxuICB1bnNvbGRSZWZyZXNoVGltZW91dCA9IDEwMDA7XHJcbiAgbWF4RmFpbGVkUmVxdWVzdHMgPSAyO1xyXG4gIGZhaWxlZFJlcXVlc3RzQ291bnQgPSAwO1xyXG4gIGltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24gPSAyMDAwO1xyXG4gIGltcHJlc3Npb25UaW1lb3V0ID0gbnVsbDtcclxuICBjbGlja0hhbmRsZXIgPSBudWxsO1xyXG4gIGNsaWNrVGFyZ2V0ID0gbnVsbDtcclxuICBpZnJhbWUgPSBudWxsO1xyXG4gIGVsZW1lbnRVbmRlck1vdXNlID0gbnVsbDtcclxuICBpZnJhbWVDbGlja2VkTGFzdCA9IGZhbHNlO1xyXG4gIGZpcnN0Qmx1ciA9IGZhbHNlO1xyXG4gIGZvY3VzSGFuZGxlciA9IG51bGw7XHJcbiAgYmx1ckhhbmRsZXIgPSBudWxsO1xyXG4gIG1vdXNlTW92ZUhhbmRsZXIgPSBudWxsO1xyXG5cclxuICBwYkNvbmZpZyA9IHtcclxuICAgIGN1cnJlbmN5OiB7XHJcbiAgICAgIGFkU2VydmVyQ3VycmVuY3k6IFwiUlVCXCIsXHJcbiAgICAgIGdyYW51bGFyaXR5TXVsdGlwbGllcjogMSxcclxuICAgICAgZGVmYXVsdFJhdGVzOiB7XHJcbiAgICAgICAgXCJVU0RcIjogeyBcIlJVQlwiOiA5Ni4yMSB9LFxyXG4gICAgICAgIFwiRVVSXCI6IHsgXCJSVUJcIjogMTAyLjgwIH0sXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBmaXJzdFBhcnR5RGF0YToge1xyXG4gICAgICB1YUhpbnRzOiBbXHJcbiAgICAgICAgXCJhcmNoaXRlY3R1cmVcIixcclxuICAgICAgICBcIm1vZGVsXCIsXHJcbiAgICAgICAgXCJwbGF0Zm9ybVwiLFxyXG4gICAgICAgIFwicGxhdGZvcm1WZXJzaW9uXCIsXHJcbiAgICAgICAgXCJmdWxsVmVyc2lvbkxpc3RcIlxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgdXNlclN5bmM6IHtcclxuICAgICAgdXNlcklkczogW3tcclxuICAgICAgICBuYW1lOiBcInNoYXJlZElkXCIsXHJcbiAgICAgICAgc3RvcmFnZToge1xyXG4gICAgICAgICAgdHlwZTogXCJjb29raWVcIixcclxuICAgICAgICAgIG5hbWU6IFwiX3NoYXJlZGlkXCIsXHJcbiAgICAgICAgICBleHBpcmVzOiAxODBcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcImFkcml2ZXJJZFwiXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAncGFpcklkJ1xyXG4gICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZWFsVGltZURhdGE6IHtcclxuICAgICAgYXVjdGlvbkRlbGF5OiAxMDAsXHJcbiAgICAgIGRhdGFQcm92aWRlcnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJpbnRlcnNlY3Rpb25cIixcclxuICAgICAgICAgIFwid2FpdEZvckl0XCI6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gICAgZW5hYmxlVElEczogdHJ1ZSxcclxuICAgIGRldmljZUFjY2VzczogdHJ1ZSxcclxuICAgIGFsbG93QWN0aXZpdGllczoge1xyXG4gICAgICBzeW5jVXNlcjoge1xyXG4gICAgICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgIHsgYWxsb3c6IHRydWUgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgYWNjZXNzRGV2aWNlOiB7XHJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgeyBhbGxvdzogdHJ1ZSB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGV2ZW50cykge1xyXG4gICAgaWYgKCFzZXR0aW5ncy5pZCkge1xyXG4gICAgICB0aGlzLmwoXCJObyBBZCB1bml0IElEIHNldCBmb3IgUHJlYmlkIGRyaXZlclwiKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hZFVuaXRJZCA9IHNldHRpbmdzLmlkO1xyXG4gICAgaWYgKCFzZXR0aW5ncy5jb25maWcpIHtcclxuICAgICAgdGhpcy5sKHRoaXMuYWRVbml0SWQgKyBcIiBObyBBZCB1bml0IFByZWJpZCBjb25maWcgZm91bmRcIik7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHRoaXMuYWRVbml0ID0gc2V0dGluZ3MuY29uZmlnO1xyXG4gICAgaWYgKHNldHRpbmdzLnBiQ29uZmlnKSB0aGlzLnBiQ29uZmlnID0gc2V0dGluZ3MucGJDb25maWc7XHJcbiAgICBpZiAoc2V0dGluZ3MudGltZW91dCkgdGhpcy50aW1lb3V0ID0gc2V0dGluZ3MudGltZW91dDtcclxuICAgIGlmIChzZXR0aW5ncy5kZWJ1ZykgdGhpcy5kZWJ1ZyA9IHNldHRpbmdzLmRlYnVnO1xyXG4gICAgaWYgKG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuZ2V0KCdwYmpzX2RlYnVnJykgPT0gJ3RydWUnKVxyXG4gICAgICB0aGlzLmRlYnVnID0gMTtcclxuXHJcbiAgICB0aGlzLnJlcXVlc3RCaWRzT2JqID0ge1xyXG4gICAgICB0aW1lb3V0OiB0aGlzLnRpbWVvdXQsXHJcbiAgICAgIGJpZHNCYWNrSGFuZGxlcjogdGhpcy5yZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzKVxyXG4gICAgfTtcclxuXHJcbiAgICB3aW5kb3cucGJqcyA9IHdpbmRvdy5wYmpzIHx8IHt9O1xyXG4gICAgd2luZG93LnBianMucXVlID0gd2luZG93LnBianMucXVlIHx8IFtdO1xyXG5cclxuICAgIHdpbmRvdy5wYmpzLnF1ZS5wdXNoKCgpID0+IHtcclxuICAgICAgd2luZG93LnBianMuc2V0Q29uZmlnKHRoaXMucGJDb25maWcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5zZXRFdmVudHMoZXZlbnRzKVxyXG4gIH1cclxuXHJcbiAgc2V0T3B0aW9uKHMsIG8pIHtcclxuICAgIGlmICh0eXBlb2Ygc1tvXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhpc1tvXSA9IHNbb107XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRFdmVudHMgPSAoZXZlbnRzKSA9PiB7XHJcbiAgICBjb25zdCBldmVudHNEZWZhdWx0ID0ge1xyXG4gICAgICBvbkNsb3NlOiAoKSA9PiB7IH0sXHJcbiAgICAgIG9uU3RvcDogKCkgPT4geyB9LFxyXG4gICAgICBvbkVycm9yOiAoKSA9PiB7IH0sXHJcbiAgICAgIG9uSW1wcmVzc2lvbjogKCkgPT4geyB9LFxyXG4gICAgICBvbkNsaWNrOiAoKSA9PiB7IH0sXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5ldmVudHMgPSB7IC4uLmV2ZW50c0RlZmF1bHQsIC4uLmV2ZW50cyB9XHJcbiAgfVxyXG5cclxuICBzZXRJbXByZXNzaW9uVGltZW91dCgpIHtcclxuICAgIHRoaXMuaW1wcmVzc2lvblRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5sKCdJbXByZXNzaW9uIFRpbWVvdXQgZmlyZWQnKTtcclxuICAgICAgdGhpcy5ldmVudHMub25JbXByZXNzaW9uKCk7XHJcbiAgICB9LCB0aGlzLmltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24pO1xyXG4gIH1cclxuXHJcbiAgc2hvdyhwYXJlbnRDb250YWluZXIpIHtcclxuICAgIGlmIChwYXJlbnRDb250YWluZXIpXHJcbiAgICAgIHRoaXMucGFyZW50Q29udGFpbmVyID0gcGFyZW50Q29udGFpbmVyO1xyXG5cclxuICAgIGlmICghdGhpcy5wYXJlbnRDb250YWluZXIpIHtcclxuICAgICAgY29uc29sZS5sb2codGhpcy5hZFVuaXRJZCArIFwiIENvbnRhaW5lciBpcyBub3QgYXZhaWxhYmxlIGZvciB0aGlzIGJhbm5lciwgY2FuJ3Qgc2hvd1wiKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5iYW5uZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRoaXMuYmFubmVyQ29udGFpbmVyLmlkID0gdGhpcy5hZFVuaXRJZDtcclxuICAgIHRoaXMucGFyZW50Q29udGFpbmVyLmFwcGVuZCh0aGlzLmJhbm5lckNvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy5yZXF1ZXN0QmlkcygpO1xyXG4gIH1cclxuXHJcbiAgaGlkZSgpIHtcclxuICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgIGlmICh0aGlzLmZvY3VzSGFuZGxlcilcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5mb2N1c0hhbmRsZXIpO1xyXG4gICAgaWYgKHRoaXMuYmx1ckhhbmRsZXIpXHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5ibHVySGFuZGxlcik7XHJcbiAgICBpZiAodGhpcy5tb3VzZU1vdmVIYW5kbGVyKVxyXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5tb3VzZU1vdmVIYW5kbGVyKTtcclxuICAgIHRoaXMuZXZlbnRzLm9uU3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJDb250YWluZXIoKSB7XHJcbiAgICB0aGlzLmwoJ0NsZWFyaW5nIGNvbnRhaW5lcicpO1xyXG4gICAgdGhpcy5sKHRoaXMuY2xpY2tUYXJnZXQpO1xyXG4gICAgdGhpcy5sKHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgIGlmICh0aGlzLmNsaWNrVGFyZ2V0ICYmIHRoaXMuY2xpY2tIYW5kbGVyKSB7XHJcbiAgICAgIHRoaXMuY2xpY2tUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgIH1cclxuICAgIHRoaXMubCh0aGlzLmNvbnRhaW5lcik7XHJcbiAgICBpZiAodGhpcy5iYW5uZXJDb250YWluZXIpIHtcclxuICAgICAgdGhpcy5iYW5uZXJDb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlZnJlc2goKSB7XHJcbiAgICB0aGlzLnJlcXVlc3RCaWRzKCk7XHJcbiAgfVxyXG5cclxuICByZXF1ZXN0QmlkcygpIHtcclxuICAgIHRoaXMubCh0aGlzLmFkVW5pdElkICsgJyBSZXF1ZXN0aW5nIGJpZHMnKTtcclxuICAgIHdpbmRvdy5wYmpzLnF1ZS5wdXNoKCgpID0+IHtcclxuICAgICAgd2luZG93LnBianMuYWRkQWRVbml0cyhbdGhpcy5hZFVuaXRdKTtcclxuICAgICAgd2luZG93LnBianMucmVxdWVzdEJpZHModGhpcy5yZXF1ZXN0Qmlkc09iaik7XHJcbiAgICAgIHdpbmRvdy5wYmpzLnJlbW92ZUFkVW5pdCh0aGlzLmFkVW5pdC5jb2RlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkQ29kZShiaWQsIHBvc2l0aW9uID0gJ2JlZm9yZWVuZCcpIHtcclxuICAgIHRoaXMubCh0aGlzLmFkVW5pdElkICsgJyBhZGRpbmcgY29kZScpO1xyXG4gICAgdGhpcy5pZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAgIHRoaXMuaWZyYW1lLnN0eWxlID0gJ3dpZHRoOicgKyBiaWQud2lkdGggKyAncHg7aGVpZ2h0OicgKyBiaWQuaGVpZ2h0ICsgJ3B4O292ZXJmbG93OmhpZGRlbjsgYm9yZGVyOiAwOyBvdmVyZmxvdzogaGlkZGVuOyc7XHJcbiAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICBpZiAoYmlkLmFkKSB7XHJcbiAgICAgIHRoaXMuYmFubmVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuaWZyYW1lKTtcclxuICAgICAgbGV0IGlmcmFtZURvYyA9IHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XHJcbiAgICAgIGlmcmFtZURvYy5ib2R5LnN0eWxlID0gJ21hcmdpbjogMDsnO1xyXG4gICAgICBpZnJhbWVEb2MuYm9keS5pbnNlcnRBZGphY2VudEhUTUwocG9zaXRpb24sIGJpZC5hZCk7XHJcbiAgICAgIGxldCBzY3JpcHRzID0gaWZyYW1lRG9jLmJvZHkucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0Jyk7XHJcbiAgICAgIGlmIChzY3JpcHRzLmxlbmd0aCkge1xyXG4gICAgICAgIHNjcmlwdHMuZm9yRWFjaCgoc2NyaXB0KSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNjcmlwdChzY3JpcHQpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGJpZC5hZFVybCkge1xyXG4gICAgICB0aGlzLmlmcmFtZS5zcmMgPSBiaWQuYWRVcmw7XHJcbiAgICAgIHRoaXMuYmFubmVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuaWZyYW1lKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2V0V2luZG93RXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBzZXRXaW5kb3dFdmVudHMoKSB7XHJcbiAgICB0aGlzLmZvY3VzSGFuZGxlciA9ICgoZSkgPT4geyB0aGlzLndpbmRvd0ZvY3Vzc2VkKGUpIH0pLmJpbmQodGhpcyk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB0aGlzLmZvY3VzSGFuZGxlciwgdHJ1ZSk7XHJcbiAgICB0aGlzLmJsdXJIYW5kbGVyID0gKChlKSA9PiB7IHRoaXMud2luZG93Qmx1cnJlZChlKSB9KS5iaW5kKHRoaXMpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLmJsdXJIYW5kbGVyLCB0cnVlKTtcclxuICAgIHRoaXMubW91c2VNb3ZlSGFuZGxlciA9ICgoZSkgPT4geyB0aGlzLndpbmRvd01vdXNlTW92ZShlKSB9KS5iaW5kKHRoaXMpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VNb3ZlSGFuZGxlciwgeyBwYXNzaXZlOiB0cnVlIH0pO1xyXG4gIH1cclxuXHJcbiAgd2luZG93Qmx1cnJlZChlKSB7XHJcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgaWYgKGVsID09PSB0aGlzLmlmcmFtZSkge1xyXG4gICAgICB0aGlzLmwoJ0lmcmFtZSBDTElDS0VEIE9OJyk7XHJcbiAgICAgIHRoaXMuaWZyYW1lQ2xpY2tlZExhc3QgPSB0cnVlO1xyXG4gICAgICB0aGlzLmV2ZW50cy5vbkNsaWNrKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3aW5kb3dGb2N1c3NlZChlKSB7XHJcbiAgICBpZiAodGhpcy5pZnJhbWVDbGlja2VkTGFzdCkge1xyXG4gICAgICB0aGlzLmlmcmFtZUNsaWNrZWRMYXN0ID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubCgnSWZyYW1lIENMSUNLRUQgT0ZGJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3aW5kb3dNb3VzZU1vdmUoZSkge1xyXG4gICAgbGV0IGVsZW1lbnRVbmRlck1vdXNlID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChlLmNsaWVudFgsIGUuY2xpZW50WSlcclxuICAgIGlmIChlbGVtZW50VW5kZXJNb3VzZSAhPT0gdGhpcy5lbGVtZW50VW5kZXJNb3VzZSkge1xyXG4gICAgICBpZiAoZWxlbWVudFVuZGVyTW91c2UgPT09IHRoaXMuY29udGFpbmVyIHx8IGVsZW1lbnRVbmRlck1vdXNlID09PSB0aGlzLmlmcmFtZSkge1xyXG4gICAgICAgIHRoaXMubChcIlRoZSBjb250YWluZXIgaXMgdW5kZXIgbW91c2VcIik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmZvY3VzKCk7XHJcbiAgICAgICAgdGhpcy5pZnJhbWVDbGlja2VkTGFzdCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZWxlbWVudFVuZGVyTW91c2UgPSBlbGVtZW50VW5kZXJNb3VzZTtcclxuICAgICAgdGhpcy5sKFwiRWxlbWVudCB1bmRlciBtb3VzZTpcIiwgdGhpcy5lbGVtZW50VW5kZXJNb3VzZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb3B5QXR0cmlidXRlcyhzb3VyY2UsIHRhcmdldCkge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20oc291cmNlLmF0dHJpYnV0ZXMpLmZvckVhY2goYXR0cmlidXRlID0+IHtcclxuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcclxuICAgICAgICBhdHRyaWJ1dGUubm9kZU5hbWUsXHJcbiAgICAgICAgYXR0cmlidXRlLm5vZGVWYWx1ZSxcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBjcmVhdGVTY3JpcHQoc2NyaXB0KSB7XHJcbiAgICBsZXQgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgdGhpcy5jb3B5QXR0cmlidXRlcyhzY3JpcHQsIHMpO1xyXG4gICAgc2NyaXB0LmJlZm9yZShzKTtcclxuICAgIHMuaW5uZXJIVE1MID0gc2NyaXB0LmlubmVySFRNTDtcclxuICAgIHNjcmlwdC5yZW1vdmUoKTtcclxuICB9XHJcblxyXG4gIHJlc3BvbnNlSGFuZGxlcihiaWRSZXNwb25zZXMpIHtcclxuICAgIHRoaXMubCh0aGlzLmFkVW5pdElkICsgJyBSZXNwb25zZXMgcmVjaWV2ZWQ6JywgYmlkUmVzcG9uc2VzKTtcclxuICAgIGxldCBhZFVuaXRzSWRzID0gT2JqZWN0LmtleXMoYmlkUmVzcG9uc2VzKTtcclxuICAgIGlmIChhZFVuaXRzSWRzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmZhaWxlZFJlcXVlc3RzQ291bnQgPSAwO1xyXG4gICAgICBhZFVuaXRzSWRzLmZvckVhY2goKGFkVW5pdElkKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgd2lubmluZ0JpZCA9IGJpZFJlc3BvbnNlc1thZFVuaXRJZF0uYmlkcy5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpID0+IChwcmV2LmNwbSA+IGN1cnJlbnQuY3BtID8gcHJldiA6IGN1cnJlbnQpKTtcclxuICAgICAgICB0aGlzLmwodGhpcy5hZFVuaXRJZCArICcgV2lubmluZyBiaWQ6Jywgd2lubmluZ0JpZCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJhbm5lckNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdGhpcy5hZGRDb2RlKHdpbm5pbmdCaWQpO1xyXG4gICAgICAgICAgdGhpcy5zZXRJbXByZXNzaW9uVGltZW91dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubCh0aGlzLmFkVW5pdElkICsgXCIgTm8gY29udGFpbmVyIHdpdGggQWQgdW5pdCBJRCBpbiBET01cIik7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmZhaWxlZFJlcXVlc3RzQ291bnQrKztcclxuICAgICAgdGhpcy5sKHRoaXMuYWRVbml0SWQgKyAnIE5vIGJpZHMgcmVjaWV2ZWQnKTtcclxuICAgICAgaWYgKHRoaXMuZmFpbGVkUmVxdWVzdHNDb3VudCA+PSB0aGlzLm1heEZhaWxlZFJlcXVlc3RzKSB7XHJcbiAgICAgICAgdGhpcy5mYWlsZWRSZXF1ZXN0c0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLmwodGhpcy5hZFVuaXRJZCArICcgQWxyZWFkeSB0cmllZCByZWZyZXNoLiBGYWlsZWQgYWdhaW4uIFF1aXQnKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmwodGhpcy5hZFVuaXRJZCArICcgV2lsbCByZXRyeSBpbiAnICsgKHRoaXMudW5zb2xkUmVmcmVzaFRpbWVvdXQgLyAxMDAwKSArICdzZWMnKTtcclxuICAgICAgICBsZXQgX3NlbGYgPSB0aGlzO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5sKHRoaXMuYWRVbml0SWQgKyAnIFJlZnJlc2hpbmcgbm93IScpO1xyXG4gICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgfSwgdGhpcy51bnNvbGRSZWZyZXNoVGltZW91dCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsaWNrKCkge1xyXG4gICAgdGhpcy5sKCdDbGljayBldmVudCBmaXJlZCcpXHJcbiAgICB0aGlzLmV2ZW50cy5vbkNsaWNrKCk7XHJcbiAgfVxyXG5cclxuICAvLyBEZWJ1Z1xyXG5cclxuICBsKC4uLmFyZ3MpIHtcclxuICAgIGlmICh0aGlzLmRlYnVnKSB7XHJcbiAgICAgIGlmICghdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZGVidWdMYWJlbCwgdGhpcy5kZWJ1Z1N0eWxlcywgLi4uYXJncyk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxnKGxhYmVsID0gXCJcIikge1xyXG4gICAgaWYgKHRoaXMuZGVidWcgJiYgIXRoaXMuZGVidWdHcm91cE9wZW5lZCkge1xyXG4gICAgICB0aGlzLmRlYnVnR3JvdXBPcGVuZWQgPSB0cnVlO1xyXG4gICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKHRoaXMuZGVidWdMYWJlbCwgdGhpcy5kZWJ1Z1N0eWxlcywgbGFiZWwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGdlKCkge1xyXG4gICAgaWYgKHRoaXMuZGVidWcgJiYgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKSB7XHJcbiAgICAgIHRoaXMuZGVidWdHcm91cE9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJld2FyZGVkRHJpdmVyIHtcclxuICAgIGRlYnVnID0gMDtcclxuICAgIGRlYnVnTGFiZWwgPSBcIiVjTVBTVSBZYW5kZXggUmV3YXJkZWQgRHJpdmVyXCI7XHJcbiAgICBkZWJ1Z1N0eWxlcyA9IFwiY29sb3I6d2hpdGU7IGJhY2tncm91bmQtY29sb3I6ICMzZjhiZTg7IHBhZGRpbmc6IDJweCA1cHg7IGJvcmRlci1yYWRpdXM6IDNweDtcIjtcclxuICAgIGRlYnVnR3JvdXBPcGVuZWQgPSBmYWxzZTtcclxuXHJcbiAgICBzZWxlY3RvciA9IG51bGw7XHJcbiAgICBidXR0b24gPSBudWxsO1xyXG4gICAgYnRuRXZlbnQgPSBudWxsO1xyXG5cclxuICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICBzY3JpcHRzTG9hZGVkID0ge307XHJcbiAgICBzZGtVUkwgPSAnaHR0cHM6Ly95YW5kZXgucnUvYWRzL3N5c3RlbS9jb250ZXh0LmpzJztcclxuICAgIHN0YXR1cyA9ICdjcmVhdGVkJztcclxuICAgIHRpbWVvdXQgPSA1MDAwO1xyXG5cclxuICAgIGltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24gPSAyMDAwO1xyXG4gICAgaW1wcmVzc2lvblRpbWVvdXQgPSBudWxsO1xyXG5cclxuICAgIGJ1dHRvbkV2ZW50cyA9IHtcclxuICAgICAgICBvblJld2FyZGVkOiAoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sKCdTdWNjZXNzZnVsbHkgcmV3YXJkZWQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ3Jld2FyZGVkJztcclxuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLm9uUmV3YXJkZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubCgnVXNlciBoYXMgY2FuY2VsbGVkIHRoZSBhZCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnY2FuY2VsbGVkJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkNsb3NlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25SZW5kZXI6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAncmVuZGVyZWQnO1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0FkIHJlbmRlcmVkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0SW1wcmVzc2lvblRpbWVvdXQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uRXJyb3I6IChkKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2Vycm9yJztcclxuICAgICAgICAgICAgdGhpcy5sKCdFcnJvcjonLCBkKTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMub25FcnJvcigpO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICB9LFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBldmVudHMpIHtcclxuICAgICAgICB0aGlzLmRlYnVnID0gc2V0dGluZ3M/LmRlYnVnID8/IDBcclxuICAgICAgICB0aGlzLnNlbGVjdG9yID0gc2V0dGluZ3M/LnNlbGVjdG9yID8/IG51bGw7XHJcblxyXG4gICAgICAgIHdpbmRvdy55YUNvbnRleHRDYiA9IHdpbmRvdy55YUNvbnRleHRDYiB8fCBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkU0RLKHRoaXMuc2RrVVJMKVxyXG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKGV2ZW50cylcclxuICAgICAgICB0aGlzLm1lcmdlT3B0aW9ucyhzZXR0aW5ncyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGRyb3Aob25FdmVudCA9IGZhbHNlKSB7XHJcbiAgICAgICAgLy90aGlzLiA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RXZlbnRzID0gKGV2ZW50cykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50c0RlZmF1bHQgPSB7XHJcbiAgICAgICAgICAgIG9uQ2xvc2U6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25TdG9wOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uRXJyb3I6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25SZXdhcmRlZDogKCkgPT4geyB9LFxyXG4gICAgICAgICAgICBvbkltcHJlc3Npb246ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25DbGljazogKCkgPT4geyB9LFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmV2ZW50cyA9IHsgLi4uZXZlbnRzRGVmYXVsdCwgLi4uZXZlbnRzIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRJbXByZXNzaW9uVGltZW91dCgpIHtcclxuICAgICAgICB0aGlzLmltcHJlc3Npb25UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnSW1wcmVzc2lvbiBUaW1lb3V0IGZpcmVkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLm9uSW1wcmVzc2lvbigpO1xyXG4gICAgICAgIH0sIHRoaXMuaW1wcmVzc2lvblRpbWVvdXREdXJhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0dGluZ3MgXHJcblxyXG4gICAgbWVyZ2VPcHRpb25zKG8pIHtcclxuICAgICAgICB0aGlzLmwoJ09wdGlvbnMgYXJlIG9iamVjdCcsIHRoaXMuaXNPYmplY3QobykpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzT2JqZWN0KG8pKVxyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAuLi50aGlzLm9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAuLi5vXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB0aGlzLmwoJ09wdGlvbnM6ICcsIHRoaXMub3B0aW9ucylcclxuICAgIH1cclxuICAgIGlzT2JqZWN0KGUpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGUgPT09ICdvYmplY3QnICYmXHJcbiAgICAgICAgICAgICFBcnJheS5pc0FycmF5KGUpICYmXHJcbiAgICAgICAgICAgIGUgIT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdyhzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChzZWxlY3RvcikgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yKTtcclxuICAgICAgICBpZiAodGhpcy5idXR0b24pIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVCdXR0b24oKTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAncmVhZHknO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sKCdDYW5cXCd0IGZpbmQgYnV0dG9uIGVsZW1lbnQgaW4gRE9NJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQnV0dG9uKCkge1xyXG4gICAgICAgIHRoaXMuYnRuRXZlbnQgPSAoZSkgPT4geyB0aGlzLmJ1dHRvbkNsaWNrRXZlbnQoZSkgfTtcclxuICAgICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnRuRXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGJ1dHRvbkNsaWNrRXZlbnQoZSkge1xyXG4gICAgICAgIHRoaXMubCgnQnV0dG9uIGNsaWNrIGZpcmVkJyk7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYnV0dG9uLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIC8vIERvaW5nIG5vdGhpbmdcclxuICAgICAgICAgICAgdGhpcy5sKCdBbHJlYWR5IGluIHVzZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnY2xpY2tlZCc7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAnY2xpY2tlZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoJ1RoZSBBZCB3YXMgbm90IHJlbmRlcmVkLiBTdG9wcGluZyB0aGUgc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHRoaXMudGltZW91dCk7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5sKCdTdGFydGluZyB0byBzaG93IHRoZSBhZCcpXHJcbiAgICAgICAgICAgIHdpbmRvdy55YUNvbnRleHRDYi5wdXNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubCgnUGxhdGZvcm0nLCBZYT8uQ29udGV4dD8uQWR2TWFuYWdlcj8uZ2V0UGxhdGZvcm0oKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmwoJ0Fkdk1hbmFnZXInLCBZYT8uQ29udGV4dD8uQWR2TWFuYWdlcik7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWRPcHRzID0gdGhpcy5vcHRpb25zLmFkc1soWWEuQ29udGV4dC5BZHZNYW5hZ2VyLmdldFBsYXRmb3JtKCkgPT09ICdkZXNrdG9wJyA/ICdkZXNrdG9wJyA6ICdtb2JpbGUnKV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFkc0V2ZW50cyhhZE9wdHMpO1xyXG4gICAgICAgICAgICAgICAgWWEuQ29udGV4dC5BZHZNYW5hZ2VyLnJlbmRlcihhZE9wdHMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWRzRXZlbnRzKGFkT3B0cykge1xyXG4gICAgICAgIGFkT3B0cy5vblJld2FyZGVkID0gdGhpcy5idXR0b25FdmVudHMub25SZXdhcmRlZDtcclxuICAgICAgICBhZE9wdHMub25SZW5kZXIgPSB0aGlzLmJ1dHRvbkV2ZW50cy5vblJlbmRlcjtcclxuICAgICAgICBhZE9wdHMub25FcnJvciA9IHRoaXMuYnV0dG9uRXZlbnRzLm9uRXJyb3I7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5idXR0b24pIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJ0bkV2ZW50ID8/ICgoKSA9PiB7IH0pKTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ldmVudHMub25TdG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVsb2FkKCkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlQnV0dG9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFNESyh1cmwsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5sKCdMT0FESU5HIFNESycpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5zY3JpcHRzTG9hZGVkW3RoaXMuc2RrVVJMXSA9PT0gJ3VuZGVmaW5lZCcgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFtzcmM9XCInICsgdGhpcy5zZGtVUkwgKyAnXCJdJykpIHtcclxuICAgICAgICAgICAgdGhpcy5sKCdTdGFydGluZyB0byBsb2FkIFNESycpO1xyXG4gICAgICAgICAgICB0aGlzLnNjcmlwdHNMb2FkZWRbdGhpcy5zZGtVUkxdID0geyBpc0xvYWRlZDogZmFsc2UgfVxyXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XHJcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0c0xvYWRlZFt0aGlzLnNka1VSTF0uc2NyaXB0ID0gc2NyaXB0O1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICAgICAgICAgIHRoaXMubCgnU0NSSVBUIScsIHNjcmlwdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIERlYnVnXHJcblxyXG4gICAgbCguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVidWcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmRlYnVnR3JvdXBPcGVuZWQpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRlYnVnTGFiZWwsIHRoaXMuZGVidWdTdHlsZXMsIC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGcobGFiZWwgPSBcIlwiKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVidWcgJiYgIXRoaXMuZGVidWdHcm91cE9wZW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlYnVnR3JvdXBPcGVuZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKHRoaXMuZGVidWdMYWJlbCwgdGhpcy5kZWJ1Z1N0eWxlcywgbGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZ2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVidWcgJiYgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVidWdHcm91cE9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmtEcml2ZXIge1xyXG4gICAgZGVidWcgPSAwO1xyXG4gICAgZGVidWdMYWJlbCA9IFwiJWNNUFNVIFZrIERyaXZlclwiO1xyXG4gICAgZGVidWdTdHlsZXMgPSBcImNvbG9yOndoaXRlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjM2Y4YmU4OyBwYWRkaW5nOiAycHggNXB4OyBib3JkZXItcmFkaXVzOiAzcHg7XCI7XHJcbiAgICBkZWJ1Z0dyb3VwT3BlbmVkID0gZmFsc2U7XHJcblxyXG4gICAgY29udGFpbmVyID0gbnVsbDtcclxuICAgIHNsb3RJZCA9IG51bGw7XHJcbiAgICBhZENvbnRhaW5lciA9IG51bGw7XHJcblxyXG4gICAgYWRTdHlsZXMgPSB7XHJcbiAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXHJcbiAgICAgICAgd2lkdGg6ICcyNDBweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnNDAwcHgnLFxyXG4gICAgICAgIHRleHREZWNvcmF0aW9uOiBcIm5vbmVcIixcclxuICAgIH1cclxuXHJcbiAgICBvcHRpb25zID0ge307XHJcblxyXG4gICAgaW1wcmVzc2lvblRpbWVvdXREdXJhdGlvbiA9IDIwMDA7XHJcbiAgICBpbXByZXNzaW9uVGltZW91dCA9IG51bGw7XHJcbiAgICBjbGlja0hhbmRsZXIgPSBudWxsO1xyXG4gICAgY2xpY2tUYXJnZXQgPSBudWxsO1xyXG5cclxuICAgIHNjcmlwdHNMb2FkZWQgPSB7fTtcclxuICAgIHNka1VSTCA9ICdodHRwczovL2FkLm1haWwucnUvc3RhdGljL2Fkcy1hc3luYy5qcyc7XHJcblxyXG4gICAgYWRPcHRpb25zID0ge1xyXG4gICAgICAgIG9uQWRzTG9hZGVkOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ29uQWRzTG9hZGVkJywgZGF0YSlcclxuICAgICAgICAgICAgdGhpcy5zZXRJbXByZXNzaW9uVGltZW91dCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrSGFuZGxlciA9IHRoaXMuY2xpY2suYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB0aGlzLmwoJ0NsaWNrIGhhbmRsZXI6JywgdGhpcy5jbGlja0hhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrVGFyZ2V0ID0gdGhpcy5hZENvbnRhaW5lcjsgLy90aGlzLmlmcmFtZSA/PyB0aGlzLmNvbnRhaW5lcjtcclxuICAgICAgICAgICAgdGhpcy5sKCdDbGljayB0YXJnZXQ6JywgdGhpcy5jbGlja1RhcmdldCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uQWRzUmVmcmVzaGVkOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnb25BZHNSZWZyZXNoZWQnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25BZHNDbG9zZWQ6IChzbG90KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnb25BZHNDbG9zZWQnLCBzbG90KVxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkNsb3NlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25Ob0FkczogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKCdObyBhZHMgcmVjaWV2ZWQgZm9yICcgKyBkYXRhLnNsb3QpXHJcbiAgICAgICAgICAgIHRoaXMubChkYXRhLnNsb3QpO1xyXG4gICAgICAgICAgICB0aGlzLmwoZGF0YS5lbCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25BZHNTdWNjZXNzOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ29uQWRzU3VjY2VzcycpO1xyXG4gICAgICAgICAgICB0aGlzLmwoZGF0YS5zbG90KTtcclxuICAgICAgICAgICAgdGhpcy5sKGRhdGEuZWwpO1xyXG4gICAgICAgICAgICB0aGlzLmwoZGF0YS5kYXRhKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uQWRzQ2xpY2tlZDogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKGRhdGEuc2xvdCk7XHJcbiAgICAgICAgICAgIHRoaXMubCgnR29pbmcgdG8gJyArIGRhdGEubGluaylcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uU2NyaXB0RXJyb3I6IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnb25TY3JpcHRFcnJvcicpO1xyXG4gICAgICAgICAgICB0aGlzLmwoZGF0YS5zbG90KTtcclxuICAgICAgICAgICAgdGhpcy5sKGRhdGEuZWwpO1xyXG4gICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLm9uRXJyb3IoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlmcmFtZU1vZGU6IHRydWUsXHJcbiAgICAgICAgc2luZ2xlUmVxdWVzdDogdHJ1ZSxcclxuICAgICAgICBwcmV2ZW50QXV0b0xvYWQ6IHRydWUsXHJcbiAgICAgICAgZGlzYWJsZUNvbGxlY3Q6IHRydWUsXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGV2ZW50cykge1xyXG4gICAgICAgIGlmIChzZXR0aW5ncykge1xyXG4gICAgICAgICAgICB0aGlzLmRlYnVnID0gc2V0dGluZ3M/LmRlYnVnID8/IDBcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBzZXR0aW5ncz8uY29udGFpbmVyID8/IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc2xvdElkID0gc2V0dGluZ3M/LnNsb3RJZCA/PyBudWxsO1xyXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYWRPcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkT3B0aW9ucyA9IHRoaXMubWVyZ2VPcHRpb25zKHRoaXMuYWRPcHRpb25zLCBzZXR0aW5ncy5hZE9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sKHRoaXMuYWRPcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYWRTdHlsZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRTdHlsZXMgPSB0aGlzLm1lcmdlT3B0aW9ucyh0aGlzLmFkU3R5bGVzLCBzZXR0aW5ncy5hZFN0eWxlcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmwodGhpcy5hZFN0eWxlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93Lk1SR3RhZyA9IHdpbmRvdy5NUkd0YWcgfHwgW107XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFNESyh0aGlzLnNka1VSTCk7XHJcbiAgICAgICAgdGhpcy5zZXRFdmVudHMoZXZlbnRzKVxyXG4gICAgICAgIHRoaXMubWVyZ2VPcHRpb25zKHNldHRpbmdzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJvcChvbkV2ZW50ID0gZmFsc2UpIHtcclxuICAgICAgICAvL3RoaXMuID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFdmVudHMgPSAoZXZlbnRzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZXZlbnRzRGVmYXVsdCA9IHtcclxuICAgICAgICAgICAgb25DbG9zZTogKCkgPT4geyB9LFxyXG4gICAgICAgICAgICBvblN0b3A6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25FcnJvcjogKCkgPT4geyB9LFxyXG4gICAgICAgICAgICBvbkltcHJlc3Npb246ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25DbGljazogKCkgPT4geyB9LFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmV2ZW50cyA9IHsgLi4uZXZlbnRzRGVmYXVsdCwgLi4uZXZlbnRzIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRJbXByZXNzaW9uVGltZW91dCgpIHtcclxuICAgICAgICB0aGlzLmltcHJlc3Npb25UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnSW1wcmVzc2lvbiBUaW1lb3V0IGZpcmVkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLm9uSW1wcmVzc2lvbigpO1xyXG4gICAgICAgIH0sIHRoaXMuaW1wcmVzc2lvblRpbWVvdXREdXJhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0dGluZ3MgXHJcblxyXG4gICAgbWVyZ2VPcHRpb25zKG8xLCBvMikge1xyXG4gICAgICAgIHRoaXMubCgnT3B0aW9ucyBhcmUgb2JqZWN0JywgdGhpcy5pc09iamVjdChvMikpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzT2JqZWN0KG8yKSlcclxuICAgICAgICAgICAgbzEgPSB7XHJcbiAgICAgICAgICAgICAgICAuLi5vMSxcclxuICAgICAgICAgICAgICAgIC4uLm8yXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB0aGlzLmwoJ09wdGlvbnM6ICcsIG8xKTtcclxuICAgICAgICByZXR1cm4gbzE7XHJcbiAgICB9XHJcbiAgICBpc09iamVjdChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBlID09PSAnb2JqZWN0JyAmJlxyXG4gICAgICAgICAgICAhQXJyYXkuaXNBcnJheShlKSAmJlxyXG4gICAgICAgICAgICBlICE9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coY29udGFpbmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lcikgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvbnRhaW5lcigpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQWRDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLmFkT3B0aW9ucy5lbGVtZW50ID0gdGhpcy5hZENvbnRhaW5lcjtcclxuICAgICAgICAod2luZG93Lk1SR3RhZyA9IHdpbmRvdy5NUkd0YWcgfHwgW10pLnB1c2godGhpcy5hZE9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyQ29udGFpbmVyKCkge1xyXG4gICAgICAgIHRoaXMubCgnQ2xlYXJpbmcgY29udGFpbmVyJyk7XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuY2xpY2tUYXJnZXQpO1xyXG4gICAgICAgIHRoaXMubCh0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xpY2tUYXJnZXQgJiYgdGhpcy5jbGlja0hhbmRsZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGlja1RhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jbGlja0hhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmwodGhpcy5jb250YWluZXIpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVBZENvbnRhaW5lcigpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5hZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucycpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmFkQ29udGFpbmVyKVxyXG4gICAgICAgICAgICB0aGlzLmFkQ29udGFpbmVyLmlkID0gJ2FkLXRlc3QtJyArIHRoaXMuc2xvdElkO1xyXG4gICAgICAgICAgICB0aGlzLmFkQ29udGFpbmVyLmRhdGFzZXRbJ2FkQ2xpZW50J10gPSAnYWQtJyArIHRoaXMuc2xvdElkO1xyXG4gICAgICAgICAgICB0aGlzLmFkQ29udGFpbmVyLmRhdGFzZXRbJ2FkU2xvdCddID0gdGhpcy5zbG90SWQ7XHJcbiAgICAgICAgICAgIHRoaXMuYWRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnbXJnLXRhZycpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEFkQ29udGFpbmVyU3R5bGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMubCgnQWQgY29udGFpbmVyIHN1Y2Nlc3NmdWxseSBjcmVhdGVkJywgdGhpcy5hZENvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0NvbnRhaW5lciB3YXMgbm90IHNwZWNpZmllZCcpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEFkQ29udGFpbmVyU3R5bGVzKCkge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuYWRTdHlsZXMpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFkQ29udGFpbmVyLnN0eWxlW2tleV0gPSB0aGlzLmFkU3R5bGVzW2tleV07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5ldmVudHMub25TdG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVsb2FkKCkge1xyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRTREsodXJsLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMubCgnTE9BRElORyBTREsnKTtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2NyaXB0c0xvYWRlZFt0aGlzLnNka1VSTF0gPT09ICd1bmRlZmluZWQnICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbc3JjPVwiJyArIHRoaXMuc2RrVVJMICsgJ1wiXScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnU3RhcnRpbmcgdG8gbG9hZCBTREsnKTtcclxuICAgICAgICAgICAgdGhpcy5zY3JpcHRzTG9hZGVkW3RoaXMuc2RrVVJMXSA9IHsgaXNMb2FkZWQ6IGZhbHNlIH1cclxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gdXJsO1xyXG4gICAgICAgICAgICB0aGlzLnNjcmlwdHNMb2FkZWRbdGhpcy5zZGtVUkxdLnNjcmlwdCA9IHNjcmlwdDtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgICAgICAgICB0aGlzLmwoJ1NDUklQVCEnLCBzY3JpcHQpO1xyXG4gICAgICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4gdGhpcy5sKCdTREsgTE9BREVEIScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGljaygpIHtcclxuICAgICAgICB0aGlzLmwoJ0NsaWNrIGV2ZW50IGZpcmVkJylcclxuICAgICAgICB0aGlzLmV2ZW50cy5vbkNsaWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGVidWdcclxuXHJcbiAgICBsKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZGVidWdHcm91cE9wZW5lZClcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZGVidWdMYWJlbCwgdGhpcy5kZWJ1Z1N0eWxlcywgLi4uYXJncyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZyhsYWJlbCA9IFwiXCIpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1ZyAmJiAhdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVidWdHcm91cE9wZW5lZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQodGhpcy5kZWJ1Z0xhYmVsLCB0aGlzLmRlYnVnU3R5bGVzLCBsYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxnZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1ZyAmJiB0aGlzLmRlYnVnR3JvdXBPcGVuZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWS0luUGFnZURyaXZlciB7XHJcbiAgICBkZWJ1ZyA9IDA7XHJcbiAgICBkZWJ1Z0xhYmVsID0gXCIlY01QU1UgVmsgSW5QYWdlIERyaXZlclwiO1xyXG4gICAgZGVidWdTdHlsZXMgPSBcImNvbG9yOndoaXRlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjM2Y4YmU4OyBwYWRkaW5nOiAycHggNXB4OyBib3JkZXItcmFkaXVzOiAzcHg7XCI7XHJcbiAgICBkZWJ1Z0dyb3VwT3BlbmVkID0gZmFsc2U7XHJcblxyXG4gICAgY29udGFpbmVyID0gbnVsbDtcclxuICAgIHNsb3RJZCA9IG51bGw7XHJcbiAgICBhZENvbnRhaW5lciA9IG51bGw7XHJcblxyXG4gICAgYWRTdHlsZXMgPSB7XHJcbiAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXHJcbiAgICAgICAgd2lkdGg6ICc2NDBweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnMzYwcHgnLFxyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICBpbXByZXNzaW9uVGltZW91dER1cmF0aW9uID0gMjAwMDtcclxuICAgIGltcHJlc3Npb25UaW1lb3V0ID0gbnVsbDtcclxuXHJcbiAgICBzY3JpcHRzTG9hZGVkID0ge307XHJcbiAgICBzZGtVUkwgPSAnaHR0cHM6Ly9hZC5tYWlsLnJ1L3N0YXRpYy92ay1hZG1hbi5qcyc7XHJcblxyXG4gICAgYWRPcHRpb25zID0ge1xyXG4gICAgICAgIG9uUmVhZHk6ICgpID0+IHsgdGhpcy5sKCdvblJlYWR5JykgfSxcclxuICAgICAgICBvbkVycm9yOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTA1OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTWVkaWEgY2h1bmsgZXJyb3InKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMxMTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ05vIGNvbnRhaW5lciBvbiB0aGUgcGFnZScpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzEyOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTm8gcGxhY2UgaW4gY29udGFpbmVyJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzMTM6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdSZW5kZXJSdW5uZXIgbG9hZCBlcnJvcicpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzE0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTWVzc2FnZSBzeXN0ZW0gZXJyb3InKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMxNTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ1VuYWNjZXB0YWJsZSBjcmVhdGl2ZScpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzE2OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnQ29udGFpbmVyIGxpbmsgZXJyb3InKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMyMTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ0VtcHR5IGFkIHNlY3Rpb24nKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMyMjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ1Zpc2l0IGlzIG5vdCBhbiBvYmplY3QnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMyMzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ1NlcnZlciBlcnJvcicpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzMxOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnQ29uZmlnIGVycm9yJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzMzI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdTbG90IGlzIG5vdCBzcGVjaWZpZWQnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMzMzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ0NvbnRhaW5lciBpcyBub3Qgc3BlY2lmaWVkJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzNDE6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdXcm9uZyBpbmxpbmUgYmFubmVyIChiYXNlNjQpJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzNDI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdXcm9uZyBpbmxpbmUgY29uZmlnLiBDaGVjayB0aGUgXCJzcmNcIiBhdHRyaWJ1dGUnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM1MTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ05vIG1lZGlhIGluIHNlY3Rpb24nKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM1MjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ0ludmFsaWQgSlNPTiBzZXJ2ZXIgcmVzcG9uc2UnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM1MzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ0NvbmZpZyBpcyBub3QgYW4gb2JqZWN0Jyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzNjE6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdWaWRlbyBlbGVtZW50IGVycm9yJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzNjI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdPbGQgYnJvd3NlciAoSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpOyknKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDUwMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdDb21tb24gZXJyb3InKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDUwMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdBbHJlYWR5IGluaXRpYWxpemVkJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1MDAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTm90IGluaXRpYWxpemVkJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1MDA0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTm90IGluIHBsYXkgc3RhdHVzJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1MDA1OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTm90IGluIHBhdXNlIHN0YXR1cycpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNTAwNjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ1RoZSBhZCBpcyBhbHJlYWR5IHN0YXJ0ZWQnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDUwMDc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdEZXN0cm95ZWQnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDUwMDg6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdGb3JiaWRkZW4gaW4gc3RyZWFtIG1vZGUgKHBsYXlNb2RlPVwic3RyZWFtXCIpJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxMTAwOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnRW1wdHkgYWQgcmVzcG9uc2UnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnVW5rbm93biBlcnJvcicpOyBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGF0YS5lcnJvciA9PT0gMTEwMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMub25TdG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkVycm9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvblN0YXJ0ZWQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKCdvblN0YXJ0ZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRJbXByZXNzaW9uVGltZW91dCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25QYXVzZWQ6ICgpID0+IHsgdGhpcy5sKCdvblBhdXNlZCcpIH0sXHJcbiAgICAgICAgb25QbGF5ZWQ6ICgpID0+IHsgdGhpcy5sKCdvblBsYXllZCcpIH0sXHJcbiAgICAgICAgb25Db21wbGV0ZWQ6ICgpID0+IHsgdGhpcy5sKCdvbkNvbXBsZXRlZCcpIH0sXHJcbiAgICAgICAgb25DbG9zZWQ6ICgpID0+IHsgdGhpcy5sKCdvbkNsb3NlZCcpOyB0aGlzLmV2ZW50cy5vbkNsb3NlKCk7IH0sXHJcbiAgICAgICAgb25Ta2lwcGVkOiAoKSA9PiB7IHRoaXMubCgnb25Ta2lwcGVkJykgfSxcclxuICAgICAgICBvbkNsaWNrZWQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKCdvbkNsaWNrZWQnKVxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkNsaWNrKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZE1pZHJvbGxQb2ludDogKCkgPT4geyB0aGlzLmwoJ2FkTWlkcm9sbFBvaW50JykgfSxcclxuICAgICAgICBvblRpbWVSZW1haW5lZDogKCkgPT4geyB0aGlzLmwoJ29uVGltZVJlbWFpbmVkJykgfSxcclxuICAgICAgICBvbkR1cmF0aW9uQ2hhbmdlZDogKCkgPT4geyB0aGlzLmwoJ29uRHVyYXRpb25DaGFuZ2VkJykgfSxcclxuICAgICAgICBvblZQQUlEU3RhcnRlZDogKCkgPT4geyB0aGlzLmwoJ29uVlBBSURTdGFydGVkJykgfVxyXG4gICAgfVxyXG5cclxuICAgIGYgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wdXNoKEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgZXZlbnRzKSB7XHJcbiAgICAgICAgaWYgKHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVidWcgPSBzZXR0aW5ncz8uZGVidWcgPz8gMFxyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IHNldHRpbmdzPy5jb250YWluZXIgPz8gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zbG90SWQgPSBzZXR0aW5ncz8uc2xvdElkID8/IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hZE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRPcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnModGhpcy5hZE9wdGlvbnMsIHNldHRpbmdzLmFkT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmwodGhpcy5hZE9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hZFN0eWxlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZFN0eWxlcyA9IHRoaXMubWVyZ2VPcHRpb25zKHRoaXMuYWRTdHlsZXMsIHNldHRpbmdzLmFkU3R5bGVzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubCh0aGlzLmFkU3R5bGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2luZG93LkFkTWFuUGxheWVyID0gdGhpcy5mLmJpbmQod2luZG93Ll9BZE1hblBsYXllckluaXQgPSBbXSk7XHJcbiAgICAgICAgd2luZG93LkFkTWFuU0RLID0gdGhpcy5mLmJpbmQod2luZG93Ll9BZE1hblNES0luaXQgPSBbXSk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFNESyh0aGlzLnNka1VSTCk7XHJcbiAgICAgICAgdGhpcy5zZXRFdmVudHMoZXZlbnRzKVxyXG4gICAgICAgIHRoaXMubWVyZ2VPcHRpb25zKHNldHRpbmdzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJvcChvbkV2ZW50ID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RXZlbnRzID0gKGV2ZW50cykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50c0RlZmF1bHQgPSB7XHJcbiAgICAgICAgICAgIG9uQ2xvc2U6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25TdG9wOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uRXJyb3I6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25JbXByZXNzaW9uOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHsgfSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7IC4uLmV2ZW50c0RlZmF1bHQsIC4uLmV2ZW50cyB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW1wcmVzc2lvblRpbWVvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5pbXByZXNzaW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0ltcHJlc3Npb24gVGltZW91dCBmaXJlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkltcHJlc3Npb24oKTtcclxuICAgICAgICB9LCB0aGlzLmltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldHRpbmdzIFxyXG5cclxuICAgIG1lcmdlT3B0aW9ucyhvMSwgbzIpIHtcclxuICAgICAgICB0aGlzLmwoJ09wdGlvbnMgYXJlIG9iamVjdCcsIHRoaXMuaXNPYmplY3QobzIpKTtcclxuICAgICAgICBpZiAodGhpcy5pc09iamVjdChvMikpXHJcbiAgICAgICAgICAgIG8xID0ge1xyXG4gICAgICAgICAgICAgICAgLi4ubzEsXHJcbiAgICAgICAgICAgICAgICAuLi5vMlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sKCdPcHRpb25zOiAnLCBvMSk7XHJcbiAgICAgICAgcmV0dXJuIG8xO1xyXG4gICAgfVxyXG4gICAgaXNPYmplY3QoZSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZSA9PT0gJ29iamVjdCcgJiZcclxuICAgICAgICAgICAgIUFycmF5LmlzQXJyYXkoZSkgJiZcclxuICAgICAgICAgICAgZSAhPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KGNvbnRhaW5lcikge1xyXG4gICAgICAgIGlmIChjb250YWluZXIpIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUFkQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuYWRDb250YWluZXIuaWQpO1xyXG4gICAgICAgIHRoaXMubCgnQWQgb3B0aW9uczonLCB0aGlzLmFkT3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5sKCdzbG90SWQnLCB0aGlzLnNsb3RJZCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5BZE1hblBsYXllcih7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogXCIjYWQtXCIgKyB0aGlzLnNsb3RJZCxcclxuICAgICAgICAgICAgc2xvdDogdGhpcy5zbG90SWQsXHJcbiAgICAgICAgICAgIC4uLnRoaXMuYWRPcHRpb25zXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJDb250YWluZXIoKSB7XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuY29udGFpbmVyKTtcclxuICAgICAgICBpZiAodGhpcy5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQWRDb250YWluZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgdGhpcy5hZENvbnRhaW5lci5pZCA9IFwiYWQtXCIgKyB0aGlzLnNsb3RJZDtcclxuICAgICAgICAgICAgdGhpcy5zZXRBZENvbnRhaW5lclN0eWxlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmFkQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgdGhpcy5sKCdBZCBjb250YWluZXIgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQnLCB0aGlzLmFkQ29udGFpbmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnQ29udGFpbmVyIHdhcyBub3Qgc3BlY2lmaWVkJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWRDb250YWluZXJTdHlsZXMoKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5hZFN0eWxlcykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRDb250YWluZXIuc3R5bGVba2V5XSA9IHRoaXMuYWRTdHlsZXNba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5vblN0b3AoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFNESyh1cmwsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5sKCdMT0FESU5HIFNESycpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5zY3JpcHRzTG9hZGVkW3RoaXMuc2RrVVJMXSA9PT0gJ3VuZGVmaW5lZCcgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFtzcmM9XCInICsgdGhpcy5zZGtVUkwgKyAnXCJdJykpIHtcclxuICAgICAgICAgICAgdGhpcy5sKCdTdGFydGluZyB0byBsb2FkIFNESycpO1xyXG4gICAgICAgICAgICB0aGlzLnNjcmlwdHNMb2FkZWRbdGhpcy5zZGtVUkxdID0geyBpc0xvYWRlZDogZmFsc2UgfVxyXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XHJcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0c0xvYWRlZFt0aGlzLnNka1VSTF0uc2NyaXB0ID0gc2NyaXB0O1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICAgICAgICAgIHRoaXMubCgnU0NSSVBUIScsIHNjcmlwdCk7XHJcbiAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB0aGlzLmwoJ1NESyBMT0FERUQhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIERlYnVnXHJcblxyXG4gICAgbCguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVidWcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmRlYnVnR3JvdXBPcGVuZWQpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRlYnVnTGFiZWwsIHRoaXMuZGVidWdTdHlsZXMsIC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGcobGFiZWwgPSBcIlwiKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVidWcgJiYgIXRoaXMuZGVidWdHcm91cE9wZW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlYnVnR3JvdXBPcGVuZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKHRoaXMuZGVidWdMYWJlbCwgdGhpcy5kZWJ1Z1N0eWxlcywgbGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZ2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVidWcgJiYgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVidWdHcm91cE9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVlBBSUREcml2ZXIge1xyXG5cclxuICBkZWJ1ZyA9IDA7XHJcbiAgZGVidWdMYWJlbCA9IFwiJWNNUFNVIFBsYXllclwiO1xyXG4gIGRlYnVnU3R5bGVzID0gXCJjb2xvcjp3aGl0ZTsgYmFja2dyb3VuZC1jb2xvcjogIzNmOGJlODsgcGFkZGluZzogMnB4IDVweDsgYm9yZGVyLXJhZGl1czogM3B4O1wiO1xyXG4gIGRlYnVnR3JvdXBPcGVuZWQgPSBmYWxzZTtcclxuXHJcbiAgaGFzaCA9IG51bGw7XHJcbiAgd2lkZ2V0SWQgPSBudWxsO1xyXG4gIGxvb3AgPSAwO1xyXG4gIGRpc2FibGVDb250cm9scyA9IDA7XHJcblxyXG4gIGxvZ29TdmcgPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA3NTcuODQgMTIwXCI+IDxkZWZzPiA8c3R5bGU+LmNscy0xe2ZpbGw6I2ZmNmQwMDt9LmNscy0ye2ZpbGw6I2ZmZjt9PC9zdHlsZT4gPC9kZWZzPiA8dGl0bGU+0JvQvtCz0L4g0LIg0LrRgNC40LLRi9GFPC90aXRsZT4gPGcgaWQ9XCLQodC70L7QuV8yXCIgZGF0YS1uYW1lPVwi0KHQu9C+0LkgMlwiPiA8ZyBpZD1cItCh0LvQvtC5XzEtMlwiIGRhdGEtbmFtZT1cItCh0LvQvtC5IDFcIj4gPHBhdGggY2xhc3M9XCJjbHMtMVwiIGQ9XCJNNDUxLjg0LDBINzI2LjRhMzEuNDQsMzEuNDQsMCwwLDEsMzEuNDQsMzEuNDRWODguNTZBMzEuNDQsMzEuNDQsMCwwLDEsNzI2LjQsMTIwSDQ4My4yOGEzMS40NCwzMS40NCwwLDAsMS0zMS40NC0zMS40NFYwQTAsMCwwLDAsMSw0NTEuODQsMFpcIi8+IDxwYXRoIGNsYXNzPVwiY2xzLTJcIiBkPVwiTTYyLjk1LDk2LjU2bC0uMS00MS41TDQyLjQ5LDg5LjI1SDM1LjI4TDE1LDU1Ljk1Vjk2LjU2SDBWMjcuMzlIMTMuMjRsMjUuODksNDMsMjUuNDktNDNINzcuNzdMNzgsOTYuNTZaXCIvPiA8cGF0aCBjbGFzcz1cImNscy0yXCIgZD1cIk0xMzkuOTIsODEuNzRIMTA3LjhsLTYuMTMsMTQuODJIODUuMjdMMTE2LjEsMjcuMzloMTUuODFsMzAuOTMsNjkuMTdIMTQ2Wm0tNS0xMi4xNS0xMS0yNi40OC0xMSwyNi40OFpcIi8+IDxwYXRoIGNsYXNzPVwiY2xzLTJcIiBkPVwiTTIxNC4xMiw5Ni41NiwyMDAuNzgsNzcuMjlIMTg2LjA2Vjk2LjU2aC0xNlYyNy4zOUgyMDBjMTguNDgsMCwzMCw5LjU4LDMwLDI1LjEsMCwxMC4zOC01LjI0LDE4LTE0LjIzLDIxLjg0bDE1LjUxLDIyLjIzWm0tMTUtNTYuMTNoLTEzVjY0LjU0aDEzYzkuNzgsMCwxNC43Mi00LjU0LDE0LjcyLTEyLjA2UzIwOC44OSw0MC40MywxOTkuMSw0MC40M1pcIi8+IDxwYXRoIGNsYXNzPVwiY2xzLTJcIiBkPVwiTTI2Ny44OCw2OS4zOGwtOS4yOSw5LjY4Vjk2LjU2SDI0Mi42OFYyNy4zOWgxNS45MVY1OS43bDMwLjYzLTMyLjMxSDMwN0wyNzguMzUsNTguMjJsMzAuMzQsMzguMzRIMjkwWlwiLz4gPHBhdGggY2xhc3M9XCJjbHMtMlwiIGQ9XCJNMzY5LjM1LDgzLjcxVjk2LjU2SDMxNS44VjI3LjM5aDUyLjI3VjQwLjIzSDMzMS43MXYxNWgzMi4xMlY2Ny43SDMzMS43MXYxNlpcIi8+IDxwYXRoIGNsYXNzPVwiY2xzLTJcIiBkPVwiTTM5Ni40Myw0MC40M0gzNzQuMjl2LTEzaDYwLjI4djEzSDQxMi40M1Y5Ni41NmgtMTZaXCIvPiA8cGF0aCBjbGFzcz1cImNscy0yXCIgZD1cIk00ODkuODgsNjUuNTJWODguMTVhNC4wNSw0LjA1LDAsMCwxLTEsMy4xMSw2LDYsMCwwLDEtNi4yLDAsNC4wNyw0LjA3LDAsMCwxLS45NS0zLjA2VjI5LjY1cTAtNCw0LjA1LTRINTA3cTkuMTksMCwxNC4zMyw1LjE5dDUuMTQsMTQuNDhxMCw5LjI5LTQuNzMsMTQuNzJ0LTE0LjI5LDUuNDNabTAtMzEuOTJ2MjRINTA4LjFhOS44NCw5Ljg0LDAsMCwwLDQuODItMS4wOSw4LjgzLDguODMsMCwwLDAsMy4xNS0yLjg3LDEyLjU5LDEyLjU5LDAsMCwwLDEuNzItNCwxNy45MSwxNy45MSwwLDAsMCwuNTQtNC4zNUExNS4zNiwxNS4zNiwwLDAsMCw1MTcuNSw0MGExMC4xOSwxMC4xOSwwLDAsMC0yLjI3LTMuNjYsOC41MSw4LjUxLDAsMCwwLTMuMy0yLjA4QTEyLjA1LDEyLjA1LDAsMCwwLDUwOCwzMy42WlwiLz4gPHBhdGggY2xhc3M9XCJjbHMtMlwiIGQ9XCJNNTQwLDkxLjYxcS00LjE1LDAtNC4xNS00LjA1VjI5LjE2cTAtNCw0LjE1LTRhNC4yOCw0LjI4LDAsMCwxLDMsLjg5LDQuMTEsNC4xMSwwLDAsMSwuOTQsMy4wNlY4My43aDI4Ljg1cTMuNzUsMCwzLjc1LDMuODUsMCw0LjA1LTMuNzUsNC4wNVpcIi8+IDxwYXRoIGNsYXNzPVwiY2xzLTJcIiBkPVwiTTYxNy40NSw3Ni41OUg1OTEuODVsLTQuMzUsMTIuODVBMy40MSwzLjQxLDAsMCwxLDU4NCw5MmE1LjU5LDUuNTksMCwwLDEtMS43OC0uMywzLjkzLDMuOTMsMCwwLDEtMi4xNy0xLjI4LDMuMjgsMy4yOCwwLDAsMS0uNjktMi4wOCw0LjIyLDQuMjIsMCwwLDEsLjItMS40OEw1OTksMjkuNDVhOC4xMSw4LjExLDAsMCwxLDEuNTMtMi44NywzLjc0LDMuNzQsMCwwLDEsMi44Mi0uODloMi44N2EzLjc1LDMuNzUsMCwwLDEsMi44Mi44OSw4LjE2LDguMTYsMCwwLDEsMS41MywyLjg3TDYyOS45LDg2Ljg2YTQuMjMsNC4yMywwLDAsMSwuMywxLjQ4cTAsMi4yNy0yLjU3LDMuMjZhNy41OSw3LjU5LDAsMCwxLTIsLjMsMy43LDMuNywwLDAsMS0zLjc1LTIuNDdabS0yMi44My03LjloMjAuMjZMNjA0LjgsMzcuMzZoLS4yWlwiLz4gPHBhdGggY2xhc3M9XCJjbHMtMlwiIGQ9XCJNNjU0LjEsOTEuNjFhMTkuMywxOS4zLDAsMCwxLTYuODItMS4xOSwxNC44NSwxNC44NSwwLDAsMS01LjUyLTMuNjEsMTcsMTcsMCwwLDEtMy43LTYuMTNBMjUuMjEsMjUuMjEsMCwwLDEsNjM2LjcxLDcyVjQ1LjM2YTIzLjY1LDIzLjY1LDAsMCwxLDEuNDUtOC42NSwxNy4zNiwxNy4zNiwwLDAsMSwzLjktNi4xMywxNi41NCwxNi41NCwwLDAsMSw1LjU3LTMuNjYsMTcuNjYsMTcuNjYsMCwwLDEsNi41Ny0xLjI0aDIwLjY1cTMuNzUsMCwzLjc1LDR0LTMuNzUsNEg2NTVhOS4yOSw5LjI5LDAsMCwwLTcuNTEsMy4xNiwxMi40NCwxMi40NCwwLDAsMC0yLjY3LDguM1Y3Mi4zNGExMi41NCwxMi41NCwwLDAsMCwyLjU3LDguMjUsOC45NCw4Ljk0LDAsMCwwLDcuMzEsMy4xMWgyMC4xNnEzLjc1LDAsMy43NSwzLjg1LDAsNC4wNS0zLjc1LDQuMDVaXCIvPiA8cGF0aCBjbGFzcz1cImNscy0yXCIgZD1cIk02OTEuMzYsOTEuNjFxLTQuMTUsMC00LjE1LTQuMDVWMjkuNjVxMC00LDQuMTUtNGgzMi45cTMuNzUsMCwzLjc1LDR0LTMuNzUsNGgtMjlWNTIuNjdINzIwcTMuNTYsMCwzLjU2LDRUNzIwLDYwLjU4aC0yNC43VjgzLjdoMjlxMy43NSwwLDMuNzUsMy44NSwwLDQuMDUtMy43NSw0LjA1WlwiLz4gPC9nPiA8L2c+IDxzY3JpcHQgeG1sbnM9XCJcIiBpZD1cInByb2Zlc3NvciBwcmViaWQgaW5qZWN0ZWQgYnVuZGxlXCIvPjwvc3ZnPmA7XHJcbiAgbG9nb0xpbmsgPSAnaHR0cHM6Ly9tYXJrZXQtcGxhY2Uuc3UnO1xyXG4gIGRpc2FibGVMb2dvID0gMTtcclxuXHJcbiAgYWRNdXRlZCA9IHRydWU7XHJcbiAgc291bmRCdG4gPSBudWxsO1xyXG4gIGRpc2FibGVTb3VuZEJ0biA9IDA7XHJcblxyXG4gIHBsYXlCdG4gPSBudWxsO1xyXG4gIGRpc2FibGVQbGF5QnRuID0gMTtcclxuXHJcbiAgY2xvc2VCdG4gPSBudWxsO1xyXG4gIGRpc2FibGVDbG9zZUJ0biA9IDE7XHJcblxyXG4gIHN0eWxlc0VsZW1lbnQgPSBudWxsO1xyXG4gIGNvbnRyb2xzU3R5bGVzID0gYFxyXG4gIC5tcHN1LWxvZ28ge1xyXG4gICAgcG9zaXRpb246YWJzb2x1dGU7XHJcbiAgICB0b3A6IDBweDtcclxuICAgIHJpZ2h0OiAwcHg7IFxyXG4gICAgd2lkdGg6IDExMHB4O1xyXG4gICAgaGVpZ2h0OiAyNXB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwuOCk7XHJcbiAgICBwYWRkaW5nOiA1cHggMTVweDtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgfVxyXG5cclxuICAubXBzdS1wbGF5ZXItY29udHJvbHMge1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlOyBcclxuICAgIGxlZnQ6IDEwcHg7IFxyXG4gICAgdG9wOiAxMHB4O1xyXG4gIH1cclxuXHJcbiAgLm1wc3UtY29udHJvbCB7XHJcbiAgICB3aWR0aDogMjZweDsgXHJcbiAgICBoZWlnaHQ6IDI2cHg7IFxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwuOCk7IFxyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICBtYXJnaW4tbGVmdDogMTBweFxyXG4gIH1cclxuXHJcbiAgLm1wc3UtY29udHJvbDpmaXJzdC1jaGlsZCB7XHJcbiAgICBtYXJnaW4tbGVmdDogMDtcclxuICB9XHJcblxyXG4gIC5tcHN1LWNvbnRyb2w6aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwxKTtcclxuICB9XHJcblxyXG4gIC5tcHN1LWNsb3NlLWJ1dHRvbiAge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICB9XHJcblxyXG4gIC5tcHN1LXNvdW5kLWJ1dHRvbiBzdmcge1xyXG4gICAgbWFyZ2luLXRvcDogNXB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IDJweDtcclxuICB9XHJcbiAgXHJcbiAgLm1wc3Utc291bmQtYnV0dG9uIC5tdXRlZCB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gIH1cclxuXHJcbiAgLm1wc3Utc291bmQtYnV0dG9uLm11dGVkIC5tdXRlZCB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgfVxyXG5cclxuICAubXBzdS1zb3VuZC1idXR0b24ubXV0ZWQgLnVubXV0ZWQge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICB9XHJcbiAgXHJcbiAgLm1wc3UtcGxheS1idXR0b24gLnBhdXNlIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICBtYXJnaW4tdG9wOiA1cHg7XHJcbiAgICBtYXJnaW4tbGVmdDogOHB4O1xyXG4gIH1cclxuXHJcbiAgLm1wc3UtcGxheS1idXR0b24gLnBsYXkge1xyXG4gICAgbWFyZ2luLXRvcDogNXB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IDhweDtcclxuICB9XHJcblxyXG4gIC5tcHN1LXBsYXktYnV0dG9uLnBsYXlpbmcgLnBhdXNlIHtcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICB9XHJcblxyXG4gIC5tcHN1LXBsYXktYnV0dG9uLnBsYXlpbmcgLnBsYXkge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICB9XHJcbiAgYDtcclxuXHJcbiAgcGxheWVyQ29udGFpbmVyID0gbnVsbDtcclxuICBzY3JpcHRzTG9hZGVkID0ge307XHJcbiAgcXVlID0gW107XHJcblxyXG4gIHRpbWVvdXQgPSBudWxsO1xyXG4gIHRpbWVvdXREdXJhdGlvbiA9IDIwMDBcclxuXHJcbiAgaW1hID0gbnVsbDtcclxuXHJcbiAgb3B0aW9ucyA9IHsgLy8gRGVmYXVsdCBvcHRpb25zXHJcbiAgICB2aWRlbzoge1xyXG4gICAgICBzdHlsZTogJ3dpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7J1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHNka1VSTCA9ICdodHRwczovL2ltYXNkay5nb29nbGVhcGlzLmNvbS9qcy9zZGtsb2FkZXIvaW1hMy5qcyc7XHJcbiAgdXJsID0gJ2h0dHBzOi8vdjEubXBzdWFkdi5ydS9iaF92Mi9baGFzaF0/aGFzaD1tcHN1JztcclxuICB2aWRlb1VybCA9ICd2aWRlby5tcDQnO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgZXZlbnRzKSB7XHJcbiAgICB0aGlzLmRyb3BBZExvYWRlcigpO1xyXG4gICAgdGhpcy5oYXNoID0gc2V0dGluZ3MuaGFzaDtcclxuICAgIHRoaXMud2lkZ2V0SWQgPSBzZXR0aW5ncy53aWRnZXRJZDtcclxuXHJcbiAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ2RlYnVnJyk7XHJcbiAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ2xvb3AnKTtcclxuICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnZGlzYWJsZUNvbnRyb2xzJyk7XHJcbiAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ2Rpc2FibGVMb2dvJyk7XHJcbiAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ2Rpc2FibGVDbG9zZUJ0bicpO1xyXG4gICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdkaXNhYmxlUGxheUJ0bicpO1xyXG4gICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdkaXNhYmxlU291bmRCdG4nKTtcclxuXHJcbiAgICB0aGlzLnVybCA9IHRoaXMudXJsLnJlcGxhY2UoJ1toYXNoXScsIHRoaXMuaGFzaCk7XHJcbiAgICB0aGlzLmwoJ1VSTDogJywgdGhpcy51cmwpO1xyXG4gICAgdGhpcy51cmwgPSAnaHR0cHM6Ly9zdGF0aWthLm1wc3VhZHYucnUvdGVzdC90ZXN0LnhtbCc7IC8vIHRlbXBvcmFyeSB1cmwsIHJlbW92ZSBvbiBwcm9kdWN0aW9uXHJcbiAgICBpZiAoc2V0dGluZ3MudmlkZW9VcmwpIHRoaXMudmlkZW9VcmwgPSBzZXR0aW5ncy52aWRlb1VybDtcclxuICAgIHRoaXMucGxheWVyQ29udGFpbmVyID0gc2V0dGluZ3MuY29udGFpbmVyO1xyXG4gICAgdGhpcy5jbGVhckNvbnRhaW5lcigpO1xyXG5cclxuICAgIHRoaXMubG9hZFNESyh0aGlzLnNka1VSTCwgKCkgPT4geyB0aGlzLmluaXQoKTsgfSlcclxuICAgIHRoaXMuc2V0RXZlbnRzKGV2ZW50cylcclxuXHJcbiAgICB0aGlzLm1lcmdlT3B0aW9ucyhzZXR0aW5ncyk7XHJcbiAgICB0aGlzLmwoXCJTZXR0aW5nczogXCIsIHRoaXMub3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBzZXRPcHRpb24ocywgbykge1xyXG4gICAgaWYgKHR5cGVvZiBzW29dICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aGlzW29dID0gc1tvXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRyb3BBZExvYWRlcihvbkV2ZW50ID0gZmFsc2UpIHtcclxuICAgIHRoaXMubCgnRHJvcHBpbmcgQWQgTG9hZGVyJyk7XHJcbiAgICBpZiAodGhpcy5hZHNNYW5hZ2VyKSB7XHJcbiAgICAgIHRoaXMuYWRzTWFuYWdlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFkc0xvYWRlciA9IG51bGw7XHJcbiAgICB0aGlzLmFkRGlzcGxheUNvbnRhaW5lciA9IG51bGw7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIgPSBudWxsO1xyXG4gICAgdGhpcy5hZHNMb2FkZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuYWRzUmVuZGVyaW5nU2V0dGluZ3MgPSBudWxsO1xyXG4gICAgdGhpcy52aWRlb0VsZW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy52aWRlb0NvbnRhaW5lciA9IG51bGw7XHJcbiAgICB0aGlzLmFkQ29udGFpbmVyID0gbnVsbDtcclxuICAgIHRoaXMudmlkZW9TdGF0dXMgPSBudWxsO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBvbkV2ZW50ID8gJ2Ryb3BwZWQnIDogbnVsbDtcclxuICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XHJcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcclxuICB9XHJcblxyXG4gIHNldEV2ZW50cyA9IChldmVudHMpID0+IHtcclxuICAgIGNvbnN0IGV2ZW50c0RlZmF1bHQgPSB7XHJcbiAgICAgIG9uQ2xvc2U6ICgpID0+IHsgfSxcclxuICAgICAgb25TdG9wOiAoKSA9PiB7IH0sXHJcbiAgICAgIG9uRXJyb3I6ICgpID0+IHsgfSxcclxuICAgICAgb25JbXByZXNzaW9uOiAoKSA9PiB7IH0sXHJcbiAgICAgIG9uQ2xpY2s6ICgpID0+IHsgfSxcclxuICAgIH1cclxuICAgIHRoaXMuZXZlbnRzID0geyAuLi5ldmVudHNEZWZhdWx0LCAuLi5ldmVudHMgfVxyXG4gIH1cclxuXHJcbiAgYWRkQ29udHJvbHMoKSB7XHJcbiAgICB0aGlzLmwoJ0FkZGluZyBjb250cm9scycsICF0aGlzLmRpc2FibGVDb250cm9scylcclxuICAgIGlmICghdGhpcy5kaXNhYmxlQ29udHJvbHMpIHtcclxuICAgICAgaWYgKCF0aGlzLmNvbnRyb2xzRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuY29udHJvbHNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sc0VsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbXBzdS1wbGF5ZXItY29udHJvbHMnKTtcclxuICAgICAgICB0aGlzLnBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzRWxlbWVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMubCgnQ3JlYXRpbmcgY2xvc2UgYnV0dG9uJylcclxuICAgICAgaWYgKCF0aGlzLmNsb3NlQnRuICYmICF0aGlzLmRpc2FibGVDbG9zZUJ0bikge1xyXG4gICAgICAgIHRoaXMuY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLmNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ21wc3UtY29udHJvbCcpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnbXBzdS1jbG9zZS1idXR0b24nKTtcclxuXHJcbiAgICAgICAgbGV0IGNsb3NlSWNvblN2ZyA9ICc8c3ZnIGZpbGw9XCJjdXJyZW50Q29sb3JcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMWVtXCIgdmlld0JveD1cIjAgMCAzODQgNTEyXCI+PHBhdGggZD1cIk0zNDIuNiAxNTAuNmMxMi41LTEyLjUgMTIuNS0zMi44IDAtNDUuM3MtMzIuOC0xMi41LTQ1LjMgMEwxOTIgMjEwLjcgODYuNiAxMDUuNGMtMTIuNS0xMi41LTMyLjgtMTIuNS00NS4zIDBzLTEyLjUgMzIuOCAwIDQ1LjNMMTQ2LjcgMjU2IDQxLjQgMzYxLjRjLTEyLjUgMTIuNS0xMi41IDMyLjggMCA0NS4zczMyLjggMTIuNSA0NS4zIDBMMTkyIDMwMS4zIDI5Ny40IDQwNi42YzEyLjUgMTIuNSAzMi44IDEyLjUgNDUuMyAwczEyLjUtMzIuOCAwLTQ1LjNMMjM3LjMgMjU2IDM0Mi42IDE1MC42elwiLz48L3N2Zz4nO1xyXG5cclxuICAgICAgICB0aGlzLmNsb3NlQnRuLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgY2xvc2VJY29uU3ZnKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sc0VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jbG9zZUJ0bik7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ2xvc2VCdXR0b25FdmVudHMoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmwoJ0Nsb3NlIGJ1dHRvbiBhbHJlYWR5IGV4aXN0cycpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmwoJ0NyZWF0aW5nIHNvdW5kIGJ1dHRvbicpXHJcbiAgICAgIGlmICghdGhpcy5zb3VuZEJ0biAmJiAhdGhpcy5kaXNhYmxlU291bmRCdG4pIHtcclxuICAgICAgICB0aGlzLnNvdW5kQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5zb3VuZEJ0bi5jbGFzc0xpc3QuYWRkKCdtcHN1LWNvbnRyb2wnKTtcclxuICAgICAgICB0aGlzLnNvdW5kQnRuLmNsYXNzTGlzdC5hZGQoJ21wc3Utc291bmQtYnV0dG9uJyk7XHJcbiAgICAgICAgdGhpcy5zb3VuZEJ0bi5jbGFzc0xpc3QuYWRkKCdtdXRlZCcpO1xyXG5cclxuICAgICAgICBsZXQgbXV0ZWRJY29uU3ZnID0gJzxzdmcgY2xhc3M9XCJtdXRlZFwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMWVtXCIgdmlld0JveD1cIjAgMCA1NzYgNTEyXCI+PHBhdGggZD1cIk0zMDEuMSAzNC44QzMxMi42IDQwIDMyMCA1MS40IDMyMCA2NFY0NDhjMCAxMi42LTcuNCAyNC0xOC45IDI5LjJzLTI1IDMuMS0zNC40LTUuM0wxMzEuOCAzNTJINjRjLTM1LjMgMC02NC0yOC43LTY0LTY0VjIyNGMwLTM1LjMgMjguNy02NCA2NC02NGg2Ny44TDI2Ni43IDQwLjFjOS40LTguNCAyMi45LTEwLjQgMzQuNC01LjN6TTQyNSAxNjdsNTUgNTUgNTUtNTVjOS40LTkuNCAyNC42LTkuNCAzMy45IDBzOS40IDI0LjYgMCAzMy45bC01NSA1NSA1NSA1NWM5LjQgOS40IDkuNCAyNC42IDAgMzMuOXMtMjQuNiA5LjQtMzMuOSAwbC01NS01NS01NSA1NWMtOS40IDkuNC0yNC42IDkuNC0zMy45IDBzLTkuNC0yNC42IDAtMzMuOWw1NS01NS01NS01NWMtOS40LTkuNC05LjQtMjQuNiAwLTMzLjlzMjQuNi05LjQgMzMuOSAwelwiLz48L3N2Zz4nO1xyXG4gICAgICAgIGxldCB1bm11dGVkSWNvblN2ZyA9ICc8c3ZnIGNsYXNzPVwidW5tdXRlZFwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMWVtXCIgdmlld0JveD1cIjAgMCA2NDAgNTEyXCI+PHBhdGggZD1cIk01MzMuNiAzMi41QzU5OC41IDg1LjMgNjQwIDE2NS44IDY0MCAyNTZzLTQxLjUgMTcwLjgtMTA2LjQgMjIzLjVjLTEwLjMgOC40LTI1LjQgNi44LTMzLjgtMy41cy02LjgtMjUuNCAzLjUtMzMuOEM1NTcuNSAzOTguMiA1OTIgMzMxLjIgNTkyIDI1NnMtMzQuNS0xNDIuMi04OC43LTE4Ni4zYy0xMC4zLTguNC0xMS44LTIzLjUtMy41LTMzLjhzMjMuNS0xMS44IDMzLjgtMy41ek00NzMuMSAxMDdjNDMuMiAzNS4yIDcwLjkgODguOSA3MC45IDE0OXMtMjcuNyAxMTMuOC03MC45IDE0OWMtMTAuMyA4LjQtMjUuNCA2LjgtMzMuOC0zLjVzLTYuOC0yNS40IDMuNS0zMy44QzQ3NS4zIDM0MS4zIDQ5NiAzMDEuMSA0OTYgMjU2cy0yMC43LTg1LjMtNTMuMi0xMTEuOGMtMTAuMy04LjQtMTEuOC0yMy41LTMuNS0zMy44czIzLjUtMTEuOCAzMy44LTMuNXptLTYwLjUgNzQuNUM0MzQuMSAxOTkuMSA0NDggMjI1LjkgNDQ4IDI1NnMtMTMuOSA1Ni45LTM1LjQgNzQuNWMtMTAuMyA4LjQtMjUuNCA2LjgtMzMuOC0zLjVzLTYuOC0yNS40IDMuNS0zMy44QzM5My4xIDI4NC40IDQwMCAyNzEgNDAwIDI1NnMtNi45LTI4LjQtMTcuNy0zNy4zYy0xMC4zLTguNC0xMS44LTIzLjUtMy41LTMzLjhzMjMuNS0xMS44IDMzLjgtMy41ek0zMDEuMSAzNC44QzMxMi42IDQwIDMyMCA1MS40IDMyMCA2NFY0NDhjMCAxMi42LTcuNCAyNC0xOC45IDI5LjJzLTI1IDMuMS0zNC40LTUuM0wxMzEuOCAzNTJINjRjLTM1LjMgMC02NC0yOC43LTY0LTY0VjIyNGMwLTM1LjMgMjguNy02NCA2NC02NGg2Ny44TDI2Ni43IDQwLjFjOS40LTguNCAyMi45LTEwLjQgMzQuNC01LjN6XCIvPjwvc3ZnPic7XHJcblxyXG4gICAgICAgIHRoaXMuc291bmRCdG4uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBtdXRlZEljb25TdmcpO1xyXG4gICAgICAgIHRoaXMuc291bmRCdG4uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB1bm11dGVkSWNvblN2Zyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbHNFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuc291bmRCdG4pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFNvdW5kQnV0dG9uRXZlbnRzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5sKCdTb3VuZCBidXR0b24gYWxyZWFkeSBleGlzdHMnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmwoJ0NyZWF0aW5nIHBsYXkgYnV0dG9uJyk7XHJcbiAgICAgIGlmICghdGhpcy5wbGF5QnRuICYmICF0aGlzLmRpc2FibGVQbGF5QnRuKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ21wc3UtY29udHJvbCcpO1xyXG4gICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdtcHN1LXBsYXktYnV0dG9uJyk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXlpbmcnKTtcclxuXHJcbiAgICAgICAgbGV0IHBsYXlJY29uU3ZnID0gJzxzdmcgY2xhc3M9XCJwbGF5XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBoZWlnaHQ9XCIxZW1cIiB2aWV3Qm94PVwiMCAwIDM4NCA1MTJcIj48cGF0aCBkPVwiTTczIDM5Yy0xNC44LTkuMS0zMy40LTkuNC00OC41LS45UzAgNjIuNiAwIDgwVjQzMmMwIDE3LjQgOS40IDMzLjQgMjQuNSA0MS45czMzLjcgOC4xIDQ4LjUtLjlMMzYxIDI5N2MxNC4zLTguNyAyMy0yNC4yIDIzLTQxcy04LjctMzIuMi0yMy00MUw3MyAzOXpcIi8+PC9zdmc+JztcclxuICAgICAgICBsZXQgcGF1c2VJY29uU3ZnID0gJzxzdmcgY2xhc3M9XCJwYXVzZVwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMWVtXCIgdmlld0JveD1cIjAgMCAzMjAgNTEyXCI+PHBhdGggZD1cIk00OCA2NEMyMS41IDY0IDAgODUuNSAwIDExMlY0MDBjMCAyNi41IDIxLjUgNDggNDggNDhIODBjMjYuNSAwIDQ4LTIxLjUgNDgtNDhWMTEyYzAtMjYuNS0yMS41LTQ4LTQ4LTQ4SDQ4em0xOTIgMGMtMjYuNSAwLTQ4IDIxLjUtNDggNDhWNDAwYzAgMjYuNSAyMS41IDQ4IDQ4IDQ4aDMyYzI2LjUgMCA0OC0yMS41IDQ4LTQ4VjExMmMwLTI2LjUtMjEuNS00OC00OC00OEgyNDB6XCIvPjwvc3ZnPic7XHJcblxyXG4gICAgICAgIHRoaXMucGxheUJ0bi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHBsYXlJY29uU3ZnKTtcclxuICAgICAgICB0aGlzLnBsYXlCdG4uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBwYXVzZUljb25TdmcpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xzRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnBsYXlCdG4pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFBsYXlCdXR0b25FdmVudHMoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmwoJ1BsYXkgYnV0dG9uIGFscmVhZHkgZXhpc3RzJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmwoJ0NvbnRyb2xzIG9wdGlvbiBkaXNhYmxlZCcpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRDb250cm9sc1N0eWxlcygpIHtcclxuICAgIHRoaXMubCgnQWRkaW5nIGNvbnRyb2xzIHN0eWxlcycsICF0aGlzLmRpc2FibGVDb250cm9scylcclxuICAgIHRoaXMubCghdGhpcy5zdHlsZXNFbGVtZW50ID8gJ0FkZGluZyBzdHlsZXMgZWxlbWVudCcgOiAnU3R5bGVzIGVsZW1lbnQgYWxyZWFkeSBleGlzdHMnKVxyXG4gICAgaWYgKCF0aGlzLnN0eWxlc0VsZW1lbnQpIHtcclxuICAgICAgdGhpcy5zdHlsZXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgdGhpcy5zdHlsZXNFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdGhpcy5jb250cm9sc1N0eWxlcyk7XHJcbiAgICAgIHRoaXMubCh0aGlzLnBsYXllckNvbnRhaW5lcik7XHJcbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc3R5bGVzRWxlbWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRMb2dvKCkge1xyXG4gICAgaWYgKCF0aGlzLmxvZ28gJiYgIXRoaXMuZGlzYWJsZUxvZ28pIHtcclxuICAgICAgdGhpcy5sb2dvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICB0aGlzLmxvZ28uaHJlZiA9IHRoaXMubG9nb0xpbms7XHJcbiAgICAgIHRoaXMubG9nby5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMubG9nb1N2Zyk7XHJcbiAgICAgIHRoaXMubG9nby5jbGFzc0xpc3QuYWRkKCdtcHN1LWxvZ28nKTtcclxuICAgICAgdGhpcy5wbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5sb2dvKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFjdGlvbnNcclxuXHJcbiAgc2hvdyhjb250YWluZXIpIHtcclxuXHJcbiAgICB0aGlzLmwoJ1Nob3dpbmcgYWRzJyk7XHJcbiAgICB0aGlzLmwoJ1N0YXR1czonLCB0aGlzLnN0YXR1cyk7XHJcblxyXG4gICAgaWYgKGNvbnRhaW5lciAmJiBjb250YWluZXIgIT09IHRoaXMucGxheWVyQ29udGFpbmVyKSB7XHJcbiAgICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgICAgdGhpcy5sKCdTZXR0aW5nIG5ldyBwbGF5ZXIgY29udGFpbmVyOicsIGNvbnRhaW5lcik7XHJcbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICAgIHRoaXMuaGFuZGxlRWxlbWVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAod2luZG93Lmdvb2dsZT8uaW1hICYmICF0aGlzLmFkc0xvYWRlciAmJiB0aGlzLnZpZGVvRWxlbWVudCAmJiB0aGlzLmFkQ29udGFpbmVyKSB7XHJcbiAgICAgIHRoaXMuaW5pdEFkc0xvYWRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ2Ryb3BwZWQnKSB7XHJcbiAgICAgIHRoaXMucmVJbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmlzUnVubmluZykge1xyXG4gICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XHJcbiAgICAgIHRoaXMubCgnaXNSdW5uaW5nJywgdGhpcy5pc1J1bm5pbmcpO1xyXG4gICAgICB0aGlzLnF1ZS5wdXNoKHRoaXMubG9hZEFkcy5iaW5kKHRoaXMpKVxyXG4gICAgICBpZiAodGhpcy5hZHNNYW5hZ2VyKVxyXG4gICAgICAgIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sKCchdGhpcy5kaXNhYmxlQ29udHJvbHMnLCAhdGhpcy5kaXNhYmxlQ29udHJvbHMpXHJcbiAgICBpZiAoIXRoaXMuZGlzYWJsZUNvbnRyb2xzKSB7XHJcbiAgICAgIHRoaXMuYWRkQ29udHJvbHNTdHlsZXMoKTtcclxuICAgICAgdGhpcy5hZGRDb250cm9scygpO1xyXG4gICAgICB0aGlzLmFkZExvZ28oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhpZGUoKSB7XHJcbiAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5ldmVudHMub25TdG9wKCk7XHJcbiAgICB0aGlzLmRyb3BBZExvYWRlcih0cnVlKTtcclxuICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICB9XHJcblxyXG4gIHJlbG9hZCgpIHtcclxuICAgIHRoaXMubCgnUmVmcmVzaGluZyBwbGF5ZXInKTtcclxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ2Ryb3BwZWQnKSB7XHJcbiAgICAgIHRoaXMucmVJbml0KCk7XHJcbiAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0dXMgIT09ICdkcm9wcGVkJyAmJiB0aGlzLmFkc0xvYWRlcikge1xyXG4gICAgICB0aGlzLnBsYXlOZXh0QWQoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzdW1lKCkge1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyPy5yZXN1bWUoKVxyXG4gIH1cclxuXHJcbiAgcGF1c2UoKSB7XHJcbiAgICB0aGlzLmFkc01hbmFnZXI/LnBhdXNlKClcclxuICB9XHJcblxyXG4gIHBsYXlOZXh0QWQoKSB7XHJcbiAgICB0aGlzLmwoJ1BsYXlpbmcgbmV4dCBBZCcpXHJcbiAgICB0aGlzLmFkc01hbmFnZXIuZGVzdHJveSgpO1xyXG4gICAgdGhpcy5hZHNMb2FkZXIuY29udGVudENvbXBsZXRlKCk7XHJcbiAgICB0aGlzLnF1ZS5wdXNoKHRoaXMubG9hZEFkcy5iaW5kKHRoaXMpKVxyXG4gICAgdGhpcy5hZHNMb2FkZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuYWRzTG9hZGVyLnJlcXVlc3RBZHModGhpcy5hZHNSZXF1ZXN0KTtcclxuICB9XHJcblxyXG4gIG11dGUoKSB7XHJcbiAgICB0aGlzLmFkTXV0ZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyPy5zZXRWb2x1bWUoMCk7XHJcbiAgfVxyXG5cclxuICB1bm11dGUoKSB7XHJcbiAgICB0aGlzLmFkTXV0ZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuYWRzTWFuYWdlcj8uc2V0Vm9sdW1lKDEpO1xyXG4gIH1cclxuXHJcbiAgcGxheVZpZGVvKCkge1xyXG4gICAgaWYgKHRoaXMudmlkZW9TdGF0dXMgJiYgdGhpcy52aWRlb1N0YXR1cyAhPT0gJ3BsYXlpbmcnKSB7XHJcbiAgICAgIHRoaXMubCgnVmlkZW8gcGxheSBmaXJlcycpO1xyXG4gICAgICB0aGlzLmwoJ1ZpZGVvIHN0YXR1czogJywgdGhpcy52aWRlb1N0YXR1cyk7XHJcbiAgICAgIGlmICh0aGlzLnZpZGVvRWxlbWVudC5wbGF5KCkpXHJcbiAgICAgICAgdGhpcy52aWRlb1N0YXR1cyA9ICdwbGF5aW5nJztcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuc3RhdHVzKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcIlBsZWFzZSBpbml0IHBsYXllciBmaXJzdFwiKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnZpZGVvU3RhdHVzID09PSAncGxheWluZycpIHtcclxuICAgICAgdGhpcy5sKFwiQWxyZWFkeSBwbGF5aW5nXCIpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdG9wVmlkZW8oKSB7XHJcbiAgICBpZiAodGhpcy52aWRlb1N0YXR1cyA9PT0gJ3BsYXlpbmcnKSB7XHJcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50LnBhdXNlKCk7XHJcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50LmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgdGhpcy52aWRlb1N0YXR1cyA9ICdzdG9wcGVkJztcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLndhcm4oXCJQbGVhc2Ugc3RhcnQgdGhlIHZpZGVvIGZpcnN0XCIpO1xyXG4gIH1cclxuXHJcbiAgcGF1c2VWaWRlbygpIHtcclxuICAgIGlmICh0aGlzLnZpZGVvU3RhdHVzID09PSAncGxheWluZycpIHtcclxuICAgICAgdGhpcy52aWRlb0VsZW1lbnQucGF1c2UoKTtcclxuICAgICAgdGhpcy52aWRlb1N0YXR1cyA9ICdwYXVzZWQnO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGNvbnNvbGUud2FybihcIlBsZWFzZSBzdGFydCB0aGUgdmlkZW8gZmlyc3RcIik7XHJcbiAgfVxyXG5cclxuICAvLyBRdWV1ZSBcclxuXHJcbiAgcHJvY2Vzc1F1ZXVlKCkge1xyXG4gICAgdGhpcy5sKCdQcm9jZXNzaW5nIHF1ZXVlJyk7XHJcbiAgICBpZiAodGhpcy5xdWUubGVuZ3RoICYmIHdpbmRvdy5nb29nbGU/LmltYSkge1xyXG4gICAgICB0aGlzLmwoJ0hhdmUgJyArIHRoaXMucXVlLmxlbmd0aCArICcgam9iKHMpJyk7XHJcbiAgICAgIHRoaXMubCgnUXVldWUnLCB0aGlzLnF1ZSlcclxuICAgICAgdGhpcy5xdWUuZm9yRWFjaCgodGFzaywgaW5kZXgpID0+IHtcclxuICAgICAgICB0aGlzLmwoJ1snICsgaW5kZXggKyAnXScsIHRhc2spO1xyXG4gICAgICAgIHRhc2soKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5xdWVbaW5kZXhdO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmwoJ1F1ZXVlIGlzIGVtcHR5Jyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBJbml0aWFsaXphdGlvblxyXG5cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5sKFwiSW5pdGlhbGl6aW5nIElNQVwiKTtcclxuXHJcbiAgICB0aGlzLnNldFdpbmRvd1Jlc2l6ZUV2ZW50KCk7XHJcblxyXG4gICAgaWYgKHRoaXMucGxheWVyQ29udGFpbmVyKSB7XHJcbiAgICAgIHRoaXMuaGFuZGxlRWxlbWVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmwoJ3dpbmRvdy5nb29nbGUnLCB3aW5kb3cuZ29vZ2xlKTtcclxuICAgIHRoaXMuaW5pdEFkc0xvYWRlcigpO1xyXG4gIH1cclxuXHJcbiAgaW5pdEFkc0xvYWRlcigpIHtcclxuICAgIGlmICh0aGlzLmFkQ29udGFpbmVyICYmIHRoaXMudmlkZW9FbGVtZW50KSB7XHJcbiAgICAgIHRoaXMubCgnSW5pdGlhbGl6aW5nIEFkcyBMb2FkZXInKTtcclxuICAgICAgdGhpcy5hZERpc3BsYXlDb250YWluZXIgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuQWREaXNwbGF5Q29udGFpbmVyKHRoaXMuYWRDb250YWluZXIsIHRoaXMudmlkZW9FbGVtZW50KTtcclxuICAgICAgLy8gdGhpcy5hZENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYWRDb250YWluZXJDbGljay5iaW5kKHRoaXMpKTtcclxuICAgICAgdGhpcy5hZHNMb2FkZXIgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuQWRzTG9hZGVyKHRoaXMuYWREaXNwbGF5Q29udGFpbmVyKTtcclxuICAgICAgdGhpcy5hZHNMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZHNNYW5hZ2VyTG9hZGVkRXZlbnQuVHlwZS5BRFNfTUFOQUdFUl9MT0FERUQsXHJcbiAgICAgICAgKGUpID0+IHsgdGhpcy5vbkFkc01hbmFnZXJMb2FkZWQoZSkgfSxcclxuICAgICAgICBmYWxzZSk7XHJcbiAgICAgIHRoaXMuYWRzTG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvckV2ZW50LlR5cGUuQURfRVJST1IsXHJcbiAgICAgICAgKGUpID0+IHsgdGhpcy5vbkFkRXJyb3IoZSkgfSxcclxuICAgICAgICBmYWxzZSk7XHJcblxyXG4gICAgICB0aGlzLmFkc1JlcXVlc3QgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuQWRzUmVxdWVzdCgpO1xyXG4gICAgICB0aGlzLmFkc1JlcXVlc3QuYWRUYWdVcmwgPSB0aGlzLnVybDtcclxuXHJcbiAgICAgIHRoaXMuYWRzUmVxdWVzdC5saW5lYXJBZFNsb3RXaWR0aCA9IHRoaXMudmlkZW9FbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICB0aGlzLmFkc1JlcXVlc3QubGluZWFyQWRTbG90SGVpZ2h0ID0gdGhpcy52aWRlb0VsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICB0aGlzLmFkc1JlcXVlc3Qubm9uTGluZWFyQWRTbG90V2lkdGggPSB0aGlzLnZpZGVvRWxlbWVudC5jbGllbnRXaWR0aDtcclxuICAgICAgdGhpcy5hZHNSZXF1ZXN0Lm5vbkxpbmVhckFkU2xvdEhlaWdodCA9IHRoaXMudmlkZW9FbGVtZW50LmNsaWVudEhlaWdodCAvIDM7XHJcblxyXG4gICAgICB0aGlzLmFkc1JlcXVlc3Quc2V0Q29udGludW91c1BsYXliYWNrKHRydWUpO1xyXG4gICAgICB0aGlzLmFkc1JlcXVlc3Quc2V0QWRXaWxsQXV0b1BsYXkodHJ1ZSk7XHJcblxyXG4gICAgICB0aGlzLmFkc0xvYWRlci5yZXF1ZXN0QWRzKHRoaXMuYWRzUmVxdWVzdCk7XHJcblxyXG4gICAgICB0aGlzLnN0YXR1cyA9IFwiaW5pdGlhdGVkXCI7XHJcbiAgICAgIHRoaXMubCgnU3RhdHVzOicsIHRoaXMuc3RhdHVzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmwoJ0NhblxcJ3QgaW5pdGlhbGl6ZSBBZHMgTG9hZGVyLCBubyBwcm9wZXIgdmlkZW8gZWxlbWVudCBvciBhZCBjb250YWluZXIuIEFkcyBMb2FkZXIgd2lsbCBiZSBpbml0aWFsaXplZCBvbiBzaG93KCknKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlSW5pdCgpIHtcclxuICAgIHRoaXMubCgnUmVpbml0aWFsaXppbmcgcGxheWVyJyk7XHJcbiAgICB0aGlzLmRyb3BBZExvYWRlcih0cnVlKTtcclxuICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJDb250YWluZXIoKSB7XHJcbiAgICB0aGlzLmwoJ0NsZWFyaW5nIGNvbnRhaW5lcicpO1xyXG4gICAgaWYgKHRoaXMucGxheWVyQ29udGFpbmVyKVxyXG4gICAgICB0aGlzLnBsYXllckNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gIH1cclxuXHJcbiAgbG9hZFNESyh1cmwsIGNhbGxiYWNrKSB7XHJcbiAgICB0aGlzLmwoJ0xPQURJTkcgU0RLJyk7XHJcbiAgICBpZiAod2luZG93Lmdvb2dsZT8uaW1hICYmIGNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMubCgnSU1BIGxvYWRlZCAmIGhhdmUgYSBjYWxsYmFjaycpO1xyXG4gICAgICBjYWxsYmFjaygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIHRoaXMuc2NyaXB0c0xvYWRlZFt0aGlzLnNka1VSTF0gPT09ICd1bmRlZmluZWQnICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbc3JjPVwiJyArIHRoaXMuc2RrVVJMICsgJ1wiXScpKSB7XHJcbiAgICAgIHRoaXMubCgnU3RhcnRpbmcgdG8gbG9hZCBTREsnKTtcclxuICAgICAgdGhpcy5zY3JpcHRzTG9hZGVkW3RoaXMuc2RrVVJMXSA9IHsgaXNMb2FkZWQ6IGZhbHNlIH1cclxuICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICBzY3JpcHQuc3JjID0gdXJsO1xyXG4gICAgICB0aGlzLnNjcmlwdHNMb2FkZWRbdGhpcy5zZGtVUkxdLnNjcmlwdCA9IHNjcmlwdDtcclxuICAgICAgaWYgKGNhbGxiYWNrKSBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMubCgnSU1BIFNESyBqdXN0IGxvYWRlZCcpO1xyXG4gICAgICAgIHRoaXMuc2NyaXB0c0xvYWRlZFt0aGlzLnNka1VSTF0ubG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgICB0aGlzLmwoJ1NDUklQVCEnLCBzY3JpcHQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlRWxlbWVudHMoKSB7XHJcbiAgICB0aGlzLmwoJ0hhbmRsaW5nIEVsZW1lbnRzJyk7XHJcbiAgICBpZiAoIXRoaXMudmlkZW9TdGF0dXMpIHtcclxuICAgICAgdGhpcy5sKFwiQ3JlYXRpbmcgVmlkZW8gRWxlbWVudFwiKTtcclxuICAgICAgdGhpcy52aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCBcIlwiKVxyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhdXRvcGxheVwiLCBcIlwiKVxyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCB0aGlzLm9wdGlvbnMudmlkZW8uc3R5bGUpO1xyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5zdHlsZS5tYXhXaWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XHJcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50Lm11dGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy52aWRlb0VsZW1lbnQuY29udHJvbHMgPSBmYWxzZTtcclxuICAgICAgdGhpcy5sKFwiVmlkZW8gRWxlbWVudFwiLCB0aGlzLnZpZGVvRWxlbWVudCk7XHJcblxyXG4gICAgICB0aGlzLmwoXCJDcmVhdGluZyBWaWRlbyBDb250YWluZXJcIik7XHJcbiAgICAgIHRoaXMudmlkZW9Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgdGhpcy52aWRlb0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdtcHN1LXBsYXllci1jb250YWluZXInKTtcclxuICAgICAgdGhpcy52aWRlb0NvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICAgdGhpcy52aWRlb0NvbnRhaW5lci5zdHlsZS53aWR0aCA9IHRoaXMub3B0aW9ucy52aWRlby53aWR0aCArIFwicHhcIjtcclxuICAgICAgdGhpcy52aWRlb0NvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSB0aGlzLm9wdGlvbnMudmlkZW8uaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5iZWZvcmUodGhpcy52aWRlb0NvbnRhaW5lcik7XHJcbiAgICAgIHRoaXMudmlkZW9Db250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy52aWRlb0VsZW1lbnQpO1xyXG4gICAgICB0aGlzLmwoXCJWaWRlbyBDb250YWluZXJcIiwgdGhpcy52aWRlb0NvbnRhaW5lcik7XHJcblxyXG4gICAgICB0aGlzLmwoXCJDcmVhdGluZyBBZCBDb250YWluZXJcIik7XHJcbiAgICAgIHRoaXMuYWRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgdGhpcy5hZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdtcHN1LWFkLWNvbnRhaW5lcicpO1xyXG4gICAgICB0aGlzLmFkQ29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICB0aGlzLmFkQ29udGFpbmVyLnN0eWxlLnRvcCA9IDA7XHJcbiAgICAgIHRoaXMuYWRDb250YWluZXIuc3R5bGUubGVmdCA9IDA7XHJcbiAgICAgIHRoaXMuYWRDb250YWluZXIuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgdGhpcy5hZENvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgICAgdGhpcy52aWRlb0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmFkQ29udGFpbmVyKTtcclxuICAgICAgdGhpcy5sKFwiQWQgQ29udGFpbmVyXCIsIHRoaXMuYWRDb250YWluZXIpO1xyXG5cclxuICAgICAgdGhpcy5jbGVhckNvbnRhaW5lcigpO1xyXG4gICAgICB0aGlzLnBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnZpZGVvQ29udGFpbmVyKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkVmlkZW9FdmVudHMoKTtcclxuXHJcbiAgICAgIHRoaXMudmlkZW9TdGF0dXMgPSBcImluaXRpYXRlZFwiO1xyXG4gICAgICB0aGlzLmwoJ1ZpZGVvIHN0YXR1czonLCB0aGlzLnZpZGVvU3RhdHVzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmwoJ1ZpZGVvIGVsZW1lbnRzIGFscmVhZHkgaW5pdGlhdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2FkQWRzKGV2ZW50KSB7XHJcbiAgICB0aGlzLmwoXCJMb2FkaW5nIGFkc1wiKTtcclxuICAgIGlmICh0aGlzLmFkc0xvYWRlZCkge1xyXG4gICAgICB0aGlzLmwoXCJBZHMgYWxyZWFkeSBsb2FkZWRcIik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuYWRzTG9hZGVkID0gdHJ1ZTtcclxuICAgIHRoaXMudmlkZW9FbGVtZW50LmxvYWQoKTtcclxuICAgIHRoaXMubChcIlZpZGVvIGVsZW1lbnQgbG9hZGVkXCIpO1xyXG4gICAgdGhpcy5hZERpc3BsYXlDb250YWluZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgdGhpcy5sKFwiRGlzcGxheSBDb250YWluZXIgaW5pdGlhbGl6ZWRcIik7XHJcbiAgICB2YXIgd2lkdGggPSB0aGlzLnZpZGVvRWxlbWVudC5jbGllbnRXaWR0aDtcclxuICAgIHZhciBoZWlnaHQgPSB0aGlzLnZpZGVvRWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLmwoXCJUcnlpbmcgdG8gaW5pdCBhZHMgbWFuYWdlclwiKTtcclxuICAgICAgdGhpcy5sKFwiQWRzIE1hbmFnZXI6IFwiLCB0aGlzLmFkc01hbmFnZXIpO1xyXG4gICAgICB0aGlzLmwoXCJ3aW5kb3cuZ29vZ2xlLmltYVwiLCB3aW5kb3cuZ29vZ2xlLmltYSk7XHJcbiAgICAgIHRoaXMuYWRzTWFuYWdlci5pbml0KHdpZHRoLCBoZWlnaHQsIHdpbmRvdy5nb29nbGUuaW1hLlZpZXdNb2RlLk5PUk1BTCk7XHJcbiAgICAgIHRoaXMubChcIlN0YXJ0aW5nIGFkcyBtYW5hZ2VyXCIpO1xyXG4gICAgICB0aGlzLmFkc01hbmFnZXIuc3RhcnQoKTtcclxuICAgICAgdGhpcy5sKFwiQWRzIE1hbmFnZXIgU3RhcnRlZFwiKTtcclxuICAgIH0gY2F0Y2ggKGFkRXJyb3IpIHtcclxuICAgICAgLy8gUGxheSB0aGUgdmlkZW8gd2l0aG91dCBhZHMsIGlmIGFuIGVycm9yIG9jY3Vyc1xyXG4gICAgICB0aGlzLmwoXCJBZHNNYW5hZ2VyIGNvdWxkIG5vdCBiZSBzdGFydGVkXCIsIGFkRXJyb3IpO1xyXG4gICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgdGhpcy5ldmVudHMub25FcnJvcigpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTZXR0aW5ncyBcclxuXHJcbiAgbWVyZ2VPcHRpb25zKG8pIHtcclxuICAgIHRoaXMubCgnT3B0aW9ucyBhcmUgb2JqZWN0JywgdGhpcy5pc09iamVjdChvKSk7XHJcbiAgICBpZiAodGhpcy5pc09iamVjdChvKSlcclxuICAgICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIC4uLnRoaXMub3B0aW9ucyxcclxuICAgICAgICAuLi5vXHJcbiAgICAgIH1cclxuICB9XHJcbiAgaXNPYmplY3QoZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBlID09PSAnb2JqZWN0JyAmJlxyXG4gICAgICAhQXJyYXkuaXNBcnJheShlKSAmJlxyXG4gICAgICBlICE9PSBudWxsO1xyXG4gIH1cclxuXHJcbiAgLy8gRXZlbnRzXHJcblxyXG4gIGFkZFZpZGVvRXZlbnRzKCkge1xyXG4gICAgdGhpcy5sKCdBZGRpbmcgdmlkZW8gZXZlbnRzJyk7XHJcbiAgICB0aGlzLnZpZGVvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZW5kZWRcIiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLmwoXCJlbmRlZCBldmVudCB0cmlnZ2VyZWRcIik7XHJcbiAgICAgIGlmICh0aGlzLmFkc0xvYWRlcikge1xyXG4gICAgICAgIHRoaXMucGxheU5leHRBZCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMudmlkZW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubChcImVycm9yIGV2ZW50IHRyaWdnZXJlZFwiKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy52aWRlb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsICgpID0+IHtcclxuICAgICAgdGhpcy5sKFwicGF1c2UgZXZlbnQgdHJpZ2dlcmVkXCIpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnZpZGVvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwicGxheVwiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubChcInBsYXkgZXZlbnQgdHJpZ2dlcmVkXCIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkFkc01hbmFnZXJMb2FkZWQoYWRzTWFuYWdlckxvYWRlZEV2ZW50KSB7XHJcbiAgICB0aGlzLmwoXCJBZHMgTWFuYWdlciBMb2FkZWRcIik7XHJcbiAgICB0aGlzLmFkc1JlbmRlcmluZ1NldHRpbmdzID0gbmV3IHdpbmRvdy5nb29nbGUuaW1hLkFkc1JlbmRlcmluZ1NldHRpbmdzKClcclxuICAgIHRoaXMuYWRzUmVuZGVyaW5nU2V0dGluZ3MudWlFbGVtZW50cyA9IFtcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuVWlFbGVtZW50cy5BRF9BVFRSSUJVVElPTixcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuVWlFbGVtZW50cy5DT1VOVERPV04sXHJcbiAgICBdXHJcbiAgICB0aGlzLmwoJ0lNQScsIHdpbmRvdy5nb29nbGUuaW1hKTtcclxuICAgIHRoaXMuYWRzTWFuYWdlciA9IGFkc01hbmFnZXJMb2FkZWRFdmVudC5nZXRBZHNNYW5hZ2VyKHRoaXMudmlkZW9FbGVtZW50LCB0aGlzLmFkc1JlbmRlcmluZ1NldHRpbmdzKTtcclxuXHJcbiAgICB0aGlzLmFkc01hbmFnZXIuc2V0Vm9sdW1lKDApO1xyXG4gICAgdGhpcy5hZE11dGVkID0gdHJ1ZTtcclxuXHJcbiAgICB0aGlzLmwoJ0Vycm9yIHR5cGVzOiAnLCB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yRXZlbnQuVHlwZSk7XHJcbiAgICB0aGlzLmwoJ0V2ZW50IHR5cGVzOiAnLCB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUpO1xyXG5cclxuICAgIHRoaXMubChcInRoaXMuYWRzTWFuYWdlclwiLCB0aGlzLmFkc01hbmFnZXIpO1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VSUk9SLFxyXG4gICAgICAoZSkgPT4geyB0aGlzLm9uQWRFcnJvcihlKSB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuQ09OVEVOVF9QQVVTRV9SRVFVRVNURUQsXHJcbiAgICAgIChlKSA9PiB7IHRoaXMub25Db250ZW50UGF1c2VSZXF1ZXN0ZWQoZSkgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkNPTlRFTlRfUkVTVU1FX1JFUVVFU1RFRCxcclxuICAgICAgKGUpID0+IHsgdGhpcy5vbkNvbnRlbnRSZXN1bWVSZXF1ZXN0ZWQoZSkgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkxPQURFRCxcclxuICAgICAgKGUpID0+IHsgdGhpcy5vbkFkTG9hZGVkKGUpIH0pO1xyXG5cclxuXHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLlNUQVJURUQsXHJcbiAgICAgIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ldmVudEluZm8oZSk7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSB0aGlzLnZpZGVvU3RhdHVzID0gXCJwbGF5aW5nXCI7XHJcbiAgICAgICAgdGhpcy5sKCdUaGUgdGltZW91dCB3aWxsIGJlIGNsZWFyZWQnKTtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcclxuICAgICAgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkZJUlNUX1FVQVJUSUxFLFxyXG4gICAgICAoZSkgPT4geyB0aGlzLmV2ZW50SW5mbyhlKTsgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLk1JRFBPSU5ULFxyXG4gICAgICAoZSkgPT4geyB0aGlzLmV2ZW50SW5mbyhlKTsgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLlRISVJEX1FVQVJUSUxFLFxyXG4gICAgICAoZSkgPT4geyB0aGlzLmV2ZW50SW5mbyhlKTsgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkNPTVBMRVRFLFxyXG4gICAgICAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZXZlbnRJbmZvKGUpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gdGhpcy52aWRlb1N0YXR1cyA9IFwiY29tcGxldGVcIjtcclxuICAgICAgICB0aGlzLmwoJ1NldHRpbmcgdGltZW91dCB0byBkaXNhYmxlIHRoZSBhZHMgaWYgXCJjb21wbGV0ZVwiIHN0YXR1cyB3aWxsIGV4Y2VlZCB0aW1lb3V0IGR1cmF0aW9uJyk7XHJcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmwoJ1RpbWVvdXQgZmlyZWQnKTtcclxuICAgICAgICAgIGlmIChbJ3BhdXNlZCcsICdwbGF5aW5nJywgJ2FsbF9jb21wbGV0ZSddLmluY2x1ZGVzKHRoaXMuc3RhdHVzKSkge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0l0XFwncyBvaywgZ29pbmcgb24nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdHVzID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnU3RhdHVzIGlzIHN0aWxsIFwiY29tcGxldGVcIiBvbiB0aW1lb3V0LCBoaWRpbmcnKTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdGhpcy50aW1lb3V0RHVyYXRpb24pO1xyXG5cclxuICAgICAgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkFMTF9BRFNfQ09NUExFVEVELFxyXG4gICAgICAoZSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZXZlbnRJbmZvKGUpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gXCJhbGxfY29tcGxldGVcIjtcclxuICAgICAgICB0aGlzLmwoJ1RoZSB0aW1lb3V0IHdpbGwgYmUgY2xlYXJlZCcpO1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHNFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMubG9nby5yZW1vdmUoKTtcclxuICAgICAgICBpZiAodGhpcy5sb29wKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbG9hZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLlBBVVNFRCxcclxuICAgICAgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmV2ZW50SW5mbyhlKTtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IHRoaXMudmlkZW9TdGF0dXMgPSBcInBhdXNlZFwiO1xyXG4gICAgICB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuUkVTVU1FRCxcclxuICAgICAgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmV2ZW50SW5mbyhlKTtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IHRoaXMudmlkZW9TdGF0dXMgPSBcInBsYXlpbmdcIjtcclxuICAgICAgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLlZJREVPX0NMSUNLRUQsXHJcbiAgICAgIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ldmVudEluZm8oZSk7XHJcbiAgICAgICAgdGhpcy5ldmVudHMub25DbGljaygpO1xyXG4gICAgICB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuSU1QUkVTU0lPTixcclxuICAgICAgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmV2ZW50SW5mbyhlKTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5vbkltcHJlc3Npb24oKTtcclxuICAgICAgfSk7XHJcblxyXG5cclxuICAgIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XHJcbiAgfVxyXG5cclxuICBldmVudEluZm8oZSkge1xyXG4gICAgbGV0IGFkID0gZS5nZXRBZCgpO1xyXG4gICAgbGV0IHBvZEluZm8gPSBhZC5nZXRBZFBvZEluZm8oKTtcclxuICAgIHRoaXMubGcoZS50eXBlICsgJyBmaXJlZCAoJyArIHBvZEluZm8uZ2V0QWRQb3NpdGlvbigpICsgJyknKTtcclxuICAgIHRoaXMubCgnQWQgZGF0YTonLCBhZClcclxuICAgIHRoaXMubCgnUmVtYWluaW5nIFRpbWUnLCB0aGlzLmFkc01hbmFnZXIuZ2V0UmVtYWluaW5nVGltZSgpKTtcclxuICAgIHRoaXMubCgnVGltZSBoYXMgcGFzc2VkJywgYWQuZ2V0RHVyYXRpb24oKSAtIHRoaXMuYWRzTWFuYWdlci5nZXRSZW1haW5pbmdUaW1lKCkpO1xyXG4gICAgdGhpcy5sKCdBZCBQb3NpdGlvbicsIHBvZEluZm8uZ2V0QWRQb3NpdGlvbigpKTtcclxuICAgIHRoaXMubCgnVG90YWwgQWRzJywgcG9kSW5mby5nZXRUb3RhbEFkcygpKTtcclxuICAgIHRoaXMubCgnTWF4IER1cmF0aW9uJywgcG9kSW5mby5nZXRNYXhEdXJhdGlvbigpKTtcclxuXHJcbiAgICB0aGlzLmxnZSgpO1xyXG4gIH1cclxuXHJcbiAgb25BZEVycm9yKGFkRXJyb3JFdmVudCkge1xyXG4gICAgdGhpcy5sKCdFcnJvciBmaXJlZCcsIGFkRXJyb3JFdmVudC5nZXRFcnJvcigpKTtcclxuICAgIHRoaXMuZHJvcEFkTG9hZGVyKHRydWUpO1xyXG4gICAgdGhpcy5oaWRlKCk7XHJcbiAgICB0aGlzLmV2ZW50cy5vbkVycm9yKCk7XHJcbiAgfVxyXG5cclxuICBvbkNvbnRlbnRQYXVzZVJlcXVlc3RlZCgpIHtcclxuICAgIHRoaXMubChcIkNvbnRlbnQgcGF1c2UgcmVxdWVzdGVkXCIpO1xyXG4gICAgdGhpcy52aWRlb0VsZW1lbnQucGF1c2UoKTtcclxuICB9XHJcblxyXG4gIG9uQ29udGVudFJlc3VtZVJlcXVlc3RlZCgpIHtcclxuICAgIHRoaXMubChcIkNvbnRlbnQgcmVzdW1lIHJlcXVlc3RlZFwiKTtcclxuICAgIGlmICh0aGlzLmxvb3ApIHtcclxuICAgICAgdGhpcy5yZWxvYWQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkQ29udGFpbmVyQ2xpY2soZXZlbnQpIHtcclxuICAgIHRoaXMubChcIkFkIGNvbnRhaW5lciBjbGlja2VkXCIpO1xyXG4gICAgaWYgKHRoaXMudmlkZW9FbGVtZW50LnBhdXNlZCkge1xyXG4gICAgICB0aGlzLmwoXCJQbGF5aW5nIHZpZGVvXCIpO1xyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5wbGF5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmwoXCJQYXVzaW5nIHZpZGVvXCIpO1xyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5wYXVzZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25BZExvYWRlZChhZEV2ZW50KSB7XHJcbiAgICB0aGlzLmwoXCJUaGUgYWQgaXMgbG9hZGVkXCIpO1xyXG4gICAgdmFyIGFkID0gYWRFdmVudC5nZXRBZCgpO1xyXG4gICAgaWYgKCFhZC5pc0xpbmVhcigpKSB7XHJcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50LnBsYXkoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldFdpbmRvd1Jlc2l6ZUV2ZW50KCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xyXG4gICAgICB0aGlzLmwoXCJ3aW5kb3cgcmVzaXplZFwiKTtcclxuICAgICAgaWYgKHRoaXMuYWRzTWFuYWdlcikge1xyXG4gICAgICAgIHZhciB3aWR0aCA9IHRoaXMudmlkZW9FbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLnZpZGVvRWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5hZHNNYW5hZ2VyLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0LCB3aW5kb3cuZ29vZ2xlLmltYS5WaWV3TW9kZS5OT1JNQUwpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZFNvdW5kQnV0dG9uRXZlbnRzKCkge1xyXG4gICAgaWYgKHRoaXMuc291bmRCdG4pIHtcclxuICAgICAgdGhpcy5zb3VuZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICB0aGlzLmwoJ2FkTXV0ZWQnLCB0aGlzLmFkTXV0ZWQpXHJcbiAgICAgICAgaWYgKHRoaXMuYWRNdXRlZCkge1xyXG4gICAgICAgICAgdGhpcy5sKCdVTk1VVElORycpXHJcbiAgICAgICAgICB0aGlzLnNvdW5kQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ211dGVkJyk7XHJcbiAgICAgICAgICB0aGlzLnVubXV0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubCgnTVVUSU5HJylcclxuICAgICAgICAgIHRoaXMuc291bmRCdG4uY2xhc3NMaXN0LmFkZCgnbXV0ZWQnKTtcclxuICAgICAgICAgIHRoaXMubXV0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRQbGF5QnV0dG9uRXZlbnRzKCkge1xyXG4gICAgaWYgKHRoaXMucGxheUJ0bikge1xyXG4gICAgICB0aGlzLnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sKCd2aWRlb1N0YXR1cycsIHRoaXMudmlkZW9TdGF0dXMpXHJcbiAgICAgICAgaWYgKHRoaXMudmlkZW9TdGF0dXMgPT09ICdwbGF5aW5nJykge1xyXG4gICAgICAgICAgdGhpcy5sKCdwYXVzaW5nJylcclxuICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5aW5nJyk7XHJcbiAgICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5sKCdwbGF5aW5nJylcclxuICAgICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5aW5nJyk7XHJcbiAgICAgICAgICB0aGlzLnJlc3VtZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRDbG9zZUJ1dHRvbkV2ZW50cygpIHtcclxuICAgIGlmICh0aGlzLmNsb3NlQnRuKSB7XHJcbiAgICAgIHRoaXMuY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sKCdDbG9zZSBidXR0b24gY2xpY2tlZCcpO1xyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLyBHZXR0ZXJzXHJcblxyXG4gIGdldEFkQ29udGFpbmVyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWRDb250YWluZXI7XHJcbiAgfVxyXG5cclxuICBnZXRWaWRlb0VsZW1lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52aWRlb0VsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBnZXRWaWRlb0NvbnRhaW5lcigpIHtcclxuICAgIHJldHVybiB0aGlzLnZpZGVvQ29udGFpbmVyO1xyXG4gIH1cclxuXHJcbiAgLy8gRGVidWdcclxuXHJcbiAgbCguLi5hcmdzKSB7XHJcbiAgICBpZiAodGhpcy5kZWJ1Zykge1xyXG4gICAgICBpZiAoIXRoaXMuZGVidWdHcm91cE9wZW5lZClcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRlYnVnTGFiZWwsIHRoaXMuZGVidWdTdHlsZXMsIC4uLmFyZ3MpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgY29uc29sZS5sb2coLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsZyhsYWJlbCA9IFwiXCIpIHtcclxuICAgIGlmICh0aGlzLmRlYnVnICYmICF0aGlzLmRlYnVnR3JvdXBPcGVuZWQpIHtcclxuICAgICAgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkID0gdHJ1ZTtcclxuICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCh0aGlzLmRlYnVnTGFiZWwsIHRoaXMuZGVidWdTdHlsZXMsIGxhYmVsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxnZSgpIHtcclxuICAgIGlmICh0aGlzLmRlYnVnICYmIHRoaXMuZGVidWdHcm91cE9wZW5lZCkge1xyXG4gICAgICB0aGlzLmRlYnVnR3JvdXBPcGVuZWQgPSBmYWxzZTtcclxuICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEhUTUxEcml2ZXIgZnJvbSBcIi4vZHJpdmVycy9odG1sX2RyaXZlclwiO1xuLy9pbXBvcnQgSFRNTERyaXZlcl90ZXN0IGZyb20gXCIuL2RyaXZlcnMvaHRtbF9kcml2ZXJfdGVzdFwiO1xuaW1wb3J0IEltYWdlRHJpdmVyIGZyb20gXCIuL2RyaXZlcnMvaW1hZ2VfZHJpdmVyXCI7XG5pbXBvcnQgUHJlYmlkRHJpdmVyIGZyb20gXCIuL2RyaXZlcnMvcHJlYmlkX2RyaXZlclwiO1xuaW1wb3J0IFJld2FyZGVkRHJpdmVyIGZyb20gXCIuL2RyaXZlcnMvcmV3YXJkZWRfZHJpdmVyXCI7XG5pbXBvcnQgVmtEcml2ZXIgZnJvbSBcIi4vZHJpdmVycy92a19kcml2ZXJcIjtcbmltcG9ydCBWS0luUGFnZURyaXZlciBmcm9tIFwiLi9kcml2ZXJzL3ZrX2lucGFnZV9kcml2ZXJcIjtcbmltcG9ydCBWUEFJRERyaXZlciBmcm9tIFwiLi9kcml2ZXJzL3ZwYWlkX2RyaXZlclwiO1xuXG52YXIgZHJpdmVyID0gKG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuZ2V0KCdkcml2ZXInKSkgPz8gJ2h0bWwnO1xudmFyIGFkVW5pdCA9IG51bGw7XG52YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhZC1jb250YWluZXJcIik7XG4vLy8vLy8vLy8vLy8vLyBIVE1MIC8vLy8vLy8vLy8vLy8vXG4vKmlmIChkcml2ZXIgPT09ICdodG1sX3Rlc3QnKSB7XG4gICAgYWRVbml0ID0gbmV3IEhUTUxEcml2ZXJfdGVzdCh7XG4gICAgICAgIGh0bWw6IGBcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6MTAwJTsgb3ZlcmZsb3c6IGhpZGRlblwiPlxuICAgICAgICAgICAgICAgIDxpZnJhbWUgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuXCIgc3JjPVwiaHR0cHM6Ly9raW5vcm9sZS5ydS91c2VyX2V2Z2VuL3B1YmxpYy8/ZHJpdmVyPWh0bWxcIj48L2lmcmFtZT5cbiAgICAgICAgICAgIDwvZGl2PmAsXG4gICAgICAgIGRlYnVnOiAxLCAgICAgICAvLyBvcHRpb25hbFxuICAgICAgICBpbklmcmFtZTogdHJ1ZSwgLy8gb3B0aW9uYWxcbiAgICB9KTtcblxuICAgIGFkVW5pdC5zaG93KGNvbnRhaW5lcik7XG59Ki9cbi8vLy8vLy8vLy8vLy8vIEhUTUwgLSBmb3IgaWZyYW1lIHRlc3QgcHVycG9zZXMgLy8vLy8vLy8vLy8vLy9cbmlmIChkcml2ZXIgPT09ICdodG1sJykge1xuICAgIGFkVW5pdCA9IG5ldyBIVE1MRHJpdmVyKHtcbiAgICAgICAgaHRtbDogYFxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDoxMDAlOyBvdmVyZmxvdzogaGlkZGVuXCI+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIj9kcml2ZXI9aW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IG92ZXJmbG93OiBoaWRkZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzb21lLWNsYXNzXCI+U29tZSB0ZXh0IHRvIHNob3cgdGhhdCB0aGUgY29kZSBpcyB3b3JraW5nPFxcL3NwYW4+XG4gICAgICAgICAgICAgICAgPFxcL2E+XG4gICAgICAgICAgICAgICAgPHNjcmlwdD5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coMSk7XG4gICAgICAgICAgICAgICAgPFxcL3NjcmlwdD5cbiAgICAgICAgICAgIDwvZGl2PmAsXG4gICAgICAgIGRlYnVnOiAxLCAgICAgICAvLyBvcHRpb25hbFxuICAgICAgICBpbklmcmFtZTogZmFsc2UsIC8vIG9wdGlvbmFsXG4gICAgfSk7XG5cbiAgICBhZFVuaXQuc2hvdyhjb250YWluZXIpO1xufVxuLy8vLy8vLy8vLy8vLy8gSW1hZ2UgLy8vLy8vLy8vLy8vLy9cbmVsc2UgaWYgKGRyaXZlciA9PT0gJ2ltYWdlJykge1xuICAgIGFkVW5pdCA9IG5ldyBJbWFnZURyaXZlcih7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vaWgwLnJlZGJ1YmJsZS5uZXQvaW1hZ2UuMjM0OTYxNjgzLjU1MTYvcmFmLDM2MHgzNjAsMDc1LHQsZmFmYWZhOmNhNDQzZjQ3ODYuanBnJyxcbiAgICAgICAgZGVidWc6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgIGluSWZyYW1lOiB0cnVlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvcHRpb25hbFxuICAgICAgICBsaW5rOiAnP2RyaXZlcj1odG1sJywgLy8gb3B0aW9uYWwsIG5leHQgYXZhaWxhYmxlIGlmIHRoZSBsaW5rIGlzIHNldFxuICAgICAgICBpbk5ld1RhYjogdHJ1ZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgdGl0bGU6ICdTb21lIHN0cmluZycsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9wdGlvbmFsXG4gICAgfSk7XG5cbiAgICBhZFVuaXQuc2hvdyhjb250YWluZXIpO1xufVxuLy8vLy8vLy8vLy8vLy8gVksgLy8vLy8vLy8vLy8vLy9cbmVsc2UgaWYgKGRyaXZlciA9PT0gJ3ZrJykge1xuICAgIGFkVW5pdCA9IG5ldyBWa0RyaXZlcih7XG4gICAgICAgIHNsb3RJZDogMTMwMzI1MyxcbiAgICAgICAgYWRTdHlsZXM6IHsgLy8gb3B0aW9uYWxcbiAgICAgICAgICAgIHdpZHRoOiAnMzAwcHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMjUwcHgnXG4gICAgICAgIH0sXG4gICAgICAgIGRlYnVnOiAxLCAgIC8vIG9wdGlvbmFsXG4gICAgfSk7XG5cbiAgICBhZFVuaXQuc2hvdyhjb250YWluZXIpO1xufVxuLy8vLy8vLy8vLy8vLy8gVksgSW5QYWdlIC8vLy8vLy8vLy8vLy8vXG5lbHNlIGlmIChkcml2ZXIgPT09ICdpbnBhZ2UnKSB7XG4gICAgYWRVbml0ID0gbmV3IFZLSW5QYWdlRHJpdmVyKHtcbiAgICAgICAgYWRTdHlsZXM6IHtcbiAgICAgICAgICAgIHdpZHRoOiAnNjQwcHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMzYwcHgnXG4gICAgICAgIH0sXG4gICAgICAgIHNsb3RJZDogMTM1MTQzNyxcbiAgICAgICAgZGVidWc6IDEsXG4gICAgfSk7XG5cbiAgICBhZFVuaXQuc2hvdyhjb250YWluZXIpO1xufVxuXG4vLy8vLy8vLy8vLy8vLyBWUEFJRCAvLy8vLy8vLy8vLy8vL1xuZWxzZSBpZiAoZHJpdmVyID09PSAndnBhaWQnKSB7XG4gICAgYWRVbml0ID0gbmV3IFZQQUlERHJpdmVyKHtcbiAgICAgICAgLy8gY29udGFpbmVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyLWZvci1hZCcpLCAvLyBvcHRpb25hbFxuICAgICAgICBoYXNoOiAnU2xwREZSRFJCTXpNMU16TkJOell3VDAxUlBRPT0nLFxuICAgICAgICB3aWRnZXRJZDogJzMzNTMnLFxuICAgICAgICBkZWJ1ZzogMSwgICAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgbG9vcDogdHJ1ZSwgICAgICAgIC8vIG9wdGlvbmFsXG4gICAgfSk7XG5cbiAgICBhZFVuaXQuc2hvdyhjb250YWluZXIpO1xufVxuLy8vLy8vLy8vLy8vLy8gVksgUmV2YXJkZWQgLy8vLy8vLy8vLy8vLy9cbmVsc2UgaWYgKGRyaXZlciA9PT0gJ3Jld2FyZGVkJykge1xuICAgIGFkVW5pdCA9IG5ldyBSZXdhcmRlZERyaXZlcih7XG4gICAgICAgIGFkczoge1xuICAgICAgICAgICAgZGVza3RvcDoge1xuICAgICAgICAgICAgICAgIGJsb2NrSWQ6IFwiUi1BLTM0MDAxNjctNFwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiZnVsbHNjcmVlblwiLFxuICAgICAgICAgICAgICAgIHBsYXRmb3JtOiBcImRlc2t0b3BcIlxuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW9iaWxlOiB7XG4gICAgICAgICAgICAgICAgYmxvY2tJZDogXCJSLUEtMzQwMDE2Ny0zXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJmdWxsc2NyZWVuXCIsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm06IFwidG91Y2hcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkZWJ1ZzogMVxuXG4gICAgfSk7XG5cbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uLmlkID0gJ2J1dHRvbic7XG4gICAgYnV0dG9uLmlubmVySFRNTCA9ICdDbGljayBtZSEnO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuICAgIGFkVW5pdC5zaG93KCcjYnV0dG9uJyk7XG59XG4vLy8vLy8vLy8vLy8vLyBQcmViaWQuanMgKG9uZSBhZCB1bml0IHBlciB0aW1lKSAvLy8vLy8vLy8vLy8vL1xuZWxzZSBpZiAoZHJpdmVyID09PSAncHJlYmlkJykge1xuXG4gICAgbGV0IHBiVXJsID0gJ2pzL3ByZWJpZC5qcyc7XG4gICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgc2NyaXB0LnNyYyA9IHBiVXJsO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblxuICAgIGxldCBhZFVuaXRDb25maWcgPSB7XG4gICAgICAgIGNvZGU6ICdkaXYtZ3B0LWFkLTMwMHgyNTBfc3RhdCcsXG4gICAgICAgIG1lZGlhVHlwZXM6IHtcbiAgICAgICAgICAgIGJhbm5lcjoge1xuICAgICAgICAgICAgICAgIHNpemVzOiBbWzMwMCwgMjUwXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYmlkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJpZGRlcjogXCJhZHJpdmVyXCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHNpdGVpZDogJzM4MScsXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudElkOiAnNjM6a2lub3JvbGVfcHJlYmlkX3N0YXRfdjInLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmlkZGVyOiBcIm15dGFyZ2V0XCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudElkOiAnMTQwMDUxMCcsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiaWRkZXI6IFwiaHlicmlkXCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogXCJiYW5uZXJcIixcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VJZDogXCI2NGY4ODBiYWI3ZWEwNjE1NjA2OWU3M2JcIixcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJpZGRlcjogJ3J0YnNhcGUnLFxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBwbGFjZUlkOiA4NjAzNDYsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiaWRkZXI6ICdidXp6b29sYScsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudElkOiAnMTI1MzY3OScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiaWRkZXI6ICdiZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgczogJzQ3MTM3MTAnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmlkZGVyOiAnb3RtJyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgdGlkOiAnNDg4ODUnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIF1cbiAgICB9O1xuXG4gICAgbGV0IHBiQ29uZmlnID0ge1xuICAgICAgICBjdXJyZW5jeToge1xuICAgICAgICAgICAgYWRTZXJ2ZXJDdXJyZW5jeTogXCJSVUJcIixcbiAgICAgICAgICAgIGdyYW51bGFyaXR5TXVsdGlwbGllcjogMSxcbiAgICAgICAgICAgIGRlZmF1bHRSYXRlczoge1xuICAgICAgICAgICAgICAgIFwiVVNEXCI6IHsgXCJSVUJcIjogOTguMzA4ODM5NTk1MDQ0IH0sXG4gICAgICAgICAgICAgICAgXCJFVVJcIjogeyBcIlJVQlwiOiAxMDUuMjkyNzc1NDQ0MzQgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmlyc3RQYXJ0eURhdGE6IHtcbiAgICAgICAgICAgIHVhSGludHM6IFtcbiAgICAgICAgICAgICAgICBcImFyY2hpdGVjdHVyZVwiLFxuICAgICAgICAgICAgICAgIFwibW9kZWxcIixcbiAgICAgICAgICAgICAgICBcInBsYXRmb3JtXCIsXG4gICAgICAgICAgICAgICAgXCJwbGF0Zm9ybVZlcnNpb25cIixcbiAgICAgICAgICAgICAgICBcImZ1bGxWZXJzaW9uTGlzdFwiXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJTeW5jOiB7XG4gICAgICAgICAgICB1c2VySWRzOiBbe1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2hhcmVkSWRcIixcbiAgICAgICAgICAgICAgICBzdG9yYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY29va2llXCIsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiX3NoYXJlZGlkXCIsXG4gICAgICAgICAgICAgICAgICAgIGV4cGlyZXM6IDE4MFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJhZHJpdmVySWRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncGFpcklkJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICByZWFsVGltZURhdGE6IHtcbiAgICAgICAgICAgIGF1Y3Rpb25EZWxheTogMTAwLFxuICAgICAgICAgICAgZGF0YVByb3ZpZGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3VzdG9tR2VvbG9jYXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ3YWl0Rm9ySXRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJhbXNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiA0Ny4yMzUwNzIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogMzkuNzk2NzM2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiAxNjk1MDIxMDMzMDI5XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaW50ZXJzZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwid2FpdEZvckl0XCI6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBlbmFibGVUSURzOiB0cnVlLFxuICAgICAgICBkZXZpY2VBY2Nlc3M6IHRydWUsXG4gICAgICAgIGFsbG93QWN0aXZpdGllczoge1xuICAgICAgICAgICAgc3luY1VzZXI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgYWxsb3c6IHRydWUgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhY2Nlc3NEZXZpY2U6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgYWxsb3c6IHRydWUgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSBcIjMwMHB4XCI7XG4gICAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IFwiMjUwcHhcIjtcblxuICAgIGxldCBhZFVuaXQgPSBuZXcgUHJlYmlkRHJpdmVyKHsgaWQ6IGFkVW5pdENvbmZpZy5jb2RlLCBjb25maWc6IGFkVW5pdENvbmZpZywgcGJDb25maWc6IHBiQ29uZmlnLCBkZWJ1ZzogMSB9KTtcbiAgICBhZFVuaXQuc2hvdyhjb250YWluZXIpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9