var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is the file that contains the React components for the web application page.
 * You must only edit this file, not the one in the `lib` directory.
 * This file uses JSX, so it's necessary to compile the code into plain JS using Babel. Instructions on how to do this
 * are in the README
 */
import Utils from "../utils.js";

// Global variables
var localServerURL = "http://127.0.0.1:5000/";
var deployedServerURL = "https://knolist-legacy.herokuapp.com/";
var nodeBackgroundDefaultColor = Utils.getDefaultNodeColor();
var nodeHighlightDefaultColor = Utils.getHighlightNodeColor();

// Wrapper for all the components in the page

var KnolistComponents = function (_React$Component) {
    _inherits(KnolistComponents, _React$Component);

    function KnolistComponents(props) {
        _classCallCheck(this, KnolistComponents);

        var _this = _possibleConstructorReturn(this, (KnolistComponents.__proto__ || Object.getPrototypeOf(KnolistComponents)).call(this, props));

        _this.state = {
            graph: null, // All the graph data
            selectedNode: null, // Node that's clicked for the detailed view,
            nodeForDeletion: null, // Node to be deleted after confirmation
            editNodeMode: false, // Set to true when selectedNode is in edit mode
            displayExport: false,
            showNewNodeForm: false,
            showNewNotesForm: false,
            // autoRefresh: true, // Will be set to false on drag
            newNodeData: null, // Used when creating a new node
            visNetwork: null, // The vis-network object
            visNodes: null, // The vis DataSet of nodes
            visEdges: null, // The vis DataSet of edges
            bibliographyData: null, // The data to be exported as bibliography
            showProjectsSidebar: false, // Whether or not to show the projects sidebar
            localServer: false, // Set to true if the server is being run locally
            fullSearchResults: null // Null when no search was made, search result object when searching (will hide the mind map)
        };

        // Bind functions that need to be passed as parameters
        // this.deleteNode = this.deleteNode.bind(this); // Was used for deletion through the vis.js GUI
        _this.getDataFromServer = _this.getDataFromServer.bind(_this);
        _this.exportData = _this.exportData.bind(_this);
        _this.handleClickedNode = _this.handleClickedNode.bind(_this);
        _this.addNode = _this.addNode.bind(_this);
        _this.deleteEdge = _this.deleteEdge.bind(_this);
        _this.addEdge = _this.addEdge.bind(_this);
        _this.switchShowNewNodeForm = _this.switchShowNewNodeForm.bind(_this);
        _this.switchShowNewNotesForm = _this.switchShowNewNotesForm.bind(_this);
        _this.resetSelectedNode = _this.resetSelectedNode.bind(_this);
        _this.setNodeForDeletion = _this.setNodeForDeletion.bind(_this);
        _this.setEditNodeMode = _this.setEditNodeMode.bind(_this);
        _this.resetNodeForDeletion = _this.resetNodeForDeletion.bind(_this);
        _this.deleteNodeAfterConfirmation = _this.deleteNodeAfterConfirmation.bind(_this);
        _this.resetDisplayExport = _this.resetDisplayExport.bind(_this);
        _this.openProjectsSidebar = _this.openProjectsSidebar.bind(_this);
        _this.closeProjectsSidebar = _this.closeProjectsSidebar.bind(_this);
        _this.closePageView = _this.closePageView.bind(_this);
        _this.closeNewNodeForm = _this.closeNewNodeForm.bind(_this);
        _this.setSelectedNode = _this.setSelectedNode.bind(_this);
        _this.basicSearch = _this.basicSearch.bind(_this);
        _this.fullSearch = _this.fullSearch.bind(_this);
        _this.setFullSearchResults = _this.setFullSearchResults.bind(_this);
        _this.resetFullSearchResults = _this.resetFullSearchResults.bind(_this);

        // Set up listener to close modals when user clicks outside of them
        document.body.addEventListener("click", function (event) {
            if (event.target.classList.contains("modal")) {
                _this.closeModals();
            }
        });

        // Set up listener to close different elements by pressing Escape
        document.body.addEventListener("keyup", function (event) {
            if (event.key === "Escape") {
                if (!_this.closeModals()) {
                    // Prioritize closing modals
                    if (_this.state.fullSearchResults !== null) {
                        _this.resetFullSearchResults();
                    }
                }
            }
        });

        // Set timeout and update graph to get the correct font
        setTimeout(function () {
            return _this.getDataFromServer();
        }, 1000);
        return _this;
    }

    // Return true if a modal was closed. Used to prioritize modal closing


    _createClass(KnolistComponents, [{
        key: "closeModals",
        value: function closeModals() {
            if (this.state.selectedNode !== null) {
                this.closePageView();
                return true;
            }
            if (this.state.displayExport) {
                this.resetDisplayExport();
                return true;
            }
            if (this.state.showNewNodeForm) {
                this.closeNewNodeForm();
                return true;
            }
            return false;
        }

        // Verifies if the local server is being run

    }, {
        key: "checkIfLocalServer",
        value: function checkIfLocalServer() {
            var _this2 = this;

            $.ajax(localServerURL, {
                complete: function complete(jqXHR, textStatus) {
                    if (textStatus === "success") _this2.setState({ localServer: true });else _this2.setState({ localServer: false });
                }
            });
        }

        // Calls graph.js function to pull the graph from the Chrome storage
        // Optional callback to be called after selectedNode is updated
        /**
         * Main function used to update the front end graph data
         * @param callbackObject is an optional object containing callback functions. callbackObject.graphCallback is called
         * after updating the graph. callbackObject.selectedNodeCallback is called after updating the selected node.
         */

    }, {
        key: "getDataFromServer",
        value: function getDataFromServer() {
            var _this3 = this;

            var callbackObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            // All the websites as a graph
            getGraphFromDisk().then(function (graph) {
                _this3.setState({ graph: graph }, function () {
                    if (callbackObject.graphCallback !== undefined) callbackObject.graphCallback();
                });
                _this3.setupVisGraph();
                _this3.getBibliographyData();

                // Redo search if search mode is active
                if (_this3.state.fullSearchResults !== null) {
                    var resultObject = _this3.state.fullSearchResults;
                    _this3.fullSearch(resultObject.query, resultObject.filterList);
                }

                // Manually update selectedNode if it's not null nor undefined
                if (_this3.state.selectedNode !== null && _this3.state.selectedNode !== undefined) {
                    var url = _this3.state.selectedNode.source;
                    var curProject = graph.curProject;
                    var updatedSelectedNode = graph[curProject][url];
                    _this3.setState({ selectedNode: updatedSelectedNode }, function () {
                        if (callbackObject.selectedNodeCallback !== undefined) callbackObject.selectedNodeCallback();
                    });
                }
            });

            // window.setTimeout(() => {
            //     if (this.state.autoRefresh) this.getDataFromServer();
            // }, 200);
        }

        // Pulls the bibliography data from the backend

    }, {
        key: "getBibliographyData",
        value: function getBibliographyData() {
            var _this4 = this;

            getTitlesFromGraph().then(function (bibliographyData) {
                _this4.setState({ bibliographyData: bibliographyData });
            });
        }

        // Used for the export bibliography button

    }, {
        key: "exportData",
        value: function exportData() {
            this.setState({ displayExport: true });
        }
    }, {
        key: "resetDisplayExport",
        value: function resetDisplayExport() {
            this.setState({ displayExport: false });
        }
    }, {
        key: "resetSelectedNode",
        value: function resetSelectedNode() {
            this.setState({ selectedNode: null });
            this.resetNodeForDeletion();
            this.setEditNodeMode(false);
        }
    }, {
        key: "setSelectedNode",
        value: function setSelectedNode(url) {
            var curProject = this.state.graph.curProject;
            this.setState({ selectedNode: this.state.graph[curProject][url] });
        }
    }, {
        key: "setNodeForDeletion",
        value: function setNodeForDeletion(url) {
            this.setState({ nodeForDeletion: url });
        }
    }, {
        key: "resetNodeForDeletion",
        value: function resetNodeForDeletion() {
            this.setState({ nodeForDeletion: null });
        }
    }, {
        key: "setEditNodeMode",
        value: function setEditNodeMode(status) {
            this.setState({ editNodeMode: status });
        }
    }, {
        key: "deleteNodeAfterConfirmation",
        value: function deleteNodeAfterConfirmation() {
            var _this5 = this;

            // Remove from the graph
            removeItemFromGraph(this.state.selectedNode.source).then(function () {
                // Reset the selected node
                _this5.resetSelectedNode();
                _this5.getDataFromServer();
            });
        }
    }, {
        key: "closePageView",
        value: function closePageView() {
            // Only call switchForm if the notes form is showing
            if (this.state.showNewNotesForm) {
                this.switchShowNewNotesForm();
            }

            this.resetSelectedNode();
        }

        // Set selected node for the detailed view

    }, {
        key: "handleClickedNode",
        value: function handleClickedNode(id) {
            var visCloseButton = document.getElementsByClassName("vis-close")[0];
            // Only open modal outside of edit mode
            if (getComputedStyle(visCloseButton).display === "none") {
                this.setSelectedNode(id);
            }
        }

        // Was used for deletion through the vis.js GUI, probably unnecessary
        // deleteNode(data, callback) {
        //     const nodeId = data.nodes[0];
        //     removeItemFromGraph(nodeId).then(() => {
        //         callback(data);
        //     });
        // }

    }, {
        key: "addNode",
        value: function addNode(nodeData, callback) {
            this.switchShowNewNodeForm();
            this.setState({
                newNodeData: nodeData
            });
        }
    }, {
        key: "deleteEdge",
        value: function deleteEdge(data, callback) {
            var _this6 = this;

            var edgeId = data.edges[0];
            var connectedNodes = this.state.visNetwork.getConnectedNodes(edgeId);
            removeEdgeFromGraph(connectedNodes[0], connectedNodes[1]).then(function () {
                _this6.getDataFromServer();
                callback(data);
            });
            callback(data);
        }
    }, {
        key: "addEdge",
        value: function addEdge(edgeData, callback) {
            var _this7 = this;

            if (edgeData.from !== edgeData.to) {
                // Ensure that user isn't adding self edge
                addEdgeToGraph(edgeData.from, edgeData.to).then(function () {
                    _this7.getDataFromServer();
                    callback(edgeData);
                });
            }
        }
    }, {
        key: "closeNewNodeForm",
        value: function closeNewNodeForm() {
            document.getElementById("new-node-form").reset();
            this.switchShowNewNodeForm();
        }
    }, {
        key: "switchShowNewNodeForm",
        value: function switchShowNewNodeForm() {
            var _this8 = this;

            this.setState({ showNewNodeForm: !this.state.showNewNodeForm }, function () {
                // Set focus to the input field
                if (_this8.state.showNewNodeForm) {
                    document.getElementById("url").focus();
                }
            });
        }
    }, {
        key: "switchShowNewNotesForm",
        value: function switchShowNewNotesForm() {
            var _this9 = this;

            document.getElementById("new-notes-form").reset();
            this.setState({ showNewNotesForm: !this.state.showNewNotesForm }, function () {
                // Set focus to the input field if the notes form is open
                if (_this9.state.showNewNotesForm) document.getElementById("notes").focus();
            });
        }
    }, {
        key: "openProjectsSidebar",
        value: function openProjectsSidebar() {
            this.setState({ showProjectsSidebar: true });
            var sidebarWidth = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-width");
            document.getElementById("projects-sidebar").style.width = sidebarWidth;
            document.getElementById("projects-sidebar-btn").style.right = sidebarWidth;
        }
    }, {
        key: "closeProjectsSidebar",
        value: function closeProjectsSidebar() {
            this.setState({ showProjectsSidebar: false });
            document.getElementById("projects-sidebar").style.width = "0";
            document.getElementById("projects-sidebar-btn").style.right = "0";
        }
    }, {
        key: "setFullSearchResults",
        value: function setFullSearchResults(results) {
            this.setState({ fullSearchResults: results });
        }
    }, {
        key: "resetFullSearchResults",
        value: function resetFullSearchResults() {
            document.getElementById("search-text").value = ""; // Reset the search bar
            this.highlightNodes(null); // Reset highlighted nodes
            this.setState({ fullSearchResults: null });
        }

        /**
         * Visually highlights nodes by changing colors and opacity
         * @param nodesToHighlight an array of ids of the nodes to be highlighted
         */

    }, {
        key: "highlightNodes",
        value: function highlightNodes(nodesToHighlight) {
            var _this10 = this;

            // If the list is null, reset all nodes to the default
            if (nodesToHighlight === null) {
                this.state.visNodes.forEach(function (node) {
                    node.opacity = 1;
                    node.color = {
                        background: nodeBackgroundDefaultColor
                    };
                    _this10.state.visNodes.update(node);
                });
                return;
            }

            // If list is not null, highlight based on the list
            this.state.visNodes.forEach(function (node) {
                if (!nodesToHighlight.includes(node.id)) {
                    node.opacity = 0.3;
                    node.color = {
                        background: nodeBackgroundDefaultColor
                    };
                } else {
                    node.opacity = 1;
                    node.color = {
                        background: nodeHighlightDefaultColor
                    };
                }
                _this10.state.visNodes.update(node);
            });
        }

        /**
         * Given a text query, this function searches the current project for occurrences of that query. The function returns
         * a "result object", which contains the query, filterList, and an array of results grouped by node. If the query is empty,
         * the results array is set to null.
         * @param query the query to be searched
         * @param filterList a list of node keys that whose contents will be included in the search
         * @returns {{query: *, filterList: *, results: []}} the result object. The results array is null is the query is empty
         */

    }, {
        key: "getSearchResults",
        value: function getSearchResults(query, filterList) {
            // Return object with null results for empty queries
            if (query === "") {
                return {
                    query: query,
                    filterList: filterList,
                    results: null
                };
            }

            var curProject = this.state.graph.curProject;
            var graph = this.state.graph[curProject];

            var resultObject = {
                query: query,
                filterList: filterList,
                results: []
            };
            query = Utils.trimString(query); // trim it
            query = query.toLowerCase();
            for (var graphKey in graph) {
                var node = graph[graphKey];
                var occurrences = [];
                var occurrencesCount = 0;
                // Iterate through the keys inside the node
                for (var nodeKey in node) {
                    // Act depending on the type of node[key]
                    var elem = node[nodeKey];
                    if (typeof elem === "number") break; // Ignore pure numbers
                    if (Array.isArray(elem)) elem = elem.toString(); // Serialize arrays for search (notes, highlights, ...)
                    elem = elem.toLowerCase(); // Lower case for case-insensitive search

                    if (filterList.includes(nodeKey)) {
                        // Check if query is present
                        var indices = Utils.getIndicesOf(query, elem);
                        // Only add if results were found
                        if (indices.length > 0) {
                            occurrences.push({
                                key: nodeKey,
                                indices: indices
                            });
                            occurrencesCount += indices.length;
                        }
                    }
                }
                // If occurrences were found, include the current node in results
                if (occurrences.length > 0) {
                    resultObject.results.push({
                        url: node.source,
                        occurrences: occurrences,
                        occurrencesCount: occurrencesCount
                    });
                }
            }
            return resultObject;
        }
    }, {
        key: "basicSearch",
        value: function basicSearch(query, filterList) {
            var resultObject = this.getSearchResults(query, filterList);
            if (resultObject.results === null) {
                // If results are null, the query was empty
                this.highlightNodes(null);
            } else {
                // Construct array of IDs based on the results
                var resultIDs = [];
                resultObject.results.forEach(function (result) {
                    return resultIDs.push(result.url);
                });
                // Highlight results
                this.highlightNodes(resultIDs);
            }
        }
    }, {
        key: "fullSearch",
        value: function fullSearch(query, filterList) {
            var resultObject = this.getSearchResults(query, filterList);
            // Sort so that results with the most occurrences are at the top
            resultObject.results.sort(function (a, b) {
                return a.occurrencesCount >= b.occurrencesCount ? -1 : 1;
            });
            this.setFullSearchResults(resultObject);
        }

        /* Helper function to generate position for nodes
        This function adds an offset to  the randomly generated position based on the
        position of the node's parent (if it has one)
         */

    }, {
        key: "generateNodePositions",
        value: function generateNodePositions(node) {
            var xOffset = 0;
            var yOffset = 0;
            // Update the offset if the node has a parent
            if (node.prevURLs.length !== 0) {
                var prevURL = node.prevURLs[0];
                var curProject = this.state.graph.curProject;
                var prevNode = this.state.graph[curProject][prevURL];
                // Check if the previous node has defined coordinates
                if (prevNode.x !== null && prevNode.y !== null) {
                    xOffset = prevNode.x;
                    yOffset = prevNode.y;
                }
            }
            // Helper variable to generate random positions
            var rangeLimit = 300; // To generate positions in the interval [-rangeLimit, rangeLimit]
            // Generate random positions
            var xRandom = Math.floor(Math.random() * 2 * rangeLimit - rangeLimit);
            var yRandom = Math.floor(Math.random() * 2 * rangeLimit - rangeLimit);

            // Return positions with offset
            return [xRandom + xOffset, yRandom + yOffset];
        }

        // Helper function to setup the nodes and edges for the graph

    }, {
        key: "createNodesAndEdges",
        value: function createNodesAndEdges() {
            var nodes = new vis.DataSet();
            var edges = new vis.DataSet();
            var curProject = this.state.graph.curProject;
            // Iterate through each node in the graph and build the arrays of nodes and edges
            for (var index in this.state.graph[curProject]) {
                var node = this.state.graph[curProject][index];
                // Deal with positions
                if (node.x === null || node.y === null || node.x === undefined || node.y === undefined) {
                    // If position is still undefined, generate random x and y in interval [-300, 300]
                    var _generateNodePosition = this.generateNodePositions(node),
                        _generateNodePosition2 = _slicedToArray(_generateNodePosition, 2),
                        x = _generateNodePosition2[0],
                        y = _generateNodePosition2[1];

                    nodes.add({ id: node.source, label: node.title, x: x, y: y });
                } else {
                    nodes.add({ id: node.source, label: node.title, x: node.x, y: node.y });
                }
                // Deal with edges
                for (var nextIndex in node.nextURLs) {
                    edges.add({ from: node.source, to: node.nextURLs[nextIndex] });
                }
            }
            // console.log(nodes);
            // console.log(edges);
            this.setState({ visNodes: nodes, visEdges: edges });
            return [nodes, edges];
        }

        // Main function to set up the vis-network object

    }, {
        key: "setupVisGraph",
        value: function setupVisGraph() {
            var _this11 = this;

            var _createNodesAndEdges = this.createNodesAndEdges(),
                _createNodesAndEdges2 = _slicedToArray(_createNodesAndEdges, 2),
                nodes = _createNodesAndEdges2[0],
                edges = _createNodesAndEdges2[1];

            // create a network


            var container = document.getElementById("graph");
            var data = {
                nodes: nodes,
                edges: edges
            };
            var options = {
                nodes: {
                    shape: "box",
                    size: 16,
                    margin: 10,
                    physics: false,
                    chosen: false,
                    font: {
                        face: "Product Sans"
                    },
                    color: {
                        background: nodeBackgroundDefaultColor
                    },
                    widthConstraint: {
                        maximum: 500
                    }
                },
                edges: {
                    arrows: {
                        to: {
                            enabled: true
                        }
                    },
                    color: "black",
                    physics: false,
                    smooth: false,
                    hoverWidth: 0
                },
                interaction: {
                    navigationButtons: true,
                    selectConnectedEdges: false,
                    hover: true,
                    hoverConnectedEdges: false
                },
                manipulation: {
                    enabled: true,
                    deleteNode: false,
                    addNode: this.addNode,
                    deleteEdge: this.deleteEdge,
                    addEdge: this.addEdge,
                    editEdge: false
                }
            };
            var network = new vis.Network(container, data, options);
            network.fit(); // Zoom in or out to fit entire network on screen

            // Store all positions
            var positions = network.getPositions();
            updateAllPositionsInGraph(positions);

            // Handle click vs drag
            network.on("click", function (params) {
                if (params.nodes !== undefined && params.nodes.length > 0) {
                    var nodeId = params.nodes[0];
                    _this11.handleClickedNode(nodeId);
                }
            });

            // Stop auto refresh while dragging
            network.on("dragStart", function () {
                // this.setState({autoRefresh: false});
            });

            // Update positions after dragging node
            network.on("dragEnd", function () {
                // Only update positions if there is a selected node
                if (network.getSelectedNodes().length !== 0) {
                    var url = network.getSelectedNodes()[0];
                    var position = network.getPosition(url);
                    var x = position.x;
                    var y = position.y;
                    updatePositionOfNode(url, x, y);
                }
                // this.setState({autoRefresh: true});
            });

            // Set cursor to pointer when hovering over a node
            network.on("hoverNode", function () {
                return network.canvas.body.container.style.cursor = "pointer";
            });
            network.on("blurNode", function () {
                return network.canvas.body.container.style.cursor = "default";
            });

            // Store the network
            this.setState({ visNetwork: network });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this12 = this;

            this.getDataFromServer();
            this.checkIfLocalServer();
            // Add listener to refresh the page when the tab is clicked
            chrome.tabs.onActivated.addListener(function (activeInfo) {
                chrome.tabs.get(activeInfo.tabId, function (tab) {
                    if (tab.title === "Knolist") {
                        // Update data
                        _this12.getDataFromServer();
                    }
                });
            });
        }

        // // Helper function to track why a component is being re-rendered
        // componentDidUpdate(prevProps, prevState) {
        //     Object.entries(this.props).forEach(([key, val]) =>
        //         prevProps[key] !== val && console.log(`Prop '${key}' changed`)
        //     );
        //     if (this.state) {
        //         Object.entries(this.state).forEach(([key, val]) =>
        //             prevState[key] !== val && console.log(`State '${key}' changed`)
        //         );
        //     }
        // }

    }, {
        key: "render",
        value: function render() {
            if (this.state.graph === null) return null;

            // Only show mind map outside of full search mode
            var graphStyle = { display: "block" };
            if (this.state.fullSearchResults !== null) graphStyle = { display: "none" };

            var curProject = this.state.graph.curProject;
            return React.createElement(
                "div",
                null,
                React.createElement(Header, { projectName: curProject, refresh: this.getDataFromServer,
                    showProjectsSidebar: this.state.showProjectsSidebar,
                    openProjectsSidebar: this.openProjectsSidebar,
                    closeProjectsSidebar: this.closeProjectsSidebar }),
                React.createElement(
                    "div",
                    { className: "main-body" },
                    React.createElement(
                        "div",
                        { id: "buttons-bar" },
                        React.createElement(RefreshGraphButton, { refresh: this.getDataFromServer }),
                        React.createElement(SearchBar, { basicSearch: this.basicSearch, fullSearch: this.fullSearch,
                            graph: this.state.graph[curProject],
                            fullSearchResults: this.state.fullSearchResults }),
                        React.createElement(ExportGraphButton, { "export": this.exportData })
                    ),
                    React.createElement("div", { id: "graph", style: graphStyle }),
                    React.createElement(FullSearchResults, { fullSearchResults: this.state.fullSearchResults,
                        graph: this.state.graph[curProject],
                        resetFullSearchResults: this.resetFullSearchResults,
                        setSelectedNode: this.setSelectedNode }),
                    React.createElement(ProjectsSidebar, { graph: this.state.graph, refresh: this.getDataFromServer }),
                    React.createElement(NewNodeForm, { showNewNodeForm: this.state.showNewNodeForm, nodeData: this.state.newNodeData,
                        localServer: this.state.localServer, closeForm: this.closeNewNodeForm,
                        refresh: this.getDataFromServer }),
                    React.createElement(PageView, { graph: this.state.graph[curProject], selectedNode: this.state.selectedNode,
                        editNodeMode: this.state.editNodeMode,
                        resetSelectedNode: this.resetSelectedNode, setSelectedNode: this.setSelectedNode,
                        setNodeForDeletion: this.setNodeForDeletion, setEditNodeMode: this.setEditNodeMode,
                        refresh: this.getDataFromServer, closePageView: this.closePageView,
                        switchShowNewNotesForm: this.switchShowNewNotesForm,
                        fullSearchResults: this.state.fullSearchResults,
                        showNewNotesForm: this.state.showNewNotesForm }),
                    React.createElement(ConfirmDeletionWindow, {
                        item: this.state.nodeForDeletion == null ? null : this.state.nodeForDeletion.title,
                        resetForDeletion: this.resetNodeForDeletion,
                        "delete": this.deleteNodeAfterConfirmation }),
                    React.createElement(ExportView, { bibliographyData: this.state.bibliographyData, shouldShow: this.state.displayExport,
                        resetDisplayExport: this.resetDisplayExport })
                )
            );
        }
    }]);

    return KnolistComponents;
}(React.Component);

