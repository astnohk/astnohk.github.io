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
var MenuWidthFittingWithWindow = true;
var MenuWidth = 800;
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
	// Randomly change the Menu contents size
	if (Math.random() < 0.25) {
		MenuContentResizeYojohan();
	} else if (Math.random() < 0.4) {
		MenuContentResizeRandomly();
	}
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

function MenuContentResizeYojohan() {
	let MenuChildren = Array.from(Menu.children);
	MenuWidthFittingWithWindow = false;
	MenuWidth = 800;
	if (MenuChildren.length > 4) {
		MenuChildren[0].style.width = "2000px";
		MenuChildren[0].style.height = "1000px";
		MenuChildren[1].style.width = "1000px";
		MenuChildren[1].style.height = "2000px";
		MenuChildren[2].style.width = "1000px";
		MenuChildren[2].style.height = "2000px";
		MenuChildren[3].style.width = "2000px";
		MenuChildren[3].style.height = "1000px";
		MenuChildren[4].style.width = "915px";
		MenuChildren[4].style.height = "915px";
	}
}

function MenuContentResizeRandomly() {
	let MenuChildren = Array.from(Menu.children);
	MenuWidthFittingWithWindow = true;
	for (let i = 0; i < MenuChildren.length; i++) {
		let s = Math.round(Math.random() * 1000);
		let w = 0;
		let h = 0;
		if (Math.random() > 0.7) {
			w = s;
			h = s;
		} else {
			w = s;
			h = Math.round(Math.random() * 1000);
		}
		MenuChildren[i].style.width = 400 + w + "px";
		MenuChildren[i].style.height = 400 + h + "px";
	}
}

function MenuAlignment() {
	let gapThreshold = 50; // minimum gap in px

	let MenuChildren = Array.from(Menu.children);
	let menu_rect = Menu.getBoundingClientRect();
	let maxRight = 0;
	let maxBottom = 0;
	let fixed = [];
	if (MenuWidthFittingWithWindow) {
		MenuWidth = window.innerWidth - menu_rect.x;
	}
	for (let i = 0; i < MenuChildren.length; i++) {
		let rect = MenuChildren[i].getBoundingClientRect();
		candidates = [];
		// Search candidates
		for (let k = 0; k < fixed.length; k++) {
			candidates.push({
			    x: fixed[k].x_rb + 1,
			    y: fixed[k].y});
			candidates.push({
			    x: fixed[k].x,
			    y: fixed[k].y_rb + 1});
		}
		for (let n = 0; n < candidates.length; n++) {
			if (candidates[n].x + rect.width > MenuWidth) {
				// Out of the window
				candidates.splice(n, 1);
				n--;
				continue;
			}
			let x_rb = candidates[n].x + rect.width + MenuContentMargin;
			let y_rb = candidates[n].y + rect.height + MenuContentMargin;
			let x_c = (candidates[n].x + x_rb) * 0.5;
			let y_c = (candidates[n].y + y_rb) * 0.5;
			let w = x_rb - candidates[n].x;
			let h = y_rb - candidates[n].y;
			for (let k = 0; k < fixed.length; k++) {
				let x_fc = (fixed[k].x + fixed[k].x_rb) * 0.5;
				let y_fc = (fixed[k].y + fixed[k].y_rb) * 0.5;
				let w_f = fixed[k].x_rb - fixed[k].x;
				let h_f = fixed[k].y_rb - fixed[k].y;
				// Check collision
				if (Math.abs(x_c - x_fc) < (w + w_f) * 0.5 &&
				    Math.abs(y_c - y_fc) < (h + h_f) * 0.5) {
					if (Math.abs(candidates[n].x - fixed[k].x) > 5) {
						candidates.push({
						    x: candidates[n].x,
						    y: fixed[k].y_rb + 1});
					}
					if (Math.abs(candidates[n].y - fixed[k].y) > 5) {
						candidates.push({
						    x: fixed[k].x_rb + 1,
						    y: candidates[n].y});
					}
					// Delete the candidate
					candidates.splice(n, 1);
					n--;
					k = fixed.length;
					continue;
				}
			}
		}
		// if contents width over the window size
		if (candidates.length == 0) {
			candidates.push({
			    x: 0,
			    y: maxBottom + MenuContentMargin});
		}
		// Select origin point
		let origin = {
		    x: candidates[0].x,
		    y: candidates[0].y};
		for (let n = 1; n < candidates.length; n++) {
			if (candidates[n].y < origin.y ||
			    (candidates[n].x < origin.x && candidates[n].y == origin.y)) {
				origin.x = candidates[n].x;
				origin.y = candidates[n].y;
			}
		}
		// Add box to fixed
		fixed.push({
			x: origin.x, y: origin.y,
			x_rb: origin.x + rect.width + MenuContentMargin,
			y_rb: origin.y + rect.height + MenuContentMargin});
		// Update max of Bottom and Right
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




