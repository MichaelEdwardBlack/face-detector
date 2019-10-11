document.getElementById("submit_url").addEventListener("click", function(event) {
  event.preventDefault();
  const url = document.getElementById("image_url").value;
  detectURL(url);
});


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
    var results = "";
    if (json.error_message) {
      results = `<div class="col"><h2 class="error">${json.error_message}</h2></div>`;
    }
    else {
      for (var i = 0; i < json.faces.length; i++) {
        let attrs = json.faces[i].attributes;
        let emotion = calcStrongestEmotion(attrs.emotion);
        let emoji = getEmojiFromEmotion(emotion);
        let beauty = (attrs.gender.value === "Male" ? attrs.beauty.male_score : attrs.beauty.female_score);

        results += `
          <div class="row">
            <div class="col"><h1>Face #${i}</h1></div>
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
  })
  .catch(err => {
    console.log(err);
  });
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