var FullSearchResults = function (_React$Component2) {
    _inherits(FullSearchResults, _React$Component2);

    function FullSearchResults(props) {
        _classCallCheck(this, FullSearchResults);

        // this.state = {
        //     expandedSearchResult: null,
        // };
        //
        // this.setExpandedSearchResult = this.setExpandedSearchResult.bind(this);
        // this.resetExpandedSearchResult = this.resetExpandedSearchResult.bind(this);
        var _this13 = _possibleConstructorReturn(this, (FullSearchResults.__proto__ || Object.getPrototypeOf(FullSearchResults)).call(this, props));

        _this13.closeSearch = _this13.closeSearch.bind(_this13);
        return _this13;
    }

    // setExpandedSearchResult(url) {
    //     this.setState({expandedSearchResult: url});
    // }
    //
    // resetExpandedSearchResult() {
    //     this.setState({expandedSearchResult: null});
    // }

    _createClass(FullSearchResults, [{
        key: "closeSearch",
        value: function closeSearch() {
            // this.resetExpandedSearchResult();
            this.props.resetFullSearchResults();
        }
    }, {
        key: "render",
        value: function render() {
            var _this14 = this;

            if (this.props.fullSearchResults === null) return null;

            var noResultsMessage = "Sorry, we couldn't find any results for your search.";
            var searchResultsMessage = "Search results";

            return React.createElement(
                "div",
                { id: "full-search-results-area" },
                React.createElement(
                    "div",
                    { id: "search-results-header" },
                    React.createElement(
                        "button",
                        { className: "button", onClick: this.closeSearch },
                        React.createElement("img", { src: "../../images/back-icon-white.png", alt: "Return" })
                    ),
                    React.createElement(
                        "h2",
                        null,
                        this.props.fullSearchResults.results.length === 0 ? noResultsMessage : searchResultsMessage
                    ),
                    React.createElement("div", { style: { width: "40px" } })
                ),
                this.props.fullSearchResults.results.map(function (result) {
                    return React.createElement(SearchResultItem, { key: result.url,
                        item: _this14.props.graph[result.url]
                        // expandedSearchResult={this.state.expandedSearchResult}
                        // setExpandedSearchResult={this.setExpandedSearchResult}
                        // resetExpandedSearchResult={this.resetExpandedSearchResult}
                        , result: result,
                        setSelectedNode: _this14.props.setSelectedNode });
                })
            );
        }
    }]);

    return FullSearchResults;
}(React.Component);

