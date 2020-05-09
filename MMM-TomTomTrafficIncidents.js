Module.register("MMM-TomTomTrafficIncidents",{

	defaults: {
		requiresVersion: "2.8.0",  //Developped and tested with this version.
		key: "",
		lang: config.language,
		height: "75vh",
		width: "75vw",
		traffic: "relative",
		refresh: (15 * 60 * 1000), //Human readable for every 15 minutes.
		showIncidents: true,
		showTraffic: true,
		showMarker: false,
		remoteTTCSSJS: false,
		zoom: 11,
		TTVersion: "5.52.0" //Internal solution to quickly change version of TomTom API to a new version.
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
			Log.error(`${this.name}: key not set. Please read the README.md for details.`);
			return;
		}
		if (this.config.remoteTTCSSJS === true) {
			Log.info(`${this.name}: Using JS & CSS from https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/${this.config.TTVersion}`);
		} else {
			Log.info(`${this.name}: Using JS & CSS from local source.`);
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
			});
			
			if( self.config.showMarker) {
				let marker = new tt.Marker({
					width: self.config.mwidth,
					height: self.config.mheight
				});
				marker.setLngLat([self.config.mlng, self.config.mlat]);
				marker.addTo(map);
			};
		
		}
		return wrapper;
	}
});
