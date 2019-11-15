Module.register("MMM-TomTomTrafficIncidents",{

	defaults: {
		key: "",
		height: "75vh",
		width: "75vh",
		traffic: 'relative',
		refresh: 30000 //default setting from TomTom. <30.000 will be treated as 30.000.
	},
	
	start: function() {
		Log.info("Starting module: " + this.name);

        if (this.config.key === "") {
			Log.error(this.name + ": key not set. Please read the README.md for details.");
			return;
		}
	}, 
	
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.setAttribute("id", "map");
		wrapper.setAttribute("class", "map");
		wrapper.style.height = this.config.height;
        wrapper.style.width = this.config.width;
	
		var style1 = document.createElement("link");
		style1.type = "text/css";
		style1.rel = "stylesheet";
		style1.href = "https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.39.0/maps/maps.css";
		document.head.appendChild(style1);
		
		var style2 = document.createElement("link");
		style2.type = "text/css";
		style2.rel = "stylesheet";
		style2.href = "https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.39.0/maps/css-styles/traffic-incidents.css";
		document.head.appendChild(style2);
		
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.39.0/maps/maps-web.min.js";
		script.setAttribute('defer','');
		script.setAttribute('async','');
		document.body.appendChild(script);
		
		var self = this;	//Fixme: why?			
				
    	script.onload = function () {
			tt.setProductInfo('MagicMirror TomTomTrafficIncidents', '0.9');
			var map = new tt.map({
				key: self.config.key,
				container: 'map',
				center: [self.config.lng, self.config.lat],
				zoom:self.config.zoom,
				style: 'tomtom://vector/1/basic-night',
				language: self.config.lang,
				interactive: false
			});

			map.on('load', function() {
				map.addTier(new tt.TrafficFlowTilesTier({
					key: self.config.key,
					style: 'tomtom://raster/1/' + self.config.traffic,
					refresh: self.config.refresh
				}));
				map.addTier(new tt.TrafficIncidentTier({
					key: self.config.key,
					incidentTiles: { style: 'tomtom://raster/1/s1'},
					incidentDetails: {style: 'night'},  //night doesn't group the icons.
					refresh: self.config.refresh
				}))
			})
		}
		return wrapper;
	}
});