var SearchResultItem = function (_React$Component3) {
    _inherits(SearchResultItem, _React$Component3);

    function SearchResultItem(props) {
        _classCallCheck(this, SearchResultItem);

        var _this15 = _possibleConstructorReturn(this, (SearchResultItem.__proto__ || Object.getPrototypeOf(SearchResultItem)).call(this, props));

        _this15.itemAction = _this15.itemAction.bind(_this15);
        return _this15;
    }

    _createClass(SearchResultItem, [{
        key: "itemAction",
        value: function itemAction() {
            this.props.setSelectedNode(this.props.item.source);
            // if (this.props.expandedSearchResult === this.props.result.url) this.props.resetExpandedSearchResult();
            // else this.props.setExpandedSearchResult(this.props.result.url);
        }
    }, {
        key: "render",
        value: function render() {
            if (this.props.item === undefined) return null;
            return React.createElement(
                "div",
                { onClick: this.itemAction, className: "search-result-item" },
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "h3",
                        null,
                        this.props.item.title
                    ),
                    React.createElement(
                        "p",
                        null,
                        this.props.result.occurrencesCount,
                        " ",
                        this.props.result.occurrencesCount > 1 ? "occurrences" : "occurrence"
                    )
                ),
                React.createElement(OccurrenceCategories, { occurrences: this.props.result.occurrences })
            );
        }
    }]);

    return SearchResultItem;
}(React.Component);

