# resLoader

A JavaScript resource loader featuring conditional loading, asynchronous- or sequential loading

[![Build Status](https://travis-ci.org/myspace-nu/resLoader.svg?branch=master)](https://travis-ci.org/myspace-nu/resLoader)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/myspace-nu/resLoader/blob/master/LICENSE)
[![Code size](https://img.shields.io/github/languages/code-size/myspace-nu/resLoader)](https://github.com/myspace-nu/resLoader)
[![Issues](https://img.shields.io/github/issues-raw/myspace-nu/resLoader)](https://github.com/myspace-nu/resLoader/issues)

## Installation

Using npm

	npm install @myspace-nu/resloader --save

Using CDN

	<script src="https://cdn.jsdelivr.net/npm/@myspace-nu/resloader/dist/resLoader.min.js"></script>

Or include the script manually

	<script src="/path/to/resLoad.min.js"></script>

## Usage

Simple usage

	<script type="text/javascript">
		var loader = new resLoader();
		loader.load("myScript.js");
	</script>

Now, that isn't very impressive. Let's load some more scripts and add a callback when all scripts are loaded.

	<script type="text/javascript">
		var loader = new resLoader();
		loader.load({
			url: ["myScript.js","anotherScript.js"],
			onComplete: function(){
				console.log("All done");
			}
		});
	</script>

Let's say that one script is depending on another to be loaded first, simply set async to false (default true).

	<script type="text/javascript">
		var loader = new resLoader();
		loader.load({
			url: ["myScript.js","myScript-extra.js"],
			async: false,
			onComplete: function(){
				console.log("All done, and in the right order");
			}
		});
	</script>

You can also add conditions for the resource to be loaded. Like, only load jQuery unless it is already loaded.

	<script type="text/javascript">
		var loader = new resLoader();
		loader.load({
			url: "//code.jquery.com/jquery-3.3.1.min.js",
			loadUnless: window.jQuery,
			async:false,
			onComplete: function(){
				$("body").append("<p>One more paragraph</p>");
			}
		});
	</script>

*Note that onComplete is called regardless of the test is evaluted to true or false, i.e. in the example the code will be executed even if jQuery has been loaded earlier on the page*

If you include different resources to the same html out and there is a chance that several of the resources include for example jQuery you can solve this by loading these scripts in blocking mode like this.

    <script src="/path/to/resLoad.min.js"></script>
	<script type="text/javascript">
		var loader = new resLoader();
		loader.load([
			{ url:"//code.jquery.com/jquery-3.3.1.min.js", unless:window.jQuery, blocking:true }
		]);
	</script>
	...
	<script type="text/javascript">
		var loader = new resLoader();
		loader.load([
			{ url:"//code.jquery.com/jquery-3.3.1.min.js", unless:window.jQuery, blocking:true }
		]);
	</script>

*In the example, jQuery will not be loaded a second time*

## Options
**url** - Resource urls to be loaded [array or string]

    url: ["myScript.js","myScript-extra.js"]
	
**async** - Load the resource asynchronously [true/false]

	async: false

*Default: true*

**blocking** - Load script in (render-)blocking mode [true/false]

	blocking: true

*Default: false*

**loadUnless** - Load the resource unless expression is true

	loadUnless: window.jQuery

**unless** - Shorthand for loadUnless

	unless: window.jQuery

**loadIf** - Load the resource if expression is true

	loadIf: window.jQuery

**if** - Shorthand for loadIf

	if: window.jQuery

**onComplete** - Callback to be executed when everything is done (regardless of any conditional tests)

	onComplete: function(){
		console.log("All done");
	}

**onLoad** - Callback to be executed when a resource has beed loaded.

	onLoad: function(){
		console.log("Resource has been loaded");
	}

**onLoadAll** - Callback to be executed when all resources have beed loaded.

	onLoadAll: function(){
		console.log("All resources are loaded");
	}
