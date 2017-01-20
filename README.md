# ChromaOS

ChromaOS made for AngularJS made by Finn Winchester. Currently under development.

### Installation
Via Bower
```
bower install chromaos --save
```

## Get started

Include files in your ```index.html```:
```
<script src="bower_components/chromaos/dist/js/ChromaOS.min.js"></script>
<link href="bower_components/chromaos/dist/css/ChromaOS.min.css" rel="stylesheet" />
```

Add ```ChromaOS``` to your AngularJS project:
```
angular.module('YourProject', ['ChromaOS']);
```

## Usage

#### Apps
When developing ChromaOS Apps the only thing you need to do is the following.

1. Create a directive (normally) containing everything the app will have.
2. Add a 'run' function to that AppDirective, injecting ```ChromaOSAppsService```, and do the following:
	1. ```ChromaOSAppsService.register(config);```
	2. config parameter is a _JSON_ accepting:
		1. **id**: _String_. App unique identifier (appUniqueId). Needed to call the app.
		2. **name**: _String_. App's name. It will apear in the app window's header bar.
		3. **icon**: _String_. App's icon. I recommend FontAwesome and 'fa-fw' class.
		4. **template**: _String_. App's template to compile (using Angular's $compile) render. I recommend using a directive like ```<div my-app></div>```.
		5. **config**: _JSON_. App's config, accepting:
			1. **behavior**: _JSON__. Sets what the app's window can or can not do:
				1. **resizable**: Tells the app's window whether it is resizable or not.
				2. **draggable**: Tells the app's window whether it is draggable or not.
				3. **fullScreenable**: Tells the app's window whether it is fullScreenable or not.
				4. **collapsable**: Tells the app's window whether it is collapsable or not.
				5. **minimizable**: Tells the app's window whether it is minimizable or not.
				6. **closeable**: Tells the app's window whether it is closeable or not.
			2. **size**: _JSON_. Sets the app window's default size:
				1. **width**: _String_. The window's width. Accepting 'px', '%' or whatever you need.
				2. **height**: _String_. The window's height. Accepting 'px', '%' or whatever you need.
			2. **autostart**: _Integer_. Tells the app whether it should autostart on register or not.
			3. **focus**: _Boolean_. Tells the app whether it should autofocus on open or not.
			4. **startAt**: _Integer_. Sets the app window's initial position, accepting 1-9:
				1. (1) Top-left corner.
				2. (2) Top-mid side.
				3. (3) Top-right corner.
				4. (4) Left-mid side.
				5. (5) Mid-mid side.
				6. (6) Right-mid side.
				7. (7) Bottom-left corner.
				8. (8) Bottom-mid side.
				9. (9) Bottom-right corner.

With this now you have a registered app. Now to open it from wherever you want to what you need to do is ```ChromaOSAppsService.openApp(app);```.

The ```app``` can be retrieved with ```ChromaOSAppsService.findApp(appUniqueId);```.

## SDK

#### Events fired ($scope.$on)
1. **'chromaos.app.focused'**: Fired when an app gets focus.
2. **'chromaos.app.opened'**: Fired when an app is opened.

#### Events you can fire ($scope.$emit)
1. **'chromaos.window.fire.full-screen'**: Fire this event to make window go full screen.
1. **'chromaos.window.fire.windowed'**: Fire this event to make window go windowed (outside from full screen).
1. **'chromaos.window.fire.minimize'**: Fire this event to make window go minimized.
1. **'chromaos.window.fire.restore'**: Fire this event to make window go windowed (outside from minimized).
1. **'chromaos.window.fire.collapse'**: Fire this event to make window go collapsed.
1. **'chromaos.window.fire.expand'**: Fire this event to make window go windowed (outside from collapsed).
2. **'chromaos.app.retitle'**: Fire this event to change the window's title. Params:
	1. **title**: _String_. New title.
3. **'chromaos.app.resize'**: Fire this event to resize the window (with JQuery UI Animate).
	1. **size**: _JSON_. Accepting:
		1. **width**: _Integer_. New width in PX.
		2. **height**: _Integer_. New height in PX.
4. **'chromaos.app.focus'**: Fire this event to focus the window.
5. **'chromaos.app.close'**: Fire this event to close the window.
