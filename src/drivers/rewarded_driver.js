export default class RewardedDriver {
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