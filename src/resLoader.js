/*!
 * JavaScript resource loader
 * https://github.com/myspace-nu
 *
 * Copyright 2018 Johan Johansson
 * Released under the MIT license
 */
var resLoader = function(){
	this.scriptsLoaded = {};
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
				true,
			scriptArray:
				(Array.isArray(tmpl.scriptArray))?tmpl.scriptArray:
				null
		}
		if(typeof(cfg.loadUnless) !== 'undefined' && cfg.loadUnless){
			settings.onComplete();
			return;
		}
		if(typeof(cfg.loadIf) !== 'undefined' && !cfg.loadIf){
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
				settings.scriptArray = [];
				for(var s in cfg.url){
					var e = document.createElement('script');
					e.src = cfg.url[s];
					settings.scriptArray.push(e.src);
				}
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
					var caller = this;
					e.onload = function(){
						caller.scriptsLoaded[o.path] = true;
						o.onLoad();
						if(Array.isArray(o.settings.scriptArray)){
							var iLoaded = 0;
							for(var i in o.settings.scriptArray){
								if(caller.scriptsLoaded[o.settings.scriptArray[i]]) iLoaded++;
							}
							if(iLoaded == o.settings.scriptArray.length){
								o.onLoadAll();
								o.onComplete();
							}
						} else {
							o.onLoadAll();
							o.onComplete();
						}
						if(o.path.match(/\.css/i) && o.settings.async){
							o.elm.onload=function(){}; // To not trigger onload once more when media i changed.
							o.elm.media='all';
						}
					}
				}
				document.head.appendChild(e);
			}
		}
	}
}