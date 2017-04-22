// The code written in BSD/KNF indent style
"use strict";

class ECMASystemWindow extends HTMLElement {
	constructor() {
		super();
		this.ECMASystemRoot = null;
		this.ECMASystemWindowID = null;
		this.ECMASystemWindowClass = "classWindow";
		this.ECMASystemWindowTitle = null;
		this.ECMASystemParentWindow = null;
		// state
		this.ECMASystemWindowFixed = false;
		this.ECMASystemStateLock = false;
		this.ECMASystemCloseWindowTimeDuration = 300;
		this.ECMASystemDragEventType = "";
		this.ECMASystemEventState = "";
		this.ECMASystemTouchID = null;
		this.ECMASystemDragOffset = {x: 0, y: 0};
		this.ECMASystemCloseFunctionUserDefined = function () {};
		this.ECMASystemCloseWindow = function ()
		    {
			    let win = null;
			    if (this.ECMASystemWindowClass === "classWindow") {
				    win = this;
			    } else if (this.ECMASystemWindowClass === "classCloseButton") {
				    win = this.ECMASystemParentWindow;
			    }
			    if (win.parentNode === null ||// The Node has been created but not added to DOM tree
				win.ECMASystemStateLock) {
				    return;
			    }
			    win.ECMASystemClosing = true;
			    win.style.transitionProperty = "opacity";
			    win.style.transitionDuration = String(win.ECMASystemCloseWindowTimeDuration) + "ms";
			    win.style.transitionTimingFunction = "linear";
			    win.style.opacity = 0;
			    let timeout = setTimeout(function ()
				{
					win.ECMASystemCloseFunctionUserDefined();
					win.remove();
					win.ECMASystemRoot.spliceWindowList(win); // Remove window from WindowList
				},
				win.ECMASystemCloseWindowTimeDuration);
		    };
	}
}
customElements.define("ecmasystem-window", ECMASystemWindow);
// ----------




class ECMASystem {
	constructor(rootWindow) {
		this.rootWindow = rootWindow;
		rootWindow.ECMASystemRoot = this;
		this.WindowZIndexOffset = 100;
		// Time
		this.timeClock = null;

		// Window list
		this.WindowList = new Array();
		this.draggingWindows = new Array();

		// Tools
		this.windowScroller = null;

		//Initialize
		//window.addEventListener("load", initECMASystem, false);
		this.initECMASystem();
	}

	// ----- INITIALIZE -----
	initECMASystem()
	{
		let timeClock = setInterval(updateTimeAndBackground, 1000);
		// Add Window Scroller
		this.appendWindowScroller();
		// Event Listener for mouse click or touch
		this.rootWindow.addEventListener("mousedown", function (e) { e.currentTarget.ECMASystemRoot.globalClickEvent(e); }, false);
		this.rootWindow.addEventListener("touchstart", function (e) { e.currentTarget.ECMASystemRoot.globalClickEvent(e); }, false);
		this.rootWindow.addEventListener("mousemove", function (e) { e.currentTarget.ECMASystemRoot.globalMouseMoveEvent(e); }, false);
		this.rootWindow.addEventListener("touchmove", function (e) { e.currentTarget.ECMASystemRoot.globalMouseMoveEvent(e); }, false);
		this.rootWindow.addEventListener("mouseup", function (e) { e.currentTarget.ECMASystemRoot.globalMouseUpEvent(e); }, false);
		this.rootWindow.addEventListener("touchend", function (e) { e.currentTarget.ECMASystemRoot.globalMouseUpEvent(e); }, false);
	}

	// ----- GLOBAL CLICK EVENTS -----
	globalClickEvent(event)
	{
	}

	globalMouseMoveEvent(event)
	{
		this.dragWindow(event);
	}

	globalMouseUpEvent(event)
	{
		this.dragWindow(event);
	}

