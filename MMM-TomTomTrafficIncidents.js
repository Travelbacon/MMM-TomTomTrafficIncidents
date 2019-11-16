Module.register("MMM-TomTomTrafficIncidents",{

	defaults: {
		key: "",
		height: "75vh",
		width: "75vh",
		traffic: "relative",
		refresh: 30000, //default setting from TomTom. <30.000 will be treated as 30.000.
		showIncidents: true,
		showTraffic: true,
		TTVersion: "5.39.0" //internal solution to quickly change version of TomTom API to a new version.
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
		
		alert("Version :" + this.config.TTVersion);
	
		let mapstyle = document.createElement("link");
		mapstyle.type = "text/css";
		mapstyle.rel = "stylesheet";
		mapstyle.href = "https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/" + this.config.TTVersion + "/maps/maps.css";
		document.head.appendChild(mapstyle);
		
		let trafficstyle = document.createElement("link");
		trafficstyle.type = "text/css";
		trafficstyle.rel = "stylesheet";
		trafficstyle.href = "https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/" + this.config.TTVersion + "/maps/css-styles/traffic-incidents.css";
		document.head.appendChild(trafficstyle);
		
		let script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/" + this.config.TTVersion + "/maps/maps-web.min.js";
		script.setAttribute('defer','');
		script.setAttribute('async','');
		document.body.appendChild(script);
		
		var self = this;	//Fixme: why?			
				
    	script.onload = function () {
			tt.setProductInfo('MagicMirror TomTomTrafficIncidents', '0.9');
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
						style: 'tomtom://raster/1/' + self.config.traffic,
						refresh: self.config.refresh
					}));
				}
				if (self.config.showIncidents) {
					map.addTier(new tt.TrafficIncidentTier({
						key: self.config.key,
						incidentTiles: { style: 'tomtom://raster/1/s1'},
						incidentDetails: {style: 'night'},  //night doesn't group the icons.
						refresh: self.config.refresh
					}))
				}
			})
		}
		return wrapper;
	}
});