function OccurrenceCategories(props) {
    return React.createElement(
        "div",
        { className: "occurrence-categories" },
        props.occurrences.map(function (occurrence, index) {
            return React.createElement(
                "div",
                { key: occurrence.key, className: "flex" },
                React.createElement(
                    "div",
                    { className: "occurrence-item" },
                    React.createElement(
                        "h3",
                        null,
                        Utils.getNodePropertyTitle(occurrence.key)
                    ),
                    React.createElement(
                        "p",
                        null,
                        occurrence.indices.length
                    )
                ),
                index < props.occurrences.length - 1 ? React.createElement("div", { className: "vertical-line" }) : null
            );
        })
    );
}

/**
 * @return {null}
 */
function ExpandedSearchResultData(props) {
    if (!props.display) return null;

    return React.createElement(
        "p",
        null,
        "Expanded!"
    );
}

// Sidebar to switch between projects

var ProjectsSidebar = function (_React$Component4) {
    _inherits(ProjectsSidebar, _React$Component4);

    function ProjectsSidebar(props) {
        _classCallCheck(this, ProjectsSidebar);

        var _this16 = _possibleConstructorReturn(this, (ProjectsSidebar.__proto__ || Object.getPrototypeOf(ProjectsSidebar)).call(this, props));

        _this16.state = {
            showNewProjectForm: false,
            projectForDeletion: null,
            alertMessage: null,
            invalidTitle: null
        };

        _this16.switchShowNewProjectForm = _this16.switchShowNewProjectForm.bind(_this16);
        _this16.setProjectForDeletion = _this16.setProjectForDeletion.bind(_this16);
        _this16.resetProjectForDeletion = _this16.resetProjectForDeletion.bind(_this16);
        _this16.setAlertMessage = _this16.setAlertMessage.bind(_this16);
        _this16.setInvalidTitle = _this16.setInvalidTitle.bind(_this16);
        _this16.deleteProject = _this16.deleteProject.bind(_this16);
        return _this16;
    }

    _createClass(ProjectsSidebar, [{
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
        key: "setProjectForDeletion",
        value: function setProjectForDeletion(project) {
            this.setState({ projectForDeletion: project });
        }
    }, {
        key: "resetProjectForDeletion",
        value: function resetProjectForDeletion() {
            this.setState({ projectForDeletion: null });
        }
    }, {
        key: "deleteProject",
        value: function deleteProject() {
            var _this17 = this;

            deleteProjectFromGraph(this.state.projectForDeletion).then(function () {
                var callbackObject = {
                    graphCallback: function graphCallback() {
                        _this17.resetProjectForDeletion();
                    }
                };
                _this17.props.refresh(callbackObject);
            });
        }
    }, {
        key: "switchShowNewProjectForm",
        value: function switchShowNewProjectForm() {
            var _this18 = this;

            this.setState({
                showNewProjectForm: !this.state.showNewProjectForm,
                alertMessage: null,
                invalidTitle: null
            }, function () {
                // Set focus to the input field
                if (_this18.state.showNewProjectForm) document.getElementById("newProjectTitle").focus();
                document.getElementById("new-project-form").reset();
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this19 = this;

            return React.createElement(
                "div",
                { id: "projects-sidebar", className: "sidebar" },
                React.createElement(
                    "div",
                    { id: "sidebar-header" },
                    React.createElement(
                        "h1",
                        { id: "sidebar-title" },
                        "Your Projects"
                    ),
                    React.createElement(NewProjectButton, { showForm: this.state.showNewProjectForm,
                        switchShowForm: this.switchShowNewProjectForm })
                ),
                React.createElement(
                    "div",
                    { id: "sidebar-content" },
                    Object.keys(this.props.graph).map(function (project, index) {
                        return React.createElement(ProjectItem, { key: index, index: index,
                            graph: _this19.props.graph,
                            project: project,
                            refresh: _this19.props.refresh,
                            setForDeletion: _this19.setProjectForDeletion });
                    }),
                    React.createElement(NewProjectForm, { showNewProjectForm: this.state.showNewProjectForm, refresh: this.props.refresh,
                        switchForm: this.switchShowNewProjectForm,
                        setAlertMessage: this.setAlertMessage,
                        setInvalidTitle: this.setInvalidTitle,
                        alertMessage: this.state.alertMessage,
                        invalidTitle: this.state.invalidTitle,
                        projects: Object.keys(this.props.graph) }),
                    React.createElement(ConfirmDeletionWindow, { item: this.state.projectForDeletion,
                        resetForDeletion: this.resetProjectForDeletion,
                        "delete": this.deleteProject })
                )
            );
        }
    }]);

    return ProjectsSidebar;
}(React.Component);

/**Confirmation window before an item is deleted
 * @return {null}
 */


function ConfirmDeletionWindow(props) {
    if (props.item === null) {
        return null;
    }
    return React.createElement(
        "div",
        { className: "modal" },
        React.createElement(
            "div",
            { id: "delete-confirmation-modal", className: "modal-content" },
            React.createElement("img", { src: "../../images/alert-icon-black.png", alt: "Alert icon",
                style: { width: "30%", display: "block", marginLeft: "auto", marginRight: "auto" } }),
            React.createElement(
                "h1",
                null,
                "Are you sure you want to delete \"",
                props.item,
                "\"?"
            ),
            React.createElement(
                "h3",
                null,
                "This action cannot be undone."
            ),
            React.createElement(
                "div",
                { className: "flex-and-spaced" },
                React.createElement(
                    "button",
                    { className: "button confirmation-button", onClick: props.delete },
                    "Yes, delete it!"
                ),
                React.createElement(
                    "button",
                    { className: "button confirmation-button", onClick: props.resetForDeletion },
                    "Cancel"
                )
            )
        )
    );
}

// Button used to open the "create project" form
function NewProjectButton(props) {
    return React.createElement(
        "button",
        {
            className: props.showForm ? "button new-project-button button-with-text" : "button new-project-button",
            onMouseDown: function onMouseDown(event) {
                event.preventDefault();
                props.switchShowForm();
            } },
        props.showForm ? React.createElement(
            "p",
            null,
            "Cancel"
        ) : React.createElement("img", { src: "../../images/add-icon-white.png", alt: "New" })
    );
}

// Form to create a new project

var NewProjectForm = function (_React$Component5) {
    _inherits(NewProjectForm, _React$Component5);

    function NewProjectForm(props) {
        _classCallCheck(this, NewProjectForm);

        var _this20 = _possibleConstructorReturn(this, (NewProjectForm.__proto__ || Object.getPrototypeOf(NewProjectForm)).call(this, props));

        _this20.handleSubmit = _this20.handleSubmit.bind(_this20);
        return _this20;
    }

    _createClass(NewProjectForm, [{
        key: "handleSubmit",
        value: function handleSubmit(event) {
            var _this21 = this;

            // Prevent page from reloading
            event.preventDefault();

            // Data validation
            var title = Utils.trimString(event.target.newProjectTitle.value);
            var alertMessage = Utils.validateProjectTitle(title, this.props.projects);
            this.props.setAlertMessage(alertMessage);
            if (alertMessage == null) {
                // Valid entry
                // Reset entry and close form
                event.target.reset();

                // Create project
                createNewProjectInGraph(title).then(function () {
                    var callbackObject = {
                        graphCallback: function graphCallback() {
                            // Close the form
                            _this21.props.switchForm();
                            // Hide alert message if there was one
                            _this21.props.setInvalidTitle(null);
                        }
                    };
                    _this21.props.refresh(callbackObject);
                });
            } else {
                this.props.setInvalidTitle(title);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this22 = this;

            var style = { display: "none" };
            if (this.props.showNewProjectForm) {
                style = { display: "block" };
            }
            return React.createElement(
                "div",
                { style: style, className: "project-item new-project-form-area" },
                React.createElement(
                    "form",
                    { id: "new-project-form", onSubmit: this.handleSubmit,
                        onBlur: function onBlur() {
                            return _this22.props.showNewProjectForm ? _this22.props.switchForm() : null;
                        }, autoComplete: "off" },
                    React.createElement("input", { type: "text", id: "newProjectTitle", name: "newProjectTitle", defaultValue: "New Project", required: true }),
                    React.createElement(
                        "button",
                        { onMouseDown: function onMouseDown(event) {
                                return event.preventDefault();
                            },
                            className: "button create-project-button" },
                        "Create"
                    )
                ),
                React.createElement(ProjectTitleAlertMessage, { alertMessage: this.props.alertMessage,
                    projectTitle: this.props.invalidTitle })
            );
        }
    }]);

    return NewProjectForm;
}(React.Component);

/** Alert message for invalid project names
 * @return {null}
 */


function ProjectTitleAlertMessage(props) {
    if (props.alertMessage === "invalid-title") {
        return React.createElement(
            "p",
            { className: "alert-message" },
            props.projectTitle,
            " is not a valid title."
        );
    }

    if (props.alertMessage === "repeated-title") {
        return React.createElement(
            "p",
            { className: "alert-message" },
            "You already have a project called ",
            props.projectTitle,
            "."
        );
    }

    return null;
}

// Visualization of a project in the sidebar, used to switch active projects

var ProjectItem = function (_React$Component6) {
    _inherits(ProjectItem, _React$Component6);

    function ProjectItem(props) {
        _classCallCheck(this, ProjectItem);

        var _this23 = _possibleConstructorReturn(this, (ProjectItem.__proto__ || Object.getPrototypeOf(ProjectItem)).call(this, props));

        _this23.state = {
            projectEditMode: false,
            alertMessage: null,
            invalidTitle: null
        };

        _this23.switchProject = _this23.switchProject.bind(_this23);
        _this23.deleteProject = _this23.deleteProject.bind(_this23);
        _this23.switchProjectEditMode = _this23.switchProjectEditMode.bind(_this23);
        _this23.editProjectName = _this23.editProjectName.bind(_this23);
        _this23.setAlertMessage = _this23.setAlertMessage.bind(_this23);
        _this23.setInvalidTitle = _this23.setInvalidTitle.bind(_this23);
        return _this23;
    }

    _createClass(ProjectItem, [{
        key: "getInputFieldId",
        value: function getInputFieldId() {
            // Generate unique id
            return "edit-project-title" + this.props.index;
        }
    }, {
        key: "switchProject",
        value: function switchProject(data) {
            var _this24 = this;

            // Only switch if the click was on the item, not on the delete button
            if (data.target.className === "project-item" || data.target.tagName === "H2") {
                setCurrentProjectInGraph(this.props.project).then(function () {
                    return _this24.props.refresh();
                });
            }
        }
    }, {
        key: "deleteProject",
        value: function deleteProject() {
            this.props.setForDeletion(this.props.project);
        }
    }, {
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
        key: "submitOnEnter",
        value: function submitOnEnter(event) {
            event.preventDefault();
            this.editProjectName(event.target[this.getInputFieldId()].value);
        }
    }, {
        key: "editProjectName",
        value: function editProjectName(title) {
            var _this25 = this;

            // Prevent user from inputting empty title name
            if (title == null || title.length === 0) {
                this.switchProjectEditMode();
                return;
            }

            title = Utils.trimString(title);
            // Check if submitted title is equal to the current
            if (title === this.props.project) {
                this.switchProjectEditMode();
                return;
            }

            var projects = Object.keys(this.props.graph);
            var alertMessage = Utils.validateProjectTitle(title, projects);
            this.setAlertMessage(alertMessage);
            if (alertMessage == null) {
                // Valid name
                updateProjectTitle(this.props.project, title).then(function () {
                    var callbackObject = {
                        graphCallback: function graphCallback() {
                            // Update on callback
                            _this25.switchProjectEditMode();
                            // Hide alert message if there was one
                            _this25.setInvalidTitle(null);
                        }
                    };
                    _this25.props.refresh(callbackObject);
                });
            } else {
                this.setInvalidTitle(title);
            }
        }
    }, {
        key: "switchProjectEditMode",
        value: function switchProjectEditMode() {
            var _this26 = this;

            this.setState({ projectEditMode: !this.state.projectEditMode }, function () {
                if (_this26.state.projectEditMode) {
                    document.getElementById(_this26.getInputFieldId()).focus();
                } else {
                    _this26.setAlertMessage(null);
                    _this26.setInvalidTitle(null);
                }
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this27 = this;

            var project = this.props.project;
            // Ignore properties that are not project names
            if (project === "version" || project === "curProject") {
                return null;
            }

            // Generate unique id
            var projectId = this.getInputFieldId();

            return React.createElement(
                "div",
                { className: project === this.props.graph.curProject ? "project-item active-project" : "project-item",
                    onClick: this.switchProject },
                this.state.projectEditMode ? React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "form",
                        { onSubmit: function onSubmit(event) {
                                return _this27.submitOnEnter(event);
                            },
                            onBlur: function onBlur(event) {
                                return _this27.editProjectName(event.target.value);
                            },
                            autoComplete: "off" },
                        React.createElement("input", { id: projectId, type: "text", defaultValue: this.props.project, required: true })
                    ),
                    React.createElement(ProjectTitleAlertMessage, { alertMessage: this.state.alertMessage,
                        projectTitle: this.state.invalidTitle })
                ) : React.createElement(
                    "h2",
                    null,
                    this.props.project
                ),
                React.createElement(SidebarButtons, { deleteProject: this.deleteProject, switchProjectEditMode: this.switchProjectEditMode,
                    projectEditMode: this.state.projectEditMode })
            );
        }
    }]);

    return ProjectItem;
}(React.Component);

function SidebarButtons(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "button",
            {
                className: props.projectEditMode ? "button edit-project-button button-with-text" : "button edit-project-button",
                onMouseDown: function onMouseDown(event) {
                    event.preventDefault();
                    props.switchProjectEditMode();
                } },
            props.projectEditMode ? React.createElement(
                "p",
                null,
                "Cancel"
            ) : React.createElement("img", { src: "../../images/edit-icon-white.png", alt: "Edit project" })
        ),
        React.createElement(
            "button",
            { className: "button delete-project-button", onClick: props.deleteProject },
            React.createElement("img", { src: "../../images/delete-icon-white.png", alt: "Delete project" })
        )
    );
}

// Form that allows the user to manually add nodes

var NewNodeForm = function (_React$Component7) {
    _inherits(NewNodeForm, _React$Component7);

    function NewNodeForm(props) {
        _classCallCheck(this, NewNodeForm);

        var _this28 = _possibleConstructorReturn(this, (NewNodeForm.__proto__ || Object.getPrototypeOf(NewNodeForm)).call(this, props));

        _this28.state = {
            loading: false // Used to display loading icon while the new node is being added
        };

        _this28.handleSubmit = _this28.handleSubmit.bind(_this28);
        return _this28;
    }

    _createClass(NewNodeForm, [{
        key: "handleSubmit",
        value: function handleSubmit(event) {
            var _this29 = this;

            event.preventDefault(); // Stop page from reloading
            // Call from server
            var baseServerURL = deployedServerURL;
            if (this.props.localServer) {
                // Use local server if it's active
                baseServerURL = localServerURL;
            }
            var contentExtractionURL = baseServerURL + "extract?url=" + encodeURIComponent(event.target.url.value);

            // Start loading
            event.persist();
            this.setState({ loading: true }, function () {
                $.getJSON(contentExtractionURL, function (item) {
                    addItemToGraph(item, "").then(function () {
                        return updatePositionOfNode(item.source, _this29.props.nodeData.x, _this29.props.nodeData.y);
                    }).then(function () {
                        // Create callback object
                        var callbackObject = {
                            graphCallback: function graphCallback() {
                                _this29.setState({ loading: false }, function () {
                                    _this29.props.closeForm();
                                    event.target.reset(); // Clear the form entries
                                });
                            }
                        };
                        _this29.props.refresh(callbackObject);
                    });
                });
            });
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            // Block clicks while the new node is being loaded
            if (prevState.loading !== this.state.loading) {
                if (this.state.loading) document.body.style.pointerEvents = "none";else document.body.style.pointerEvents = "auto";
            }
        }
    }, {
        key: "render",
        value: function render() {
            var style = { display: "none" };
            if (this.props.showNewNodeForm) {
                style = { display: "block" };
            }
            return React.createElement(
                "div",
                { className: "modal", style: style },
                React.createElement(
                    "div",
                    { className: "modal-content" },
                    React.createElement(
                        "button",
                        { className: "close-modal button", onClick: this.props.closeForm },
                        React.createElement("img", { src: "../../images/close-icon-white.png", alt: "Close" })
                    ),
                    React.createElement(
                        "h1",
                        null,
                        "Add new node"
                    ),
                    React.createElement(
                        "form",
                        { id: "new-node-form", onSubmit: this.handleSubmit },
                        React.createElement("input", { id: "url", name: "url", type: "url", placeholder: "Insert URL", required: true }),
                        React.createElement("br", null),
                        React.createElement(
                            "button",
                            { className: "button button-with-text" },
                            "Add node"
                        )
                    ),
                    this.state.loading ? React.createElement(
                        "div",
                        { id: "new-node-spinner" },
                        React.createElement(LoadingSpinner, null)
                    ) : null
                )
            );
        }
    }]);

    return NewNodeForm;
}(React.Component);

// Simple loading spinner, CSS is defined in utilities.less


function LoadingSpinner() {
    return React.createElement("div", { className: "spinner" });

    // return (
    //     <div className="lds-spinner">
    //         <div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
    //     </div>
    // );
}

// Detailed view of a specific node

var PageView = function (_React$Component8) {
    _inherits(PageView, _React$Component8);

    function PageView(props) {
        _classCallCheck(this, PageView);

        var _this30 = _possibleConstructorReturn(this, (PageView.__proto__ || Object.getPrototypeOf(PageView)).call(this, props));

        _this30.setForDeletion = _this30.setForDeletion.bind(_this30);
        return _this30;
    }

    _createClass(PageView, [{
        key: "setForDeletion",
        value: function setForDeletion() {
            this.props.setNodeForDeletion(this.props.selectedNode);
        }
    }, {
        key: "render",
        value: function render() {
            // Don't render if selectedNode is null or undefined
            if (this.props.selectedNode === null || this.props.selectedNode === undefined) {
                return null;
            }

            // Don't render if selectedNode doesn't belong to curProject
            // (To allow for data update when the page is focused - CU-96hk2k)
            if (!this.props.graph.hasOwnProperty(this.props.selectedNode.source)) {
                return null;
            }

            return React.createElement(
                "div",
                { id: "page-view", className: "modal" },
                React.createElement(
                    "div",
                    { className: "modal-content pageview" },
                    React.createElement(
                        "div",
                        { className: "flex-and-spaced pageview-header" },
                        React.createElement(PageViewTitle, { selectedNode: this.props.selectedNode, editNodeMode: this.props.editNodeMode,
                            refresh: this.props.refresh }),
                        React.createElement(
                            "button",
                            { className: "button close-pageview", id: "close-page-view", "data-tooltip": "Close",
                                "data-tooltip-location": "down", onClick: this.props.closePageView },
                            React.createElement("img", { src: "../../images/close-icon-white.png", alt: "Close" })
                        )
                    ),
                    React.createElement(HighlightsList, { highlights: this.props.selectedNode.highlights,
                        editNodeMode: this.props.editNodeMode,
                        selectedNode: this.props.selectedNode,
                        refresh: this.props.refresh }),
                    React.createElement("hr", null),
                    React.createElement(NotesList, { showNewNotesForm: this.props.showNewNotesForm,
                        switchShowNewNotesForm: this.props.switchShowNewNotesForm,
                        selectedNode: this.props.selectedNode,
                        refresh: this.props.refresh,
                        editNodeMode: this.props.editNodeMode }),
                    React.createElement("hr", null),
                    React.createElement(
                        "div",
                        { className: "flex" },
                        React.createElement(ListURL, { type: "prev", graph: this.props.graph, selectedNode: this.props.selectedNode,
                            setSelectedNode: this.props.setSelectedNode }),
                        React.createElement(ListURL, { type: "next", graph: this.props.graph, selectedNode: this.props.selectedNode,
                            setSelectedNode: this.props.setSelectedNode })
                    ),
                    React.createElement(
                        "div",
                        { className: "flex", style: { justifyContent: "flex-end" } },
                        React.createElement(EditNodeButton, { editNodeMode: this.props.editNodeMode,
                            setEditNodeMode: this.props.setEditNodeMode }),
                        React.createElement(DeleteNodeButton, { setForDeletion: this.setForDeletion })
                    )
                )
            );
        }
    }]);

    return PageView;
}(React.Component);

function EditNodeButton(props) {
    return React.createElement(
        "button",
        { className: props.editNodeMode ? "button button-with-text edit-done-button" : "button", style: { marginRight: "10px" },
            "data-tooltip": props.editNodeMode ? undefined : "Edit Node",
            "data-tooltip-location": props.editNodeMode ? undefined : "up",
            onClick: function onClick() {
                return props.setEditNodeMode(!props.editNodeMode);
            } },
        props.editNodeMode ? React.createElement(
            "p",
            null,
            "Done"
        ) : React.createElement("img", { src: "../../images/edit-icon-white.png", alt: "Edit node" })
    );
}

function DeleteNodeButton(props) {
    return React.createElement(
        "button",
        { className: "button", "data-tooltip": "Delete node", "data-tooltip-location": "up",
            onClick: props.setForDeletion },
        React.createElement("img", { src: "../../images/delete-icon-white.png", alt: "Delete node" })
    );
}

var PageViewTitle = function (_React$Component9) {
    _inherits(PageViewTitle, _React$Component9);

    function PageViewTitle() {
        _classCallCheck(this, PageViewTitle);

        return _possibleConstructorReturn(this, (PageViewTitle.__proto__ || Object.getPrototypeOf(PageViewTitle)).apply(this, arguments));
    }

    _createClass(PageViewTitle, [{
        key: "updateTitle",
        value: function updateTitle(newTitle) {
            var _this32 = this;

            updateNodeTitleInGraph(this.props.selectedNode.source, newTitle).then(function () {
                var callbackObject = {
                    selectedNodeCallback: function selectedNodeCallback() {
                        return document.getElementById("newNodeTitle").value = _this32.props.selectedNode.title;
                    }
                };
                _this32.props.refresh(callbackObject);
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this33 = this;

            if (this.props.editNodeMode) {
                return React.createElement(
                    "form",
                    { onSubmit: function onSubmit(event) {
                            event.preventDefault();
                            _this33.updateTitle(event.target.newNodeTitle.value);
                        },
                        onBlur: function onBlur(event) {
                            return _this33.updateTitle(event.target.value);
                        } },
                    React.createElement("input", { type: "text", id: "newNodeTitle", defaultValue: this.props.selectedNode.title,
                        key: this.props.selectedNode.title, autoComplete: "off", required: true })
                );
            }
            return React.createElement(
                "a",
                { href: this.props.selectedNode.source, target: "_blank" },
                React.createElement(
                    "h1",
                    null,
                    this.props.selectedNode.title
                )
            );
        }
    }]);

    return PageViewTitle;
}(React.Component);

// Bibliography export
/**
 * @return {null}
 */


function ExportView(props) {
    if (props.shouldShow === false) {
        return null;
    }
    return React.createElement(
        "div",
        { className: "modal" },
        React.createElement(
            "div",
            { className: "modal-content" },
            React.createElement(
                "button",
                { className: "close-modal button", id: "close-page-view", onClick: props.resetDisplayExport },
                React.createElement("img", { src: "../../images/close-icon-white.png", alt: "Close" })
            ),
            React.createElement(
                "h1",
                null,
                "Export for Bibliography"
            ),
            React.createElement(
                "ul",
                null,
                props.bibliographyData.map(function (item) {
                    return React.createElement(
                        "li",
                        { key: item.url },
                        item.title,
                        ", ",
                        item.url
                    );
                })
            )
        )
    );
}

// List of URLs in the detailed page view
/**
 * @return {null}
 */
function ListURL(props) {
    // Don't render if type is neither "prev" nor "next"
    if (props.type !== "prev" && props.type !== "next") return null;

    // Define the list to be used based on the type passed as props
    var urlList = props.selectedNode.prevURLs;
    if (props.type === "next") urlList = props.selectedNode.nextURLs;

    return React.createElement(
        "div",
        { className: "url-column" },
        React.createElement(
            "h2",
            { style: { textAlign: "center" } },
            props.type === "prev" ? "Previous Connections" : "Next Connections"
        ),
        React.createElement(
            "ul",
            null,
            urlList.map(function (url, index) {
                return React.createElement(
                    "li",
                    { key: index },
                    React.createElement(
                        "a",
                        { href: "#",
                            onClick: function onClick() {
                                return props.setSelectedNode(url);
                            } },
                        props.graph[url].title
                    )
                );
            })
        )
    );
}

// List of highlights in the detailed page view

var HighlightsList = function (_React$Component10) {
    _inherits(HighlightsList, _React$Component10);

    function HighlightsList(props) {
        _classCallCheck(this, HighlightsList);

        var _this34 = _possibleConstructorReturn(this, (HighlightsList.__proto__ || Object.getPrototypeOf(HighlightsList)).call(this, props));

        _this34.state = {
            selectedHighlights: [] // Indices of the selected highlights in edit mode
        };

        _this34.resetSelectedHighlights = _this34.resetSelectedHighlights.bind(_this34);
        _this34.removeSelectedHighlights = _this34.removeSelectedHighlights.bind(_this34);
        _this34.addSelectedHighlights = _this34.addSelectedHighlights.bind(_this34);
        _this34.deleteSelectedHighlights = _this34.deleteSelectedHighlights.bind(_this34);
        return _this34;
    }

    _createClass(HighlightsList, [{
        key: "checkboxChange",
        value: function checkboxChange(index, checked) {
            if (checked) this.addSelectedHighlights(index);else this.removeSelectedHighlights(index);
        }
    }, {
        key: "resetSelectedHighlights",
        value: function resetSelectedHighlights() {
            this.setState({ selectedHighlights: [] });
        }
    }, {
        key: "removeSelectedHighlights",
        value: function removeSelectedHighlights(toRemove) {
            var highlights = this.state.selectedHighlights;
            var index = highlights.indexOf(toRemove);
            if (index >= 0) highlights.splice(index, 1);
            this.setState({ selectedHighlights: highlights });
        }
    }, {
        key: "addSelectedHighlights",
        value: function addSelectedHighlights(toAdd) {
            var highlights = this.state.selectedHighlights;
            highlights.push(toAdd);
            this.setState({ selectedHighlights: highlights });
        }
    }, {
        key: "deleteSelectedHighlights",
        value: function deleteSelectedHighlights(highlightsToDelete) {
            var _this35 = this;

            deleteHighlightsFromItemInGraph(this.props.selectedNode.source, highlightsToDelete).then(function () {
                var callbackObject = {
                    selectedNodeCallback: function selectedNodeCallback() {
                        _this35.resetSelectedHighlights();
                        document.getElementById("delete-highlights-form").reset();
                    }
                };
                _this35.props.refresh(callbackObject);
            });
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
            if (prevProps.editNodeMode !== this.props.editNodeMode) this.resetSelectedHighlights();
        }
    }, {
        key: "render",
        value: function render() {
            var _this36 = this;

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "flex" },
                    React.createElement(
                        "h2",
                        null,
                        this.props.highlights.length > 0 ? "My Highlights" : "You haven't added any highlights yet."
                    ),
                    React.createElement(DeleteSelected, { editNodeMode: this.props.editNodeMode, selectedItems: this.state.selectedHighlights,
                        type: "highlights", deleteSelected: this.deleteSelectedHighlights })
                ),
                this.props.highlights.length === 0 ? React.createElement(
                    "p",
                    null,
                    "To add highlights, select text on a page, right-click, then click on \"Highlight with Knolist\"."
                ) : null,
                this.props.editNodeMode ? React.createElement(
                    "form",
                    { id: "delete-highlights-form", style: { margin: "12px 0" } },
                    this.props.highlights.map(function (highlight, index) {
                        return React.createElement(
                            "div",
                            { key: index },
                            React.createElement(
                                "label",
                                null,
                                React.createElement("input", { type: "checkbox",
                                    onChange: function onChange(event) {
                                        return _this36.checkboxChange(index, event.target.checked);
                                    } }),
                                highlight
                            )
                        );
                    })
                ) : React.createElement(
                    "ul",
                    null,
                    this.props.highlights.map(function (highlight, index) {
                        return React.createElement(
                            "li",
                            { key: index },
                            highlight
                        );
                    })
                )
            );
        }
    }]);

    return HighlightsList;
}(React.Component);