	// ----- Initializing -----
	appendWindowScroller()
	{
		if (this.windowScroller != null) {
			return;
		}
		this.windowScroller = document.createElement("div");
		this.windowScroller.ECMASystemRoot = this;
		let className = "classWindowScroller";
		this.windowScroller.className = className;
		this.windowScroller.ECMASystemWindowClass = className;
		this.windowScroller.ECMASystemStateLock = false;
		this.windowScroller.id = "WindowScroller";
		document.body.appendChild(this.windowScroller);
		this.windowScroller.openScroller = function ()
		    {
			    if (this.ECMASystemStateLock) {
				    // Already opened
				    return;
			    }
			    this.ECMASystemStateLock = true;
			    this.style.width = "100px"; // Open
			    for (let i = 0; i < this.ECMASystemRoot.WindowList.length; i++) {
				    let box = document.createElement("div");
				    box.ECMASystemRoot = this.ECMASystemRoot;
				    let boxClassName = "classWindowTitle";
				    box.className = boxClassName;
				    box.ECMASystemWindowClass = boxClassName;
				    box.style.position = "relative";
				    box.style.marginTop = "6px";
				    box.style.transitionProperty = "top";
				    box.style.transitionDuration = "0.2s";
				    box.style.transitionTimingFunction = "linear";
				    box.innerHTML = this.ECMASystemRoot.WindowList[i].windowTitle;
				    box.addEventListener("click", function (e) { e.currentTarget.ECMASystemRoot.raiseClickedTitle(e); }, false);
				    this.windowScroller.appendChild(box);
			    }
		    };
		this.windowScroller.closeScroller = function ()
		    {
			    if (this.ECMASystemStateLock) {
				    this.style.width = "18px";
				    this.innerHTML = "";
				    this.ECMASystemStateLock = false;
			    }
		    };
		this.windowScroller.addEventListener("mouseenter", function (e) { e.currentTarget.openScroller(e); }, false);
		this.windowScroller.addEventListener("mouseleave", function (e) { e.currentTarget.closeScroller(e); }, false);
		this.windowScroller.addEventListener("touchstart", function (e) { e.currentTarget.openScroller(e); }, false);
		this.windowScroller.addEventListener("touchstart", function (e) { e.currentTarget.closeScroller(e); }, false);
		this.windowScroller.addEventListener(
		    "wheel",
		    function (event) {
			    if (event.deltaY > 0) {
				    this.raiseWindowList(this.WindowList[0]);
				    this.windowScroller.insertBefore(this.windowScroller.children[0], null);
			    } else {
				    this.windowScroller.insertBefore(
					this.windowScroller.children[this.windowScroller.children.length - 1],
					this.windowScroller.children[0]);
				    this.lowerWindowList(this.WindowList[this.WindowList.length - 1]);
			    }
		    },
		    false);
	}

	raiseClickedTitle(event)
	{
		this.windowScroller.insertBefore(event.currentTarget, null);
		for (let i = 0; i < this.WindowList.length; i++) {
			if (this.WindowList[i].ECMASystemWindowTitle === event.currentTarget.innerHTML) {
				this.raiseWindowList(this.WindowList[i]);
				break;
			}
		}
	}

	// ----- WINDOWS -----
	makeFunctionButton(className, innerHTML, onClickFunction)
	{
		let box = document.createElement("span");
		box.ECMASystemRoot = this;
		box.ECMASystemWindowClass = "classFunctionButton";
		box.className = className;
		box.innerHTML = innerHTML;
		box.onClickFunction = onClickFunction;
		box.addEventListener("click", box.onClickFunction, false);
		box.addEventListener("touchstart", box.onClickFunction, false);
		return box;
	}

