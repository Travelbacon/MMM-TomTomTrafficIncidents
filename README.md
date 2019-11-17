# MMM-TomTomTrafficIncidents
Magic Mirror Module uses the TomTom map with traffic and incidents information from TomTom. You can select wich way the traffice should be displayd. Is it relative or absolute. Should a road with slow speed limit marked red, or only when there is a congestion going on? Also it is possible to show the traffic incidents as icons on the map. For examples accidents, road blocks, etc. etc..
Big difference with Google Maps that is really free for 2.5000 calls, and you don't need to leave your credit card credentials. And as mentioned, TomTom can disply traffic relative while Google and Bing allways show absolute traffice in speed.
The module is based on the public previev V5. TomTom expects to release V5 to the public within a few months. Don't worry, this module will keep on working when the release is there if you keep remoteTTCSSJS to it's default value of false. In this way module will use the local stored javascript and css files for TomTom.

# Configuring the Module
The following settings can be changed.

## Required settings.
### key from TomTom
key: default ""
In order to get the data from TomTom a developpers key is required. A key can be obtained free, and without the need of a credit card or any other payment, from the developpers site. At https://developer.tomtom.com you can register yourself. When registration is a success, the site will guide to create a key for you application.
The key is free for 2.500 transictions on daily basis. When this limit has been reached, 

- height: default "75vh"
- width: default "75vw"
Here you can set the heigth and width of the map in any CSS unit style.

- traffic: "relative"
Here you can select in wich way traffic should be displayed. There are three options.
- absolute: roads will be marked green for high speed and red for low speed.
- delay: roods will be marked green or red when speed is slower than normal.
- relative-delay:  only the roads where the speed is slower than normal will be marked on the map.

- refresh: (15 * 60 * 1000)
The settings are in ms. In this case I made a readable value of every  15 minutes. On TomTom you get 2.5000 transactions on daily basis for free. When you reach the limit, "HTTP 403 – Over the limit error" errors will occur. You will see them in the log of MagicMirror.
The calculation is something I have to figure out in detail. From https://developer.tomtom.com/store/maps-api I read that each 15 requests for a map, traffic, and incidents counts as one request. The Map is not being refreshed, but traffic and accidents are. The question open is, is one road on request or the whole map one request? So far I read the documentation, each road or accident is one request.

- showIncidents: true
- showTraffic: true
If you want to display traffic and/or the incidents on the map.

- remoteTTCSSJS: false
The following settings is only needed when you wnat newer maps.css, traffic-incidents.css, and maps-web.min.js from TomTom site.
Default it is https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.39/maps/" 

- TTVersion: "5.39.0" Whenever TomTom releases a new version, and remoteTTCSSJS is set to true, this value van be changed to the most current version. It is advisable not to use the TomTom server unless your enforced to do so. By legal or something. When the the api.tomtom.com is not reachable, this part of the module will stall. It is at the moment not possible to fix this due technical reasons.

# LICENSING from TomTom
The files maps.css, traffic-incidents.css, and maps-web.min.js are lincesd by TomTom. Read the LICENSE.txt in the folder tomtom-international-web-sdk-maps for details.
