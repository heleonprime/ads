import HTMLDriver from "./drivers/html_driver";
import ImageDriver from "./drivers/image_driver";
import PrebidDriver from "./drivers/prebid_driver";
import RewardedDriver from "./drivers/rewarded_driver";
import VkDriver from "./drivers/vk_driver";
import VKInPageDriver from "./drivers/vk_inpage_driver";
import VPAIDDriver from "./drivers/vpaid_driver";

var driver = (new URLSearchParams(window.location.search).get('driver')) ?? 'html';
var adUnit = null;
////////////// HTML //////////////
if (driver === 'html') {
    adUnit = new HTMLDriver({
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
    adUnit = new ImageDriver({
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
    adUnit = new VkDriver({
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
    adUnit = new VKInPageDriver({
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
    adUnit = new VPAIDDriver({
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
    adUnit = new RewardedDriver({
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

    let adUnit = new PrebidDriver({ id: adUnitConfig.code, config: adUnitConfig, pbConfig: pbConfig });
    adUnit.show(document.querySelector("#ad-container"));
}
