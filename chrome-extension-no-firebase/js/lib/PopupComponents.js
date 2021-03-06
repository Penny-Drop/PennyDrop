var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is the file that contains the React components for the popup.
 * You must only edit this file, not the one in the `lib` directory.
 * This file uses JSX, so it's necessary to compile the code into plain JS using Babel. Instructions on how to do this
 * are in the README
 */
import Utils from "../utils.js";

// Global variables
var localServerURL = "http://127.0.0.1:5000/";
var deployedServerURL = "https://knolist-legacy.herokuapp.com/";

// Wrapper for all components in the popup

var PopupComponents = function (_React$Component) {
    _inherits(PopupComponents, _React$Component);

    function PopupComponents(props) {
        _classCallCheck(this, PopupComponents);

        var _this = _possibleConstructorReturn(this, (PopupComponents.__proto__ || Object.getPrototypeOf(PopupComponents)).call(this, props));

        _this.state = {
            graph: null,
            showNewNotesForm: false,
            localServer: false
        };

        _this.getDataFromServer = _this.getDataFromServer.bind(_this);
        _this.switchShowNewNotesForm = _this.switchShowNewNotesForm.bind(_this);
        return _this;
    }

    // Verifies if the local server is being run


    _createClass(PopupComponents, [{
        key: "checkIfLocalServer",
        value: function checkIfLocalServer() {
            var _this2 = this;

            $.ajax(localServerURL, {
                complete: function complete(jqXHR, textStatus) {
                    if (textStatus === "success") _this2.setState({ localServer: true });else _this2.setState({ localServer: false });
                }
            });
        }
    }, {
        key: "switchShowNewNotesForm",
        value: function switchShowNewNotesForm() {
            var _this3 = this;

            document.getElementById("new-notes-form").reset();
            this.setState({ showNewNotesForm: !this.state.showNewNotesForm }, function () {
                if (_this3.state.showNewNotesForm) document.getElementById("notes").focus();
            });
        }
    }, {
        key: "getDataFromServer",
        value: function getDataFromServer() {
            var _this4 = this;

            getGraphFromDisk().then(function (graph) {
                _this4.setState({ graph: graph });
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.getDataFromServer();
            this.checkIfLocalServer();
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "popup" },
                React.createElement(Header, null),
                React.createElement(
                    "div",
                    { id: "popup-body" },
                    React.createElement(ProjectList, { graph: this.state.graph, refresh: this.getDataFromServer }),
                    React.createElement(AddCurrentPageButton, null),
                    React.createElement(NewNotesArea, { showForm: this.state.showNewNotesForm, switchShowForm: this.switchShowNewNotesForm,
                        localServer: this.state.localServer })
                )
            );
        }
    }]);

    return PopupComponents;
}(React.Component);

// Header of the popup. Contains logo and home button


