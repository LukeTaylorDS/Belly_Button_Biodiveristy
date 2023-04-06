function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultMetadata = metadata.filter(metaObj => metaObj.id == sample);
    //  Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    //  Create a variable that holds the first sample in the metadata array.
    var resultMeta = resultMetadata[0];
    //  Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;
    //  Create a variable that holds the washing frequency.
    var washFrequency = resultMeta.wfreq;

    // Create the yticks for the bar chart.
  
    var yticks = otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

    //  Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otuLabels.slice(0, 10).reverse()
    }];

    //  Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Species (OTUs)",
      width: 400,
      paper_bgcolor: "lightpink",
    };

    //  Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    // Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: 'Earth'
        }
      }
    ];
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID', tickmode: 'linear', dtick: 500 },
      hovermode: 'closest',
      margin: { t: 30 },
      paper_bgcolor: "lightpink",
      width: 1000
    };
    //  Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    //  Create the trace for the gauge chart.
    var gaugeData = [      {        domain: { x: [0, 1], y: [0, 1] },
    value: washFrequency,
    title: { text: "Belly Button Washing Frequency<br>Scrubs per Week", font: {color: "black"} },
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkgrey", tickfont: { color: "darkgrey" } },
      bar: { color: "black" },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "lightgreen" },
        { range: [8, 10], color: "green" }
      ]
    }
  }
];
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 400, 
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lightpink",
      font: { color: "black", family: "Arial" }
    };
    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