	createWindow(parameter, win = null)
	{
		let className = "classWindow";
		if (win == null) {
			win = new ECMASystemWindow();
			win.className = className;
			// Set position along with the number of windows
			win.style.top = String(100 + Math.min(this.WindowList.length * 10, 200)) + "px";
			win.style.left = String(40 + Math.min(this.WindowList.length * 10, 200)) + "px";
		}
		win.ECMASystemRoot = this;
		win.ECMASystemWindowClass = className;
		win.ECMASystemStateLock = true;
		win.ECMASystemParentWindow = this.rootWindow;
		// Check whether parameter is defined or not
		let parameterDefined = true;
		if (typeof parameter === "undefined") {
			parameterDefined = false;
		}
		if (parameterDefined && "type" in parameter) {
			if (parameter.type === "dialog") {
				win.ECMASystemWindowClass = "classDialog";
				win.style.borderBottomLeftRadius = "16px";
			}
		}
		if (parameterDefined) {
			// Set ID
			if ("id" in parameter) {
				win.id = parameter.id;
			}
			// Style
			if ("style" in parameter) {
				Object.assign(win.style, parameter.style);
			}
			// Title
			if ("title" in parameter && win.ECMASystemWindowClass === "classDialog") {
				// Add title
				let title = document.createElement("span");
				title.ECMASystemRoot = this;
				title.ECMASystemWindowClass = classNameTitle;
				title.ECMASystemParentWindow = win;
				let classNameTitle = "classWindowTitle";
				title.className = classNameTitle;
				title.innerHTML = parameter.title;
				title.addEventListener("mousedown", function (e) { e.currentTarget.ECMASystemRoot.dragWindow(e); }, false);
				title.addEventListener("touchstart", function (e) { e.currentTarget.ECMASystemRoot.dragWindow(e); }, false);
				win.appendChild(title);
				win.ECMASystemWindowTitle = parameter.title;
			}
		}
		// Add window close function to HTML Element
		if (parameterDefined && "closeFunction" in parameter) {
			win.ECMASystemCloseFunctionUserDefined = parameter.closeFunction;
		}
		if (!(parameterDefined && "noCloseButton" in parameter)) {
			// Append Close button
			let closeBox = this.makeFunctionButton(
			    "classButton",
			    "&times;",
			    win.ECMASystemCloseWindow);
			closeBox.ECMASystemRoot = this;
			closeBox.ECMASystemWindowClass = "classCloseButton";
			closeBox.ECMASystemParentWindow = win;
			closeBox.style.position = "absolute";
			closeBox.style.right = "30px";
			closeBox.style.bottom = "0px";
			win.appendChild(closeBox);
		}
		win.addEventListener(
		    "mousedown",
		    function (e) {
			    if (e.currentTarget.ECMASystemWindowFixed == false) {
				    e.currentTarget.ECMASystemRoot.dragWindow(e);
			    }
		    },
		    false);
		win.addEventListener(
		    "touchstart",
		    function (e) {
			    if (e.currentTarget.ECMASystemWindowFixed == false) {
				    e.currentTarget.ECMASystemRoot.dragWindow(e);
			    }
		    },
		    false);
		// Add new window to WindowList
		if (this.WindowList.length > 0) {
			win.style.zIndex = String(parseInt(this.WindowList[this.WindowList.length - 1].style.zIndex, 10) + 1);
		} else {
			win.style.zIndex = String(this.WindowZIndexOffset);
		}
		this.WindowList.push(win);
		// Add slider for resizing
		let resizer = document.createElement("div");
		resizer.ECMASystemRoot = this;
		let resizerClassName = "classWindowResizer";
		resizer.className = resizerClassName;
		resizer.ECMASystemWindowClass = resizerClassName;
		resizer.ECMASystemParentWindow = win;
		win.appendChild(resizer);
		// Finish opening process
		win.ECMASystemStateLock = false;
		return win;
	}

	createDraggableElement(elementName)
	{
		let element = document.createElement(elementName);
		element.ECMASystemRoot = this;
		element.ECMASystemParentWindow = this.rootWindow;
		element.ECMASystemWindowClass = "classDraggableElement";
		element.ECMASystemEventState = "";
		element.ECMASystemDragEventType = "";
		element.ECMASystemDragOffset = {x: 0, y: 0};
		element.ECMASystemStateLock = false;
		element.addEventListener("mousedown", function (e) { e.currentTarget.ECMASystemRoot.dragWindow(e); }, false);
		element.addEventListener("touchstart", function (e) { e.currentTarget.ECMASystemRoot.dragWindow(e); }, false);
		return element;
	}

	raiseWindowList(target)
	{
		if (target.ECMASystemWindowClass !== "classWindow") {
			return;
		}
		let index = this.WindowList.indexOf(target);
		this.WindowList.splice(index, 1);
		this.WindowList.push(target);
		for (let i = 0; i < this.WindowList.length; i++) {
			this.WindowList[i].style.zIndex = String(this.WindowZIndexOffset + i);
		}
	}

	lowerWindowList(target)
	{
		let index = this.WindowList.indexOf(target);
		this.WindowList.splice(index, 1);
		this.WindowList.unshift(target);
		for (let i = 0; i < this.WindowList.length; i++) {
			this.WindowList[i].style.zIndex = String(this.WindowZIndexOffset + i);
		}
	}

	spliceWindowList(target)
	{
		let index = this.WindowList.indexOf(target);
		this.WindowList.splice(index, 1);
		for (let i = 0; i < this.WindowList.length; i++) {
			this.WindowList[i].zIndex = String(this.WindowZIndexOffset + i);
		}
	}

