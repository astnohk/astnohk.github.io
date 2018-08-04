// Initialize window system
window.addEventListener("load", initSystem, false);

// User ID
var userId = "you";
var onetimepass = "";

// Settings
var UserSettings = {BackgroundColor: "black"};

// Time
var time;
var timeClock = setInterval(updateTimeAndBackground, 1000);

// Background color list
var listBackground = {
    change: {name: "Change in Time", color: "rgb(0, 0, 0)"},
    morning: {name: "Morning", color: "rgb(110, 230, 233)"},
    daytime: {name: "Daytime", color: "rgb(93, 198, 255)"},
    dusk: {name: "Dusk", color: "rgb(247, 207, 110)"},
    night: {name: "Night", color: "rgb(10, 10, 0)"},
    red: {name: "Red", color: "rgb(64, 0, 0)"},
    green: {name: "Green", color: "rgb(0, 64, 0)"},
    blue: {name: "Blue", color: "rgb(0, 0, 128)"},
    black: {name: "Black", color: "rgb(0, 0, 0)"}};

// Menu
var MenuScaling = 0.25;
var MenuPadding = 10;
var MenuContentMargin = 10;
var MenuContentsSize = {
	height: 800,
	width: 800};
var MenuContentsTransitionDuration = 0.5;




// ----- Initialize -----
var SystemRoot;
var FcelMainWindow;
var FcelApplication;
var WaveSimulatorWindow;
var WaveSimulatorApplication;
var GalaxySimulatorWindow;
var GalaxySimulatorApplication;
var HopfieldNetworkWindow;
var HopfieldNetworkApplication;
var SVMWindow;
var SVMApplication;
var PerceptronWindow;
var PerceptronApplication;

function
initSystem()
{
	var Menu = document.getElementById("Menu");

	// * ECMASystem
	SystemRoot = new ECMASystem(document.body);

	// * Fcel
	FcelMainWindow = createMenuContent({id: "FcelMainWindow", className: "Contents", noCloseButton: null});
	FcelApplication = new Fcel(SystemRoot, FcelMainWindow);

	// * Wave simulator
	WaveSimulatorWindow = createMenuContent({id: "WaveSimulatorWindow", className: "Contents", noCloseButton: null});
	WaveSimulatorApplication = new WaveSimulator(SystemRoot, WaveSimulatorWindow);

	// * Galaxy simulator
	GalaxySimulatorWindow = createMenuContent({id: "GalaxySimulatorWindow", className: "Contents", noCloseButton: null});
	GalaxySimulatorApplication = new GalaxySimulator(SystemRoot, GalaxySimulatorWindow);

	// * Hopfield network
	HopfieldNetworkWindow = createMenuContent({id: "HopfieldNetworkWindow", className: "Contents", noCloseButton: null});
	HopfieldNetworkApplication = new HopfieldNetwork(SystemRoot, HopfieldNetworkWindow);

	// * SVM
	SVMWindow = createMenuContent({id: "SVMWindow", className: "Contents", noCloseButton: null});
	SVMApplication = new SVM(SystemRoot, SVMWindow);

	// * Perceptron
	PerceptronWindow = createMenuContent({id: "PerceptronWindow", className: "Contents", noCloseButton: null});
	PerceptronApplication = new Perceptron(SystemRoot, PerceptronWindow);

	MenuScalingFunction(); // Initialize
	Menu.addEventListener("mousedown", MenuScalingFunction, false);
	Menu.addEventListener("touchstart", MenuScalingFunction, false);
	// Set menu alignment observer
	Menu.alignmentLoop = setInterval(
	    function () { MenuAlignment(); },
	    100);
}

function createMenuContent(init) {
	let MenuChildren = Array.from(Menu.children);
	let w = SystemRoot.createWindow(init);
	w.style.position = "absolute";
	w.style.transform = "scale(" + MenuScaling + "," + MenuScaling + ")";
	w.style.transitionDuration = MenuContentsTransitionDuration + "s";
	w.fixWindow();
	Menu.appendChild(w);
	return w;
}

