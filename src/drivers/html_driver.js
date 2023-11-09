export default class HTMLDriver {
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