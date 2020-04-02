const CUR_VERSION_NUM = 1
createNewGraph = () => {
  return {
    "default": {},
    "curProject": "default",
    "version": CUR_VERSION_NUM
  };
}

// A collection of function to do on the graph
updateItemInGraph = (item, previousURL, graph) => {
  project = graph["curProject"];
  graph = graph[project]
  // Create item if it doesn't exist
  if (graph[item["source"]] == undefined) {
    graph[item["source"]] = item
    graph[item["source"]]["prevURLs"] = []
    graph[item["source"]]["nextURLs"] = []
  }
  // Add edge to graph
  if (previousURL != "" && graph[previousURL] != undefined) {
    graph[item["source"]]["prevURLs"].push(previousURL)
    graph[previousURL]["nextURLs"].push(item["source"])
  }
}

resetCurProjectInGraph = (graph) => {
  project = graph["curProject"];
  graph[project] = {}
}

deleteProjectFromGraph = (graph, projectName) => {
  delete graph[projectName];
}

// Makes new project and sets current project to this new project
createNewProjectInGraph = (graph, projectName) => {
  graph[projectName] = {}
  graph["curProject"] = projectName;
}

setCurrentProjectInGraph = (graph, projectName) => {
  graph["curProject"] = projectName;
}

getNextURLsFromURL = (graph, url) => {
  project = graph["curProject"];
  return graph[project][url]["nextURLs"];
}

getPrevURLsFromURL = (graph, url) => {
  project = graph["curProject"];
  return graph[project][url]["prevURLs"];
}

saveGraphToDisk = (graph) => {
  console.log(graph)
  chrome.storage.local.set({'itemGraph': graph});
}

// This method updates the passed in graph variable in place
getGraphFromDisk = (graph) => {
  chrome.storage.local.get('itemGraph', function (result) {
    result = result.itemGraph;
    if (result.version == CUR_VERSION_NUM) {
      Object.keys(graph).forEach(k => delete graph[k])
      Object.keys(result).forEach(k => graph[k] = result[k])
      console.log(graph)
    }
    else {
      console.log("Either the graph doesnt exist in storage or it's not version "+CUR_VERSION_NUM)
    }
  });
}