function MenuAlignment() {
	let MenuChildren = Array.from(Menu.children);
	let menu_rect = Menu.getBoundingClientRect();
	let bottomLine = [];
	let maxRight = 0;
	let maxBottom = 0;
	for (let x = 0; x < window.innerWidth - menu_rect.x - 2 * MenuPadding; x++) {
		bottomLine[x] = 0;
	}
	for (let i = 0; i < MenuChildren.length; i++) {
		let rect = MenuChildren[i].getBoundingClientRect();
		let searching = [{x: 0, y: 0}];
		let candidates = [];
		let maxBottomLine = 0;
		// Search candidates
		for (let x = 0; x < bottomLine.length; x++) {
			if (x > 0 && bottomLine[x] < bottomLine[x - 1]) {
				searching.push({
					x: x,
					y: bottomLine[x]});
			}
			for (let n = 0; n < searching.length; n++) {
				if (bottomLine[x] > searching[n].y) {
					searching[n].y = bottomLine[x];
				}
				// Check if the box with margin can put in the searching coordinate
				if (x - searching[n].x + 1 >= rect.width + MenuContentMargin) {
					// Add to cnadidates and eliminate it from searching
					candidates = candidates.concat(searching.splice(0, 1));
					n--;
				}
			}
			// Get max of bottomLine
			if (bottomLine[x] > maxBottomLine) {
				maxBottomLine = bottomLine[x];
			}
		}
		// if contents width over the window size
		if (candidates.length == 0) {
			candidates = candidates.concat({
			    x: 0,
			    y: maxBottomLine});
		}
		// Select origin point
		let origin = {
		    x: candidates[0].x,
		    y: candidates[0].y};
		for (let k = 1; k < candidates.length; k++) {
			if (candidates[k].y < origin.y) {
				origin.x = candidates[k].x;
				origin.y = candidates[k].y;
			}
		}
		// Update bottomLine and max{Bottom | Right}
		for (let k = 0; k < rect.width + MenuContentMargin; k++) {
			bottomLine[origin.x + k] += rect.height + MenuContentMargin;
		}
		if (origin.y + rect.height > maxBottom) {
			maxBottom = origin.y + rect.height;
		}
		if (origin.x + rect.width > maxRight) {
			maxRight = origin.x + rect.width;
		}
		// Set styles
		MenuChildren[i].style.left = origin.x + MenuPadding + "px";
		MenuChildren[i].style.top = origin.y + MenuPadding + "px";
	}
	// Set Menu size
	Menu.style.width = maxRight + 2 * MenuPadding + "px";
	Menu.style.height = maxBottom + 2 * MenuPadding + "px";
}

// Menu Scaling
function MenuScalingFunction(e) {
	let MenuChildren = Array.from(Menu.children);
	let target = null;
	if (typeof e !== "undefined") {
		target = e.target;
		while (target != null) {
			if (MenuChildren.indexOf(target) >= 0) {
				break;
			}
			target = target.parentNode;
		}
	}
	for (let i = 0; i < MenuChildren.length; i++) {
		if (MenuChildren[i] != target) {
			let style = window.getComputedStyle(MenuChildren[i]);
			MenuChildren[i].style.transform = "scale(" + MenuScaling + "," + MenuScaling + ")";
		}
	}
	if (target !== null) {
		target.style.transform = "scale(1.0, 1.0)";
		target.style.marginRight = "0";
		target.style.marginBottom = "0";
	}
}




// ----- REALTIME -----
function
updateTimeAndBackground()
{
	time = new Date();
	// Change background color
	changeBackgroundColor();
}

function
changeBackgroundColor()
{
	// Set background color
	if (UserSettings.BackgroundColor === "change") {
		if (time.getMonth() <= 3 || 10 <= time.getMonth()) {
			if (time.getHours() < 6 || 18 <= time.getHours()) {
				document.body.style.background = "rgba(10, 10, 0, 1.0)";
			} else if (time.getHours() < 7 || 17 <= time.getHours()) {
				document.body.style.background = "rgba(247, 207, 110, 1.0)";
			} else if (time.getHours() < 8 || 16 <= time.getHours()) {
				document.body.style.background = "rgba(110, 230, 233, 1.0)";
			} else {
				document.body.style.background = "rgba(93, 198, 255, 1.0)";
			}
		} else {
			if (time.getHours() < 4 || 19 <= time.getHours()) {
				document.body.style.background = "rgba(10, 10, 0, 1.0)";
			} else if (time.getHours() < 5 || 18 <= time.getHours()) {
				document.body.style.background = "rgba(247, 207, 110, 1.0)";
			} else if (time.getHours() < 6 || 17 <= time.getHours()) {
				document.body.style.background = "rgba(110, 230, 233, 1.0)";
			} else {
				document.body.style.background = "rgba(93, 198, 255, 1.0)";
			}
		}
	} else {
		document.body.style.background = listBackground[UserSettings.BackgroundColor].color;
	}
}


// Check member checkboxes
// if the checkbox has been clicked
// or the dragging mouse pointer pass over the checkbox
function
dragSelector(event)
{
	if (event.type === "mouseenter" && event.buttons === 0) {
		return; // Avoid selecting without button press
	}
	// Get event target
	let target = event.target;
	if (event.type === "touchmove") {
		target = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
	}
	let element = null;
	if (event.target.tagName === "SPAN") {
		element = target;
	} else if (target.parentNode.tagName === "SPAN") {
		element = target.parentNode;
	} else {
		return;
	}
	if (element.hasChildNodes()) {
		let children = element.childNodes;
		for (let i = 0; i < children.length; i++) {
			if (children[i].tagName === "INPUT") {
				if (firstChecked === 0) {
					firstChecked = children[i].checked === false ? 1 : 2;
				}
				children[i].checked = firstChecked == 1 ? true : false;
				break;
			}
		}
	}
	displayNoteForm(); // Show or Hide the form for writing notes
	updateNotesDisplay(); // Update display of Notes
}



