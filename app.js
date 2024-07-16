//Function to run on page load
function init() {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  
// Get the names field
const namesArray = data.names;
console.log("Names Array:", namesArray);
  
// Use d3 to select the dropdown with id of `#selDataset`
const dropDownEl = d3.select('#selDataset');
  
// Use the list of sample names to populate the select options
    for (const name of namesArray) {
    dropDownEl.append('option').text(name);
    }

// Get the first sample from the list
const firstName = namesArray[0];
  
// Build charts and metadata panel with the first sample
  optionChanged(firstName);
  buildMetadata(firstName);
  buildCharts(firstName)

});
}
  
// Function for event listener
function optionChanged(newSample) {
// Build charts and metadata panel each time a new sample is selected
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
  }

// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

// get the metadata field and filter for the object with the desired sample number
const metadataArray = data.metadata.filter((metaObj) => metaObj.id == sample);
const result = metadataArray[0];
console.log("Metadata Array Sample:", result);

// Use d3 to select the panel with id of `#sample-metadata`
const panelEl = d3.select('#sample-metadata');

// Use `.html("") to clear any existing metadata
panelEl.html("");

// Inside a loop, you will need to use d3 to append new
// tags for each key-value in the filtered metadata.

    for (let participant of metadataArray) {
        panelEl.append('div').text('ID:' + participant.id);
        panelEl.append('div').text('ETHNICITY:' + participant.ethnicity);
        panelEl.append('div').text('GENDER:' + participant.gender);
        panelEl.append('div').text('AGE:' + participant.age);
        panelEl.append('div').text('LOCATION:' + participant.location);
        }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field and filter for the object with the desired sample number
    const samplesArray = data.samples.filter((sampleObj) => sampleObj.id == sample);
    const result = samplesArray[0];
    console.log("Samples Array Sample:", result);

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    console.log("OTU IDs", otu_ids);
    console.log("OTU LABEL:", otu_labels);
    console.log("SAMPLE VALUES:", sample_values);

 // Build the bar chart 

 //map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(1, 10).map(otuID => `OTU ${otuID}`).reverse();
    console.log("Y-ticks:", yticks);

  let trace = {
    x: sample_values.slice(0, 10).reverse(), 
    y: yticks,
    text: otu_labels.slice(0, 10).reverse(),
    type: 'bar',
    orientation: 'h',
    hoverinfo: 'h' 
  }
  let chartData = [trace];
  let chartLayout = {
    title: 'Top 10 Bacteria Cultures Found',
    xaxis: {title: 'Number of Bacteria'},
    margin: {t: 30, l: 150}
  };

  //Render the bar chart
  Plotly.newPlot('plot', chartData, chartLayout);

 // Build the bubble chart 
  let trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: 'Viridis'
      }
  };

let bubbleData = [trace1];
let bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    margin: { t:0 },
    hovermode: 'closest',
    xaxis: { title:"OTU ID"},
    yaxis: { title:"Number of Bacteria"},
    margin: { t:30 }

};

//Render the bubble chart
Plotly.newPlot('bubbleChart', bubbleData, bubbleLayout);
 
  });
}

// Initialize the dashboard
init();