/**
 * Button to delete selected items (notes or highlights)
 * @return {null}
 */


function DeleteSelected(props) {
    // Don't return anything if there are no selected items or outside of edit mode
    if (!props.editNodeMode || props.selectedItems == null || props.selectedItems.length === 0) return null;

    return React.createElement(
        "button",
        { className: "button small-button button-with-text",
            onClick: function onClick() {
                return props.deleteSelected(props.selectedItems);
            } },
        React.createElement(
            "p",
            null,
            "Delete selected ",
            props.type
        )
    );
}

// List of notes in the detailed page view

var NotesList = function (_React$Component11) {
    _inherits(NotesList, _React$Component11);

    function NotesList(props) {
        _classCallCheck(this, NotesList);

        var _this37 = _possibleConstructorReturn(this, (NotesList.__proto__ || Object.getPrototypeOf(NotesList)).call(this, props));

        _this37.state = {
            selectedNotes: [] // Array of notes selected to be deleted
        };

        _this37.handleSubmit = _this37.handleSubmit.bind(_this37);
        _this37.updateNotesOnBlur = _this37.updateNotesOnBlur.bind(_this37);
        _this37.addSelectedNotes = _this37.addSelectedNotes.bind(_this37);
        _this37.removeSelectedNotes = _this37.removeSelectedNotes.bind(_this37);
        _this37.resetSelectedNotes = _this37.resetSelectedNotes.bind(_this37);
        _this37.deleteSelectedNotes = _this37.deleteSelectedNotes.bind(_this37);
        return _this37;
    }

    _createClass(NotesList, [{
        key: "checkboxChange",
        value: function checkboxChange(index, checked) {
            if (checked) this.addSelectedNotes(index);else this.removeSelectedNotes(index);
        }
    }, {
        key: "resetSelectedNotes",
        value: function resetSelectedNotes() {
            this.setState({ selectedNotes: [] });
        }
    }, {
        key: "removeSelectedNotes",
        value: function removeSelectedNotes(toRemove) {
            var notes = this.state.selectedNotes;
            var index = notes.indexOf(toRemove);
            if (index >= 0) notes.splice(index, 1);
            this.setState({ selectedNotes: notes });
        }
    }, {
        key: "addSelectedNotes",
        value: function addSelectedNotes(toAdd) {
            var notes = this.state.selectedNotes;
            notes.push(toAdd);
            this.setState({ selectedNotes: notes });
        }
    }, {
        key: "deleteSelectedNotes",
        value: function deleteSelectedNotes(notesToDelete) {
            var _this38 = this;

            deleteNotesFromItemInGraph(this.props.selectedNode.source, notesToDelete).then(function () {
                var callbackObject = {
                    selectedNodeCallback: function selectedNodeCallback() {
                        _this38.resetSelectedNotes();
                        document.getElementById("delete-notes-form").reset();
                    }
                };
                _this38.props.refresh(callbackObject);
            });
        }
    }, {
        key: "handleSubmit",
        value: function handleSubmit(event) {
            var _this39 = this;

            event.preventDefault();
            event.persist();
            addNotesToItemInGraph(this.props.selectedNode, event.target.notes.value).then(function () {
                var callbackObject = {
                    selectedNodeCallback: function selectedNodeCallback() {
                        _this39.props.switchShowNewNotesForm();
                        event.target.reset(); // Clear the form entries
                    }
                };
                _this39.props.refresh(callbackObject);
            });
        }
    }, {
        key: "updateNotesOnBlur",
        value: function updateNotesOnBlur(index, newNotes) {
            var _this40 = this;

            // if (newNotes === "") newNotes = null; // Set to null to delete the note on blur
            updateNotesInGraph(this.props.selectedNode.source, index, newNotes).then(function () {
                var id = _this40.getInputFieldId(index);
                var callbackObject = {
                    selectedNodeCallback: function selectedNodeCallback() {
                        document.getElementById(id).value = _this40.props.selectedNode.notes[index];
                    }
                };
                _this40.props.refresh(callbackObject);
            });
        }
    }, {
        key: "getInputFieldId",
        value: function getInputFieldId(index) {
            return "edit-note-input" + index;
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
            if (prevProps.editNodeMode !== this.props.editNodeMode) this.resetSelectedNotes();
        }
    }, {
        key: "render",
        value: function render() {
            var _this41 = this;

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "flex" },
                    React.createElement(
                        "h2",
                        null,
                        this.props.selectedNode.notes.length > 0 ? "My Notes" : "You haven't added any notes yet."
                    ),
                    React.createElement(NewNotesButton, { showForm: this.props.showNewNotesForm,
                        switchShowForm: this.props.switchShowNewNotesForm }),
                    React.createElement(DeleteSelected, { editNodeMode: this.props.editNodeMode, selectedItems: this.state.selectedNotes,
                        type: "notes", deleteSelected: this.deleteSelectedNotes })
                ),
                this.props.editNodeMode ? React.createElement(
                    "form",
                    { id: "delete-notes-form", style: { margin: "12px 0" },
                        onSubmit: function onSubmit(event) {
                            return event.preventDefault();
                        } },
                    this.props.selectedNode.notes.map(function (notes, index) {
                        return React.createElement(
                            "div",
                            { className: "editable-note", key: index },
                            React.createElement("input", { type: "checkbox",
                                onChange: function onChange(event) {
                                    return _this41.checkboxChange(index, event.target.checked);
                                } }),
                            React.createElement("input", { type: "text", defaultValue: notes, id: _this41.getInputFieldId(index),
                                onBlur: function onBlur(event) {
                                    return _this41.updateNotesOnBlur(index, event.target.value);
                                } })
                        );
                    })
                ) : React.createElement(
                    "ul",
                    null,
                    this.props.selectedNode.notes.map(function (notes, index) {
                        return React.createElement(
                            "li",
                            { key: index },
                            notes
                        );
                    })
                ),
                React.createElement(NewNotesForm, { handleSubmit: this.handleSubmit, showNewNotesForm: this.props.showNewNotesForm,
                    switchShowNewNotesForm: this.props.switchShowNewNotesForm })
            );
        }
    }]);

    return NotesList;
}(React.Component);