var Header = function (_React$Component2) {
    _inherits(Header, _React$Component2);

    function Header() {
        _classCallCheck(this, Header);

        return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
    }

    _createClass(Header, [{
        key: "openHomePage",

        // If the home page is already opened, it simply refreshes and goes to that page
        // If it's not open, a new tab is opened next to the current active tab
        value: function openHomePage() {
            chrome.tabs.query({
                title: "Knolist", currentWindow: true
            }, function (tabs) {
                // Check if a tab was found. If it was, it means the home page is already open
                if (tabs.length > 0) {
                    var tab = tabs[0];
                    // Reload if already active, switch to Knolist if not active
                    if (tab.active) {
                        chrome.tabs.reload(tab.id);
                        window.close();
                    } else chrome.tabs.update(tab.id, { active: true });
                } else {
                    // Open a new tab for the home page
                    chrome.tabs.query({
                        active: true, currentWindow: true
                    }, function (tabs) {
                        var index = tabs[0].index;
                        chrome.tabs.create({
                            url: "../../html/Knolist.com.html",
                            index: index + 1
                        });
                    });
                }
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this6 = this;

            return React.createElement(
                "div",
                { className: "header", style: { height: "35px" } },
                React.createElement("img", { src: "../../images/horizontal_main.PNG", alt: "Knolist", style: { height: "100%" } }),
                React.createElement(
                    "div",
                    { style: { display: "flex" } },
                    React.createElement(ActivateProjectSwitch, null),
                    React.createElement(
                        "a",
                        { onClick: function onClick() {
                                return _this6.openHomePage();
                            }, id: "home-button" },
                        React.createElement("img", { src: "../../images/home-icon-black.png", alt: "Home", style: { height: "100%", margin: "1px" } })
                    )
                )
            );
        }
    }]);

    return Header;
}(React.Component);

// Dropdown list of all the projects, allows user to switch between them.


var ProjectList = function (_React$Component3) {
    _inherits(ProjectList, _React$Component3);

    function ProjectList(props) {
        _classCallCheck(this, ProjectList);

        var _this7 = _possibleConstructorReturn(this, (ProjectList.__proto__ || Object.getPrototypeOf(ProjectList)).call(this, props));

        _this7.state = {
            dropdownOpen: false,
            showNewProjectForm: false,
            alertMessage: null, // null for no issue, "invalid-title", or "repeated-title"
            invalidTitle: null
        };

        _this7.switchDropdown = _this7.switchDropdown.bind(_this7);
        _this7.switchShowNewProjectForm = _this7.switchShowNewProjectForm.bind(_this7);
        _this7.setAlertMessage = _this7.setAlertMessage.bind(_this7);
        _this7.setInvalidTitle = _this7.setInvalidTitle.bind(_this7);

        document.body.addEventListener("click", function (event) {
            if (!Utils.isDescendant(document.getElementById("projects-dropdown"), event.target)) {
                _this7.closeDropdown();
            }
        });
        return _this7;
    }

    _createClass(ProjectList, [{
        key: "setAlertMessage",
        value: function setAlertMessage(value) {
            this.setState({ alertMessage: value });
        }
    }, {
        key: "setInvalidTitle",
        value: function setInvalidTitle(value) {
            this.setState({ invalidTitle: value });
        }
    }, {
        key: "switchDropdown",
        value: function switchDropdown() {
            this.setState({ dropdownOpen: !this.state.dropdownOpen });
        }
    }, {
        key: "closeDropdown",
        value: function closeDropdown() {
            if (this.state.dropdownOpen) this.switchDropdown();
        }
    }, {
        key: "switchShowNewProjectForm",
        value: function switchShowNewProjectForm() {
            var _this8 = this;

            document.getElementById("new-project-form").reset();
            this.setState({
                showNewProjectForm: !this.state.showNewProjectForm,
                alertMessage: null,
                invalidTitle: null
            }, function () {
                // Set focus to input field
                if (_this8.state.showNewProjectForm) document.getElementById("newProjectTitle").focus();
            });
        }
    }, {
        key: "render",
        value: function render() {
            if (this.props.graph === null) return null;

            return React.createElement(
                "div",
                { id: "projects-list" },
                React.createElement(
                    "div",
                    { style: { display: "flex", justifyContent: "space-between" } },
                    React.createElement(
                        "h4",
                        null,
                        "Current Project:"
                    ),
                    React.createElement(NewProjectButton, { showForm: this.state.showNewProjectForm,
                        switchShowForm: this.switchShowNewProjectForm })
                ),
                React.createElement(NewProjectForm, { showNewProjectForm: this.state.showNewProjectForm, refresh: this.props.refresh,
                    switchForm: this.switchShowNewProjectForm,
                    setAlertMessage: this.setAlertMessage,
                    setInvalidTitle: this.setInvalidTitle,
                    alertMessage: this.state.alertMessage,
                    invalidTitle: this.state.invalidTitle,
                    projects: Object.keys(this.props.graph) }),
                React.createElement(ProjectsDropdown, { dropdownOpen: this.state.dropdownOpen, switchDropdown: this.switchDropdown,
                    graph: this.props.graph, refresh: this.props.refresh })
            );
        }
    }]);

    return ProjectList;
}(React.Component);

var AddCurrentPageButton = function (_React$Component4) {
    _inherits(AddCurrentPageButton, _React$Component4);

    function AddCurrentPageButton(props) {
        _classCallCheck(this, AddCurrentPageButton);

        var _this9 = _possibleConstructorReturn(this, (AddCurrentPageButton.__proto__ || Object.getPrototypeOf(AddCurrentPageButton)).call(this, props));

        _this9.state = {
            loading: false, // Used to display loading icon while page is being added
            justAdded: false // Used to display a temporary "Added" message after node is added
        };

        _this9.addPageToProject = _this9.addPageToProject.bind(_this9);
        return _this9;
    }

    _createClass(AddCurrentPageButton, [{
        key: "setLoading",
        value: function setLoading(value) {
            this.setState({ loading: value });
        }
    }, {
        key: "addPageToProject",
        value: function addPageToProject() {
            var _this10 = this;

            this.setLoading(true);
            // Get current page
            chrome.tabs.query({
                active: true, currentWindow: true
            }, function (tabs) {
                var currentTab = tabs[0];

                // Call from server
                var baseServerURL = deployedServerURL;
                if (_this10.props.localServer) {
                    // Use local server if it's active
                    baseServerURL = localServerURL;
                }
                var contentExtractionURL = baseServerURL + "extract?url=" + encodeURIComponent(currentTab.url);

                // Get previous url to add connection if it exists, then add to project
                chrome.tabs.sendMessage(currentTab.id, { command: "get_current" }, function (response) {
                    // Create item based on the current page
                    $.getJSON(contentExtractionURL, function (item) {
                        addItemToGraph(item, response.prevURL).then(function () {
                            return _this10.setLoading(false);
                        });
                    });
                });
            });
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            var _this11 = this;

            // Block clicks while the new node is being loaded
            if (prevState.loading !== this.state.loading) {
                if (this.state.loading) document.body.style.pointerEvents = "none";else {
                    document.body.style.pointerEvents = "auto";
                    this.setState({ justAdded: true }, function () {
                        setTimeout(function () {
                            _this11.setState({ justAdded: false });
                        }, 1000);
                    });
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "flex popup-action-button" },
                React.createElement(
                    "button",
                    { className: "button small-button button-with-text", onClick: this.addPageToProject },
                    React.createElement(
                        "p",
                        null,
                        this.state.loading ? "Adding..." : this.state.justAdded ? "Page added." : "Add this page to project"
                    )
                ),
                this.state.loading ? React.createElement(LoadingSpinner, null) : null
            );
        }
    }]);

    return AddCurrentPageButton;
}(React.Component);

// Button used to open the "create project" form


function NewProjectButton(props) {
    if (props.showForm) {
        return React.createElement(
            "button",
            { className: "button small-button button-with-text new-project-button", onClick: props.switchShowForm },
            React.createElement(
                "p",
                null,
                "Cancel"
            )
        );
    }
    return React.createElement(
        "button",
        { className: "button small-button new-project-button", onClick: props.switchShowForm },
        React.createElement("img", { src: "../../images/add-icon-white.png", alt: "New", style: { width: "100%" } })
    );
}

// Form to create a new project

var NewProjectForm = function (_React$Component5) {
    _inherits(NewProjectForm, _React$Component5);

    function NewProjectForm(props) {
        _classCallCheck(this, NewProjectForm);

        var _this12 = _possibleConstructorReturn(this, (NewProjectForm.__proto__ || Object.getPrototypeOf(NewProjectForm)).call(this, props));

        _this12.handleSubmit = _this12.handleSubmit.bind(_this12);
        return _this12;
    }

    _createClass(NewProjectForm, [{
        key: "handleSubmit",
        value: function handleSubmit(event) {
            var _this13 = this;

            // Prevent page from reloading
            event.preventDefault();

            // Data validation
            var title = Utils.trimString(event.target.newProjectTitle.value);
            var alertMessage = Utils.validateProjectTitle(title, this.props.projects);
            this.props.setAlertMessage(alertMessage);
            if (alertMessage == null) {
                // Valid name
                createNewProjectInGraph(title).then(function () {
                    return _this13.props.refresh();
                });

                // Activate tracking
                document.getElementById("switch-tracking").checked = true;
                chrome.runtime.sendMessage({ command: "start-tracking" });

                // Reset entry and close form
                event.target.reset();
                // Close the form
                this.props.switchForm();
                // Hide alert message if there was one
                this.props.setInvalidTitle(null);
            } else {
                this.props.setInvalidTitle(title);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var style = { display: "none" };
            if (this.props.showNewProjectForm) {
                style = { display: "block" };
            }
            return React.createElement(
                "div",
                { style: style, id: "new-project-form-area" },
                React.createElement(
                    "form",
                    { id: "new-project-form", onSubmit: this.handleSubmit, autoComplete: "off" },
                    React.createElement("input", { type: "text", id: "newProjectTitle", name: "newProjectTitle", defaultValue: "New Project", required: true }),
                    React.createElement(
                        "button",
                        { className: "button small-button button-with-text" },
                        "Create"
                    )
                ),
                React.createElement(AlertMessage, { alertMessage: this.props.alertMessage, projectTitle: this.props.invalidTitle })
            );
        }
    }]);

    return NewProjectForm;
}(React.Component);

/**
 * @return {null}
 */


function AlertMessage(props) {
    if (props.alertMessage === "invalid-title") {
        return React.createElement(
            "p",
            null,
            props.projectTitle,
            " is not a valid title."
        );
    }

    if (props.alertMessage === "repeated-title") {
        return React.createElement(
            "p",
            null,
            "You already have a project called ",
            props.projectTitle,
            "."
        );
    }

    return null;
}

function ProjectsDropdown(props) {
    // Define arrow icon to use based on whether dropdown is active
    // Hide or display the dropdown content
    var arrowIconURL = "../../images/down-chevron-icon-black.png";
    var dropdownStyle = { display: "none" };
    if (props.dropdownOpen) {
        arrowIconURL = "../../images/up-chevron-icon-black.png";
        dropdownStyle = { display: "block" };
    }

    return React.createElement(
        "div",
        { className: "dropdown", id: "projects-dropdown" },
        React.createElement(
            "div",
            { onClick: props.switchDropdown, id: "current-project-area" },
            React.createElement(
                "p",
                null,
                props.graph.curProject
            ),
            React.createElement(
                "button",
                { className: "dropdown-button" },
                React.createElement("img", { src: arrowIconURL, alt: "Dropdown" })
            )
        ),
        React.createElement(
            "div",
            { className: "dropdown-content", style: dropdownStyle },
            Object.keys(props.graph).map(function (project) {
                return React.createElement(DropdownItem, { key: project,
                    projectName: project,
                    curProject: props.graph.curProject,
                    refresh: props.refresh,
                    switchDropdown: props.switchDropdown });
            })
        )
    );
}

// Each item in the project dropdown

var DropdownItem = function (_React$Component6) {
    _inherits(DropdownItem, _React$Component6);

    function DropdownItem(props) {
        _classCallCheck(this, DropdownItem);

        var _this14 = _possibleConstructorReturn(this, (DropdownItem.__proto__ || Object.getPrototypeOf(DropdownItem)).call(this, props));

        _this14.activateProject = _this14.activateProject.bind(_this14);
        return _this14;
    }

    _createClass(DropdownItem, [{
        key: "activateProject",
        value: function activateProject() {
            var _this15 = this;

            this.props.switchDropdown();
            setCurrentProjectInGraph(this.props.projectName).then(function () {
                return _this15.props.refresh();
            });
        }
    }, {
        key: "render",
        value: function render() {
            // Ignore properties that are not titles
            if (this.props.projectName === "curProject" || this.props.projectName === "version") return null;

            // Ignore current project
            if (this.props.projectName === this.props.curProject) return null;

            return React.createElement(
                "a",
                { onClick: this.activateProject },
                this.props.projectName
            );
        }
    }]);

    return DropdownItem;
}(React.Component);

var ActivateProjectSwitch = function (_React$Component7) {
    _inherits(ActivateProjectSwitch, _React$Component7);

    function ActivateProjectSwitch(props) {
        _classCallCheck(this, ActivateProjectSwitch);

        var _this16 = _possibleConstructorReturn(this, (ActivateProjectSwitch.__proto__ || Object.getPrototypeOf(ActivateProjectSwitch)).call(this, props));

        _this16.switchTracking = _this16.switchTracking.bind(_this16);
        return _this16;
    }

    _createClass(ActivateProjectSwitch, [{
        key: "switchTracking",
        value: function switchTracking() {
            if (document.getElementById("switch-tracking").checked) {
                chrome.runtime.sendMessage({ command: "start-tracking" });
            } else {
                chrome.runtime.sendMessage({ command: "stop-tracking" });
            }
        }
    }, {
        key: "setTrackingState",
        value: function setTrackingState() {
            chrome.runtime.sendMessage({ command: "get_tracking" }, function (response) {
                document.getElementById("switch-tracking").checked = response.trackBrowsing;
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.setTrackingState();
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "label",
                { className: "switch" },
                React.createElement("input", { type: "checkbox", id: "switch-tracking", onClick: this.switchTracking }),
                React.createElement("span", { className: "switch-slider round" })
            );
        }
    }]);

    return ActivateProjectSwitch;
}(React.Component);

function NewNotesArea(props) {
    return React.createElement(
        "div",
        { className: "popup-action-button" },
        React.createElement(NewNotesButton, { showForm: props.showForm, switchShowForm: props.switchShowForm }),
        React.createElement(NewNotesForm, { showForm: props.showForm, switchShowForm: props.switchShowForm,
            localServer: props.localServer })
    );
}

var NewNotesForm = function (_React$Component8) {
    _inherits(NewNotesForm, _React$Component8);

    function NewNotesForm(props) {
        _classCallCheck(this, NewNotesForm);

        var _this17 = _possibleConstructorReturn(this, (NewNotesForm.__proto__ || Object.getPrototypeOf(NewNotesForm)).call(this, props));

        _this17.handleSubmit = _this17.handleSubmit.bind(_this17);
        return _this17;
    }

    _createClass(NewNotesForm, [{
        key: "handleSubmit",
        value: function handleSubmit(event) {
            var _this18 = this;

            event.preventDefault();

            var notes = event.target.notes.value;

            this.props.switchShowForm(); // Hide the form
            event.target.reset(); // Clear the form entries

            // Get current page
            chrome.tabs.query({
                active: true, currentWindow: true
            }, function (tabs) {
                var currentTab = tabs[0];

                // Call from server
                var baseServerURL = deployedServerURL;
                if (_this18.props.localServer) {
                    // Use local server if it's active
                    baseServerURL = localServerURL;
                }
                var contentExtractionURL = baseServerURL + "extract?url=" + encodeURIComponent(currentTab.url);

                // Get previous url to add connection if it exists, then add notes
                chrome.tabs.sendMessage(currentTab.id, { command: "get_current" }, function (response) {
                    // Create item based on the current page
                    $.getJSON(contentExtractionURL, function (item) {
                        addNotesToItemInGraph(item, notes, response.prevURL);
                    });
                });
            });
        }
    }, {
        key: "render",
        value: function render() {
            // Hidden form for adding notes
            var style = { display: "none" };
            if (this.props.showForm) {
                style = { display: "flex" };
            }

            return React.createElement(
                "form",
                { id: "new-notes-form", onSubmit: this.handleSubmit, style: style },
                React.createElement("input", { id: "notes", name: "notes", type: "text", placeholder: "Insert Notes", required: true }),
                React.createElement(
                    "button",
                    { className: "button small-button button-with-text", style: { marginTop: 0, marginBottom: 0 } },
                    "Add"
                )
            );
        }
    }]);

    return NewNotesForm;
}(React.Component);

// Button used to open the "create project" form


function NewNotesButton(props) {
    return React.createElement(
        "button",
        { className: "button small-button button-with-text", onClick: props.switchShowForm },
        React.createElement(
            "p",
            null,
            props.showForm ? "Cancel" : "Add notes to this page"
        )
    );
}

// Simple loading spinner, CSS is defined in utilities.less
function LoadingSpinner() {
    return React.createElement("div", { className: "spinner" });

    // return (
    //     <div className="lds-spinner">
    //         <div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
    //     </div>
    // );
}

ReactDOM.render(React.createElement(PopupComponents, null), document.querySelector("#popup-wrapper"));