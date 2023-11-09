export default class VKInPageDriver {
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
                    this.l(data.error, 'Media chunk error');
                case 311:
                    this.l(data.error, 'No container on the page');
                case 312:
                    this.l(data.error, 'No place in container');
                case 313:
                    this.l(data.error, 'RenderRunner load error');
                case 314:
                    this.l(data.error, 'Message system error');
                case 315:
                    this.l(data.error, 'Unacceptable creative');
                case 316:
                    this.l(data.error, 'Container link error');
                case 321:
                    this.l(data.error, 'Empty ad section');
                case 322:
                    this.l(data.error, 'Visit is not an object');
                case 323:
                    this.l(data.error, 'Server error');
                case 331:
                    this.l(data.error, 'Config error');
                case 332:
                    this.l(data.error, 'Slot is not specified');
                case 333:
                    this.l(data.error, 'Container is not specified');
                case 341:
                    this.l(data.error, 'Wrong inline banner (base64)');
                case 342:
                    this.l(data.error, 'Wrong inline config. Check the "src" attribute');
                case 351:
                    this.l(data.error, 'No media in section');
                case 352:
                    this.l(data.error, 'Invalid JSON server response');
                case 353:
                    this.l(data.error, 'Config is not an object');
                case 361:
                    this.l(data.error, 'Video element error');
                case 362:
                    this.l(data.error, 'Old browser (IntersectionObserver);)');
                case 5001:
                    this.l(data.error, 'Common error');
                case 5002:
                    this.l(data.error, 'Already initialized');
                case 5003:
                    this.l(data.error, 'Not initialized');
                case 5004:
                    this.l(data.error, 'Not in play status');
                case 5005:
                    this.l(data.error, 'Not in pause status');
                case 5006:
                    this.l(data.error, 'The ad is already started');
                case 5007:
                    this.l(data.error, 'Destroyed');
                case 5008:
                    this.l(data.error, 'Forbidden in stream mode (playMode="stream")');
                case 1100:
                    this.l(data.error, 'Empty ad response');
                default:
                    this.l(data.error, 'Unknown error');
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