Module.register("MMM-TomTomTrafficIncidents",{

	defaults: {
		requiresVersion: "2.8.0",  //Developped and tested with this version.
		key: "",
		height: "75vh",
		width: "75vh",
		traffic: "relative",
		refresh: (15 * 60 * 1000), //Human readable for every 15 minutes.
		showIncidents: true,
		showTraffic: true,
		remoteTTCSSJS: false,
		TTVersion: "5.39.0" //Internal solution to quickly change version of TomTom API to a new version.
	},
		
	getStyles: function() {
		//Not getting data from Tomtom, will stall the module. Give the user the choice for local.
		if(this.config.remoteTTCSSJS) {
			return [
				"https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/" +  this.config.TTVersion + "/maps/maps.css",
				"https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/" +  this.config.TTVersion + "/maps/css-styles/traffic-incidents.css"
			]
		} else {
			return [
				this.file("tomtom-international-web-sdk-maps/maps.css"),
				this.file("tomtom-international-web-sdk-maps/traffic-incidents.css")
			]
		}
	},
	
	start: function() {
		Log.info("Starting module: " + this.name);

        if (this.config.key === "") {
			Log.error(this.name + ": key not set. Please read the README.md for details.");
			return;
		}
	}, 
	
	getDom: function() {
		let wrapper = document.createElement("div");
		wrapper.setAttribute("id", "map");
		wrapper.setAttribute("class", "map");
		wrapper.style.height = this.config.height;
        wrapper.style.width = this.config.width;
		
		let script = document.createElement("script"); //Getscripts is not working in this module.
		script.type = "text/javascript";
		if(this.config.remoteTTCSSJS) {
			script.src = "https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/" + this.config.TTVersion + "/maps/maps-web.min.js";
		} else {
			script.src = this.file("tomtom-international-web-sdk-maps/maps-web.min.js");
		}
		script.setAttribute('defer','');
		script.setAttribute('async','');
		document.body.appendChild(script);
		
		var self = this;	//Fixme: why?			
				
    	script.onload = function () {
			tt.setProductInfo('MagicMirror TomTom Traffic & Incidents', '1.0');
			let map = new tt.map({
				key: self.config.key,
				container: 'map',
				center: [self.config.lng, self.config.lat],
				zoom:self.config.zoom,
				style: 'tomtom://vector/1/basic-night',
				language: self.config.lang,
				interactive: false
			});

			map.on('load', function() {
				if (self.config.showTraffic) {
					map.addTier(new tt.TrafficFlowTilesTier({
						key: self.config.key,
						style: 'tomtom://vector/1/' + self.config.traffic,
						refresh: self.config.refresh
					}));
				}
				if (self.config.showIncidents) {
					map.addTier(new tt.TrafficIncidentTier({
						key: self.config.key,
						incidentTiles: { style: 'tomtom://vector/1/s1'},
						incidentDetails: {style: 'night'},  //night doesn't group the icons.
						refresh: self.config.refresh
					}))
				}
			})
		}
		return wrapper;
	}
});