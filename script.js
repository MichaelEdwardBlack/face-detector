document.getElementById("submit_url").addEventListener("click", function(event) {
  event.preventDefault();
  const url = document.getElementById("image_url").value;
  // show the spinner
  document.getElementById("spinner").className = "fa fa-spinner fa-spin fa-3x";
  detectURL(url);
});

document.getElementById("submit_file").addEventListener("click", function(event) {
  event.preventDefault();
  const file = document.getElementById("image_file").files[0];
  // show the spinner
  document.getElementById("spinner").className = "fa fa-spinner fa-spin fa-3x";
  getBase64(file)
    .then(data => detectFile(data))
    .catch(err => {
      console.log(err);
      // hide the spinner
      document.getElementById("spinner").className = "fa fa-spinner fa-spin fa-3x hide";
    });
});

document.getElementById("image_file").addEventListener("change", function(event) {
  const file = document.getElementById("image_file").files[0];
  document.getElementById("image_label").innerHTML = file.name;
})

function detectURL(url) {
  const base_url = "https://api-us.faceplusplus.com/facepp/v3/detect";
  const data = new URLSearchParams();
  data.append("api_key", "Tskw9j3_9UMr02y_UH8eb8g-sR45EMPp");
  data.append("api_secret", "scGLqSv40_Ir-d4_-tVdUsOsA26wYlh-");
  data.append("image_url", url);
  data.append("return_attributes", "gender,age,emotion,ethnicity,beauty")
  fetch(base_url, {
    "method": "POST",
    "headers": {
      "content-type": "application/x-www-form-urlencoded; charset=utf-8",
    },
    "body": data
  })
  .then(response => response.json())
  .then(json => {
    console.log(json);
    displayResults(json);
    // hide the spinner
    document.getElementById("spinner").className = "fa fa-spinner fa-spin fa-3x hide";
  })
  .catch(err => {
    console.log(err);
    // hide the spinner
    document.getElementById("spinner").className = "fa fa-spinner fa-spin fa-3x hide";
  });
}

function detectFile(file) {
  const base_url = "https://api-us.faceplusplus.com/facepp/v3/detect";
  const data = new URLSearchParams();
  data.append("api_key", "Tskw9j3_9UMr02y_UH8eb8g-sR45EMPp");
  data.append("api_secret", "scGLqSv40_Ir-d4_-tVdUsOsA26wYlh-");
  data.append("image_base64", file);
  data.append("return_attributes", "gender,age,emotion,ethnicity,beauty")
  fetch(base_url, {
    "method": "POST",
    "headers": {
      "content-type": "application/x-www-form-urlencoded; charset=utf-8",
    },
    "body": data
  })
  .then(response => response.json())
  .then(json => {
    console.log(json);
    displayResults(json);
    // hide the spinner
    document.getElementById("spinner").className = "fa fa-spinner fa-spin fa-3x hide";
  })
  .catch(err => {
    console.log(err);
    // hide the spinner
    document.getElementById("spinner").className = "fa fa-spinner fa-spin fa-3x hide";
  });
}

function displayResults(json) {
  var results = "";
  if (json.error_message) {
    results = `<div class="col"><h2 class="error">${json.error_message}</h2></div>`;
  }
  else if (json.faces.length === 0) {
    results = "No faces found in this image 😢"
  }
  else {
    for (var i = 0; i < json.faces.length && i < 5; i++) {
      let attrs = json.faces[i].attributes;
      let emotion = calcStrongestEmotion(attrs.emotion);
      let emoji = getEmojiFromEmotion(emotion);
      let beauty = (attrs.gender.value === "Male" ? attrs.beauty.male_score : attrs.beauty.female_score);

      results += `
        <div class="row">
          <div class="col"><h1>Face #${i + 1}</h1></div>
        </div>
        <div class="row">
          <div class="col"><h3>Gender</h3></div>
          <div class="col"><h3>Age</h3></div>
          <div class="col"><h3>Ethnicity</h3></div>
          <div class="col"><h3>Emotion</h3></div>
          <div class="col"><h3>Beauty</h3></div>
        </div>
        <div class="row">
          <div class="col"><h3>
            <i class="fa fa-${attrs.gender.value.toLowerCase()}" aria-hidden="true"></i>
          </h3></div>
          <div class="col"><h3>${attrs.age.value}</h3></div>
          <div class="col"><h3>${attrs.ethnicity.value}</h3></div>
          <div class="col"><h3>${emotion} ${emoji}</h3></div>
          <div class="col"><h3>${beauty}</h3></div>
        </div>
        <br/>
        `;
    }
  }

  document.getElementById("url_results").innerHTML = results
}

function calcStrongestEmotion(emotions) {
  let strongestVal = 0;
  let strongestEmotion = "";
  let keys = Object.keys(emotions);
  for (var i in keys) {
    if (emotions[keys[i]] > strongestVal) {
      strongestEmotion = keys[i];
      strongestVal = emotions[keys[i]];
    }
  }
  return strongestEmotion;
}

function getEmojiFromEmotion(emotion) {
  switch (emotion) {
    case 'anger':
      return "😡"
    case 'disgust':
      return "🤢"
    case 'fear':
      return "😱"
    case 'happiness':
      return "😊"
    case 'neutral':
      return "😐"
    case 'sadness':
      return "😢"
    case 'surprise':
      return "😲"
    default:
      return '?';
  }
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