	/*
	    Drag or resize the window.
	    If the event target is window border then resize the window.
	*/
	dragWindow(event)
	{
		let Eventer = function (win) {
			let style = window.getComputedStyle(win);
			var dragEvent = new CustomEvent("windowdrag", {
				detail: {
					position: {x: parseInt(style.left, 10), y: parseInt(style.top, 10)}
				}
			    });
			win.dispatchEvent(dragEvent);
		    };
		// Get window object
		let clientX = 0;
		let clientY = 0;
		if (event.type === "touchstart" || event.type === "touchmove" || event.type === "touchup") {
			clientX = event.touches[0].clientX; // Use first touch event
			clientY = event.touches[0].clientY;
		} else {
			clientX = event.clientX;
			clientY = event.clientY;
		}
		let win = null;
		/// initialize or finalize process
		if (event.type === "mousedown" || event.type === "touchstart") {
			// Raise selected window to frontmost
			this.raiseWindowList(event.currentTarget);
			if (event.target.ECMASystemWindowClass === "classWindow" || event.target.ECMASystemWindowClass === "classDraggableElement" ||
			    event.target.ECMASystemWindowClass === "classWindowTitle") {
				win = event.currentTarget;
				this.draggingWindows.push(win);
				win.ECMASystemEventState = "drag";
			} else if (event.target.ECMASystemWindowClass === "classWindowResizer") {
				win = event.target.ECMASystemParentWindow;
				this.draggingWindows.push(win);
				win.ECMASystemEventState = "resize";
			} else {
				// Start drag only the event fired on window itself
				return;
			}
			let rect = win.getBoundingClientRect();
			win.ECMASystemDragOffset.x = clientX - rect.left;
			win.ECMASystemDragOffset.y = clientY - rect.top;
			// Transparent
			if (event.type === "mousedown") {
				win.ECMASystemDragEventType = "mouse";
			} else if (event.type === "touchstart") {
				win.ECMASystemDragEventType = "touch";
			}
			win.style.opacity = "0.8";
			Eventer(win);
			return;
		} else if (this.draggingWindows.length <= 0) {
			return;
		} else if (event.type === "mouseup" || event.type === "touchend") {
			win = this.findWindowByEvent(this.draggingWindows, event);
			let targetIndex = this.draggingWindows.indexOf(win);
			win = this.draggingWindows[targetIndex];
			win.style.opacity = "1.0";
			win.ECMASystemEventState = "";
			win.ECMASystemDragEventType = "";
			win.ECMASystemDragOffset = {x: 0, y: 0};
			this.draggingWindows.splice(targetIndex, 1);
			return;
		}
		/// End initialize or finalize process

		event.preventDefault();
		//event.stopPropagation(); // Prevent to propagate the event to parent node

		win = this.findWindowByEvent(this.draggingWindows, event);
		// Get mouse position
		if (win.ECMASystemEventState === "resize") { // Resize the window
			let style = window.getComputedStyle(win, "");
			let rect = win.getBoundingClientRect();
			let x = clientX - rect.left -
			    parseInt(style.borderLeftWidth, 10) - parseInt(style.borderRightWidth, 10) -
			    parseInt(style.paddingRight, 10) - 7;
			let y = clientY - rect.top -
			    parseInt(style.borderTopWidth, 10) - parseInt(style.borderBottomWidth, 10) -
			    parseInt(style.paddingBottom, 10) - 7;
			win.style.width = String(x) + "px";
			win.style.height = String(y) + "px";
		} else { // Drag the window
			let parentNode = win.parentNode;
			let parentRect = parentNode.getBoundingClientRect();
			let x = 0;
			let y = 0;
			if (parentNode.nodeName === "BODY") {
				// If the parent is BODY then the amount of scroll should be neglected
				// because document.body.scrollTop == window.scrollY
				x = clientX - win.ECMASystemDragOffset.x - parentRect.left;
				y = clientY - win.ECMASystemDragOffset.y - parentRect.top;
			} else {
				x = clientX - win.ECMASystemDragOffset.x - parentRect.left + parentNode.scrollLeft;
				y = clientY - win.ECMASystemDragOffset.y - parentRect.top + parentNode.scrollTop;
			}
			// Move the window
			win.style.left = String(x) + "px";
			win.style.top = String(y) + "px";
		}
		Eventer(win);
	}