// ----- SETTINGS -----
function
openSettings()
{
	let settingsMenu = document.getElementById("MySettingsMenu");
	if (document.getElementById("MySettingsMenu") !== null) {
		settingsMenu.remove();
	} else {
		// Open menu
		settingsMenu = document.createElement("div");
		settingsMenu.id = "MySettingsMenu";
		document.querySelector("#UpperRightMenu div.MenuDropdown").appendChild(settingsMenu);
		// Make menu
		let changeBackground = document.createElement("div");
		changeBackground.className = "classMySettingsMenu";
		changeBackground.innerHTML = "Change Background";
		changeBackground.addEventListener("click", openChangeBackground, false);
		settingsMenu.appendChild(changeBackground);
	}
}

function
openChangeBackground()
{
	if (document.getElementById("changeBackground") !== null) {
		return;
	}
	let win = SystemRoot.createWindow({id: "changeBackground", title: "Change Background Color"});
	win.style.left = "30%";
	win.style.top = "30%";
	win.style.width = "600px";
	document.body.appendChild(win);
	let board = document.createElement("div");
	board.className = "BlackBoard";
	win.appendChild(board);
	let box_main = document.createElement("div");
	box_main.className = "upperBox";
	box_main.style.display = "flex";
	box_main.style.flexWrap = "wrap";
	box_main.style.justifyContent = "space-around";
	board.appendChild(box_main);
	let box_button = document.createElement("div");
	box_button.className = "buttonBox";
	box_button.style.display = "flex";
	box_button.style.justifyContent = "flex_start";
	box_button.style.marginTop = "16px";
	board.appendChild(box_button);
	// Create background list
	let keys = Object.keys(listBackground);
	let boxSize = 100;
	let backgroundChanger =
	    function (evnt) {
		    UserSettings.BackgroundColor = evnt.target.id.slice(14);
		    changeBackgroundColor();
		    // Reset outline color
		    let units = document.querySelectorAll("#changeBackground div.BlackBoard div.upperBox span");
		    for (let i = 0; i < units.length; i++) {
			    units[i].style.outlineColor = "rgba(240, 240, 240, 0.8)";
		    }
		    // Set outline color of selected box
		    evnt.target.style.outlineColor = "rgba(255, 40, 40, 0.8)";
	    };
	for (let i = 0; i < keys.length; i++) {
		let colorId = keys[i];
		let color = listBackground[keys[i]].color;
		let unit = document.createElement("span");
		unit.id = "listBackground" + colorId;
		unit.style.display = "flex";
		unit.style.justifyContent = "center";
		unit.style.alignItems = "center";
		unit.style.margin = "8px";
		unit.style.height = String(boxSize) + "px";
		unit.style.width = String(boxSize) + "px";
		unit.style.color = negateColor(color);
		unit.style.backgroundColor = color;
		unit.style.outlineStyle = "solid";
		unit.style.outlineWidth = "4px";
		if (UserSettings.BackgroundColor == keys[i]) {
			unit.style.outlineColor = "rgba(255, 40, 40, 0.8)";
		} else {
			unit.style.outlineColor = "rgba(240, 240, 240, 0.8)";
		}
		unit.style.cursor = "pointer";
		unit.innerHTML = listBackground[colorId].name;
		unit.addEventListener("click", backgroundChanger, false);
		box_main.appendChild(unit);
	}
	// Add save button
	let save = document.createElement("input");
	save.type = "button";
	save.id = "saveChangeBackground";
	save.value = "Save";
	save.style.margin = "4px";
	save.addEventListener(
	    "click",
	    function () {
		    //saveSettings(); // It needs CGI to work
		    win.ECMASystemCloseWindow();
	    },
	    false);
	box_button.appendChild(save);
}

function
saveSettings()
{
	let request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/saveSettings.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			if (request.status == 200) {
				console.log(request.responseText);
				if (request.responseText.indexOf("Error:") >= 0) {
					console.log("Error: Wrong ID or one-time password");
				}
				console.log("settings saved successfully");
			} else {
				console.log("Error: Failed to request");
			}
		}
	    };
	let query = "id=" + encrypt(userId) +
	    "&onetimepass=" + encrypt(onetimepass) +
	    "&settings=" + encrypt(JSON.stringify(UserSettings));
	request.send(query);
}

function
loadSettings()
{
	let request = new XMLHttpRequest();
	request.open("POST", "cgi-bin/loadSettings.cgi", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			if (request.status == 200) {
				if (request.responseText.indexOf("Error:") >= 0) {
					console.log("Error: Wrong ID or one-time password");
				}
				let tmp = JSON.parse(decrypt(request.responseText));
				Object.assign(UserSettings, tmp);
				console.log("settings loaded successfully");
			} else {
				console.log("Error: Failed to request");
			}
		}
	    };
	let query = "id=" + encrypt(userId) +
	    "&onetimepass=" + encrypt(onetimepass) +
	    "&pubkey=" + cryptToClient.getPublicKey();
	request.send(query);
}




