/*!
 * JavaScript resource loader
 * https://github.com/myspace-nu
 *
 * Copyright 2018 Johan Johansson
 * Released under the MIT license
 */
if(typeof resLoader === "undefined"){
	window.resLoadedStorage = {
		onLoad: []
	};
	var resLoader = function(settings){
		this.scriptsLoaded = {}; // Scripts currently loaded
		this.scriptsToLoad = {}; // Scripts to load if optional load conditions are met
		this.scriptsToHandle = {}; // All scripts, regardless of load condition
		this.onCompleteExecuted = false; // Prevent from firing more than once, timing issue
		this.onLoadAllExecuted = false; // Prevent from firing more than once, timing issue
		this.scriptElement;
		this.defaultSettings = {
			async:(settings && typeof settings.async === 'boolean') ? settings.async : true,
			blocking:(settings && typeof settings.blocking === 'boolean') ? settings.blocking : false
		};
		this.objectSize = function(obj){
		    var size = 0;
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		}
		this.load = function(cfg,tmpl){
			var tmpl = (typeof(tmpl) !== 'undefined')?tmpl:{};
			var settings = {
				onComplete:
					(typeof(cfg.onComplete) === 'function')?cfg.onComplete:
					(typeof(tmpl.onComplete) === 'function')?tmpl.onComplete:
					function(){},
				onLoad:
					(typeof(cfg.onLoad) === 'function')?cfg.onLoad:
					(typeof(tmpl.onLoad) === 'function')?tmpl.onLoad:
					function(){},
				onLoadAll:
					(typeof(cfg.onLoadAll) === 'function')?cfg.onLoadAll:
					(typeof(tmpl.onLoadAll) === 'function')?tmpl.onLoadAll:
					function(){},
				async:
					(typeof(cfg.async) === 'boolean')?cfg.async:
					(typeof(tmpl.async) === 'boolean')?tmpl.async:
					this.defaultSettings.async,
				blocking:
					(typeof(cfg.blocking) === 'boolean')?cfg.blocking:
					(typeof(tmpl.blocking) === 'boolean')?tmpl.blocking:
					this.defaultSettings.blocking
			}
			if(typeof cfg.url === 'string'){
				var e = document.createElement('script');
				e.src = cfg.url;
				this.scriptsToHandle[e.src] = true;
			}
			if((typeof(cfg.loadUnless) !== 'undefined' && cfg.loadUnless) || (typeof(cfg.unless) !== 'undefined' && cfg.unless)){
				settings.onComplete();
				return;
			}
			if((typeof(cfg.loadIf) !== 'undefined' && !cfg.loadIf) || (typeof(cfg.if) !== 'undefined' && !cfg.if)){
				settings.onComplete();
				return;
			}
			if(Array.isArray(cfg)){
				for(var s in cfg){
					this.load(cfg[s],settings);
				}
			}
			if(typeof cfg === 'string'){
				this.load({
					url:cfg,
				},settings);
			}
			if(cfg.url){
				if(Array.isArray(cfg.url)){
					for(var s in cfg.url){
						this.load({
							url:cfg.url[s],
						},settings);
					}
				} else {
					var e;
					if(cfg.url.match(/\.js/i)){
						e = document.createElement('script');
						e.type = 'text/javascript';
						e.src = cfg.url;
					} else if(cfg.url.match(/\.css/i)){
						e = document.createElement('link');
						e.type = 'text/css';
						e.rel = 'stylesheet';
						e.media = (settings.async)?'none':'all';
						e.href = cfg.url;
					} 
					e.async = settings.async;
					{
						var o = {
							path:e.src||e.href,
							elm:e,
							url:cfg.url,
							onComplete: settings.onComplete,
							onLoadAll: settings.onLoadAll,
							onLoad: settings.onLoad,
							settings: settings
						};
						this.scriptsToLoad[o.path] = true;
						var caller = this;
						e.onload = function(){
							caller.scriptsLoaded[o.path] = true;
							o.onLoad();
							if(caller.objectSize(caller.scriptsLoaded) == caller.objectSize(caller.scriptsToHandle) && !caller.onLoadAllExecuted){
								caller.onLoadAllExecuted = true;
								o.onLoadAll();
							}
							if(caller.objectSize(caller.scriptsLoaded) == caller.objectSize(caller.scriptsToLoad) && !caller.onCompleteExecuted){
								caller.onCompleteExecuted = true;
								o.onComplete();
							}
							if(o.path.match(/\.css/i) && o.settings.async){
								o.elm.onload=function(){}; // To not trigger onload once more when media i changed.
								o.elm.media='all';
							}
						}
					}
					if(settings.blocking && e.type === 'text/javascript'){
						window.resLoadedStorage.onLoad.push(e.onload);
						document.write("<scr"+"ipt src=\""+cfg.url+"\" onload=\"window.resLoadedStorage.onLoad["+(window.resLoadedStorage.onLoad.length-1)+"]();\"></scr"+"ipt>");
					} else {
						var thisScriptElement = document.getElementsByTagName('script')[0];
						thisScriptElement.parentNode.insertBefore(e, thisScriptElement);
					}
				}
			}
		}
	}
}