function NewNotesForm(props) {
    // Hidden form for adding notes
    var style = { display: "none" };
    if (props.showNewNotesForm) {
        style = { display: "block" };
    }

    return React.createElement(
        "form",
        { id: "new-notes-form", onSubmit: props.handleSubmit,
            onBlur: function onBlur() {
                if (props.showNewNotesForm) props.switchShowNewNotesForm();
            }, style: style },
        React.createElement("input", { id: "notes", name: "notes", type: "text", placeholder: "Insert Notes", required: true }),
        React.createElement(
            "button",
            { onMouseDown: function onMouseDown(event) {
                    event.preventDefault();
                }, className: "button small-button button-with-text", style: { marginTop: 0, marginBottom: 0 } },
            "Add"
        )
    );
}

// Button used to open the "create notes" form
function NewNotesButton(props) {
    return React.createElement(
        "button",
        { className: props.showForm ? "button small-button button-with-text" : "button small-button",
            "data-tooltip": props.showForm ? undefined : "Add notes",
            "data-tooltip-location": props.showForm ? undefined : "up",
            onMouseDown: function onMouseDown(event) {
                event.preventDefault();
                props.switchShowForm();
            } },
        props.showForm ? React.createElement(
            "p",
            null,
            "Cancel"
        ) : React.createElement("img", { src: "../../images/add-icon-white.png", alt: "New" })
    );
}

