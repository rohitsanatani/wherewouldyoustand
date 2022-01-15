//var allData = '<%- JSON.stringify(allData) %>';
//const allData = document.getElementById('allData');
//console.log(allData);

getData('testget').then((incomingObjs) => {
    console.log(incomingObjs.allData[0])
    });

/*then((incomingObjs) => {
    console.log(incomingObjs.allData[0].userName);
    });*/


function getData(endpoint) {
    return fetch(endpoint)
      .then(convertToJSON)
      .catch((error) => {
        // give a useful error message
        throw `GET request to ${endpoint} failed with error:\n${error}`;
      });
  }

  // convert a fetch result to a JSON object with error handling for fetch and json errors
function convertToJSON(res) {
    if (!res.ok) {
      throw `API request failed with response status ${res.status} and text: ${res.statusText}`;
    }
  
    return res
      .clone() // clone so that the original is still readable for debugging
      .json() // start converting to JSON object
      .catch((error) => {
        // throw an error containing the text that couldn't be converted to JSON
        return res.text().then((text) => {
          throw `API request's result could not be converted to a JSON object: \n${text}`;
        });
      });
  }