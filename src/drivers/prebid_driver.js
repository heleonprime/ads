export default class PrebidDriver {
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