function RefreshGraphButton(props) {
    return React.createElement(
        "button",
        { onClick: props.refresh, className: "button", "data-tooltip": "Refresh", "data-tooltip-location": "right" },
        React.createElement("img", { src: "../../images/refresh-icon-white.png", alt: "Refresh Button" })
    );
}

var SearchBar = function (_React$Component12) {
    _inherits(SearchBar, _React$Component12);

    function SearchBar(props) {
        _classCallCheck(this, SearchBar);

        var _this42 = _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call(this, props));

        _this42.state = {
            filterList: _this42.generateFilterList(),
            showFilterList: false
        };

        _this42.submitSearch = _this42.submitSearch.bind(_this42);
        _this42.searchButtonAction = _this42.searchButtonAction.bind(_this42);
        _this42.setActiveFilter = _this42.setActiveFilter.bind(_this42);
        _this42.switchShowFilterList = _this42.switchShowFilterList.bind(_this42);
        _this42.setAllFilters = _this42.setAllFilters.bind(_this42);

        // Add listener to close filter when clicking outside
        document.body.addEventListener("click", function (event) {
            if (!Utils.isDescendant(document.getElementById("filter-dropdown"), event.target) && !Utils.isDescendant(document.getElementById("search-filters-button"), event.target)) {
                _this42.closeFilterList();
            }
        });

        // Remap CTRL+F to focus the search bar
        document.addEventListener('keydown', function (event) {
            if (event.ctrlKey && event.key === 'f') {
                event.preventDefault();
                document.getElementById("search-text").focus();
                $("#search-bar").effect({
                    effect: "highlight",
                    color: "#fffaa6",
                    duration: 1500,
                    queue: false
                });
            }
        });
        return _this42;
    }

    _createClass(SearchBar, [{
        key: "switchShowFilterList",
        value: function switchShowFilterList() {
            this.setState({ showFilterList: !this.state.showFilterList });
        }
    }, {
        key: "closeFilterList",
        value: function closeFilterList() {
            if (this.state.showFilterList) this.switchShowFilterList();
        }
    }, {
        key: "generateFilterList",
        value: function generateFilterList() {
            // Get list of all filters
            var nodeList = Object.keys(this.props.graph);
            if (nodeList.length === 0) return [];
            var filterNames = Object.keys(this.props.graph[nodeList[0]]);

            // Remove unwanted properties from filter list
            var propertiesToRemove = ["x", "y"];
            propertiesToRemove.forEach(function (property) {
                var index = filterNames.indexOf(property);
                filterNames.splice(index, 1);
            });

            // Create filter objects
            var filterList = {};
            filterNames.forEach(function (name) {
                filterList[name] = { active: true };
            });

            return filterList;
        }
    }, {
        key: "setFilterList",
        value: function setFilterList(filterList) {
            var _this43 = this;

            this.setState({ filterList: filterList }, function () {
                // Call search with updated filter list
                if (_this43.props.fullSearchResults !== null && _this43.props.fullSearchResults.query !== "") {
                    _this43.props.fullSearch(_this43.props.fullSearchResults.query, _this43.getActiveFilters());
                } else {
                    var query = document.getElementById("search-text").value;
                    _this43.props.basicSearch(query, _this43.getActiveFilters());
                }
            });
        }
    }, {
        key: "setActiveFilter",
        value: function setActiveFilter(name, active) {
            var filterList = this.state.filterList;
            filterList[name].active = active;
            this.setFilterList(filterList);
        }
    }, {
        key: "setAllFilters",
        value: function setAllFilters(active) {
            var filterList = this.state.filterList;
            Object.keys(filterList).forEach(function (filter) {
                filterList[filter].active = active;
            });
            this.setFilterList(filterList);
        }
    }, {
        key: "getActiveFilters",
        value: function getActiveFilters() {
            var _this44 = this;

            var activeFilters = [];
            Object.keys(this.state.filterList).forEach(function (filter) {
                if (_this44.state.filterList[filter].active) activeFilters.push(filter);
            });
            return activeFilters;
        }
    }, {
        key: "searchButtonAction",
        value: function searchButtonAction() {
            var query = document.getElementById("search-text").value;
            if (query !== "") {
                this.props.fullSearch(query, this.getActiveFilters());
                this.closeFilterList();
            }
        }
    }, {
        key: "submitSearch",
        value: function submitSearch(searchInput) {
            this.closeFilterList();
            if (searchInput.key === "Enter" || this.props.fullSearchResults !== null) {
                if (searchInput.target.value !== "") this.props.fullSearch(searchInput.target.value, this.getActiveFilters());
            } else {
                this.props.basicSearch(searchInput.target.value, this.getActiveFilters());
            }
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
            if (prevProps.graph !== this.props.graph) this.setState({ filterList: this.generateFilterList() });
        }
    }, {
        key: "render",
        value: function render() {
            var _this45 = this;

            return React.createElement(
                "div",
                { className: "flex" },
                React.createElement(
                    "div",
                    { id: "search-bar" },
                    React.createElement("input", { id: "search-text", type: "text", onKeyUp: function onKeyUp(searchInput) {
                            return _this45.submitSearch(searchInput);
                        },
                        placeholder: "Search through your project" }),
                    React.createElement("img", { onClick: this.searchButtonAction, src: "../../images/search-icon-black.png", alt: "Search" })
                ),
                React.createElement(Filters, { filterList: this.state.filterList, showFilterList: this.state.showFilterList,
                    setActiveFilter: this.setActiveFilter,
                    switchShowFilterList: this.switchShowFilterList,
                    setAllFilters: this.setAllFilters })
            );
        }
    }]);

    return SearchBar;
}(React.Component);

