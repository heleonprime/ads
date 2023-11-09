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

    refresh() {
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

    refresh() {
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
  timeout = 2000;
  adUnit = null;
  requestBidsObj = null;
  preferredCurrency = 'RUB';
  unsoldRefreshTimeout = 1000;
  maxFailedRequests = 2;
  failedRequestsCount = 0;
  impressionTimeoutDuration = 2000;
  impressionTimeout = null;
  clickHandler = null;
  clickTarget = null;

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
    if (settings && settings.pbConfig) {
      this.pbConfig = settings.pbConfig;
    }
    if (settings && settings.timeout) {
      this.timeout = settings.timeout;
    }

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
    let iframe = document.createElement('iframe');
    iframe.frameBorder = '0';
    iframe.scrolling = "no";
    iframe.style = 'width:' + bid.width + 'px;height:' + bid.height + 'px;overflow:hidden';
    this.clearContainer();
    if (bid.ad) {
      this.bannerContainer.appendChild(iframe);
      let iframeDoc = iframe.contentWindow.document;
      iframeDoc.body.style = 'margin: 0;'
      iframeDoc.body.insertAdjacentHTML(position, bid.ad);
      let scripts = iframeDoc.body.querySelectorAll('script');
      if (scripts.length) {
        scripts.forEach((script) => {
          this.createScript(script);
        })
      }
    }
    else if (bid.adUrl) {
      iframe.src = bid.adUrl;
      this.bannerContainer.appendChild(iframe);
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
          this.clickHandler = this.click.bind(this)
          this.l('Click handler:', this.clickHandler);
          this.clickTarget = this.bannerContainer;
          this.l('Click target:', this.clickTarget);
          this.clickTarget.addEventListener("click", this.clickHandler);
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

  l(...args) {
    if (this.debug) console.log(...args)
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

    refresh() {
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

    refresh() {
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

    refresh() {
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

  refresh() {
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
          this.refresh();
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
      this.refresh();
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








var driver = (new URLSearchParams(window.location.search).get('driver')) ?? 'html';
var adUnit = null;
////////////// HTML //////////////
if (driver === 'html') {
    adUnit = new _drivers_html_driver__WEBPACK_IMPORTED_MODULE_0__["default"]({
        html: `
            <div style="height:100%;">
                <a href="?driver=image"
                   target="_blank"
                   style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <span class="some-class">Some text to show that the code is working<\/span>
                <\/a>
                <script>
                    console.log(1);
                <\/script>
            </div>`,
        debug: 1,       // optional
        inIframe: true, // optional
    });

    adUnit.show(document.querySelector("#ad-container"));
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

    adUnit.show(document.querySelector("#ad-container"));
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

    adUnit.show(document.querySelector("#ad-container"));
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

    adUnit.show(document.querySelector("#ad-container"));
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

    adUnit.show(document.querySelector("#ad-container"));
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

    let adUnit = new _drivers_prebid_driver__WEBPACK_IMPORTED_MODULE_2__["default"]({ id: adUnitConfig.code, config: adUnitConfig, pbConfig: pbConfig });
    adUnit.show(document.querySelector("#ad-container"));
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ3JOZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9CLGlCQUFpQixlQUFlO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUIsNkJBQTZCO0FBQzdCLDhCQUE4QjtBQUM5QixtQ0FBbUM7QUFDbkMsOEJBQThCO0FBQzlCO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QXdCO0FBQ2pEO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsOERBQVksR0FBRyxpRUFBaUU7QUFDckc7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Fkcy8uL3NyYy9kcml2ZXJzL2h0bWxfZHJpdmVyLmpzIiwid2VicGFjazovL2Fkcy8uL3NyYy9kcml2ZXJzL2ltYWdlX2RyaXZlci5qcyIsIndlYnBhY2s6Ly9hZHMvLi9zcmMvZHJpdmVycy9wcmViaWRfZHJpdmVyLmpzIiwid2VicGFjazovL2Fkcy8uL3NyYy9kcml2ZXJzL3Jld2FyZGVkX2RyaXZlci5qcyIsIndlYnBhY2s6Ly9hZHMvLi9zcmMvZHJpdmVycy92a19kcml2ZXIuanMiLCJ3ZWJwYWNrOi8vYWRzLy4vc3JjL2RyaXZlcnMvdmtfaW5wYWdlX2RyaXZlci5qcyIsIndlYnBhY2s6Ly9hZHMvLi9zcmMvZHJpdmVycy92cGFpZF9kcml2ZXIuanMiLCJ3ZWJwYWNrOi8vYWRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Fkcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYWRzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYWRzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYWRzLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEhUTUxEcml2ZXIge1xyXG4gICAgZGVidWcgPSAwO1xyXG4gICAgZGVidWdMYWJlbCA9IFwiJWNNUFNVIEhUTUwgRHJpdmVyXCI7XHJcbiAgICBkZWJ1Z1N0eWxlcyA9IFwiY29sb3I6d2hpdGU7IGJhY2tncm91bmQtY29sb3I6ICMzZjhiZTg7IHBhZGRpbmc6IDJweCA1cHg7IGJvcmRlci1yYWRpdXM6IDNweDtcIjtcclxuICAgIGRlYnVnR3JvdXBPcGVuZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb250YWluZXIgPSBudWxsO1xyXG5cclxuICAgIGh0bWwgPSAnJztcclxuICAgIGluSWZyYW1lID0gZmFsc2U7XHJcbiAgICBpZnJhbWUgPSBudWxsO1xyXG5cclxuICAgIGltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24gPSAyMDAwO1xyXG4gICAgaW1wcmVzc2lvblRpbWVvdXQgPSBudWxsO1xyXG5cclxuICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgaWZyYW1lU3R5bGVzOiB7XHJcbiAgICAgICAgICAgIGJvcmRlcjogJzAnLFxyXG4gICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjbGlja0hhbmRsZXIgPSBudWxsO1xyXG4gICAgY2xpY2tUYXJnZXQgPSBudWxsO1xyXG5cclxuICAgIHNjcmlwdHNMb2FkZWQgPSB7fTtcclxuXHJcbiAgICBjb2RlUG9zaXRpb24gPSAnYmVmb3JlZW5kJztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgZXZlbnRzKSB7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdkZWJ1ZycpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnY29udGFpbmVyJyk7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdodG1sJyk7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdpbklmcmFtZScpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnaW1wcmVzc2lvblRpbWVvdXREdXJhdGlvbicpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50cyhldmVudHMpXHJcbiAgICAgICAgdGhpcy5tZXJnZU9wdGlvbnMoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE9wdGlvbihzLCBvKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzW29dICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aGlzW29dID0gc1tvXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW1wcmVzc2lvblRpbWVvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5pbXByZXNzaW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0ltcHJlc3Npb24gVGltZW91dCBmaXJlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkltcHJlc3Npb24oKTtcclxuICAgICAgICB9LCB0aGlzLmltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGRyb3Aob25FdmVudCA9IGZhbHNlKSB7XHJcbiAgICAgICAgLy90aGlzLiA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RXZlbnRzID0gKGV2ZW50cykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50c0RlZmF1bHQgPSB7XHJcbiAgICAgICAgICAgIG9uQ2xvc2U6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25TdG9wOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uRXJyb3I6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25JbXByZXNzaW9uOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHsgfSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7IC4uLmV2ZW50c0RlZmF1bHQsIC4uLmV2ZW50cyB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0dGluZ3MgXHJcblxyXG4gICAgbWVyZ2VPcHRpb25zKG8xLCBvMikge1xyXG4gICAgICAgIHRoaXMubCgnT3B0aW9ucyBhcmUgb2JqZWN0JywgdGhpcy5pc09iamVjdChvMikpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzT2JqZWN0KG8yKSlcclxuICAgICAgICAgICAgbzEgPSB7XHJcbiAgICAgICAgICAgICAgICAuLi5vMSxcclxuICAgICAgICAgICAgICAgIC4uLm8yXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB0aGlzLmwoJ09wdGlvbnM6ICcsIG8xKTtcclxuICAgICAgICByZXR1cm4gbzE7XHJcbiAgICB9XHJcbiAgICBpc09iamVjdChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBlID09PSAnb2JqZWN0JyAmJlxyXG4gICAgICAgICAgICAhQXJyYXkuaXNBcnJheShlKSAmJlxyXG4gICAgICAgICAgICBlICE9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coY29udGFpbmVyKSB7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lcikgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvbnRhaW5lcigpO1xyXG4gICAgICAgIHRoaXMuYWRkQ29kZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0SW1wcmVzc2lvblRpbWVvdXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckNvbnRhaW5lcigpIHtcclxuICAgICAgICB0aGlzLmwoJ0NsZWFyaW5nIGNvbnRhaW5lcicpO1xyXG4gICAgICAgIHRoaXMubCh0aGlzLmNsaWNrVGFyZ2V0KTtcclxuICAgICAgICB0aGlzLmwodGhpcy5jbGlja0hhbmRsZXIpO1xyXG4gICAgICAgIGlmICh0aGlzLmNsaWNrVGFyZ2V0ICYmIHRoaXMuY2xpY2tIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuY29udGFpbmVyKTtcclxuICAgICAgICBpZiAodGhpcy5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5ldmVudHMub25TdG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaCgpIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29kZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb250YWluZXIgJiYgdGhpcy5odG1sKSB7XHJcbiAgICAgICAgICAgIGxldCBjO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pbklmcmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SWZyYW1lU3R5bGVzKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmlmcmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjID0gdGhpcy5pZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICAgICAgYy5zdHlsZS5tYXJnaW4gPSAnMCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjID0gdGhpcy5jb250YWluZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYy5pbnNlcnRBZGphY2VudEhUTUwodGhpcy5jb2RlUG9zaXRpb24sIHRoaXMuaHRtbCk7XHJcbiAgICAgICAgICAgIGxldCBzY3JpcHRzID0gYy5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgaWYgKHNjcmlwdHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBzY3JpcHRzLmZvckVhY2goKHNjcmlwdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjcmVhdGVTY3JpcHQoc2NyaXB0KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jbGlja0hhbmRsZXIgPSB0aGlzLmNsaWNrLmJpbmQodGhpcylcclxuICAgICAgICAgICAgdGhpcy5sKCdDbGljayBoYW5kbGVyOicsIHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5jbGlja1RhcmdldCA9IGM7IC8vdGhpcy5pZnJhbWUgPz8gdGhpcy5jb250YWluZXI7XHJcbiAgICAgICAgICAgIHRoaXMubCgnQ2xpY2sgdGFyZ2V0OicsIHRoaXMuY2xpY2tUYXJnZXQpO1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrVGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldElmcmFtZVN0eWxlcygpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmlmcmFtZVN0eWxlcykge1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuaWZyYW1lU3R5bGVzKS5mb3JFYWNoKChrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlmcmFtZS5zdHlsZVtrXSA9IHRoaXMub3B0aW9ucy5pZnJhbWVTdHlsZXNba107XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb3B5QXR0cmlidXRlcyhzb3VyY2UsIHRhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHNvdXJjZS5hdHRyaWJ1dGVzKS5mb3JFYWNoKGF0dHJpYnV0ZSA9PiB7XHJcbiAgICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUubm9kZU5hbWUgPT09ICdpZCcgPyAnZGF0YS1pZCcgOiBhdHRyaWJ1dGUubm9kZU5hbWUsXHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUubm9kZVZhbHVlLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlY3JlYXRlU2NyaXB0KHNjcmlwdCkge1xyXG4gICAgICAgIGxldCBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgdGhpcy5jb3B5QXR0cmlidXRlcyhzY3JpcHQsIHMpO1xyXG4gICAgICAgIHNjcmlwdC5iZWZvcmUocyk7XHJcbiAgICAgICAgcy5pbm5lckhUTUwgPSBzY3JpcHQuaW5uZXJIVE1MO1xyXG4gICAgICAgIHNjcmlwdC5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGljaygpIHtcclxuICAgICAgICB0aGlzLmwoJ0NsaWNrIGV2ZW50IGZpcmVkJylcclxuICAgICAgICB0aGlzLmV2ZW50cy5vbkNsaWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGVidWdcclxuXHJcbiAgICBsKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZGVidWdHcm91cE9wZW5lZClcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZGVidWdMYWJlbCwgdGhpcy5kZWJ1Z1N0eWxlcywgLi4uYXJncyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZyhsYWJlbCA9IFwiXCIpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1ZyAmJiAhdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVidWdHcm91cE9wZW5lZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQodGhpcy5kZWJ1Z0xhYmVsLCB0aGlzLmRlYnVnU3R5bGVzLCBsYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxnZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1ZyAmJiB0aGlzLmRlYnVnR3JvdXBPcGVuZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZURyaXZlciB7XHJcbiAgICBkZWJ1ZyA9IDA7XHJcbiAgICBkZWJ1Z0xhYmVsID0gXCIlY01QU1UgSW1hZ2UgRHJpdmVyXCI7XHJcbiAgICBkZWJ1Z1N0eWxlcyA9IFwiY29sb3I6d2hpdGU7IGJhY2tncm91bmQtY29sb3I6ICMzZjhiZTg7IHBhZGRpbmc6IDJweCA1cHg7IGJvcmRlci1yYWRpdXM6IDNweDtcIjtcclxuICAgIGRlYnVnR3JvdXBPcGVuZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb250YWluZXIgPSBudWxsO1xyXG5cclxuICAgIHVybCA9ICcnO1xyXG4gICAgbGluayA9IG51bGw7XHJcbiAgICB0aXRsZSA9IG51bGw7XHJcbiAgICBpbk5ld1RhYiA9IGZhbHNlO1xyXG4gICAgaW5JZnJhbWUgPSBmYWxzZTtcclxuICAgIGlmcmFtZSA9IG51bGw7XHJcblxyXG4gICAgaW1wcmVzc2lvblRpbWVvdXREdXJhdGlvbiA9IDIwMDA7XHJcbiAgICBpbXByZXNzaW9uVGltZW91dCA9IG51bGw7XHJcblxyXG4gICAgb3B0aW9ucyA9IHtcclxuICAgICAgICBpZnJhbWVTdHlsZXM6IHtcclxuICAgICAgICAgICAgYm9yZGVyOiAnMCcsXHJcbiAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcclxuICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGltYWdlU3R5bGVzOiB7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY2xpY2tIYW5kbGVyID0gbnVsbDtcclxuICAgIGNsaWNrVGFyZ2V0ID0gbnVsbDtcclxuXHJcbiAgICBzY3JpcHRzTG9hZGVkID0ge307XHJcblxyXG4gICAgY29kZVBvc2l0aW9uID0gJ2JlZm9yZWVuZCc7XHJcblxyXG4gICAgaW1hZ2UgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBldmVudHMpIHtcclxuICAgICAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ2RlYnVnJyk7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdjb250YWluZXInKTtcclxuICAgICAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ3VybCcpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnaW5JZnJhbWUnKTtcclxuICAgICAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ2xpbmsnKTtcclxuICAgICAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ2luTmV3VGFiJyk7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICd0aXRsZScpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnaW1wcmVzc2lvblRpbWVvdXREdXJhdGlvbicpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEV2ZW50cyhldmVudHMpO1xyXG4gICAgICAgIHRoaXMubWVyZ2VPcHRpb25zKHNldHRpbmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRPcHRpb24ocywgbykge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc1tvXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhpc1tvXSA9IHNbb107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEltcHJlc3Npb25UaW1lb3V0KCkge1xyXG4gICAgICAgIHRoaXMuaW1wcmVzc2lvblRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKCdJbXByZXNzaW9uIFRpbWVvdXQgZmlyZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMub25JbXByZXNzaW9uKCk7XHJcbiAgICAgICAgfSwgdGhpcy5pbXByZXNzaW9uVGltZW91dER1cmF0aW9uKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJvcChvbkV2ZW50ID0gZmFsc2UpIHtcclxuICAgICAgICAvL3RoaXMuID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFdmVudHMgPSAoZXZlbnRzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZXZlbnRzRGVmYXVsdCA9IHtcclxuICAgICAgICAgICAgb25DbG9zZTogKCkgPT4geyB9LFxyXG4gICAgICAgICAgICBvblN0b3A6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25FcnJvcjogKCkgPT4geyB9LFxyXG4gICAgICAgICAgICBvbkltcHJlc3Npb246ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25DbGljazogKCkgPT4geyB9LFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmV2ZW50cyA9IHsgLi4uZXZlbnRzRGVmYXVsdCwgLi4uZXZlbnRzIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBTZXR0aW5ncyBcclxuXHJcbiAgICBtZXJnZU9wdGlvbnMobzEsIG8yKSB7XHJcbiAgICAgICAgdGhpcy5sKCdPcHRpb25zIGFyZSBvYmplY3QnLCB0aGlzLmlzT2JqZWN0KG8yKSk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNPYmplY3QobzIpKVxyXG4gICAgICAgICAgICBvMSA9IHtcclxuICAgICAgICAgICAgICAgIC4uLm8xLFxyXG4gICAgICAgICAgICAgICAgLi4ubzJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubCgnT3B0aW9uczogJywgbzEpO1xyXG4gICAgICAgIHJldHVybiBvMTtcclxuICAgIH1cclxuICAgIGlzT2JqZWN0KGUpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGUgPT09ICdvYmplY3QnICYmXHJcbiAgICAgICAgICAgICFBcnJheS5pc0FycmF5KGUpICYmXHJcbiAgICAgICAgICAgIGUgIT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdyhjb250YWluZXIpIHtcclxuICAgICAgICBpZiAoY29udGFpbmVyKSB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5hZGRDb2RlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRJbXByZXNzaW9uVGltZW91dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyQ29udGFpbmVyKCkge1xyXG4gICAgICAgIHRoaXMubCgnQ2xlYXJpbmcgY29udGFpbmVyJyk7XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuY2xpY2tUYXJnZXQpO1xyXG4gICAgICAgIHRoaXMubCh0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xpY2tUYXJnZXQgJiYgdGhpcy5jbGlja0hhbmRsZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGlja1RhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jbGlja0hhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmwodGhpcy5jb250YWluZXIpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5vblN0b3AoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb2RlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciAmJiB0aGlzLnVybCkge1xyXG4gICAgICAgICAgICBsZXQgYyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmluSWZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJZnJhbWVTdHlsZXMoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuaWZyYW1lKTtcclxuICAgICAgICAgICAgICAgIGMgPSB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgICAgICBjLnN0eWxlLm1hcmdpbiA9ICcwJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGMgPSB0aGlzLmNvbnRhaW5lcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHRhcmdldCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2Uuc3JjID0gdGhpcy51cmw7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5saW5rKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IHRoaXMubGluaztcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluTmV3VGFiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluay50YXJnZXQgPSBcIl9ibGFua1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsucmVsID0gXCJub29wZW5lciBub3JlZmVycmVyXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50aXRsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsudGl0bGUgPSB0aGlzLnRpdGxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGluay5hcHBlbmRDaGlsZCh0aGlzLmltYWdlKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldCA9IGxpbms7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB0aGlzLmltYWdlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmwoYyk7XHJcbiAgICAgICAgICAgIGMuYXBwZW5kQ2hpbGQodGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tIYW5kbGVyID0gdGhpcy5jbGljay5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIHRoaXMubCgnQ2xpY2sgaGFuZGxlcjonLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tUYXJnZXQgPSBjOyAvL3RoaXMuaWZyYW1lID8/IHRoaXMuY29udGFpbmVyO1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0NsaWNrIHRhcmdldDonLCB0aGlzLmNsaWNrVGFyZ2V0KTtcclxuICAgICAgICAgICAgdGhpcy5jbGlja1RhcmdldC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jbGlja0hhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRJZnJhbWVTdHlsZXMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pZnJhbWVTdHlsZXMpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmlmcmFtZVN0eWxlcykuZm9yRWFjaCgoaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pZnJhbWUuc3R5bGVba10gPSB0aGlzLm9wdGlvbnMuaWZyYW1lU3R5bGVzW2tdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xpY2soKSB7XHJcbiAgICAgICAgdGhpcy5sKCdDbGljayBldmVudCBmaXJlZCcpXHJcbiAgICAgICAgdGhpcy5ldmVudHMub25DbGljaygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERlYnVnXHJcblxyXG4gICAgbCguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVidWcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmRlYnVnR3JvdXBPcGVuZWQpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRlYnVnTGFiZWwsIHRoaXMuZGVidWdTdHlsZXMsIC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGcobGFiZWwgPSBcIlwiKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVidWcgJiYgIXRoaXMuZGVidWdHcm91cE9wZW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlYnVnR3JvdXBPcGVuZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKHRoaXMuZGVidWdMYWJlbCwgdGhpcy5kZWJ1Z1N0eWxlcywgbGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZ2UoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGVidWcgJiYgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVidWdHcm91cE9wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlYmlkRHJpdmVyIHtcclxuICBhZFVuaXRJZCA9IG51bGw7XHJcbiAgcGFyZW50Q29udGFpbmVyID0gbnVsbDtcclxuICBiYW5uZXJDb250YWluZXIgPSBudWxsO1xyXG4gIGRlYnVnID0gMDtcclxuICB0aW1lb3V0ID0gMjAwMDtcclxuICBhZFVuaXQgPSBudWxsO1xyXG4gIHJlcXVlc3RCaWRzT2JqID0gbnVsbDtcclxuICBwcmVmZXJyZWRDdXJyZW5jeSA9ICdSVUInO1xyXG4gIHVuc29sZFJlZnJlc2hUaW1lb3V0ID0gMTAwMDtcclxuICBtYXhGYWlsZWRSZXF1ZXN0cyA9IDI7XHJcbiAgZmFpbGVkUmVxdWVzdHNDb3VudCA9IDA7XHJcbiAgaW1wcmVzc2lvblRpbWVvdXREdXJhdGlvbiA9IDIwMDA7XHJcbiAgaW1wcmVzc2lvblRpbWVvdXQgPSBudWxsO1xyXG4gIGNsaWNrSGFuZGxlciA9IG51bGw7XHJcbiAgY2xpY2tUYXJnZXQgPSBudWxsO1xyXG5cclxuICBwYkNvbmZpZyA9IHtcclxuICAgIGN1cnJlbmN5OiB7XHJcbiAgICAgIGFkU2VydmVyQ3VycmVuY3k6IFwiUlVCXCIsXHJcbiAgICAgIGdyYW51bGFyaXR5TXVsdGlwbGllcjogMSxcclxuICAgICAgZGVmYXVsdFJhdGVzOiB7XHJcbiAgICAgICAgXCJVU0RcIjogeyBcIlJVQlwiOiA5Ni4yMSB9LFxyXG4gICAgICAgIFwiRVVSXCI6IHsgXCJSVUJcIjogMTAyLjgwIH0sXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBmaXJzdFBhcnR5RGF0YToge1xyXG4gICAgICB1YUhpbnRzOiBbXHJcbiAgICAgICAgXCJhcmNoaXRlY3R1cmVcIixcclxuICAgICAgICBcIm1vZGVsXCIsXHJcbiAgICAgICAgXCJwbGF0Zm9ybVwiLFxyXG4gICAgICAgIFwicGxhdGZvcm1WZXJzaW9uXCIsXHJcbiAgICAgICAgXCJmdWxsVmVyc2lvbkxpc3RcIlxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgdXNlclN5bmM6IHtcclxuICAgICAgdXNlcklkczogW3tcclxuICAgICAgICBuYW1lOiBcInNoYXJlZElkXCIsXHJcbiAgICAgICAgc3RvcmFnZToge1xyXG4gICAgICAgICAgdHlwZTogXCJjb29raWVcIixcclxuICAgICAgICAgIG5hbWU6IFwiX3NoYXJlZGlkXCIsXHJcbiAgICAgICAgICBleHBpcmVzOiAxODBcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcImFkcml2ZXJJZFwiXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAncGFpcklkJ1xyXG4gICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZWFsVGltZURhdGE6IHtcclxuICAgICAgYXVjdGlvbkRlbGF5OiAxMDAsXHJcbiAgICAgIGRhdGFQcm92aWRlcnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJpbnRlcnNlY3Rpb25cIixcclxuICAgICAgICAgIFwid2FpdEZvckl0XCI6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gICAgZW5hYmxlVElEczogdHJ1ZSxcclxuICAgIGRldmljZUFjY2VzczogdHJ1ZSxcclxuICAgIGFsbG93QWN0aXZpdGllczoge1xyXG4gICAgICBzeW5jVXNlcjoge1xyXG4gICAgICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgIHsgYWxsb3c6IHRydWUgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgYWNjZXNzRGV2aWNlOiB7XHJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgeyBhbGxvdzogdHJ1ZSB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGV2ZW50cykge1xyXG4gICAgaWYgKCFzZXR0aW5ncy5pZCkge1xyXG4gICAgICB0aGlzLmwoXCJObyBBZCB1bml0IElEIHNldCBmb3IgUHJlYmlkIGRyaXZlclwiKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hZFVuaXRJZCA9IHNldHRpbmdzLmlkO1xyXG4gICAgaWYgKCFzZXR0aW5ncy5jb25maWcpIHtcclxuICAgICAgdGhpcy5sKHRoaXMuYWRVbml0SWQgKyBcIiBObyBBZCB1bml0IFByZWJpZCBjb25maWcgZm91bmRcIik7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHRoaXMuYWRVbml0ID0gc2V0dGluZ3MuY29uZmlnO1xyXG4gICAgaWYgKHNldHRpbmdzICYmIHNldHRpbmdzLnBiQ29uZmlnKSB7XHJcbiAgICAgIHRoaXMucGJDb25maWcgPSBzZXR0aW5ncy5wYkNvbmZpZztcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncyAmJiBzZXR0aW5ncy50aW1lb3V0KSB7XHJcbiAgICAgIHRoaXMudGltZW91dCA9IHNldHRpbmdzLnRpbWVvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuZ2V0KCdwYmpzX2RlYnVnJykgPT0gJ3RydWUnKVxyXG4gICAgICB0aGlzLmRlYnVnID0gMTtcclxuXHJcbiAgICB0aGlzLnJlcXVlc3RCaWRzT2JqID0ge1xyXG4gICAgICB0aW1lb3V0OiB0aGlzLnRpbWVvdXQsXHJcbiAgICAgIGJpZHNCYWNrSGFuZGxlcjogdGhpcy5yZXNwb25zZUhhbmRsZXIuYmluZCh0aGlzKVxyXG4gICAgfTtcclxuXHJcbiAgICB3aW5kb3cucGJqcyA9IHdpbmRvdy5wYmpzIHx8IHt9O1xyXG4gICAgd2luZG93LnBianMucXVlID0gd2luZG93LnBianMucXVlIHx8IFtdO1xyXG5cclxuICAgIHdpbmRvdy5wYmpzLnF1ZS5wdXNoKCgpID0+IHtcclxuICAgICAgd2luZG93LnBianMuc2V0Q29uZmlnKHRoaXMucGJDb25maWcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5zZXRFdmVudHMoZXZlbnRzKVxyXG4gIH1cclxuXHJcbiAgc2V0RXZlbnRzID0gKGV2ZW50cykgPT4ge1xyXG4gICAgY29uc3QgZXZlbnRzRGVmYXVsdCA9IHtcclxuICAgICAgb25DbG9zZTogKCkgPT4geyB9LFxyXG4gICAgICBvblN0b3A6ICgpID0+IHsgfSxcclxuICAgICAgb25FcnJvcjogKCkgPT4geyB9LFxyXG4gICAgICBvbkltcHJlc3Npb246ICgpID0+IHsgfSxcclxuICAgICAgb25DbGljazogKCkgPT4geyB9LFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZXZlbnRzID0geyAuLi5ldmVudHNEZWZhdWx0LCAuLi5ldmVudHMgfVxyXG4gIH1cclxuXHJcbiAgc2V0SW1wcmVzc2lvblRpbWVvdXQoKSB7XHJcbiAgICB0aGlzLmltcHJlc3Npb25UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMubCgnSW1wcmVzc2lvbiBUaW1lb3V0IGZpcmVkJyk7XHJcbiAgICAgIHRoaXMuZXZlbnRzLm9uSW1wcmVzc2lvbigpO1xyXG4gICAgfSwgdGhpcy5pbXByZXNzaW9uVGltZW91dER1cmF0aW9uKTtcclxuICB9XHJcblxyXG4gIHNob3cocGFyZW50Q29udGFpbmVyKSB7XHJcbiAgICBpZiAocGFyZW50Q29udGFpbmVyKVxyXG4gICAgICB0aGlzLnBhcmVudENvbnRhaW5lciA9IHBhcmVudENvbnRhaW5lcjtcclxuXHJcbiAgICBpZiAoIXRoaXMucGFyZW50Q29udGFpbmVyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuYWRVbml0SWQgKyBcIiBDb250YWluZXIgaXMgbm90IGF2YWlsYWJsZSBmb3IgdGhpcyBiYW5uZXIsIGNhbid0IHNob3dcIik7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHRoaXMuYmFubmVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLmJhbm5lckNvbnRhaW5lci5pZCA9IHRoaXMuYWRVbml0SWQ7XHJcbiAgICB0aGlzLnBhcmVudENvbnRhaW5lci5hcHBlbmQodGhpcy5iYW5uZXJDb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMucmVxdWVzdEJpZHMoKTtcclxuICB9XHJcblxyXG4gIGhpZGUoKSB7XHJcbiAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICB0aGlzLmV2ZW50cy5vblN0b3AoKTtcclxuICB9XHJcblxyXG4gIGNsZWFyQ29udGFpbmVyKCkge1xyXG4gICAgdGhpcy5sKCdDbGVhcmluZyBjb250YWluZXInKTtcclxuICAgIHRoaXMubCh0aGlzLmNsaWNrVGFyZ2V0KTtcclxuICAgIHRoaXMubCh0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICBpZiAodGhpcy5jbGlja1RhcmdldCAmJiB0aGlzLmNsaWNrSGFuZGxlcikge1xyXG4gICAgICB0aGlzLmNsaWNrVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICB0aGlzLmwodGhpcy5jb250YWluZXIpO1xyXG4gICAgaWYgKHRoaXMuYmFubmVyQ29udGFpbmVyKSB7XHJcbiAgICAgIHRoaXMuYmFubmVyQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWZyZXNoKCkge1xyXG4gICAgdGhpcy5yZXF1ZXN0QmlkcygpO1xyXG4gIH1cclxuXHJcbiAgcmVxdWVzdEJpZHMoKSB7XHJcbiAgICB0aGlzLmwodGhpcy5hZFVuaXRJZCArICcgUmVxdWVzdGluZyBiaWRzJyk7XHJcbiAgICB3aW5kb3cucGJqcy5xdWUucHVzaCgoKSA9PiB7XHJcbiAgICAgIHdpbmRvdy5wYmpzLmFkZEFkVW5pdHMoW3RoaXMuYWRVbml0XSk7XHJcbiAgICAgIHdpbmRvdy5wYmpzLnJlcXVlc3RCaWRzKHRoaXMucmVxdWVzdEJpZHNPYmopO1xyXG4gICAgICB3aW5kb3cucGJqcy5yZW1vdmVBZFVuaXQodGhpcy5hZFVuaXQuY29kZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZENvZGUoYmlkLCBwb3NpdGlvbiA9ICdiZWZvcmVlbmQnKSB7XHJcbiAgICB0aGlzLmwodGhpcy5hZFVuaXRJZCArICcgYWRkaW5nIGNvZGUnKTtcclxuICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAgIGlmcmFtZS5mcmFtZUJvcmRlciA9ICcwJztcclxuICAgIGlmcmFtZS5zY3JvbGxpbmcgPSBcIm5vXCI7XHJcbiAgICBpZnJhbWUuc3R5bGUgPSAnd2lkdGg6JyArIGJpZC53aWR0aCArICdweDtoZWlnaHQ6JyArIGJpZC5oZWlnaHQgKyAncHg7b3ZlcmZsb3c6aGlkZGVuJztcclxuICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgIGlmIChiaWQuYWQpIHtcclxuICAgICAgdGhpcy5iYW5uZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcclxuICAgICAgbGV0IGlmcmFtZURvYyA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xyXG4gICAgICBpZnJhbWVEb2MuYm9keS5zdHlsZSA9ICdtYXJnaW46IDA7J1xyXG4gICAgICBpZnJhbWVEb2MuYm9keS5pbnNlcnRBZGphY2VudEhUTUwocG9zaXRpb24sIGJpZC5hZCk7XHJcbiAgICAgIGxldCBzY3JpcHRzID0gaWZyYW1lRG9jLmJvZHkucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0Jyk7XHJcbiAgICAgIGlmIChzY3JpcHRzLmxlbmd0aCkge1xyXG4gICAgICAgIHNjcmlwdHMuZm9yRWFjaCgoc2NyaXB0KSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNyZWF0ZVNjcmlwdChzY3JpcHQpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGJpZC5hZFVybCkge1xyXG4gICAgICBpZnJhbWUuc3JjID0gYmlkLmFkVXJsO1xyXG4gICAgICB0aGlzLmJhbm5lckNvbnRhaW5lci5hcHBlbmRDaGlsZChpZnJhbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjb3B5QXR0cmlidXRlcyhzb3VyY2UsIHRhcmdldCkge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20oc291cmNlLmF0dHJpYnV0ZXMpLmZvckVhY2goYXR0cmlidXRlID0+IHtcclxuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcclxuICAgICAgICBhdHRyaWJ1dGUubm9kZU5hbWUsXHJcbiAgICAgICAgYXR0cmlidXRlLm5vZGVWYWx1ZSxcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBjcmVhdGVTY3JpcHQoc2NyaXB0KSB7XHJcbiAgICBsZXQgcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgdGhpcy5jb3B5QXR0cmlidXRlcyhzY3JpcHQsIHMpO1xyXG4gICAgc2NyaXB0LmJlZm9yZShzKTtcclxuICAgIHMuaW5uZXJIVE1MID0gc2NyaXB0LmlubmVySFRNTDtcclxuICAgIHNjcmlwdC5yZW1vdmUoKTtcclxuICB9XHJcblxyXG4gIHJlc3BvbnNlSGFuZGxlcihiaWRSZXNwb25zZXMpIHtcclxuICAgIHRoaXMubCh0aGlzLmFkVW5pdElkICsgJyBSZXNwb25zZXMgcmVjaWV2ZWQ6JywgYmlkUmVzcG9uc2VzKTtcclxuICAgIGxldCBhZFVuaXRzSWRzID0gT2JqZWN0LmtleXMoYmlkUmVzcG9uc2VzKTtcclxuICAgIGlmIChhZFVuaXRzSWRzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmZhaWxlZFJlcXVlc3RzQ291bnQgPSAwO1xyXG4gICAgICBhZFVuaXRzSWRzLmZvckVhY2goKGFkVW5pdElkKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgd2lubmluZ0JpZCA9IGJpZFJlc3BvbnNlc1thZFVuaXRJZF0uYmlkcy5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpID0+IChwcmV2LmNwbSA+IGN1cnJlbnQuY3BtID8gcHJldiA6IGN1cnJlbnQpKTtcclxuICAgICAgICB0aGlzLmwodGhpcy5hZFVuaXRJZCArICcgV2lubmluZyBiaWQ6Jywgd2lubmluZ0JpZCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJhbm5lckNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdGhpcy5hZGRDb2RlKHdpbm5pbmdCaWQpO1xyXG4gICAgICAgICAgdGhpcy5zZXRJbXByZXNzaW9uVGltZW91dCgpO1xyXG4gICAgICAgICAgdGhpcy5jbGlja0hhbmRsZXIgPSB0aGlzLmNsaWNrLmJpbmQodGhpcylcclxuICAgICAgICAgIHRoaXMubCgnQ2xpY2sgaGFuZGxlcjonLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICAgICAgICB0aGlzLmNsaWNrVGFyZ2V0ID0gdGhpcy5iYW5uZXJDb250YWluZXI7XHJcbiAgICAgICAgICB0aGlzLmwoJ0NsaWNrIHRhcmdldDonLCB0aGlzLmNsaWNrVGFyZ2V0KTtcclxuICAgICAgICAgIHRoaXMuY2xpY2tUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmwodGhpcy5hZFVuaXRJZCArIFwiIE5vIGNvbnRhaW5lciB3aXRoIEFkIHVuaXQgSUQgaW4gRE9NXCIpO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5mYWlsZWRSZXF1ZXN0c0NvdW50Kys7XHJcbiAgICAgIHRoaXMubCh0aGlzLmFkVW5pdElkICsgJyBObyBiaWRzIHJlY2lldmVkJyk7XHJcbiAgICAgIGlmICh0aGlzLmZhaWxlZFJlcXVlc3RzQ291bnQgPj0gdGhpcy5tYXhGYWlsZWRSZXF1ZXN0cykge1xyXG4gICAgICAgIHRoaXMuZmFpbGVkUmVxdWVzdHNDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuYWRVbml0SWQgKyAnIEFscmVhZHkgdHJpZWQgcmVmcmVzaC4gRmFpbGVkIGFnYWluLiBRdWl0Jyk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuYWRVbml0SWQgKyAnIFdpbGwgcmV0cnkgaW4gJyArICh0aGlzLnVuc29sZFJlZnJlc2hUaW1lb3V0IC8gMTAwMCkgKyAnc2VjJyk7XHJcbiAgICAgICAgbGV0IF9zZWxmID0gdGhpcztcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMubCh0aGlzLmFkVW5pdElkICsgJyBSZWZyZXNoaW5nIG5vdyEnKTtcclxuICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgIH0sIHRoaXMudW5zb2xkUmVmcmVzaFRpbWVvdXQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbGljaygpIHtcclxuICAgIHRoaXMubCgnQ2xpY2sgZXZlbnQgZmlyZWQnKVxyXG4gICAgdGhpcy5ldmVudHMub25DbGljaygpO1xyXG4gIH1cclxuXHJcbiAgbCguLi5hcmdzKSB7XHJcbiAgICBpZiAodGhpcy5kZWJ1ZykgY29uc29sZS5sb2coLi4uYXJncylcclxuICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBSZXdhcmRlZERyaXZlciB7XHJcbiAgICBkZWJ1ZyA9IDA7XHJcbiAgICBkZWJ1Z0xhYmVsID0gXCIlY01QU1UgWWFuZGV4IFJld2FyZGVkIERyaXZlclwiO1xyXG4gICAgZGVidWdTdHlsZXMgPSBcImNvbG9yOndoaXRlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjM2Y4YmU4OyBwYWRkaW5nOiAycHggNXB4OyBib3JkZXItcmFkaXVzOiAzcHg7XCI7XHJcbiAgICBkZWJ1Z0dyb3VwT3BlbmVkID0gZmFsc2U7XHJcblxyXG4gICAgc2VsZWN0b3IgPSBudWxsO1xyXG4gICAgYnV0dG9uID0gbnVsbDtcclxuICAgIGJ0bkV2ZW50ID0gbnVsbDtcclxuXHJcbiAgICBvcHRpb25zID0ge307XHJcblxyXG4gICAgc2NyaXB0c0xvYWRlZCA9IHt9O1xyXG4gICAgc2RrVVJMID0gJ2h0dHBzOi8veWFuZGV4LnJ1L2Fkcy9zeXN0ZW0vY29udGV4dC5qcyc7XHJcbiAgICBzdGF0dXMgPSAnY3JlYXRlZCc7XHJcbiAgICB0aW1lb3V0ID0gNTAwMDtcclxuXHJcbiAgICBpbXByZXNzaW9uVGltZW91dER1cmF0aW9uID0gMjAwMDtcclxuICAgIGltcHJlc3Npb25UaW1lb3V0ID0gbnVsbDtcclxuXHJcbiAgICBidXR0b25FdmVudHMgPSB7XHJcbiAgICAgICAgb25SZXdhcmRlZDogKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubCgnU3VjY2Vzc2Z1bGx5IHJld2FyZGVkJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdyZXdhcmRlZCc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5vblJld2FyZGVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmwoJ1VzZXIgaGFzIGNhbmNlbGxlZCB0aGUgYWQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2NhbmNlbGxlZCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ldmVudHMub25DbG9zZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uUmVuZGVyOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ3JlbmRlcmVkJztcclxuICAgICAgICAgICAgdGhpcy5sKCdBZCByZW5kZXJlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEltcHJlc3Npb25UaW1lb3V0KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkVycm9yOiAoZCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdlcnJvcic7XHJcbiAgICAgICAgICAgIHRoaXMubCgnRXJyb3I6JywgZCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLm9uRXJyb3IoKTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfSxcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgZXZlbnRzKSB7XHJcbiAgICAgICAgdGhpcy5kZWJ1ZyA9IHNldHRpbmdzPy5kZWJ1ZyA/PyAwXHJcbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IHNldHRpbmdzPy5zZWxlY3RvciA/PyBudWxsO1xyXG5cclxuICAgICAgICB3aW5kb3cueWFDb250ZXh0Q2IgPSB3aW5kb3cueWFDb250ZXh0Q2IgfHwgW107XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFNESyh0aGlzLnNka1VSTClcclxuICAgICAgICB0aGlzLnNldEV2ZW50cyhldmVudHMpXHJcbiAgICAgICAgdGhpcy5tZXJnZU9wdGlvbnMoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcm9wKG9uRXZlbnQgPSBmYWxzZSkge1xyXG4gICAgICAgIC8vdGhpcy4gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEV2ZW50cyA9IChldmVudHMpID0+IHtcclxuICAgICAgICBjb25zdCBldmVudHNEZWZhdWx0ID0ge1xyXG4gICAgICAgICAgICBvbkNsb3NlOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uU3RvcDogKCkgPT4geyB9LFxyXG4gICAgICAgICAgICBvbkVycm9yOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uUmV3YXJkZWQ6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25JbXByZXNzaW9uOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHsgfSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7IC4uLmV2ZW50c0RlZmF1bHQsIC4uLmV2ZW50cyB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW1wcmVzc2lvblRpbWVvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5pbXByZXNzaW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0ltcHJlc3Npb24gVGltZW91dCBmaXJlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkltcHJlc3Npb24oKTtcclxuICAgICAgICB9LCB0aGlzLmltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldHRpbmdzIFxyXG5cclxuICAgIG1lcmdlT3B0aW9ucyhvKSB7XHJcbiAgICAgICAgdGhpcy5sKCdPcHRpb25zIGFyZSBvYmplY3QnLCB0aGlzLmlzT2JqZWN0KG8pKTtcclxuICAgICAgICBpZiAodGhpcy5pc09iamVjdChvKSlcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgLi4ub1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sKCdPcHRpb25zOiAnLCB0aGlzLm9wdGlvbnMpXHJcbiAgICB9XHJcbiAgICBpc09iamVjdChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBlID09PSAnb2JqZWN0JyAmJlxyXG4gICAgICAgICAgICAhQXJyYXkuaXNBcnJheShlKSAmJlxyXG4gICAgICAgICAgICBlICE9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IpIHRoaXMuc2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuICAgICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3Rvcik7XHJcbiAgICAgICAgaWYgKHRoaXMuYnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQnV0dG9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ3JlYWR5JztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnQ2FuXFwndCBmaW5kIGJ1dHRvbiBlbGVtZW50IGluIERPTScpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUJ1dHRvbigpIHtcclxuICAgICAgICB0aGlzLmJ0bkV2ZW50ID0gKGUpID0+IHsgdGhpcy5idXR0b25DbGlja0V2ZW50KGUpIH07XHJcbiAgICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJ0bkV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBidXR0b25DbGlja0V2ZW50KGUpIHtcclxuICAgICAgICB0aGlzLmwoJ0J1dHRvbiBjbGljayBmaXJlZCcpO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGlmICh0aGlzLmJ1dHRvbi5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAvLyBEb2luZyBub3RoaW5nXHJcbiAgICAgICAgICAgIHRoaXMubCgnQWxyZWFkeSBpbiB1c2UnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2NsaWNrZWQnO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ2NsaWNrZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKCdUaGUgQWQgd2FzIG5vdCByZW5kZXJlZC4gU3RvcHBpbmcgdGhlIHNjcmlwdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0aGlzLnRpbWVvdXQpO1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMubCgnU3RhcnRpbmcgdG8gc2hvdyB0aGUgYWQnKVxyXG4gICAgICAgICAgICB3aW5kb3cueWFDb250ZXh0Q2IucHVzaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmwoJ1BsYXRmb3JtJywgWWE/LkNvbnRleHQ/LkFkdk1hbmFnZXI/LmdldFBsYXRmb3JtKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sKCdBZHZNYW5hZ2VyJywgWWE/LkNvbnRleHQ/LkFkdk1hbmFnZXIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFkT3B0cyA9IHRoaXMub3B0aW9ucy5hZHNbKFlhLkNvbnRleHQuQWR2TWFuYWdlci5nZXRQbGF0Zm9ybSgpID09PSAnZGVza3RvcCcgPyAnZGVza3RvcCcgOiAnbW9iaWxlJyldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBZHNFdmVudHMoYWRPcHRzKTtcclxuICAgICAgICAgICAgICAgIFlhLkNvbnRleHQuQWR2TWFuYWdlci5yZW5kZXIoYWRPcHRzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEFkc0V2ZW50cyhhZE9wdHMpIHtcclxuICAgICAgICBhZE9wdHMub25SZXdhcmRlZCA9IHRoaXMuYnV0dG9uRXZlbnRzLm9uUmV3YXJkZWQ7XHJcbiAgICAgICAgYWRPcHRzLm9uUmVuZGVyID0gdGhpcy5idXR0b25FdmVudHMub25SZW5kZXI7XHJcbiAgICAgICAgYWRPcHRzLm9uRXJyb3IgPSB0aGlzLmJ1dHRvbkV2ZW50cy5vbkVycm9yO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5idG5FdmVudCA/PyAoKCkgPT4geyB9KSk7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZXZlbnRzLm9uU3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2goKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVCdXR0b24oKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkU0RLKHVybCwgY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLmwoJ0xPQURJTkcgU0RLJyk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnNjcmlwdHNMb2FkZWRbdGhpcy5zZGtVUkxdID09PSAndW5kZWZpbmVkJyAmJiAhZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W3NyYz1cIicgKyB0aGlzLnNka1VSTCArICdcIl0nKSkge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ1N0YXJ0aW5nIHRvIGxvYWQgU0RLJyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NyaXB0c0xvYWRlZFt0aGlzLnNka1VSTF0gPSB7IGlzTG9hZGVkOiBmYWxzZSB9XHJcbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgc2NyaXB0LnNyYyA9IHVybDtcclxuICAgICAgICAgICAgdGhpcy5zY3JpcHRzTG9hZGVkW3RoaXMuc2RrVVJMXS5zY3JpcHQgPSBzY3JpcHQ7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgICAgICAgICAgdGhpcy5sKCdTQ1JJUFQhJywgc2NyaXB0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGVidWdcclxuXHJcbiAgICBsKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZGVidWdHcm91cE9wZW5lZClcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZGVidWdMYWJlbCwgdGhpcy5kZWJ1Z1N0eWxlcywgLi4uYXJncyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZyhsYWJlbCA9IFwiXCIpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1ZyAmJiAhdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVidWdHcm91cE9wZW5lZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQodGhpcy5kZWJ1Z0xhYmVsLCB0aGlzLmRlYnVnU3R5bGVzLCBsYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxnZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1ZyAmJiB0aGlzLmRlYnVnR3JvdXBPcGVuZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWa0RyaXZlciB7XHJcbiAgICBkZWJ1ZyA9IDA7XHJcbiAgICBkZWJ1Z0xhYmVsID0gXCIlY01QU1UgVmsgRHJpdmVyXCI7XHJcbiAgICBkZWJ1Z1N0eWxlcyA9IFwiY29sb3I6d2hpdGU7IGJhY2tncm91bmQtY29sb3I6ICMzZjhiZTg7IHBhZGRpbmc6IDJweCA1cHg7IGJvcmRlci1yYWRpdXM6IDNweDtcIjtcclxuICAgIGRlYnVnR3JvdXBPcGVuZWQgPSBmYWxzZTtcclxuXHJcbiAgICBjb250YWluZXIgPSBudWxsO1xyXG4gICAgc2xvdElkID0gbnVsbDtcclxuICAgIGFkQ29udGFpbmVyID0gbnVsbDtcclxuXHJcbiAgICBhZFN0eWxlcyA9IHtcclxuICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcclxuICAgICAgICB3aWR0aDogJzI0MHB4JyxcclxuICAgICAgICBoZWlnaHQ6ICc0MDBweCcsXHJcbiAgICAgICAgdGV4dERlY29yYXRpb246IFwibm9uZVwiLFxyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICBpbXByZXNzaW9uVGltZW91dER1cmF0aW9uID0gMjAwMDtcclxuICAgIGltcHJlc3Npb25UaW1lb3V0ID0gbnVsbDtcclxuICAgIGNsaWNrSGFuZGxlciA9IG51bGw7XHJcbiAgICBjbGlja1RhcmdldCA9IG51bGw7XHJcblxyXG4gICAgc2NyaXB0c0xvYWRlZCA9IHt9O1xyXG4gICAgc2RrVVJMID0gJ2h0dHBzOi8vYWQubWFpbC5ydS9zdGF0aWMvYWRzLWFzeW5jLmpzJztcclxuXHJcbiAgICBhZE9wdGlvbnMgPSB7XHJcbiAgICAgICAgb25BZHNMb2FkZWQ6IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnb25BZHNMb2FkZWQnLCBkYXRhKVxyXG4gICAgICAgICAgICB0aGlzLnNldEltcHJlc3Npb25UaW1lb3V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tIYW5kbGVyID0gdGhpcy5jbGljay5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIHRoaXMubCgnQ2xpY2sgaGFuZGxlcjonLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tUYXJnZXQgPSB0aGlzLmFkQ29udGFpbmVyOyAvL3RoaXMuaWZyYW1lID8/IHRoaXMuY29udGFpbmVyO1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0NsaWNrIHRhcmdldDonLCB0aGlzLmNsaWNrVGFyZ2V0KTtcclxuICAgICAgICAgICAgdGhpcy5jbGlja1RhcmdldC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5jbGlja0hhbmRsZXIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25BZHNSZWZyZXNoZWQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKCdvbkFkc1JlZnJlc2hlZCcpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkFkc0Nsb3NlZDogKHNsb3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKCdvbkFkc0Nsb3NlZCcsIHNsb3QpXHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLm9uQ2xvc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbk5vQWRzOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ05vIGFkcyByZWNpZXZlZCBmb3IgJyArIGRhdGEuc2xvdClcclxuICAgICAgICAgICAgdGhpcy5sKGRhdGEuc2xvdCk7XHJcbiAgICAgICAgICAgIHRoaXMubChkYXRhLmVsKTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkFkc1N1Y2Nlc3M6IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnb25BZHNTdWNjZXNzJyk7XHJcbiAgICAgICAgICAgIHRoaXMubChkYXRhLnNsb3QpO1xyXG4gICAgICAgICAgICB0aGlzLmwoZGF0YS5lbCk7XHJcbiAgICAgICAgICAgIHRoaXMubChkYXRhLmRhdGEpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25BZHNDbGlja2VkOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmwoZGF0YS5zbG90KTtcclxuICAgICAgICAgICAgdGhpcy5sKCdHb2luZyB0byAnICsgZGF0YS5saW5rKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25TY3JpcHRFcnJvcjogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKCdvblNjcmlwdEVycm9yJyk7XHJcbiAgICAgICAgICAgIHRoaXMubChkYXRhLnNsb3QpO1xyXG4gICAgICAgICAgICB0aGlzLmwoZGF0YS5lbCk7XHJcbiAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMub25FcnJvcigpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaWZyYW1lTW9kZTogdHJ1ZSxcclxuICAgICAgICBzaW5nbGVSZXF1ZXN0OiB0cnVlLFxyXG4gICAgICAgIHByZXZlbnRBdXRvTG9hZDogdHJ1ZSxcclxuICAgICAgICBkaXNhYmxlQ29sbGVjdDogdHJ1ZSxcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgZXZlbnRzKSB7XHJcbiAgICAgICAgaWYgKHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVidWcgPSBzZXR0aW5ncz8uZGVidWcgPz8gMFxyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IHNldHRpbmdzPy5jb250YWluZXIgPz8gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zbG90SWQgPSBzZXR0aW5ncz8uc2xvdElkID8/IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hZE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRPcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnModGhpcy5hZE9wdGlvbnMsIHNldHRpbmdzLmFkT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmwodGhpcy5hZE9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hZFN0eWxlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZFN0eWxlcyA9IHRoaXMubWVyZ2VPcHRpb25zKHRoaXMuYWRTdHlsZXMsIHNldHRpbmdzLmFkU3R5bGVzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubCh0aGlzLmFkU3R5bGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cuTVJHdGFnID0gd2luZG93Lk1SR3RhZyB8fCBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkU0RLKHRoaXMuc2RrVVJMKTtcclxuICAgICAgICB0aGlzLnNldEV2ZW50cyhldmVudHMpXHJcbiAgICAgICAgdGhpcy5tZXJnZU9wdGlvbnMoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBkcm9wKG9uRXZlbnQgPSBmYWxzZSkge1xyXG4gICAgICAgIC8vdGhpcy4gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEV2ZW50cyA9IChldmVudHMpID0+IHtcclxuICAgICAgICBjb25zdCBldmVudHNEZWZhdWx0ID0ge1xyXG4gICAgICAgICAgICBvbkNsb3NlOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uU3RvcDogKCkgPT4geyB9LFxyXG4gICAgICAgICAgICBvbkVycm9yOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uSW1wcmVzc2lvbjogKCkgPT4geyB9LFxyXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZXZlbnRzID0geyAuLi5ldmVudHNEZWZhdWx0LCAuLi5ldmVudHMgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEltcHJlc3Npb25UaW1lb3V0KCkge1xyXG4gICAgICAgIHRoaXMuaW1wcmVzc2lvblRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKCdJbXByZXNzaW9uIFRpbWVvdXQgZmlyZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHMub25JbXByZXNzaW9uKCk7XHJcbiAgICAgICAgfSwgdGhpcy5pbXByZXNzaW9uVGltZW91dER1cmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZXR0aW5ncyBcclxuXHJcbiAgICBtZXJnZU9wdGlvbnMobzEsIG8yKSB7XHJcbiAgICAgICAgdGhpcy5sKCdPcHRpb25zIGFyZSBvYmplY3QnLCB0aGlzLmlzT2JqZWN0KG8yKSk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNPYmplY3QobzIpKVxyXG4gICAgICAgICAgICBvMSA9IHtcclxuICAgICAgICAgICAgICAgIC4uLm8xLFxyXG4gICAgICAgICAgICAgICAgLi4ubzJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubCgnT3B0aW9uczogJywgbzEpO1xyXG4gICAgICAgIHJldHVybiBvMTtcclxuICAgIH1cclxuICAgIGlzT2JqZWN0KGUpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGUgPT09ICdvYmplY3QnICYmXHJcbiAgICAgICAgICAgICFBcnJheS5pc0FycmF5KGUpICYmXHJcbiAgICAgICAgICAgIGUgIT09IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdyhjb250YWluZXIpIHtcclxuICAgICAgICBpZiAoY29udGFpbmVyKSB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVBZENvbnRhaW5lcigpO1xyXG4gICAgICAgIHRoaXMuYWRPcHRpb25zLmVsZW1lbnQgPSB0aGlzLmFkQ29udGFpbmVyO1xyXG4gICAgICAgICh3aW5kb3cuTVJHdGFnID0gd2luZG93Lk1SR3RhZyB8fCBbXSkucHVzaCh0aGlzLmFkT3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJDb250YWluZXIoKSB7XHJcbiAgICAgICAgdGhpcy5sKCdDbGVhcmluZyBjb250YWluZXInKTtcclxuICAgICAgICB0aGlzLmwodGhpcy5jbGlja1RhcmdldCk7XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuY2xpY2tIYW5kbGVyKTtcclxuICAgICAgICBpZiAodGhpcy5jbGlja1RhcmdldCAmJiB0aGlzLmNsaWNrSGFuZGxlcikge1xyXG4gICAgICAgICAgICB0aGlzLmNsaWNrVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmNsaWNrSGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubCh0aGlzLmNvbnRhaW5lcik7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUFkQ29udGFpbmVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICB0aGlzLmFkQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5zJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYWRDb250YWluZXIpXHJcbiAgICAgICAgICAgIHRoaXMuYWRDb250YWluZXIuaWQgPSAnYWQtdGVzdC0nICsgdGhpcy5zbG90SWQ7XHJcbiAgICAgICAgICAgIHRoaXMuYWRDb250YWluZXIuZGF0YXNldFsnYWRDbGllbnQnXSA9ICdhZC0nICsgdGhpcy5zbG90SWQ7XHJcbiAgICAgICAgICAgIHRoaXMuYWRDb250YWluZXIuZGF0YXNldFsnYWRTbG90J10gPSB0aGlzLnNsb3RJZDtcclxuICAgICAgICAgICAgdGhpcy5hZENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdtcmctdGFnJyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWRDb250YWluZXJTdHlsZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5sKCdBZCBjb250YWluZXIgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQnLCB0aGlzLmFkQ29udGFpbmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnQ29udGFpbmVyIHdhcyBub3Qgc3BlY2lmaWVkJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWRDb250YWluZXJTdHlsZXMoKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5hZFN0eWxlcykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRDb250YWluZXIuc3R5bGVba2V5XSA9IHRoaXMuYWRTdHlsZXNba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5vblN0b3AoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoKCkge1xyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRTREsodXJsLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMubCgnTE9BRElORyBTREsnKTtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2NyaXB0c0xvYWRlZFt0aGlzLnNka1VSTF0gPT09ICd1bmRlZmluZWQnICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbc3JjPVwiJyArIHRoaXMuc2RrVVJMICsgJ1wiXScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnU3RhcnRpbmcgdG8gbG9hZCBTREsnKTtcclxuICAgICAgICAgICAgdGhpcy5zY3JpcHRzTG9hZGVkW3RoaXMuc2RrVVJMXSA9IHsgaXNMb2FkZWQ6IGZhbHNlIH1cclxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gdXJsO1xyXG4gICAgICAgICAgICB0aGlzLnNjcmlwdHNMb2FkZWRbdGhpcy5zZGtVUkxdLnNjcmlwdCA9IHNjcmlwdDtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgICAgICAgICB0aGlzLmwoJ1NDUklQVCEnLCBzY3JpcHQpO1xyXG4gICAgICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4gdGhpcy5sKCdTREsgTE9BREVEIScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGljaygpIHtcclxuICAgICAgICB0aGlzLmwoJ0NsaWNrIGV2ZW50IGZpcmVkJylcclxuICAgICAgICB0aGlzLmV2ZW50cy5vbkNsaWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGVidWdcclxuXHJcbiAgICBsKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZGVidWdHcm91cE9wZW5lZClcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZGVidWdMYWJlbCwgdGhpcy5kZWJ1Z1N0eWxlcywgLi4uYXJncyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZyhsYWJlbCA9IFwiXCIpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1ZyAmJiAhdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVidWdHcm91cE9wZW5lZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQodGhpcy5kZWJ1Z0xhYmVsLCB0aGlzLmRlYnVnU3R5bGVzLCBsYWJlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxnZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5kZWJ1ZyAmJiB0aGlzLmRlYnVnR3JvdXBPcGVuZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBWS0luUGFnZURyaXZlciB7XHJcbiAgICBkZWJ1ZyA9IDA7XHJcbiAgICBkZWJ1Z0xhYmVsID0gXCIlY01QU1UgVmsgSW5QYWdlIERyaXZlclwiO1xyXG4gICAgZGVidWdTdHlsZXMgPSBcImNvbG9yOndoaXRlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjM2Y4YmU4OyBwYWRkaW5nOiAycHggNXB4OyBib3JkZXItcmFkaXVzOiAzcHg7XCI7XHJcbiAgICBkZWJ1Z0dyb3VwT3BlbmVkID0gZmFsc2U7XHJcblxyXG4gICAgY29udGFpbmVyID0gbnVsbDtcclxuICAgIHNsb3RJZCA9IG51bGw7XHJcbiAgICBhZENvbnRhaW5lciA9IG51bGw7XHJcblxyXG4gICAgYWRTdHlsZXMgPSB7XHJcbiAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXHJcbiAgICAgICAgd2lkdGg6ICc2NDBweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnMzYwcHgnLFxyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICBpbXByZXNzaW9uVGltZW91dER1cmF0aW9uID0gMjAwMDtcclxuICAgIGltcHJlc3Npb25UaW1lb3V0ID0gbnVsbDtcclxuXHJcbiAgICBzY3JpcHRzTG9hZGVkID0ge307XHJcbiAgICBzZGtVUkwgPSAnaHR0cHM6Ly9hZC5tYWlsLnJ1L3N0YXRpYy92ay1hZG1hbi5qcyc7XHJcblxyXG4gICAgYWRPcHRpb25zID0ge1xyXG4gICAgICAgIG9uUmVhZHk6ICgpID0+IHsgdGhpcy5sKCdvblJlYWR5JykgfSxcclxuICAgICAgICBvbkVycm9yOiAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTA1OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTWVkaWEgY2h1bmsgZXJyb3InKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMxMTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ05vIGNvbnRhaW5lciBvbiB0aGUgcGFnZScpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzEyOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTm8gcGxhY2UgaW4gY29udGFpbmVyJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzMTM6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdSZW5kZXJSdW5uZXIgbG9hZCBlcnJvcicpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzE0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTWVzc2FnZSBzeXN0ZW0gZXJyb3InKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMxNTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ1VuYWNjZXB0YWJsZSBjcmVhdGl2ZScpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzE2OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnQ29udGFpbmVyIGxpbmsgZXJyb3InKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMyMTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ0VtcHR5IGFkIHNlY3Rpb24nKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMyMjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ1Zpc2l0IGlzIG5vdCBhbiBvYmplY3QnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMyMzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ1NlcnZlciBlcnJvcicpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzMxOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnQ29uZmlnIGVycm9yJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzMzI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdTbG90IGlzIG5vdCBzcGVjaWZpZWQnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDMzMzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ0NvbnRhaW5lciBpcyBub3Qgc3BlY2lmaWVkJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzNDE6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdXcm9uZyBpbmxpbmUgYmFubmVyIChiYXNlNjQpJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzNDI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdXcm9uZyBpbmxpbmUgY29uZmlnLiBDaGVjayB0aGUgXCJzcmNcIiBhdHRyaWJ1dGUnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM1MTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ05vIG1lZGlhIGluIHNlY3Rpb24nKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM1MjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ0ludmFsaWQgSlNPTiBzZXJ2ZXIgcmVzcG9uc2UnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM1MzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ0NvbmZpZyBpcyBub3QgYW4gb2JqZWN0Jyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzNjE6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdWaWRlbyBlbGVtZW50IGVycm9yJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzNjI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdPbGQgYnJvd3NlciAoSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpOyknKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDUwMDE6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdDb21tb24gZXJyb3InKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDUwMDI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdBbHJlYWR5IGluaXRpYWxpemVkJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1MDAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTm90IGluaXRpYWxpemVkJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1MDA0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTm90IGluIHBsYXkgc3RhdHVzJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1MDA1OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnTm90IGluIHBhdXNlIHN0YXR1cycpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNTAwNjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmwoZGF0YS5lcnJvciwgJ1RoZSBhZCBpcyBhbHJlYWR5IHN0YXJ0ZWQnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDUwMDc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdEZXN0cm95ZWQnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDUwMDg6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sKGRhdGEuZXJyb3IsICdGb3JiaWRkZW4gaW4gc3RyZWFtIG1vZGUgKHBsYXlNb2RlPVwic3RyZWFtXCIpJyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxMTAwOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnRW1wdHkgYWQgcmVzcG9uc2UnKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubChkYXRhLmVycm9yLCAnVW5rbm93biBlcnJvcicpOyBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGF0YS5lcnJvciA9PT0gMTEwMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMub25TdG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkVycm9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvblN0YXJ0ZWQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKCdvblN0YXJ0ZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRJbXByZXNzaW9uVGltZW91dCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25QYXVzZWQ6ICgpID0+IHsgdGhpcy5sKCdvblBhdXNlZCcpIH0sXHJcbiAgICAgICAgb25QbGF5ZWQ6ICgpID0+IHsgdGhpcy5sKCdvblBsYXllZCcpIH0sXHJcbiAgICAgICAgb25Db21wbGV0ZWQ6ICgpID0+IHsgdGhpcy5sKCdvbkNvbXBsZXRlZCcpIH0sXHJcbiAgICAgICAgb25DbG9zZWQ6ICgpID0+IHsgdGhpcy5sKCdvbkNsb3NlZCcpOyB0aGlzLmV2ZW50cy5vbkNsb3NlKCk7IH0sXHJcbiAgICAgICAgb25Ta2lwcGVkOiAoKSA9PiB7IHRoaXMubCgnb25Ta2lwcGVkJykgfSxcclxuICAgICAgICBvbkNsaWNrZWQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sKCdvbkNsaWNrZWQnKVxyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkNsaWNrKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZE1pZHJvbGxQb2ludDogKCkgPT4geyB0aGlzLmwoJ2FkTWlkcm9sbFBvaW50JykgfSxcclxuICAgICAgICBvblRpbWVSZW1haW5lZDogKCkgPT4geyB0aGlzLmwoJ29uVGltZVJlbWFpbmVkJykgfSxcclxuICAgICAgICBvbkR1cmF0aW9uQ2hhbmdlZDogKCkgPT4geyB0aGlzLmwoJ29uRHVyYXRpb25DaGFuZ2VkJykgfSxcclxuICAgICAgICBvblZQQUlEU3RhcnRlZDogKCkgPT4geyB0aGlzLmwoJ29uVlBBSURTdGFydGVkJykgfVxyXG4gICAgfVxyXG5cclxuICAgIGYgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wdXNoKEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgZXZlbnRzKSB7XHJcbiAgICAgICAgaWYgKHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVidWcgPSBzZXR0aW5ncz8uZGVidWcgPz8gMFxyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IHNldHRpbmdzPy5jb250YWluZXIgPz8gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zbG90SWQgPSBzZXR0aW5ncz8uc2xvdElkID8/IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hZE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRPcHRpb25zID0gdGhpcy5tZXJnZU9wdGlvbnModGhpcy5hZE9wdGlvbnMsIHNldHRpbmdzLmFkT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmwodGhpcy5hZE9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hZFN0eWxlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZFN0eWxlcyA9IHRoaXMubWVyZ2VPcHRpb25zKHRoaXMuYWRTdHlsZXMsIHNldHRpbmdzLmFkU3R5bGVzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubCh0aGlzLmFkU3R5bGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2luZG93LkFkTWFuUGxheWVyID0gdGhpcy5mLmJpbmQod2luZG93Ll9BZE1hblBsYXllckluaXQgPSBbXSk7XHJcbiAgICAgICAgd2luZG93LkFkTWFuU0RLID0gdGhpcy5mLmJpbmQod2luZG93Ll9BZE1hblNES0luaXQgPSBbXSk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZFNESyh0aGlzLnNka1VSTCk7XHJcbiAgICAgICAgdGhpcy5zZXRFdmVudHMoZXZlbnRzKVxyXG4gICAgICAgIHRoaXMubWVyZ2VPcHRpb25zKHNldHRpbmdzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZHJvcChvbkV2ZW50ID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RXZlbnRzID0gKGV2ZW50cykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50c0RlZmF1bHQgPSB7XHJcbiAgICAgICAgICAgIG9uQ2xvc2U6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25TdG9wOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uRXJyb3I6ICgpID0+IHsgfSxcclxuICAgICAgICAgICAgb25JbXByZXNzaW9uOiAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHsgfSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7IC4uLmV2ZW50c0RlZmF1bHQsIC4uLmV2ZW50cyB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SW1wcmVzc2lvblRpbWVvdXQoKSB7XHJcbiAgICAgICAgdGhpcy5pbXByZXNzaW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmwoJ0ltcHJlc3Npb24gVGltZW91dCBmaXJlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5vbkltcHJlc3Npb24oKTtcclxuICAgICAgICB9LCB0aGlzLmltcHJlc3Npb25UaW1lb3V0RHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldHRpbmdzIFxyXG5cclxuICAgIG1lcmdlT3B0aW9ucyhvMSwgbzIpIHtcclxuICAgICAgICB0aGlzLmwoJ09wdGlvbnMgYXJlIG9iamVjdCcsIHRoaXMuaXNPYmplY3QobzIpKTtcclxuICAgICAgICBpZiAodGhpcy5pc09iamVjdChvMikpXHJcbiAgICAgICAgICAgIG8xID0ge1xyXG4gICAgICAgICAgICAgICAgLi4ubzEsXHJcbiAgICAgICAgICAgICAgICAuLi5vMlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sKCdPcHRpb25zOiAnLCBvMSk7XHJcbiAgICAgICAgcmV0dXJuIG8xO1xyXG4gICAgfVxyXG4gICAgaXNPYmplY3QoZSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZSA9PT0gJ29iamVjdCcgJiZcclxuICAgICAgICAgICAgIUFycmF5LmlzQXJyYXkoZSkgJiZcclxuICAgICAgICAgICAgZSAhPT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KGNvbnRhaW5lcikge1xyXG4gICAgICAgIGlmIChjb250YWluZXIpIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUFkQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuYWRDb250YWluZXIuaWQpO1xyXG4gICAgICAgIHRoaXMubCgnQWQgb3B0aW9uczonLCB0aGlzLmFkT3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5sKCdzbG90SWQnLCB0aGlzLnNsb3RJZCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5BZE1hblBsYXllcih7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcjogXCIjYWQtXCIgKyB0aGlzLnNsb3RJZCxcclxuICAgICAgICAgICAgc2xvdDogdGhpcy5zbG90SWQsXHJcbiAgICAgICAgICAgIC4uLnRoaXMuYWRPcHRpb25zXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJDb250YWluZXIoKSB7XHJcbiAgICAgICAgdGhpcy5sKHRoaXMuY29udGFpbmVyKTtcclxuICAgICAgICBpZiAodGhpcy5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQWRDb250YWluZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgdGhpcy5hZENvbnRhaW5lci5pZCA9IFwiYWQtXCIgKyB0aGlzLnNsb3RJZDtcclxuICAgICAgICAgICAgdGhpcy5zZXRBZENvbnRhaW5lclN0eWxlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmFkQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgdGhpcy5sKCdBZCBjb250YWluZXIgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQnLCB0aGlzLmFkQ29udGFpbmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnQ29udGFpbmVyIHdhcyBub3Qgc3BlY2lmaWVkJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWRDb250YWluZXJTdHlsZXMoKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5hZFN0eWxlcykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRDb250YWluZXIuc3R5bGVba2V5XSA9IHRoaXMuYWRTdHlsZXNba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5vblN0b3AoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoKCkge1xyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRTREsodXJsLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMubCgnTE9BRElORyBTREsnKTtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2NyaXB0c0xvYWRlZFt0aGlzLnNka1VSTF0gPT09ICd1bmRlZmluZWQnICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbc3JjPVwiJyArIHRoaXMuc2RrVVJMICsgJ1wiXScpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnU3RhcnRpbmcgdG8gbG9hZCBTREsnKTtcclxuICAgICAgICAgICAgdGhpcy5zY3JpcHRzTG9hZGVkW3RoaXMuc2RrVVJMXSA9IHsgaXNMb2FkZWQ6IGZhbHNlIH1cclxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICBzY3JpcHQuc3JjID0gdXJsO1xyXG4gICAgICAgICAgICB0aGlzLnNjcmlwdHNMb2FkZWRbdGhpcy5zZGtVUkxdLnNjcmlwdCA9IHNjcmlwdDtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgICAgICAgICB0aGlzLmwoJ1NDUklQVCEnLCBzY3JpcHQpO1xyXG4gICAgICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4gdGhpcy5sKCdTREsgTE9BREVEIScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBEZWJ1Z1xyXG5cclxuICAgIGwoLi4uYXJncykge1xyXG4gICAgICAgIGlmICh0aGlzLmRlYnVnKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5kZWJ1Z0xhYmVsLCB0aGlzLmRlYnVnU3R5bGVzLCAuLi5hcmdzKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coLi4uYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxnKGxhYmVsID0gXCJcIikge1xyXG4gICAgICAgIGlmICh0aGlzLmRlYnVnICYmICF0aGlzLmRlYnVnR3JvdXBPcGVuZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCh0aGlzLmRlYnVnTGFiZWwsIHRoaXMuZGVidWdTdHlsZXMsIGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGdlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRlYnVnICYmIHRoaXMuZGVidWdHcm91cE9wZW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlYnVnR3JvdXBPcGVuZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFZQQUlERHJpdmVyIHtcclxuXHJcbiAgZGVidWcgPSAwO1xyXG4gIGRlYnVnTGFiZWwgPSBcIiVjTVBTVSBQbGF5ZXJcIjtcclxuICBkZWJ1Z1N0eWxlcyA9IFwiY29sb3I6d2hpdGU7IGJhY2tncm91bmQtY29sb3I6ICMzZjhiZTg7IHBhZGRpbmc6IDJweCA1cHg7IGJvcmRlci1yYWRpdXM6IDNweDtcIjtcclxuICBkZWJ1Z0dyb3VwT3BlbmVkID0gZmFsc2U7XHJcblxyXG4gIGhhc2ggPSBudWxsO1xyXG4gIHdpZGdldElkID0gbnVsbDtcclxuICBsb29wID0gMDtcclxuICBkaXNhYmxlQ29udHJvbHMgPSAwO1xyXG5cclxuICBsb2dvU3ZnID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgNzU3Ljg0IDEyMFwiPiA8ZGVmcz4gPHN0eWxlPi5jbHMtMXtmaWxsOiNmZjZkMDA7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+IDwvZGVmcz4gPHRpdGxlPtCb0L7Qs9C+INCyINC60YDQuNCy0YvRhTwvdGl0bGU+IDxnIGlkPVwi0KHQu9C+0LlfMlwiIGRhdGEtbmFtZT1cItCh0LvQvtC5IDJcIj4gPGcgaWQ9XCLQodC70L7QuV8xLTJcIiBkYXRhLW5hbWU9XCLQodC70L7QuSAxXCI+IDxwYXRoIGNsYXNzPVwiY2xzLTFcIiBkPVwiTTQ1MS44NCwwSDcyNi40YTMxLjQ0LDMxLjQ0LDAsMCwxLDMxLjQ0LDMxLjQ0Vjg4LjU2QTMxLjQ0LDMxLjQ0LDAsMCwxLDcyNi40LDEyMEg0ODMuMjhhMzEuNDQsMzEuNDQsMCwwLDEtMzEuNDQtMzEuNDRWMEEwLDAsMCwwLDEsNDUxLjg0LDBaXCIvPiA8cGF0aCBjbGFzcz1cImNscy0yXCIgZD1cIk02Mi45NSw5Ni41NmwtLjEtNDEuNUw0Mi40OSw4OS4yNUgzNS4yOEwxNSw1NS45NVY5Ni41NkgwVjI3LjM5SDEzLjI0bDI1Ljg5LDQzLDI1LjQ5LTQzSDc3Ljc3TDc4LDk2LjU2WlwiLz4gPHBhdGggY2xhc3M9XCJjbHMtMlwiIGQ9XCJNMTM5LjkyLDgxLjc0SDEwNy44bC02LjEzLDE0LjgySDg1LjI3TDExNi4xLDI3LjM5aDE1LjgxbDMwLjkzLDY5LjE3SDE0NlptLTUtMTIuMTUtMTEtMjYuNDgtMTEsMjYuNDhaXCIvPiA8cGF0aCBjbGFzcz1cImNscy0yXCIgZD1cIk0yMTQuMTIsOTYuNTYsMjAwLjc4LDc3LjI5SDE4Ni4wNlY5Ni41NmgtMTZWMjcuMzlIMjAwYzE4LjQ4LDAsMzAsOS41OCwzMCwyNS4xLDAsMTAuMzgtNS4yNCwxOC0xNC4yMywyMS44NGwxNS41MSwyMi4yM1ptLTE1LTU2LjEzaC0xM1Y2NC41NGgxM2M5Ljc4LDAsMTQuNzItNC41NCwxNC43Mi0xMi4wNlMyMDguODksNDAuNDMsMTk5LjEsNDAuNDNaXCIvPiA8cGF0aCBjbGFzcz1cImNscy0yXCIgZD1cIk0yNjcuODgsNjkuMzhsLTkuMjksOS42OFY5Ni41NkgyNDIuNjhWMjcuMzloMTUuOTFWNTkuN2wzMC42My0zMi4zMUgzMDdMMjc4LjM1LDU4LjIybDMwLjM0LDM4LjM0SDI5MFpcIi8+IDxwYXRoIGNsYXNzPVwiY2xzLTJcIiBkPVwiTTM2OS4zNSw4My43MVY5Ni41NkgzMTUuOFYyNy4zOWg1Mi4yN1Y0MC4yM0gzMzEuNzF2MTVoMzIuMTJWNjcuN0gzMzEuNzF2MTZaXCIvPiA8cGF0aCBjbGFzcz1cImNscy0yXCIgZD1cIk0zOTYuNDMsNDAuNDNIMzc0LjI5di0xM2g2MC4yOHYxM0g0MTIuNDNWOTYuNTZoLTE2WlwiLz4gPHBhdGggY2xhc3M9XCJjbHMtMlwiIGQ9XCJNNDg5Ljg4LDY1LjUyVjg4LjE1YTQuMDUsNC4wNSwwLDAsMS0xLDMuMTEsNiw2LDAsMCwxLTYuMiwwLDQuMDcsNC4wNywwLDAsMS0uOTUtMy4wNlYyOS42NXEwLTQsNC4wNS00SDUwN3E5LjE5LDAsMTQuMzMsNS4xOXQ1LjE0LDE0LjQ4cTAsOS4yOS00LjczLDE0LjcydC0xNC4yOSw1LjQzWm0wLTMxLjkydjI0SDUwOC4xYTkuODQsOS44NCwwLDAsMCw0LjgyLTEuMDksOC44Myw4LjgzLDAsMCwwLDMuMTUtMi44NywxMi41OSwxMi41OSwwLDAsMCwxLjcyLTQsMTcuOTEsMTcuOTEsMCwwLDAsLjU0LTQuMzVBMTUuMzYsMTUuMzYsMCwwLDAsNTE3LjUsNDBhMTAuMTksMTAuMTksMCwwLDAtMi4yNy0zLjY2LDguNTEsOC41MSwwLDAsMC0zLjMtMi4wOEExMi4wNSwxMi4wNSwwLDAsMCw1MDgsMzMuNlpcIi8+IDxwYXRoIGNsYXNzPVwiY2xzLTJcIiBkPVwiTTU0MCw5MS42MXEtNC4xNSwwLTQuMTUtNC4wNVYyOS4xNnEwLTQsNC4xNS00YTQuMjgsNC4yOCwwLDAsMSwzLC44OSw0LjExLDQuMTEsMCwwLDEsLjk0LDMuMDZWODMuN2gyOC44NXEzLjc1LDAsMy43NSwzLjg1LDAsNC4wNS0zLjc1LDQuMDVaXCIvPiA8cGF0aCBjbGFzcz1cImNscy0yXCIgZD1cIk02MTcuNDUsNzYuNTlINTkxLjg1bC00LjM1LDEyLjg1QTMuNDEsMy40MSwwLDAsMSw1ODQsOTJhNS41OSw1LjU5LDAsMCwxLTEuNzgtLjMsMy45MywzLjkzLDAsMCwxLTIuMTctMS4yOCwzLjI4LDMuMjgsMCwwLDEtLjY5LTIuMDgsNC4yMiw0LjIyLDAsMCwxLC4yLTEuNDhMNTk5LDI5LjQ1YTguMTEsOC4xMSwwLDAsMSwxLjUzLTIuODcsMy43NCwzLjc0LDAsMCwxLDIuODItLjg5aDIuODdhMy43NSwzLjc1LDAsMCwxLDIuODIuODksOC4xNiw4LjE2LDAsMCwxLDEuNTMsMi44N0w2MjkuOSw4Ni44NmE0LjIzLDQuMjMsMCwwLDEsLjMsMS40OHEwLDIuMjctMi41NywzLjI2YTcuNTksNy41OSwwLDAsMS0yLC4zLDMuNywzLjcsMCwwLDEtMy43NS0yLjQ3Wm0tMjIuODMtNy45aDIwLjI2TDYwNC44LDM3LjM2aC0uMlpcIi8+IDxwYXRoIGNsYXNzPVwiY2xzLTJcIiBkPVwiTTY1NC4xLDkxLjYxYTE5LjMsMTkuMywwLDAsMS02LjgyLTEuMTksMTQuODUsMTQuODUsMCwwLDEtNS41Mi0zLjYxLDE3LDE3LDAsMCwxLTMuNy02LjEzQTI1LjIxLDI1LjIxLDAsMCwxLDYzNi43MSw3MlY0NS4zNmEyMy42NSwyMy42NSwwLDAsMSwxLjQ1LTguNjUsMTcuMzYsMTcuMzYsMCwwLDEsMy45LTYuMTMsMTYuNTQsMTYuNTQsMCwwLDEsNS41Ny0zLjY2LDE3LjY2LDE3LjY2LDAsMCwxLDYuNTctMS4yNGgyMC42NXEzLjc1LDAsMy43NSw0dC0zLjc1LDRINjU1YTkuMjksOS4yOSwwLDAsMC03LjUxLDMuMTYsMTIuNDQsMTIuNDQsMCwwLDAtMi42Nyw4LjNWNzIuMzRhMTIuNTQsMTIuNTQsMCwwLDAsMi41Nyw4LjI1LDguOTQsOC45NCwwLDAsMCw3LjMxLDMuMTFoMjAuMTZxMy43NSwwLDMuNzUsMy44NSwwLDQuMDUtMy43NSw0LjA1WlwiLz4gPHBhdGggY2xhc3M9XCJjbHMtMlwiIGQ9XCJNNjkxLjM2LDkxLjYxcS00LjE1LDAtNC4xNS00LjA1VjI5LjY1cTAtNCw0LjE1LTRoMzIuOXEzLjc1LDAsMy43NSw0dC0zLjc1LDRoLTI5VjUyLjY3SDcyMHEzLjU2LDAsMy41Niw0VDcyMCw2MC41OGgtMjQuN1Y4My43aDI5cTMuNzUsMCwzLjc1LDMuODUsMCw0LjA1LTMuNzUsNC4wNVpcIi8+IDwvZz4gPC9nPiA8c2NyaXB0IHhtbG5zPVwiXCIgaWQ9XCJwcm9mZXNzb3IgcHJlYmlkIGluamVjdGVkIGJ1bmRsZVwiLz48L3N2Zz5gO1xyXG4gIGxvZ29MaW5rID0gJ2h0dHBzOi8vbWFya2V0LXBsYWNlLnN1JztcclxuICBkaXNhYmxlTG9nbyA9IDE7XHJcblxyXG4gIGFkTXV0ZWQgPSB0cnVlO1xyXG4gIHNvdW5kQnRuID0gbnVsbDtcclxuICBkaXNhYmxlU291bmRCdG4gPSAwO1xyXG5cclxuICBwbGF5QnRuID0gbnVsbDtcclxuICBkaXNhYmxlUGxheUJ0biA9IDE7XHJcblxyXG4gIGNsb3NlQnRuID0gbnVsbDtcclxuICBkaXNhYmxlQ2xvc2VCdG4gPSAxO1xyXG5cclxuICBzdHlsZXNFbGVtZW50ID0gbnVsbDtcclxuICBjb250cm9sc1N0eWxlcyA9IGBcclxuICAubXBzdS1sb2dvIHtcclxuICAgIHBvc2l0aW9uOmFic29sdXRlO1xyXG4gICAgdG9wOiAwcHg7XHJcbiAgICByaWdodDogMHB4OyBcclxuICAgIHdpZHRoOiAxMTBweDtcclxuICAgIGhlaWdodDogMjVweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsLjgpO1xyXG4gICAgcGFkZGluZzogNXB4IDE1cHg7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gIH1cclxuXHJcbiAgLm1wc3UtcGxheWVyLWNvbnRyb2xzIHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgXHJcbiAgICBsZWZ0OiAxMHB4OyBcclxuICAgIHRvcDogMTBweDtcclxuICB9XHJcblxyXG4gIC5tcHN1LWNvbnRyb2wge1xyXG4gICAgd2lkdGg6IDI2cHg7IFxyXG4gICAgaGVpZ2h0OiAyNnB4OyBcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsLjgpOyBcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgIGZsb2F0OiBsZWZ0O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDEwcHhcclxuICB9XHJcblxyXG4gIC5tcHN1LWNvbnRyb2w6Zmlyc3QtY2hpbGQge1xyXG4gICAgbWFyZ2luLWxlZnQ6IDA7XHJcbiAgfVxyXG5cclxuICAubXBzdS1jb250cm9sOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsMSk7XHJcbiAgfVxyXG5cclxuICAubXBzdS1jbG9zZS1idXR0b24gIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgfVxyXG5cclxuICAubXBzdS1zb3VuZC1idXR0b24gc3ZnIHtcclxuICAgIG1hcmdpbi10b3A6IDVweDtcclxuICAgIG1hcmdpbi1sZWZ0OiAycHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5tcHN1LXNvdW5kLWJ1dHRvbiAubXV0ZWQge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICB9XHJcblxyXG4gIC5tcHN1LXNvdW5kLWJ1dHRvbi5tdXRlZCAubXV0ZWQge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gIH1cclxuXHJcbiAgLm1wc3Utc291bmQtYnV0dG9uLm11dGVkIC51bm11dGVkIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgfVxyXG4gIFxyXG4gIC5tcHN1LXBsYXktYnV0dG9uIC5wYXVzZSB7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgbWFyZ2luLXRvcDogNXB4O1xyXG4gICAgbWFyZ2luLWxlZnQ6IDhweDtcclxuICB9XHJcblxyXG4gIC5tcHN1LXBsYXktYnV0dG9uIC5wbGF5IHtcclxuICAgIG1hcmdpbi10b3A6IDVweDtcclxuICAgIG1hcmdpbi1sZWZ0OiA4cHg7XHJcbiAgfVxyXG5cclxuICAubXBzdS1wbGF5LWJ1dHRvbi5wbGF5aW5nIC5wYXVzZSB7XHJcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgfVxyXG5cclxuICAubXBzdS1wbGF5LWJ1dHRvbi5wbGF5aW5nIC5wbGF5IHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgfVxyXG4gIGA7XHJcblxyXG4gIHBsYXllckNvbnRhaW5lciA9IG51bGw7XHJcbiAgc2NyaXB0c0xvYWRlZCA9IHt9O1xyXG4gIHF1ZSA9IFtdO1xyXG5cclxuICB0aW1lb3V0ID0gbnVsbDtcclxuICB0aW1lb3V0RHVyYXRpb24gPSAyMDAwXHJcblxyXG4gIGltYSA9IG51bGw7XHJcblxyXG4gIG9wdGlvbnMgPSB7IC8vIERlZmF1bHQgb3B0aW9uc1xyXG4gICAgdmlkZW86IHtcclxuICAgICAgc3R5bGU6ICd3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOydcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBzZGtVUkwgPSAnaHR0cHM6Ly9pbWFzZGsuZ29vZ2xlYXBpcy5jb20vanMvc2RrbG9hZGVyL2ltYTMuanMnO1xyXG4gIHVybCA9ICdodHRwczovL3YxLm1wc3VhZHYucnUvYmhfdjIvW2hhc2hdP2hhc2g9bXBzdSc7XHJcbiAgdmlkZW9VcmwgPSAndmlkZW8ubXA0JztcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGV2ZW50cykge1xyXG4gICAgdGhpcy5kcm9wQWRMb2FkZXIoKTtcclxuICAgIHRoaXMuaGFzaCA9IHNldHRpbmdzLmhhc2g7XHJcbiAgICB0aGlzLndpZGdldElkID0gc2V0dGluZ3Mud2lkZ2V0SWQ7XHJcblxyXG4gICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdkZWJ1ZycpO1xyXG4gICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdsb29wJyk7XHJcbiAgICB0aGlzLnNldE9wdGlvbihzZXR0aW5ncywgJ2Rpc2FibGVDb250cm9scycpO1xyXG4gICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdkaXNhYmxlTG9nbycpO1xyXG4gICAgdGhpcy5zZXRPcHRpb24oc2V0dGluZ3MsICdkaXNhYmxlQ2xvc2VCdG4nKTtcclxuICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnZGlzYWJsZVBsYXlCdG4nKTtcclxuICAgIHRoaXMuc2V0T3B0aW9uKHNldHRpbmdzLCAnZGlzYWJsZVNvdW5kQnRuJyk7XHJcblxyXG4gICAgdGhpcy51cmwgPSB0aGlzLnVybC5yZXBsYWNlKCdbaGFzaF0nLCB0aGlzLmhhc2gpO1xyXG4gICAgdGhpcy5sKCdVUkw6ICcsIHRoaXMudXJsKTtcclxuICAgIHRoaXMudXJsID0gJ2h0dHBzOi8vc3RhdGlrYS5tcHN1YWR2LnJ1L3Rlc3QvdGVzdC54bWwnOyAvLyB0ZW1wb3JhcnkgdXJsLCByZW1vdmUgb24gcHJvZHVjdGlvblxyXG4gICAgaWYgKHNldHRpbmdzLnZpZGVvVXJsKSB0aGlzLnZpZGVvVXJsID0gc2V0dGluZ3MudmlkZW9Vcmw7XHJcbiAgICB0aGlzLnBsYXllckNvbnRhaW5lciA9IHNldHRpbmdzLmNvbnRhaW5lcjtcclxuICAgIHRoaXMuY2xlYXJDb250YWluZXIoKTtcclxuXHJcbiAgICB0aGlzLmxvYWRTREsodGhpcy5zZGtVUkwsICgpID0+IHsgdGhpcy5pbml0KCk7IH0pXHJcbiAgICB0aGlzLnNldEV2ZW50cyhldmVudHMpXHJcblxyXG4gICAgdGhpcy5tZXJnZU9wdGlvbnMoc2V0dGluZ3MpO1xyXG4gICAgdGhpcy5sKFwiU2V0dGluZ3M6IFwiLCB0aGlzLm9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgc2V0T3B0aW9uKHMsIG8pIHtcclxuICAgIGlmICh0eXBlb2Ygc1tvXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhpc1tvXSA9IHNbb107XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkcm9wQWRMb2FkZXIob25FdmVudCA9IGZhbHNlKSB7XHJcbiAgICB0aGlzLmwoJ0Ryb3BwaW5nIEFkIExvYWRlcicpO1xyXG4gICAgaWYgKHRoaXMuYWRzTWFuYWdlcikge1xyXG4gICAgICB0aGlzLmFkc01hbmFnZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hZHNMb2FkZXIgPSBudWxsO1xyXG4gICAgdGhpcy5hZERpc3BsYXlDb250YWluZXIgPSBudWxsO1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyID0gbnVsbDtcclxuICAgIHRoaXMuYWRzTG9hZGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLmFkc1JlbmRlcmluZ1NldHRpbmdzID0gbnVsbDtcclxuICAgIHRoaXMudmlkZW9FbGVtZW50ID0gbnVsbDtcclxuICAgIHRoaXMudmlkZW9Db250YWluZXIgPSBudWxsO1xyXG4gICAgdGhpcy5hZENvbnRhaW5lciA9IG51bGw7XHJcbiAgICB0aGlzLnZpZGVvU3RhdHVzID0gbnVsbDtcclxuICAgIHRoaXMuc3RhdHVzID0gb25FdmVudCA/ICdkcm9wcGVkJyA6IG51bGw7XHJcbiAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XHJcbiAgfVxyXG5cclxuICBzZXRFdmVudHMgPSAoZXZlbnRzKSA9PiB7XHJcbiAgICBjb25zdCBldmVudHNEZWZhdWx0ID0ge1xyXG4gICAgICBvbkNsb3NlOiAoKSA9PiB7IH0sXHJcbiAgICAgIG9uU3RvcDogKCkgPT4geyB9LFxyXG4gICAgICBvbkVycm9yOiAoKSA9PiB7IH0sXHJcbiAgICAgIG9uSW1wcmVzc2lvbjogKCkgPT4geyB9LFxyXG4gICAgICBvbkNsaWNrOiAoKSA9PiB7IH0sXHJcbiAgICB9XHJcbiAgICB0aGlzLmV2ZW50cyA9IHsgLi4uZXZlbnRzRGVmYXVsdCwgLi4uZXZlbnRzIH1cclxuICB9XHJcblxyXG4gIGFkZENvbnRyb2xzKCkge1xyXG4gICAgdGhpcy5sKCdBZGRpbmcgY29udHJvbHMnLCAhdGhpcy5kaXNhYmxlQ29udHJvbHMpXHJcbiAgICBpZiAoIXRoaXMuZGlzYWJsZUNvbnRyb2xzKSB7XHJcbiAgICAgIGlmICghdGhpcy5jb250cm9sc0VsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHNFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21wc3UtcGxheWVyLWNvbnRyb2xzJyk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sc0VsZW1lbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmwoJ0NyZWF0aW5nIGNsb3NlIGJ1dHRvbicpXHJcbiAgICAgIGlmICghdGhpcy5jbG9zZUJ0biAmJiAhdGhpcy5kaXNhYmxlQ2xvc2VCdG4pIHtcclxuICAgICAgICB0aGlzLmNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5jbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdtcHN1LWNvbnRyb2wnKTtcclxuICAgICAgICB0aGlzLmNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ21wc3UtY2xvc2UtYnV0dG9uJyk7XHJcblxyXG4gICAgICAgIGxldCBjbG9zZUljb25TdmcgPSAnPHN2ZyBmaWxsPVwiY3VycmVudENvbG9yXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGhlaWdodD1cIjFlbVwiIHZpZXdCb3g9XCIwIDAgMzg0IDUxMlwiPjxwYXRoIGQ9XCJNMzQyLjYgMTUwLjZjMTIuNS0xMi41IDEyLjUtMzIuOCAwLTQ1LjNzLTMyLjgtMTIuNS00NS4zIDBMMTkyIDIxMC43IDg2LjYgMTA1LjRjLTEyLjUtMTIuNS0zMi44LTEyLjUtNDUuMyAwcy0xMi41IDMyLjggMCA0NS4zTDE0Ni43IDI1NiA0MS40IDM2MS40Yy0xMi41IDEyLjUtMTIuNSAzMi44IDAgNDUuM3MzMi44IDEyLjUgNDUuMyAwTDE5MiAzMDEuMyAyOTcuNCA0MDYuNmMxMi41IDEyLjUgMzIuOCAxMi41IDQ1LjMgMHMxMi41LTMyLjggMC00NS4zTDIzNy4zIDI1NiAzNDIuNiAxNTAuNnpcIi8+PC9zdmc+JztcclxuXHJcbiAgICAgICAgdGhpcy5jbG9zZUJ0bi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIGNsb3NlSWNvblN2Zyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29udHJvbHNFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY2xvc2VCdG4pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENsb3NlQnV0dG9uRXZlbnRzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5sKCdDbG9zZSBidXR0b24gYWxyZWFkeSBleGlzdHMnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5sKCdDcmVhdGluZyBzb3VuZCBidXR0b24nKVxyXG4gICAgICBpZiAoIXRoaXMuc291bmRCdG4gJiYgIXRoaXMuZGlzYWJsZVNvdW5kQnRuKSB7XHJcbiAgICAgICAgdGhpcy5zb3VuZEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuc291bmRCdG4uY2xhc3NMaXN0LmFkZCgnbXBzdS1jb250cm9sJyk7XHJcbiAgICAgICAgdGhpcy5zb3VuZEJ0bi5jbGFzc0xpc3QuYWRkKCdtcHN1LXNvdW5kLWJ1dHRvbicpO1xyXG4gICAgICAgIHRoaXMuc291bmRCdG4uY2xhc3NMaXN0LmFkZCgnbXV0ZWQnKTtcclxuXHJcbiAgICAgICAgbGV0IG11dGVkSWNvblN2ZyA9ICc8c3ZnIGNsYXNzPVwibXV0ZWRcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGhlaWdodD1cIjFlbVwiIHZpZXdCb3g9XCIwIDAgNTc2IDUxMlwiPjxwYXRoIGQ9XCJNMzAxLjEgMzQuOEMzMTIuNiA0MCAzMjAgNTEuNCAzMjAgNjRWNDQ4YzAgMTIuNi03LjQgMjQtMTguOSAyOS4ycy0yNSAzLjEtMzQuNC01LjNMMTMxLjggMzUySDY0Yy0zNS4zIDAtNjQtMjguNy02NC02NFYyMjRjMC0zNS4zIDI4LjctNjQgNjQtNjRoNjcuOEwyNjYuNyA0MC4xYzkuNC04LjQgMjIuOS0xMC40IDM0LjQtNS4zek00MjUgMTY3bDU1IDU1IDU1LTU1YzkuNC05LjQgMjQuNi05LjQgMzMuOSAwczkuNCAyNC42IDAgMzMuOWwtNTUgNTUgNTUgNTVjOS40IDkuNCA5LjQgMjQuNiAwIDMzLjlzLTI0LjYgOS40LTMzLjkgMGwtNTUtNTUtNTUgNTVjLTkuNCA5LjQtMjQuNiA5LjQtMzMuOSAwcy05LjQtMjQuNiAwLTMzLjlsNTUtNTUtNTUtNTVjLTkuNC05LjQtOS40LTI0LjYgMC0zMy45czI0LjYtOS40IDMzLjkgMHpcIi8+PC9zdmc+JztcclxuICAgICAgICBsZXQgdW5tdXRlZEljb25TdmcgPSAnPHN2ZyBjbGFzcz1cInVubXV0ZWRcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGhlaWdodD1cIjFlbVwiIHZpZXdCb3g9XCIwIDAgNjQwIDUxMlwiPjxwYXRoIGQ9XCJNNTMzLjYgMzIuNUM1OTguNSA4NS4zIDY0MCAxNjUuOCA2NDAgMjU2cy00MS41IDE3MC44LTEwNi40IDIyMy41Yy0xMC4zIDguNC0yNS40IDYuOC0zMy44LTMuNXMtNi44LTI1LjQgMy41LTMzLjhDNTU3LjUgMzk4LjIgNTkyIDMzMS4yIDU5MiAyNTZzLTM0LjUtMTQyLjItODguNy0xODYuM2MtMTAuMy04LjQtMTEuOC0yMy41LTMuNS0zMy44czIzLjUtMTEuOCAzMy44LTMuNXpNNDczLjEgMTA3YzQzLjIgMzUuMiA3MC45IDg4LjkgNzAuOSAxNDlzLTI3LjcgMTEzLjgtNzAuOSAxNDljLTEwLjMgOC40LTI1LjQgNi44LTMzLjgtMy41cy02LjgtMjUuNCAzLjUtMzMuOEM0NzUuMyAzNDEuMyA0OTYgMzAxLjEgNDk2IDI1NnMtMjAuNy04NS4zLTUzLjItMTExLjhjLTEwLjMtOC40LTExLjgtMjMuNS0zLjUtMzMuOHMyMy41LTExLjggMzMuOC0zLjV6bS02MC41IDc0LjVDNDM0LjEgMTk5LjEgNDQ4IDIyNS45IDQ0OCAyNTZzLTEzLjkgNTYuOS0zNS40IDc0LjVjLTEwLjMgOC40LTI1LjQgNi44LTMzLjgtMy41cy02LjgtMjUuNCAzLjUtMzMuOEMzOTMuMSAyODQuNCA0MDAgMjcxIDQwMCAyNTZzLTYuOS0yOC40LTE3LjctMzcuM2MtMTAuMy04LjQtMTEuOC0yMy41LTMuNS0zMy44czIzLjUtMTEuOCAzMy44LTMuNXpNMzAxLjEgMzQuOEMzMTIuNiA0MCAzMjAgNTEuNCAzMjAgNjRWNDQ4YzAgMTIuNi03LjQgMjQtMTguOSAyOS4ycy0yNSAzLjEtMzQuNC01LjNMMTMxLjggMzUySDY0Yy0zNS4zIDAtNjQtMjguNy02NC02NFYyMjRjMC0zNS4zIDI4LjctNjQgNjQtNjRoNjcuOEwyNjYuNyA0MC4xYzkuNC04LjQgMjIuOS0xMC40IDM0LjQtNS4zelwiLz48L3N2Zz4nO1xyXG5cclxuICAgICAgICB0aGlzLnNvdW5kQnRuLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgbXV0ZWRJY29uU3ZnKTtcclxuICAgICAgICB0aGlzLnNvdW5kQnRuLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgdW5tdXRlZEljb25TdmcpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2xzRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNvdW5kQnRuKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRTb3VuZEJ1dHRvbkV2ZW50cygpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMubCgnU291bmQgYnV0dG9uIGFscmVhZHkgZXhpc3RzJylcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5sKCdDcmVhdGluZyBwbGF5IGJ1dHRvbicpO1xyXG4gICAgICBpZiAoIXRoaXMucGxheUJ0biAmJiAhdGhpcy5kaXNhYmxlUGxheUJ0bikge1xyXG4gICAgICAgIHRoaXMucGxheUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdtcHN1LWNvbnRyb2wnKTtcclxuICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LmFkZCgnbXBzdS1wbGF5LWJ1dHRvbicpO1xyXG4gICAgICAgIHRoaXMucGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5aW5nJyk7XHJcblxyXG4gICAgICAgIGxldCBwbGF5SWNvblN2ZyA9ICc8c3ZnIGNsYXNzPVwicGxheVwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMWVtXCIgdmlld0JveD1cIjAgMCAzODQgNTEyXCI+PHBhdGggZD1cIk03MyAzOWMtMTQuOC05LjEtMzMuNC05LjQtNDguNS0uOVMwIDYyLjYgMCA4MFY0MzJjMCAxNy40IDkuNCAzMy40IDI0LjUgNDEuOXMzMy43IDguMSA0OC41LS45TDM2MSAyOTdjMTQuMy04LjcgMjMtMjQuMiAyMy00MXMtOC43LTMyLjItMjMtNDFMNzMgMzl6XCIvPjwvc3ZnPic7XHJcbiAgICAgICAgbGV0IHBhdXNlSWNvblN2ZyA9ICc8c3ZnIGNsYXNzPVwicGF1c2VcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGhlaWdodD1cIjFlbVwiIHZpZXdCb3g9XCIwIDAgMzIwIDUxMlwiPjxwYXRoIGQ9XCJNNDggNjRDMjEuNSA2NCAwIDg1LjUgMCAxMTJWNDAwYzAgMjYuNSAyMS41IDQ4IDQ4IDQ4SDgwYzI2LjUgMCA0OC0yMS41IDQ4LTQ4VjExMmMwLTI2LjUtMjEuNS00OC00OC00OEg0OHptMTkyIDBjLTI2LjUgMC00OCAyMS41LTQ4IDQ4VjQwMGMwIDI2LjUgMjEuNSA0OCA0OCA0OGgzMmMyNi41IDAgNDgtMjEuNSA0OC00OFYxMTJjMC0yNi41LTIxLjUtNDgtNDgtNDhIMjQwelwiLz48L3N2Zz4nO1xyXG5cclxuICAgICAgICB0aGlzLnBsYXlCdG4uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBwbGF5SWNvblN2Zyk7XHJcbiAgICAgICAgdGhpcy5wbGF5QnRuLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgcGF1c2VJY29uU3ZnKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb250cm9sc0VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5wbGF5QnRuKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRQbGF5QnV0dG9uRXZlbnRzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5sKCdQbGF5IGJ1dHRvbiBhbHJlYWR5IGV4aXN0cycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5sKCdDb250cm9scyBvcHRpb24gZGlzYWJsZWQnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkQ29udHJvbHNTdHlsZXMoKSB7XHJcbiAgICB0aGlzLmwoJ0FkZGluZyBjb250cm9scyBzdHlsZXMnLCAhdGhpcy5kaXNhYmxlQ29udHJvbHMpXHJcbiAgICB0aGlzLmwoIXRoaXMuc3R5bGVzRWxlbWVudCA/ICdBZGRpbmcgc3R5bGVzIGVsZW1lbnQnIDogJ1N0eWxlcyBlbGVtZW50IGFscmVhZHkgZXhpc3RzJylcclxuICAgIGlmICghdGhpcy5zdHlsZXNFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuc3R5bGVzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcbiAgICAgIHRoaXMuc3R5bGVzRWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsIHRoaXMuY29udHJvbHNTdHlsZXMpO1xyXG4gICAgICB0aGlzLmwodGhpcy5wbGF5ZXJDb250YWluZXIpO1xyXG4gICAgICB0aGlzLnBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlc0VsZW1lbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkTG9nbygpIHtcclxuICAgIGlmICghdGhpcy5sb2dvICYmICF0aGlzLmRpc2FibGVMb2dvKSB7XHJcbiAgICAgIHRoaXMubG9nbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgdGhpcy5sb2dvLmhyZWYgPSB0aGlzLmxvZ29MaW5rO1xyXG4gICAgICB0aGlzLmxvZ28uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB0aGlzLmxvZ29TdmcpO1xyXG4gICAgICB0aGlzLmxvZ28uY2xhc3NMaXN0LmFkZCgnbXBzdS1sb2dvJyk7XHJcbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubG9nbyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBY3Rpb25zXHJcblxyXG4gIHNob3coY29udGFpbmVyKSB7XHJcblxyXG4gICAgdGhpcy5sKCdTaG93aW5nIGFkcycpO1xyXG4gICAgdGhpcy5sKCdTdGF0dXM6JywgdGhpcy5zdGF0dXMpO1xyXG5cclxuICAgIGlmIChjb250YWluZXIgJiYgY29udGFpbmVyICE9PSB0aGlzLnBsYXllckNvbnRhaW5lcikge1xyXG4gICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICAgIHRoaXMubCgnU2V0dGluZyBuZXcgcGxheWVyIGNvbnRhaW5lcjonLCBjb250YWluZXIpO1xyXG4gICAgICB0aGlzLnBsYXllckNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgdGhpcy5jbGVhckNvbnRhaW5lcigpO1xyXG4gICAgICB0aGlzLmhhbmRsZUVsZW1lbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvdy5nb29nbGU/LmltYSAmJiAhdGhpcy5hZHNMb2FkZXIgJiYgdGhpcy52aWRlb0VsZW1lbnQgJiYgdGhpcy5hZENvbnRhaW5lcikge1xyXG4gICAgICB0aGlzLmluaXRBZHNMb2FkZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09ICdkcm9wcGVkJykge1xyXG4gICAgICB0aGlzLnJlSW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5pc1J1bm5pbmcpIHtcclxuICAgICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xyXG4gICAgICB0aGlzLmwoJ2lzUnVubmluZycsIHRoaXMuaXNSdW5uaW5nKTtcclxuICAgICAgdGhpcy5xdWUucHVzaCh0aGlzLmxvYWRBZHMuYmluZCh0aGlzKSlcclxuICAgICAgaWYgKHRoaXMuYWRzTWFuYWdlcilcclxuICAgICAgICB0aGlzLnByb2Nlc3NRdWV1ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubCgnIXRoaXMuZGlzYWJsZUNvbnRyb2xzJywgIXRoaXMuZGlzYWJsZUNvbnRyb2xzKVxyXG4gICAgaWYgKCF0aGlzLmRpc2FibGVDb250cm9scykge1xyXG4gICAgICB0aGlzLmFkZENvbnRyb2xzU3R5bGVzKCk7XHJcbiAgICAgIHRoaXMuYWRkQ29udHJvbHMoKTtcclxuICAgICAgdGhpcy5hZGRMb2dvKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoaWRlKCkge1xyXG4gICAgdGhpcy5pc1J1bm5pbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuZXZlbnRzLm9uU3RvcCgpO1xyXG4gICAgdGhpcy5kcm9wQWRMb2FkZXIodHJ1ZSk7XHJcbiAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoKCkge1xyXG4gICAgdGhpcy5sKCdSZWZyZXNoaW5nIHBsYXllcicpO1xyXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSAnZHJvcHBlZCcpIHtcclxuICAgICAgdGhpcy5yZUluaXQoKTtcclxuICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXR1cyAhPT0gJ2Ryb3BwZWQnICYmIHRoaXMuYWRzTG9hZGVyKSB7XHJcbiAgICAgIHRoaXMucGxheU5leHRBZCgpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXN1bWUoKSB7XHJcbiAgICB0aGlzLmFkc01hbmFnZXI/LnJlc3VtZSgpXHJcbiAgfVxyXG5cclxuICBwYXVzZSgpIHtcclxuICAgIHRoaXMuYWRzTWFuYWdlcj8ucGF1c2UoKVxyXG4gIH1cclxuXHJcbiAgcGxheU5leHRBZCgpIHtcclxuICAgIHRoaXMubCgnUGxheWluZyBuZXh0IEFkJylcclxuICAgIHRoaXMuYWRzTWFuYWdlci5kZXN0cm95KCk7XHJcbiAgICB0aGlzLmFkc0xvYWRlci5jb250ZW50Q29tcGxldGUoKTtcclxuICAgIHRoaXMucXVlLnB1c2godGhpcy5sb2FkQWRzLmJpbmQodGhpcykpXHJcbiAgICB0aGlzLmFkc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5hZHNMb2FkZXIucmVxdWVzdEFkcyh0aGlzLmFkc1JlcXVlc3QpO1xyXG4gIH1cclxuXHJcbiAgbXV0ZSgpIHtcclxuICAgIHRoaXMuYWRNdXRlZCA9IHRydWU7XHJcbiAgICB0aGlzLmFkc01hbmFnZXI/LnNldFZvbHVtZSgwKTtcclxuICB9XHJcblxyXG4gIHVubXV0ZSgpIHtcclxuICAgIHRoaXMuYWRNdXRlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyPy5zZXRWb2x1bWUoMSk7XHJcbiAgfVxyXG5cclxuICBwbGF5VmlkZW8oKSB7XHJcbiAgICBpZiAodGhpcy52aWRlb1N0YXR1cyAmJiB0aGlzLnZpZGVvU3RhdHVzICE9PSAncGxheWluZycpIHtcclxuICAgICAgdGhpcy5sKCdWaWRlbyBwbGF5IGZpcmVzJyk7XHJcbiAgICAgIHRoaXMubCgnVmlkZW8gc3RhdHVzOiAnLCB0aGlzLnZpZGVvU3RhdHVzKTtcclxuICAgICAgaWYgKHRoaXMudmlkZW9FbGVtZW50LnBsYXkoKSlcclxuICAgICAgICB0aGlzLnZpZGVvU3RhdHVzID0gJ3BsYXlpbmcnO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5zdGF0dXMpIHtcclxuICAgICAgY29uc29sZS53YXJuKFwiUGxlYXNlIGluaXQgcGxheWVyIGZpcnN0XCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMudmlkZW9TdGF0dXMgPT09ICdwbGF5aW5nJykge1xyXG4gICAgICB0aGlzLmwoXCJBbHJlYWR5IHBsYXlpbmdcIilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0b3BWaWRlbygpIHtcclxuICAgIGlmICh0aGlzLnZpZGVvU3RhdHVzID09PSAncGxheWluZycpIHtcclxuICAgICAgdGhpcy52aWRlb0VsZW1lbnQucGF1c2UoKTtcclxuICAgICAgdGhpcy52aWRlb0VsZW1lbnQuY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICB0aGlzLnZpZGVvU3RhdHVzID0gJ3N0b3BwZWQnO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGNvbnNvbGUud2FybihcIlBsZWFzZSBzdGFydCB0aGUgdmlkZW8gZmlyc3RcIik7XHJcbiAgfVxyXG5cclxuICBwYXVzZVZpZGVvKCkge1xyXG4gICAgaWYgKHRoaXMudmlkZW9TdGF0dXMgPT09ICdwbGF5aW5nJykge1xyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5wYXVzZSgpO1xyXG4gICAgICB0aGlzLnZpZGVvU3RhdHVzID0gJ3BhdXNlZCc7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS53YXJuKFwiUGxlYXNlIHN0YXJ0IHRoZSB2aWRlbyBmaXJzdFwiKTtcclxuICB9XHJcblxyXG4gIC8vIFF1ZXVlIFxyXG5cclxuICBwcm9jZXNzUXVldWUoKSB7XHJcbiAgICB0aGlzLmwoJ1Byb2Nlc3NpbmcgcXVldWUnKTtcclxuICAgIGlmICh0aGlzLnF1ZS5sZW5ndGggJiYgd2luZG93Lmdvb2dsZT8uaW1hKSB7XHJcbiAgICAgIHRoaXMubCgnSGF2ZSAnICsgdGhpcy5xdWUubGVuZ3RoICsgJyBqb2IocyknKTtcclxuICAgICAgdGhpcy5sKCdRdWV1ZScsIHRoaXMucXVlKVxyXG4gICAgICB0aGlzLnF1ZS5mb3JFYWNoKCh0YXNrLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIHRoaXMubCgnWycgKyBpbmRleCArICddJywgdGFzayk7XHJcbiAgICAgICAgdGFzaygpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnF1ZVtpbmRleF07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMubCgnUXVldWUgaXMgZW1wdHknKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEluaXRpYWxpemF0aW9uXHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLmwoXCJJbml0aWFsaXppbmcgSU1BXCIpO1xyXG5cclxuICAgIHRoaXMuc2V0V2luZG93UmVzaXplRXZlbnQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5wbGF5ZXJDb250YWluZXIpIHtcclxuICAgICAgdGhpcy5oYW5kbGVFbGVtZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubCgnd2luZG93Lmdvb2dsZScsIHdpbmRvdy5nb29nbGUpO1xyXG4gICAgdGhpcy5pbml0QWRzTG9hZGVyKCk7XHJcbiAgfVxyXG5cclxuICBpbml0QWRzTG9hZGVyKCkge1xyXG4gICAgaWYgKHRoaXMuYWRDb250YWluZXIgJiYgdGhpcy52aWRlb0VsZW1lbnQpIHtcclxuICAgICAgdGhpcy5sKCdJbml0aWFsaXppbmcgQWRzIExvYWRlcicpO1xyXG4gICAgICB0aGlzLmFkRGlzcGxheUNvbnRhaW5lciA9IG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5BZERpc3BsYXlDb250YWluZXIodGhpcy5hZENvbnRhaW5lciwgdGhpcy52aWRlb0VsZW1lbnQpO1xyXG4gICAgICAvLyB0aGlzLmFkQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5hZENvbnRhaW5lckNsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgICB0aGlzLmFkc0xvYWRlciA9IG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5BZHNMb2FkZXIodGhpcy5hZERpc3BsYXlDb250YWluZXIpO1xyXG4gICAgICB0aGlzLmFkc0xvYWRlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIHdpbmRvdy5nb29nbGUuaW1hLkFkc01hbmFnZXJMb2FkZWRFdmVudC5UeXBlLkFEU19NQU5BR0VSX0xPQURFRCxcclxuICAgICAgICAoZSkgPT4geyB0aGlzLm9uQWRzTWFuYWdlckxvYWRlZChlKSB9LFxyXG4gICAgICAgIGZhbHNlKTtcclxuICAgICAgdGhpcy5hZHNMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEVycm9yRXZlbnQuVHlwZS5BRF9FUlJPUixcclxuICAgICAgICAoZSkgPT4geyB0aGlzLm9uQWRFcnJvcihlKSB9LFxyXG4gICAgICAgIGZhbHNlKTtcclxuXHJcbiAgICAgIHRoaXMuYWRzUmVxdWVzdCA9IG5ldyB3aW5kb3cuZ29vZ2xlLmltYS5BZHNSZXF1ZXN0KCk7XHJcbiAgICAgIHRoaXMuYWRzUmVxdWVzdC5hZFRhZ1VybCA9IHRoaXMudXJsO1xyXG5cclxuICAgICAgdGhpcy5hZHNSZXF1ZXN0LmxpbmVhckFkU2xvdFdpZHRoID0gdGhpcy52aWRlb0VsZW1lbnQuY2xpZW50V2lkdGg7XHJcbiAgICAgIHRoaXMuYWRzUmVxdWVzdC5saW5lYXJBZFNsb3RIZWlnaHQgPSB0aGlzLnZpZGVvRWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgIHRoaXMuYWRzUmVxdWVzdC5ub25MaW5lYXJBZFNsb3RXaWR0aCA9IHRoaXMudmlkZW9FbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICB0aGlzLmFkc1JlcXVlc3Qubm9uTGluZWFyQWRTbG90SGVpZ2h0ID0gdGhpcy52aWRlb0VsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMztcclxuXHJcbiAgICAgIHRoaXMuYWRzUmVxdWVzdC5zZXRDb250aW51b3VzUGxheWJhY2sodHJ1ZSk7XHJcbiAgICAgIHRoaXMuYWRzUmVxdWVzdC5zZXRBZFdpbGxBdXRvUGxheSh0cnVlKTtcclxuXHJcbiAgICAgIHRoaXMuYWRzTG9hZGVyLnJlcXVlc3RBZHModGhpcy5hZHNSZXF1ZXN0KTtcclxuXHJcbiAgICAgIHRoaXMuc3RhdHVzID0gXCJpbml0aWF0ZWRcIjtcclxuICAgICAgdGhpcy5sKCdTdGF0dXM6JywgdGhpcy5zdGF0dXMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMubCgnQ2FuXFwndCBpbml0aWFsaXplIEFkcyBMb2FkZXIsIG5vIHByb3BlciB2aWRlbyBlbGVtZW50IG9yIGFkIGNvbnRhaW5lci4gQWRzIExvYWRlciB3aWxsIGJlIGluaXRpYWxpemVkIG9uIHNob3coKScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVJbml0KCkge1xyXG4gICAgdGhpcy5sKCdSZWluaXRpYWxpemluZyBwbGF5ZXInKTtcclxuICAgIHRoaXMuZHJvcEFkTG9hZGVyKHRydWUpO1xyXG4gICAgdGhpcy5jbGVhckNvbnRhaW5lcigpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBjbGVhckNvbnRhaW5lcigpIHtcclxuICAgIHRoaXMubCgnQ2xlYXJpbmcgY29udGFpbmVyJyk7XHJcbiAgICBpZiAodGhpcy5wbGF5ZXJDb250YWluZXIpXHJcbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgfVxyXG5cclxuICBsb2FkU0RLKHVybCwgY2FsbGJhY2spIHtcclxuICAgIHRoaXMubCgnTE9BRElORyBTREsnKTtcclxuICAgIGlmICh3aW5kb3cuZ29vZ2xlPy5pbWEgJiYgY2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5sKCdJTUEgbG9hZGVkICYgaGF2ZSBhIGNhbGxiYWNrJyk7XHJcbiAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy5zY3JpcHRzTG9hZGVkW3RoaXMuc2RrVVJMXSA9PT0gJ3VuZGVmaW5lZCcgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFtzcmM9XCInICsgdGhpcy5zZGtVUkwgKyAnXCJdJykpIHtcclxuICAgICAgdGhpcy5sKCdTdGFydGluZyB0byBsb2FkIFNESycpO1xyXG4gICAgICB0aGlzLnNjcmlwdHNMb2FkZWRbdGhpcy5zZGtVUkxdID0geyBpc0xvYWRlZDogZmFsc2UgfVxyXG4gICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgIHNjcmlwdC5zcmMgPSB1cmw7XHJcbiAgICAgIHRoaXMuc2NyaXB0c0xvYWRlZFt0aGlzLnNka1VSTF0uc2NyaXB0ID0gc2NyaXB0O1xyXG4gICAgICBpZiAoY2FsbGJhY2spIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sKCdJTUEgU0RLIGp1c3QgbG9hZGVkJyk7XHJcbiAgICAgICAgdGhpcy5zY3JpcHRzTG9hZGVkW3RoaXMuc2RrVVJMXS5sb2FkZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9O1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICAgIHRoaXMubCgnU0NSSVBUIScsIHNjcmlwdCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVFbGVtZW50cygpIHtcclxuICAgIHRoaXMubCgnSGFuZGxpbmcgRWxlbWVudHMnKTtcclxuICAgIGlmICghdGhpcy52aWRlb1N0YXR1cykge1xyXG4gICAgICB0aGlzLmwoXCJDcmVhdGluZyBWaWRlbyBFbGVtZW50XCIpO1xyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XHJcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50LnNldEF0dHJpYnV0ZShcInBsYXlzaW5saW5lXCIsIFwiXCIpXHJcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50LnNldEF0dHJpYnV0ZShcImF1dG9wbGF5XCIsIFwiXCIpXHJcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIHRoaXMub3B0aW9ucy52aWRlby5zdHlsZSk7XHJcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50LnN0eWxlLm1heFdpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcclxuICAgICAgdGhpcy52aWRlb0VsZW1lbnQubXV0ZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5jb250cm9scyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmwoXCJWaWRlbyBFbGVtZW50XCIsIHRoaXMudmlkZW9FbGVtZW50KTtcclxuXHJcbiAgICAgIHRoaXMubChcIkNyZWF0aW5nIFZpZGVvIENvbnRhaW5lclwiKTtcclxuICAgICAgdGhpcy52aWRlb0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICB0aGlzLnZpZGVvQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ21wc3UtcGxheWVyLWNvbnRhaW5lcicpO1xyXG4gICAgICB0aGlzLnZpZGVvQ29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xyXG4gICAgICB0aGlzLnZpZGVvQ29udGFpbmVyLnN0eWxlLndpZHRoID0gdGhpcy5vcHRpb25zLnZpZGVvLndpZHRoICsgXCJweFwiO1xyXG4gICAgICB0aGlzLnZpZGVvQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IHRoaXMub3B0aW9ucy52aWRlby5oZWlnaHQgKyBcInB4XCI7XHJcbiAgICAgIHRoaXMudmlkZW9FbGVtZW50LmJlZm9yZSh0aGlzLnZpZGVvQ29udGFpbmVyKTtcclxuICAgICAgdGhpcy52aWRlb0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnZpZGVvRWxlbWVudCk7XHJcbiAgICAgIHRoaXMubChcIlZpZGVvIENvbnRhaW5lclwiLCB0aGlzLnZpZGVvQ29udGFpbmVyKTtcclxuXHJcbiAgICAgIHRoaXMubChcIkNyZWF0aW5nIEFkIENvbnRhaW5lclwiKTtcclxuICAgICAgdGhpcy5hZENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICB0aGlzLmFkQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ21wc3UtYWQtY29udGFpbmVyJyk7XHJcbiAgICAgIHRoaXMuYWRDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgIHRoaXMuYWRDb250YWluZXIuc3R5bGUudG9wID0gMDtcclxuICAgICAgdGhpcy5hZENvbnRhaW5lci5zdHlsZS5sZWZ0ID0gMDtcclxuICAgICAgdGhpcy5hZENvbnRhaW5lci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICB0aGlzLmFkQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgICB0aGlzLnZpZGVvQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuYWRDb250YWluZXIpO1xyXG4gICAgICB0aGlzLmwoXCJBZCBDb250YWluZXJcIiwgdGhpcy5hZENvbnRhaW5lcik7XHJcblxyXG4gICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKCk7XHJcbiAgICAgIHRoaXMucGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudmlkZW9Db250YWluZXIpO1xyXG5cclxuICAgICAgdGhpcy5hZGRWaWRlb0V2ZW50cygpO1xyXG5cclxuICAgICAgdGhpcy52aWRlb1N0YXR1cyA9IFwiaW5pdGlhdGVkXCI7XHJcbiAgICAgIHRoaXMubCgnVmlkZW8gc3RhdHVzOicsIHRoaXMudmlkZW9TdGF0dXMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMubCgnVmlkZW8gZWxlbWVudHMgYWxyZWFkeSBpbml0aWF0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWRBZHMoZXZlbnQpIHtcclxuICAgIHRoaXMubChcIkxvYWRpbmcgYWRzXCIpO1xyXG4gICAgaWYgKHRoaXMuYWRzTG9hZGVkKSB7XHJcbiAgICAgIHRoaXMubChcIkFkcyBhbHJlYWR5IGxvYWRlZFwiKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hZHNMb2FkZWQgPSB0cnVlO1xyXG4gICAgdGhpcy52aWRlb0VsZW1lbnQubG9hZCgpO1xyXG4gICAgdGhpcy5sKFwiVmlkZW8gZWxlbWVudCBsb2FkZWRcIik7XHJcbiAgICB0aGlzLmFkRGlzcGxheUNvbnRhaW5lci5pbml0aWFsaXplKCk7XHJcbiAgICB0aGlzLmwoXCJEaXNwbGF5IENvbnRhaW5lciBpbml0aWFsaXplZFwiKTtcclxuICAgIHZhciB3aWR0aCA9IHRoaXMudmlkZW9FbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgdmFyIGhlaWdodCA9IHRoaXMudmlkZW9FbGVtZW50LmNsaWVudEhlaWdodDtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMubChcIlRyeWluZyB0byBpbml0IGFkcyBtYW5hZ2VyXCIpO1xyXG4gICAgICB0aGlzLmwoXCJBZHMgTWFuYWdlcjogXCIsIHRoaXMuYWRzTWFuYWdlcik7XHJcbiAgICAgIHRoaXMubChcIndpbmRvdy5nb29nbGUuaW1hXCIsIHdpbmRvdy5nb29nbGUuaW1hKTtcclxuICAgICAgdGhpcy5hZHNNYW5hZ2VyLmluaXQod2lkdGgsIGhlaWdodCwgd2luZG93Lmdvb2dsZS5pbWEuVmlld01vZGUuTk9STUFMKTtcclxuICAgICAgdGhpcy5sKFwiU3RhcnRpbmcgYWRzIG1hbmFnZXJcIik7XHJcbiAgICAgIHRoaXMuYWRzTWFuYWdlci5zdGFydCgpO1xyXG4gICAgICB0aGlzLmwoXCJBZHMgTWFuYWdlciBTdGFydGVkXCIpO1xyXG4gICAgfSBjYXRjaCAoYWRFcnJvcikge1xyXG4gICAgICAvLyBQbGF5IHRoZSB2aWRlbyB3aXRob3V0IGFkcywgaWYgYW4gZXJyb3Igb2NjdXJzXHJcbiAgICAgIHRoaXMubChcIkFkc01hbmFnZXIgY291bGQgbm90IGJlIHN0YXJ0ZWRcIiwgYWRFcnJvcik7XHJcbiAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICB0aGlzLmV2ZW50cy5vbkVycm9yKClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFNldHRpbmdzIFxyXG5cclxuICBtZXJnZU9wdGlvbnMobykge1xyXG4gICAgdGhpcy5sKCdPcHRpb25zIGFyZSBvYmplY3QnLCB0aGlzLmlzT2JqZWN0KG8pKTtcclxuICAgIGlmICh0aGlzLmlzT2JqZWN0KG8pKVxyXG4gICAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLFxyXG4gICAgICAgIC4uLm9cclxuICAgICAgfVxyXG4gIH1cclxuICBpc09iamVjdChlKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIGUgPT09ICdvYmplY3QnICYmXHJcbiAgICAgICFBcnJheS5pc0FycmF5KGUpICYmXHJcbiAgICAgIGUgIT09IG51bGw7XHJcbiAgfVxyXG5cclxuICAvLyBFdmVudHNcclxuXHJcbiAgYWRkVmlkZW9FdmVudHMoKSB7XHJcbiAgICB0aGlzLmwoJ0FkZGluZyB2aWRlbyBldmVudHMnKTtcclxuICAgIHRoaXMudmlkZW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRlZFwiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubChcImVuZGVkIGV2ZW50IHRyaWdnZXJlZFwiKTtcclxuICAgICAgaWYgKHRoaXMuYWRzTG9hZGVyKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5TmV4dEFkKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy52aWRlb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHtcclxuICAgICAgdGhpcy5sKFwiZXJyb3IgZXZlbnQgdHJpZ2dlcmVkXCIpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnZpZGVvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLmwoXCJwYXVzZSBldmVudCB0cmlnZ2VyZWRcIik7XHJcbiAgICB9KTtcclxuICAgIHRoaXMudmlkZW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsICgpID0+IHtcclxuICAgICAgdGhpcy5sKFwicGxheSBldmVudCB0cmlnZ2VyZWRcIik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uQWRzTWFuYWdlckxvYWRlZChhZHNNYW5hZ2VyTG9hZGVkRXZlbnQpIHtcclxuICAgIHRoaXMubChcIkFkcyBNYW5hZ2VyIExvYWRlZFwiKTtcclxuICAgIHRoaXMuYWRzUmVuZGVyaW5nU2V0dGluZ3MgPSBuZXcgd2luZG93Lmdvb2dsZS5pbWEuQWRzUmVuZGVyaW5nU2V0dGluZ3MoKVxyXG4gICAgdGhpcy5hZHNSZW5kZXJpbmdTZXR0aW5ncy51aUVsZW1lbnRzID0gW1xyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5VaUVsZW1lbnRzLkFEX0FUVFJJQlVUSU9OLFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5VaUVsZW1lbnRzLkNPVU5URE9XTixcclxuICAgIF1cclxuICAgIHRoaXMubCgnSU1BJywgd2luZG93Lmdvb2dsZS5pbWEpO1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyID0gYWRzTWFuYWdlckxvYWRlZEV2ZW50LmdldEFkc01hbmFnZXIodGhpcy52aWRlb0VsZW1lbnQsIHRoaXMuYWRzUmVuZGVyaW5nU2V0dGluZ3MpO1xyXG5cclxuICAgIHRoaXMuYWRzTWFuYWdlci5zZXRWb2x1bWUoMCk7XHJcbiAgICB0aGlzLmFkTXV0ZWQgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMubCgnRXJyb3IgdHlwZXM6ICcsIHdpbmRvdy5nb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlKTtcclxuICAgIHRoaXMubCgnRXZlbnQgdHlwZXM6ICcsIHdpbmRvdy5nb29nbGUuaW1hLkFkRXZlbnQuVHlwZSk7XHJcblxyXG4gICAgdGhpcy5sKFwidGhpcy5hZHNNYW5hZ2VyXCIsIHRoaXMuYWRzTWFuYWdlcik7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFcnJvckV2ZW50LlR5cGUuQURfRVJST1IsXHJcbiAgICAgIChlKSA9PiB7IHRoaXMub25BZEVycm9yKGUpIH0pO1xyXG4gICAgdGhpcy5hZHNNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIHdpbmRvdy5nb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5DT05URU5UX1BBVVNFX1JFUVVFU1RFRCxcclxuICAgICAgKGUpID0+IHsgdGhpcy5vbkNvbnRlbnRQYXVzZVJlcXVlc3RlZChlKSB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuQ09OVEVOVF9SRVNVTUVfUkVRVUVTVEVELFxyXG4gICAgICAoZSkgPT4geyB0aGlzLm9uQ29udGVudFJlc3VtZVJlcXVlc3RlZChlKSB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuTE9BREVELFxyXG4gICAgICAoZSkgPT4geyB0aGlzLm9uQWRMb2FkZWQoZSkgfSk7XHJcblxyXG5cclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuU1RBUlRFRCxcclxuICAgICAgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmV2ZW50SW5mbyhlKTtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IHRoaXMudmlkZW9TdGF0dXMgPSBcInBsYXlpbmdcIjtcclxuICAgICAgICB0aGlzLmwoJ1RoZSB0aW1lb3V0IHdpbGwgYmUgY2xlYXJlZCcpO1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xyXG4gICAgICB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuRklSU1RfUVVBUlRJTEUsXHJcbiAgICAgIChlKSA9PiB7IHRoaXMuZXZlbnRJbmZvKGUpOyB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuTUlEUE9JTlQsXHJcbiAgICAgIChlKSA9PiB7IHRoaXMuZXZlbnRJbmZvKGUpOyB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuVEhJUkRfUVVBUlRJTEUsXHJcbiAgICAgIChlKSA9PiB7IHRoaXMuZXZlbnRJbmZvKGUpOyB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuQ09NUExFVEUsXHJcbiAgICAgIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ldmVudEluZm8oZSk7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSB0aGlzLnZpZGVvU3RhdHVzID0gXCJjb21wbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMubCgnU2V0dGluZyB0aW1lb3V0IHRvIGRpc2FibGUgdGhlIGFkcyBpZiBcImNvbXBsZXRlXCIgc3RhdHVzIHdpbGwgZXhjZWVkIHRpbWVvdXQgZHVyYXRpb24nKTtcclxuICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMubCgnVGltZW91dCBmaXJlZCcpO1xyXG4gICAgICAgICAgaWYgKFsncGF1c2VkJywgJ3BsYXlpbmcnLCAnYWxsX2NvbXBsZXRlJ10uaW5jbHVkZXModGhpcy5zdGF0dXMpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubCgnSXRcXCdzIG9rLCBnb2luZyBvbicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAodGhpcy5zdGF0dXMgPT09ICdjb21wbGV0ZScpIHtcclxuICAgICAgICAgICAgdGhpcy5sKCdTdGF0dXMgaXMgc3RpbGwgXCJjb21wbGV0ZVwiIG9uIHRpbWVvdXQsIGhpZGluZycpO1xyXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCB0aGlzLnRpbWVvdXREdXJhdGlvbik7XHJcblxyXG4gICAgICB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuQUxMX0FEU19DT01QTEVURUQsXHJcbiAgICAgIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ldmVudEluZm8oZSk7XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBcImFsbF9jb21wbGV0ZVwiO1xyXG4gICAgICAgIHRoaXMubCgnVGhlIHRpbWVvdXQgd2lsbCBiZSBjbGVhcmVkJyk7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sc0VsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgdGhpcy5sb2dvLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmxvb3ApIHtcclxuICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLlBBVVNFRCxcclxuICAgICAgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmV2ZW50SW5mbyhlKTtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IHRoaXMudmlkZW9TdGF0dXMgPSBcInBhdXNlZFwiO1xyXG4gICAgICB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuUkVTVU1FRCxcclxuICAgICAgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmV2ZW50SW5mbyhlKTtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IHRoaXMudmlkZW9TdGF0dXMgPSBcInBsYXlpbmdcIjtcclxuICAgICAgfSk7XHJcbiAgICB0aGlzLmFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgd2luZG93Lmdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLlZJREVPX0NMSUNLRUQsXHJcbiAgICAgIChlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ldmVudEluZm8oZSk7XHJcbiAgICAgICAgdGhpcy5ldmVudHMub25DbGljaygpO1xyXG4gICAgICB9KTtcclxuICAgIHRoaXMuYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICB3aW5kb3cuZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuSU1QUkVTU0lPTixcclxuICAgICAgKGUpID0+IHtcclxuICAgICAgICB0aGlzLmV2ZW50SW5mbyhlKTtcclxuICAgICAgICB0aGlzLmV2ZW50cy5vbkltcHJlc3Npb24oKTtcclxuICAgICAgfSk7XHJcblxyXG5cclxuICAgIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XHJcbiAgfVxyXG5cclxuICBldmVudEluZm8oZSkge1xyXG4gICAgbGV0IGFkID0gZS5nZXRBZCgpO1xyXG4gICAgbGV0IHBvZEluZm8gPSBhZC5nZXRBZFBvZEluZm8oKTtcclxuICAgIHRoaXMubGcoZS50eXBlICsgJyBmaXJlZCAoJyArIHBvZEluZm8uZ2V0QWRQb3NpdGlvbigpICsgJyknKTtcclxuICAgIHRoaXMubCgnQWQgZGF0YTonLCBhZClcclxuICAgIHRoaXMubCgnUmVtYWluaW5nIFRpbWUnLCB0aGlzLmFkc01hbmFnZXIuZ2V0UmVtYWluaW5nVGltZSgpKTtcclxuICAgIHRoaXMubCgnVGltZSBoYXMgcGFzc2VkJywgYWQuZ2V0RHVyYXRpb24oKSAtIHRoaXMuYWRzTWFuYWdlci5nZXRSZW1haW5pbmdUaW1lKCkpO1xyXG4gICAgdGhpcy5sKCdBZCBQb3NpdGlvbicsIHBvZEluZm8uZ2V0QWRQb3NpdGlvbigpKTtcclxuICAgIHRoaXMubCgnVG90YWwgQWRzJywgcG9kSW5mby5nZXRUb3RhbEFkcygpKTtcclxuICAgIHRoaXMubCgnTWF4IER1cmF0aW9uJywgcG9kSW5mby5nZXRNYXhEdXJhdGlvbigpKTtcclxuXHJcbiAgICB0aGlzLmxnZSgpO1xyXG4gIH1cclxuXHJcbiAgb25BZEVycm9yKGFkRXJyb3JFdmVudCkge1xyXG4gICAgdGhpcy5sKCdFcnJvciBmaXJlZCcsIGFkRXJyb3JFdmVudC5nZXRFcnJvcigpKTtcclxuICAgIHRoaXMuZHJvcEFkTG9hZGVyKHRydWUpO1xyXG4gICAgdGhpcy5oaWRlKCk7XHJcbiAgICB0aGlzLmV2ZW50cy5vbkVycm9yKCk7XHJcbiAgfVxyXG5cclxuICBvbkNvbnRlbnRQYXVzZVJlcXVlc3RlZCgpIHtcclxuICAgIHRoaXMubChcIkNvbnRlbnQgcGF1c2UgcmVxdWVzdGVkXCIpO1xyXG4gICAgdGhpcy52aWRlb0VsZW1lbnQucGF1c2UoKTtcclxuICB9XHJcblxyXG4gIG9uQ29udGVudFJlc3VtZVJlcXVlc3RlZCgpIHtcclxuICAgIHRoaXMubChcIkNvbnRlbnQgcmVzdW1lIHJlcXVlc3RlZFwiKTtcclxuICAgIGlmICh0aGlzLmxvb3ApIHtcclxuICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZENvbnRhaW5lckNsaWNrKGV2ZW50KSB7XHJcbiAgICB0aGlzLmwoXCJBZCBjb250YWluZXIgY2xpY2tlZFwiKTtcclxuICAgIGlmICh0aGlzLnZpZGVvRWxlbWVudC5wYXVzZWQpIHtcclxuICAgICAgdGhpcy5sKFwiUGxheWluZyB2aWRlb1wiKTtcclxuICAgICAgdGhpcy52aWRlb0VsZW1lbnQucGxheSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sKFwiUGF1c2luZyB2aWRlb1wiKTtcclxuICAgICAgdGhpcy52aWRlb0VsZW1lbnQucGF1c2UoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQWRMb2FkZWQoYWRFdmVudCkge1xyXG4gICAgdGhpcy5sKFwiVGhlIGFkIGlzIGxvYWRlZFwiKTtcclxuICAgIHZhciBhZCA9IGFkRXZlbnQuZ2V0QWQoKTtcclxuICAgIGlmICghYWQuaXNMaW5lYXIoKSkge1xyXG4gICAgICB0aGlzLnZpZGVvRWxlbWVudC5wbGF5KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRXaW5kb3dSZXNpemVFdmVudCgpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoZXZlbnQpID0+IHtcclxuICAgICAgdGhpcy5sKFwid2luZG93IHJlc2l6ZWRcIik7XHJcbiAgICAgIGlmICh0aGlzLmFkc01hbmFnZXIpIHtcclxuICAgICAgICB2YXIgd2lkdGggPSB0aGlzLnZpZGVvRWxlbWVudC5jbGllbnRXaWR0aDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy52aWRlb0VsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuYWRzTWFuYWdlci5yZXNpemUod2lkdGgsIGhlaWdodCwgd2luZG93Lmdvb2dsZS5pbWEuVmlld01vZGUuTk9STUFMKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGRTb3VuZEJ1dHRvbkV2ZW50cygpIHtcclxuICAgIGlmICh0aGlzLnNvdW5kQnRuKSB7XHJcbiAgICAgIHRoaXMuc291bmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sKCdhZE11dGVkJywgdGhpcy5hZE11dGVkKVxyXG4gICAgICAgIGlmICh0aGlzLmFkTXV0ZWQpIHtcclxuICAgICAgICAgIHRoaXMubCgnVU5NVVRJTkcnKVxyXG4gICAgICAgICAgdGhpcy5zb3VuZEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdtdXRlZCcpO1xyXG4gICAgICAgICAgdGhpcy51bm11dGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmwoJ01VVElORycpXHJcbiAgICAgICAgICB0aGlzLnNvdW5kQnRuLmNsYXNzTGlzdC5hZGQoJ211dGVkJyk7XHJcbiAgICAgICAgICB0aGlzLm11dGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkUGxheUJ1dHRvbkV2ZW50cygpIHtcclxuICAgIGlmICh0aGlzLnBsYXlCdG4pIHtcclxuICAgICAgdGhpcy5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMubCgndmlkZW9TdGF0dXMnLCB0aGlzLnZpZGVvU3RhdHVzKVxyXG4gICAgICAgIGlmICh0aGlzLnZpZGVvU3RhdHVzID09PSAncGxheWluZycpIHtcclxuICAgICAgICAgIHRoaXMubCgncGF1c2luZycpXHJcbiAgICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LnJlbW92ZSgncGxheWluZycpO1xyXG4gICAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubCgncGxheWluZycpXHJcbiAgICAgICAgICB0aGlzLnBsYXlCdG4uY2xhc3NMaXN0LmFkZCgncGxheWluZycpO1xyXG4gICAgICAgICAgdGhpcy5yZXN1bWUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkQ2xvc2VCdXR0b25FdmVudHMoKSB7XHJcbiAgICBpZiAodGhpcy5jbG9zZUJ0bikge1xyXG4gICAgICB0aGlzLmNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMubCgnQ2xvc2UgYnV0dG9uIGNsaWNrZWQnKTtcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8gR2V0dGVyc1xyXG5cclxuICBnZXRBZENvbnRhaW5lcigpIHtcclxuICAgIHJldHVybiB0aGlzLmFkQ29udGFpbmVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0VmlkZW9FbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudmlkZW9FbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgZ2V0VmlkZW9Db250YWluZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy52aWRlb0NvbnRhaW5lcjtcclxuICB9XHJcblxyXG4gIC8vIERlYnVnXHJcblxyXG4gIGwoLi4uYXJncykge1xyXG4gICAgaWYgKHRoaXMuZGVidWcpIHtcclxuICAgICAgaWYgKCF0aGlzLmRlYnVnR3JvdXBPcGVuZWQpXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5kZWJ1Z0xhYmVsLCB0aGlzLmRlYnVnU3R5bGVzLCAuLi5hcmdzKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGcobGFiZWwgPSBcIlwiKSB7XHJcbiAgICBpZiAodGhpcy5kZWJ1ZyAmJiAhdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkKSB7XHJcbiAgICAgIHRoaXMuZGVidWdHcm91cE9wZW5lZCA9IHRydWU7XHJcbiAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQodGhpcy5kZWJ1Z0xhYmVsLCB0aGlzLmRlYnVnU3R5bGVzLCBsYWJlbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsZ2UoKSB7XHJcbiAgICBpZiAodGhpcy5kZWJ1ZyAmJiB0aGlzLmRlYnVnR3JvdXBPcGVuZWQpIHtcclxuICAgICAgdGhpcy5kZWJ1Z0dyb3VwT3BlbmVkID0gZmFsc2U7XHJcbiAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBIVE1MRHJpdmVyIGZyb20gXCIuL2RyaXZlcnMvaHRtbF9kcml2ZXJcIjtcbmltcG9ydCBJbWFnZURyaXZlciBmcm9tIFwiLi9kcml2ZXJzL2ltYWdlX2RyaXZlclwiO1xuaW1wb3J0IFByZWJpZERyaXZlciBmcm9tIFwiLi9kcml2ZXJzL3ByZWJpZF9kcml2ZXJcIjtcbmltcG9ydCBSZXdhcmRlZERyaXZlciBmcm9tIFwiLi9kcml2ZXJzL3Jld2FyZGVkX2RyaXZlclwiO1xuaW1wb3J0IFZrRHJpdmVyIGZyb20gXCIuL2RyaXZlcnMvdmtfZHJpdmVyXCI7XG5pbXBvcnQgVktJblBhZ2VEcml2ZXIgZnJvbSBcIi4vZHJpdmVycy92a19pbnBhZ2VfZHJpdmVyXCI7XG5pbXBvcnQgVlBBSUREcml2ZXIgZnJvbSBcIi4vZHJpdmVycy92cGFpZF9kcml2ZXJcIjtcblxudmFyIGRyaXZlciA9IChuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldCgnZHJpdmVyJykpID8/ICdodG1sJztcbnZhciBhZFVuaXQgPSBudWxsO1xuLy8vLy8vLy8vLy8vLy8gSFRNTCAvLy8vLy8vLy8vLy8vL1xuaWYgKGRyaXZlciA9PT0gJ2h0bWwnKSB7XG4gICAgYWRVbml0ID0gbmV3IEhUTUxEcml2ZXIoe1xuICAgICAgICBodG1sOiBgXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIj9kcml2ZXI9aW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgICAgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzb21lLWNsYXNzXCI+U29tZSB0ZXh0IHRvIHNob3cgdGhhdCB0aGUgY29kZSBpcyB3b3JraW5nPFxcL3NwYW4+XG4gICAgICAgICAgICAgICAgPFxcL2E+XG4gICAgICAgICAgICAgICAgPHNjcmlwdD5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coMSk7XG4gICAgICAgICAgICAgICAgPFxcL3NjcmlwdD5cbiAgICAgICAgICAgIDwvZGl2PmAsXG4gICAgICAgIGRlYnVnOiAxLCAgICAgICAvLyBvcHRpb25hbFxuICAgICAgICBpbklmcmFtZTogdHJ1ZSwgLy8gb3B0aW9uYWxcbiAgICB9KTtcblxuICAgIGFkVW5pdC5zaG93KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWQtY29udGFpbmVyXCIpKTtcbn1cbi8vLy8vLy8vLy8vLy8vIEltYWdlIC8vLy8vLy8vLy8vLy8vXG5lbHNlIGlmIChkcml2ZXIgPT09ICdpbWFnZScpIHtcbiAgICBhZFVuaXQgPSBuZXcgSW1hZ2VEcml2ZXIoe1xuICAgICAgICB1cmw6ICdodHRwczovL2loMC5yZWRidWJibGUubmV0L2ltYWdlLjIzNDk2MTY4My41NTE2L3JhZiwzNjB4MzYwLDA3NSx0LGZhZmFmYTpjYTQ0M2Y0Nzg2LmpwZycsXG4gICAgICAgIGRlYnVnOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvcHRpb25hbFxuICAgICAgICBpbklmcmFtZTogdHJ1ZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgbGluazogJz9kcml2ZXI9aHRtbCcsIC8vIG9wdGlvbmFsLCBuZXh0IGF2YWlsYWJsZSBpZiB0aGUgbGluayBpcyBzZXRcbiAgICAgICAgaW5OZXdUYWI6IHRydWUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgIHRpdGxlOiAnU29tZSBzdHJpbmcnLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvcHRpb25hbFxuICAgIH0pO1xuXG4gICAgYWRVbml0LnNob3coZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhZC1jb250YWluZXJcIikpO1xufVxuLy8vLy8vLy8vLy8vLy8gVksgLy8vLy8vLy8vLy8vLy9cbmVsc2UgaWYgKGRyaXZlciA9PT0gJ3ZrJykge1xuICAgIGFkVW5pdCA9IG5ldyBWa0RyaXZlcih7XG4gICAgICAgIHNsb3RJZDogMTMwMzI1MyxcbiAgICAgICAgYWRTdHlsZXM6IHsgLy8gb3B0aW9uYWxcbiAgICAgICAgICAgIHdpZHRoOiAnMzAwcHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMjUwcHgnXG4gICAgICAgIH0sXG4gICAgICAgIGRlYnVnOiAxLCAgIC8vIG9wdGlvbmFsXG4gICAgfSk7XG5cbiAgICBhZFVuaXQuc2hvdyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FkLWNvbnRhaW5lclwiKSk7XG59XG4vLy8vLy8vLy8vLy8vLyBWSyBJblBhZ2UgLy8vLy8vLy8vLy8vLy9cbmVsc2UgaWYgKGRyaXZlciA9PT0gJ2lucGFnZScpIHtcbiAgICBhZFVuaXQgPSBuZXcgVktJblBhZ2VEcml2ZXIoe1xuICAgICAgICBhZFN0eWxlczoge1xuICAgICAgICAgICAgd2lkdGg6ICc2NDBweCcsXG4gICAgICAgICAgICBoZWlnaHQ6ICczNjBweCdcbiAgICAgICAgfSxcbiAgICAgICAgc2xvdElkOiAxMzUxNDM3LFxuICAgICAgICBkZWJ1ZzogMSxcbiAgICB9KTtcblxuICAgIGFkVW5pdC5zaG93KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWQtY29udGFpbmVyXCIpKTtcbn1cblxuLy8vLy8vLy8vLy8vLy8gVlBBSUQgLy8vLy8vLy8vLy8vLy9cbmVsc2UgaWYgKGRyaXZlciA9PT0gJ3ZwYWlkJykge1xuICAgIGFkVW5pdCA9IG5ldyBWUEFJRERyaXZlcih7XG4gICAgICAgIC8vIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lci1mb3ItYWQnKSwgLy8gb3B0aW9uYWxcbiAgICAgICAgaGFzaDogJ1NscERGUkRSQk16TTFNek5CTnpZd1QwMVJQUT09JyxcbiAgICAgICAgd2lkZ2V0SWQ6ICczMzUzJyxcbiAgICAgICAgZGVidWc6IDEsICAgICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgIGxvb3A6IHRydWUsICAgICAgICAvLyBvcHRpb25hbFxuICAgIH0pO1xuXG4gICAgYWRVbml0LnNob3coZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNhZC1jb250YWluZXJcIikpO1xufVxuLy8vLy8vLy8vLy8vLy8gVksgUmV2YXJkZWQgLy8vLy8vLy8vLy8vLy9cbmVsc2UgaWYgKGRyaXZlciA9PT0gJ3Jld2FyZGVkJykge1xuICAgIGFkVW5pdCA9IG5ldyBSZXdhcmRlZERyaXZlcih7XG4gICAgICAgIGFkczoge1xuICAgICAgICAgICAgZGVza3RvcDoge1xuICAgICAgICAgICAgICAgIGJsb2NrSWQ6IFwiUi1BLTM0MDAxNjctNFwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiZnVsbHNjcmVlblwiLFxuICAgICAgICAgICAgICAgIHBsYXRmb3JtOiBcImRlc2t0b3BcIlxuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW9iaWxlOiB7XG4gICAgICAgICAgICAgICAgYmxvY2tJZDogXCJSLUEtMzQwMDE2Ny0zXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJmdWxsc2NyZWVuXCIsXG4gICAgICAgICAgICAgICAgcGxhdGZvcm06IFwidG91Y2hcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkZWJ1ZzogMVxuXG4gICAgfSk7XG5cbiAgICBsZXQgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uLmlkID0gJ2J1dHRvbic7XG4gICAgYnV0dG9uLmlubmVySFRNTCA9ICdDbGljayBtZSEnO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuICAgIGFkVW5pdC5zaG93KCcjYnV0dG9uJyk7XG59XG4vLy8vLy8vLy8vLy8vLyBQcmViaWQuanMgKG9uZSBhZCB1bml0IHBlciB0aW1lKSAvLy8vLy8vLy8vLy8vL1xuZWxzZSBpZiAoZHJpdmVyID09PSAncHJlYmlkJykge1xuXG4gICAgbGV0IHBiVXJsID0gJ2pzL3ByZWJpZC5qcyc7XG4gICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgc2NyaXB0LnNyYyA9IHBiVXJsO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblxuICAgIGxldCBhZFVuaXRDb25maWcgPSB7XG4gICAgICAgIGNvZGU6ICdkaXYtZ3B0LWFkLTMwMHgyNTBfc3RhdCcsXG4gICAgICAgIG1lZGlhVHlwZXM6IHtcbiAgICAgICAgICAgIGJhbm5lcjoge1xuICAgICAgICAgICAgICAgIHNpemVzOiBbWzMwMCwgMjUwXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYmlkczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJpZGRlcjogXCJhZHJpdmVyXCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHNpdGVpZDogJzM4MScsXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudElkOiAnNjM6a2lub3JvbGVfcHJlYmlkX3N0YXRfdjInLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmlkZGVyOiBcIm15dGFyZ2V0XCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudElkOiAnMTQwMDUxMCcsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiaWRkZXI6IFwiaHlicmlkXCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogXCJiYW5uZXJcIixcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VJZDogXCI2NGY4ODBiYWI3ZWEwNjE1NjA2OWU3M2JcIixcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJpZGRlcjogJ3J0YnNhcGUnLFxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBwbGFjZUlkOiA4NjAzNDYsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiaWRkZXI6ICdidXp6b29sYScsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudElkOiAnMTI1MzY3OScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiaWRkZXI6ICdiZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgczogJzQ3MTM3MTAnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmlkZGVyOiAnb3RtJyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgdGlkOiAnNDg4ODUnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIF1cbiAgICB9O1xuXG4gICAgbGV0IHBiQ29uZmlnID0ge1xuICAgICAgICBjdXJyZW5jeToge1xuICAgICAgICAgICAgYWRTZXJ2ZXJDdXJyZW5jeTogXCJSVUJcIixcbiAgICAgICAgICAgIGdyYW51bGFyaXR5TXVsdGlwbGllcjogMSxcbiAgICAgICAgICAgIGRlZmF1bHRSYXRlczoge1xuICAgICAgICAgICAgICAgIFwiVVNEXCI6IHsgXCJSVUJcIjogOTguMzA4ODM5NTk1MDQ0IH0sXG4gICAgICAgICAgICAgICAgXCJFVVJcIjogeyBcIlJVQlwiOiAxMDUuMjkyNzc1NDQ0MzQgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmlyc3RQYXJ0eURhdGE6IHtcbiAgICAgICAgICAgIHVhSGludHM6IFtcbiAgICAgICAgICAgICAgICBcImFyY2hpdGVjdHVyZVwiLFxuICAgICAgICAgICAgICAgIFwibW9kZWxcIixcbiAgICAgICAgICAgICAgICBcInBsYXRmb3JtXCIsXG4gICAgICAgICAgICAgICAgXCJwbGF0Zm9ybVZlcnNpb25cIixcbiAgICAgICAgICAgICAgICBcImZ1bGxWZXJzaW9uTGlzdFwiXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJTeW5jOiB7XG4gICAgICAgICAgICB1c2VySWRzOiBbe1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2hhcmVkSWRcIixcbiAgICAgICAgICAgICAgICBzdG9yYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY29va2llXCIsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiX3NoYXJlZGlkXCIsXG4gICAgICAgICAgICAgICAgICAgIGV4cGlyZXM6IDE4MFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJhZHJpdmVySWRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncGFpcklkJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICByZWFsVGltZURhdGE6IHtcbiAgICAgICAgICAgIGF1Y3Rpb25EZWxheTogMTAwLFxuICAgICAgICAgICAgZGF0YVByb3ZpZGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3VzdG9tR2VvbG9jYXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ3YWl0Rm9ySXRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJwYXJhbXNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiA0Ny4yMzUwNzIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogMzkuNzk2NzM2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiAxNjk1MDIxMDMzMDI5XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaW50ZXJzZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwid2FpdEZvckl0XCI6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBlbmFibGVUSURzOiB0cnVlLFxuICAgICAgICBkZXZpY2VBY2Nlc3M6IHRydWUsXG4gICAgICAgIGFsbG93QWN0aXZpdGllczoge1xuICAgICAgICAgICAgc3luY1VzZXI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgYWxsb3c6IHRydWUgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhY2Nlc3NEZXZpY2U6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgYWxsb3c6IHRydWUgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgYWRVbml0ID0gbmV3IFByZWJpZERyaXZlcih7IGlkOiBhZFVuaXRDb25maWcuY29kZSwgY29uZmlnOiBhZFVuaXRDb25maWcsIHBiQ29uZmlnOiBwYkNvbmZpZyB9KTtcbiAgICBhZFVuaXQuc2hvdyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2FkLWNvbnRhaW5lclwiKSk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=