	findWindowByEvent(array, event) {
		let win = null;
		if (event.type.slice(0, 5) === "mouse") {
			win = array.find(
			    function (element, index, array) {
				    return element.ECMASystemDragEventType === "mouse";
			    });
		} else {
			win = array.find(
			    function (element, index, array) {
				    if (element.ECMASystemDragEventType === "touch") {
					    for (let i = 0; i < event.touches.length; i++) {
						    if (element.ECMASystemTouchID === event.touches[i].identifier) {
							    return true;
						    }
					    }
				    } else {
					    return false;
				    }
			    });
		}
		return win;
	}

	errorWindow(message)
	{
		let errorWin = document.getElementById("errorWindow");
		if (errorWin === null) {
			errorWin = createWindow({id: "errorWindow", style: {position: "absolute", top: "30%", left: "30%", color: "rgb(255, 50, 50)", backgroundColor: "rgba(255, 0, 0, 0.8)"}});
			document.body.appendChild(errorWin);
		}
		let content = document.querySelector("#errorWindow div.BlackBoard"); // get <div className="BlackBoard"> within a <tags id="errorWindow">
		if (content === null) {
			content = document.createElement("div");
			errorWin.appendChild(content);
		}
		content.className = "BlackBoard";
		content.innerHTML = message;
	}
}




// ---------- LIBRARIES ----------
function
parseUnicodeInt(str, base)
{
	if (typeof base === "undefined") {
		let base = 10;
	}
	if (str.search(/[０１２３４５６７８９]/) >= 0) {
		let list = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"];
		for (let i = 0; i < 10; i++) {
			let regex = new RegExp(list[i], "g");
			str = str.replace(regex, String(i));
		}
	}
	return parseInt(str, base);
}

// ----- Base64 -----
// If you encode Unicode strings then use the functions below.
// These functions avoid problems when using Unicode strings.
// These functions idea from Johan Sundstrom.
function
enBase64(str)
{
	if (typeof str === "undefined") {
		return "";
	}
	return window.btoa(unescape(encodeURIComponent(str)));
}

function
deBase64(str)
{
	if (typeof str === "undefined") {
		return "";
	}
	return decodeURIComponent(escape(window.atob(str)));
}

// negate color in rgb(d, d, d) or rgba(d, d, d, f) style
function
negateColor(color)
{
	let output;
	if (color.indexOf("rgba") >= 0) {
		output = "rgba(";
	} else {
		output = "rgb(";
	}
	let strings = color.substr(color.indexOf("(") + 1).split(',');
	for (let i = 0; i < 3; i++) {
		let intensity = parseInt(strings[i], 10);
		output += (i > 0 ? ", " : "") + String(255 - intensity);
	}
	if (color.indexOf("rgba") >= 0) {
		let alpha = parseFloat(strings[3]);
		output += ", " + String(alpha) + ")";
	} else {
		output += ")";
	}
	return output;
}







// ----- Encryption -----

function
initEncryptionToServer()
{
	let request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/loadKey.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			cryptToServer.setKey(request.responseText);
		}
	    };
	request.send("load=" + RSA_key_length);
}

function
initEncryptionToClient()
{
	cryptToClient.getKey();
}

function
encrypt(text)
{
	// encrypt with server's public key
	if (typeof text === "undefined" || text.length < 1) {
		return "";
	}
	let text_encoded = encodeURIComponent(text);
	let encrypted = "";
	let i = 0;
	for (i = 0; i < Math.ceil(text_encoded.length / maxEncryptLength); i++) {
		encrypted += cryptToServer.encrypt(text_encoded.slice(maxEncryptLength * i, Math.min(maxEncryptLength * (i + 1), text_encoded.length))) + "|";
	}
	return encrypted.slice(0, -1);
}

function
decrypt(text)
{
	// decrypt with client generated private key
	if (typeof text === "undefined" || text.length < 1) {
		return "";
	}
	let encrypted = text.split("|");
	let decrypted = "";
	let i = 0;
	for (i = 0; i < encrypted.length; i++) {
		if (encrypted[i].length < 1) {
			continue;
		}
		decrypted += cryptToClient.decrypt(encrypted[i]);
	}
	return decodeURIComponent(decrypted);
}