function Filters(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "button",
            { onClick: props.switchShowFilterList, className: "button", id: "search-filters-button",
                "data-tooltip": "Search Filters", "data-tooltip-location": "top" },
            React.createElement("img", { src: "../../images/filter-icon-black.png", alt: "Filter" })
        ),
        React.createElement(FiltersDropdown, { showFilterList: props.showFilterList, filterList: props.filterList,
            setActiveFilter: props.setActiveFilter, setAllFilters: props.setAllFilters })
    );
}

function FiltersDropdown(props) {
    var dropdownStyle = { display: "none" };
    if (props.showFilterList) dropdownStyle = { display: "block" };

    return React.createElement(
        "div",
        { className: "dropdown", style: dropdownStyle },
        React.createElement(
            "div",
            { className: "dropdown-content filters-dropdown", id: "filter-dropdown" },
            React.createElement(
                "div",
                { id: "filter-dropdown-buttons" },
                React.createElement(
                    "a",
                    { onClick: function onClick() {
                            return props.setAllFilters(true);
                        }, id: "filter-dropdown-left-button" },
                    "Select all"
                ),
                React.createElement(
                    "a",
                    { onClick: function onClick() {
                            return props.setAllFilters(false);
                        } },
                    "Clear all"
                )
            ),
            Object.keys(props.filterList).map(function (filter) {
                return React.createElement(FilterItem, { key: filter, filter: filter,
                    filterList: props.filterList,
                    setActiveFilter: props.setActiveFilter });
            })
        )
    );
}

var FilterItem = function (_React$Component13) {
    _inherits(FilterItem, _React$Component13);

    function FilterItem(props) {
        _classCallCheck(this, FilterItem);

        var _this46 = _possibleConstructorReturn(this, (FilterItem.__proto__ || Object.getPrototypeOf(FilterItem)).call(this, props));

        _this46.filterClicked = _this46.filterClicked.bind(_this46);
        return _this46;
    }

    _createClass(FilterItem, [{
        key: "filterClicked",
        value: function filterClicked() {
            this.props.setActiveFilter(this.props.filter, !this.props.filterList[this.props.filter].active);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "filter-item", onClick: this.filterClicked },
                React.createElement(
                    "p",
                    null,
                    Utils.getNodePropertyTitle(this.props.filter)
                ),
                this.props.filterList[this.props.filter].active ? React.createElement("img", { src: "../../images/checkmark-icon-green.png", alt: "Active" }) : null
            );
        }
    }]);

    return FilterItem;
}(React.Component);

function ExportGraphButton(props) {
    return React.createElement(
        "button",
        { onClick: props.export, className: "button", "data-tooltip": "Export for Bibliography",
            "data-tooltip-location": "left" },
        React.createElement("img", { src: "../../images/export-icon-white.png", alt: "Refresh Button" })
    );
}

function Header(props) {
    return React.createElement(
        "div",
        { className: "header" },
        React.createElement(
            "div",
            { className: "header-corner-wrapper logo-wrapper" },
            React.createElement("img", { className: "logo", src: "../../images/horizontal_main.PNG", alt: "Knolist Logo" })
        ),
        React.createElement(
            "div",
            { id: "project-name-div" },
            React.createElement(
                "h5",
                { id: "project-name" },
                "Current Project: ",
                props.projectName
            )
        ),
        React.createElement(
            "div",
            { className: "header-corner-wrapper" },
            React.createElement(ProjectsSidebarButton, { showSidebar: props.showProjectsSidebar,
                openProjectsSidebar: props.openProjectsSidebar,
                closeProjectsSidebar: props.closeProjectsSidebar })
        )
    );
}

function ProjectsSidebarButton(props) {
    if (props.showSidebar) {
        return React.createElement(
            "button",
            { id: "projects-sidebar-btn", onClick: props.closeProjectsSidebar },
            React.createElement("img", { src: "../../images/close-icon-white.png", alt: "Close", id: "close-sidebar-btn" })
        );
    }
    return React.createElement(
        "button",
        { id: "projects-sidebar-btn", onClick: props.openProjectsSidebar },
        React.createElement(
            "p",
            null,
            "Your projects"
        )
    );
}

ReactDOM.render(React.createElement(KnolistComponents, null), document.querySelector("#knolist-page"));