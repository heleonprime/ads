export default class VkDriver {
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