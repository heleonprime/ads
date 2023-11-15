export default class VPAIDDriver {

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