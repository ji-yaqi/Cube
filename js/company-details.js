// company detail page
var currentCompany = localStorage.getItem("currentCompany");
document.getElementById("title").innerHTML = "<h1>Reviews of " + currentCompany + "</h1>";
console.log(currentCompany);
var data = [];
var companyData;
var stateData = {
  "AZ": {},
  "CO": {},
  "DE": {},
  "FL": {},
  "GA": {},
  "HI": {},
  "ID": {},
  "IL": {},
  "IN": {},
  "IA": {},
  "KS": {},
  "KY": {},
  "LA": {},
  "MD": {},
  "ME": {},
  "MA": {},
  "MN": {},
  "MI": {},
  "MS": {},
  "MO": {},
  "MT": {},
  "NC": {},
  "NE": {},
  "NV": {},
  "NH": {},
  "NJ": {},
  "NY": {},
  "ND": {},
  "NM": {},
  "OH": {},
  "OK": {},
  "OR": {},
  "PA": {},
  "RI": {},
  "SC": {},
  "SD": {},
  "TN": {},
  "TX": {},
  "UT": {},
  "WI": {},
  "VA": {},
  "VT": {},
  "WA": {},
  "WV": {},
  "WY": {},
  "CA": {},
  "CT": {},
  "AK": {},
  "AR": {},
  "AL": {}
}
for(var i=0; i < Object.keys(stateData).length; i++){
  var s = Object.keys(stateData)[i];
  var state = stateData[s];
  state.fillKey = "no";
  state.count = +0;
  state.overall_r = +0;
  state.balance_r = +0;
  state.culture_r = +0;
  state.career_r = +0;
  state.benefit_r = +0;
  state.senior_r = +0;
}

d3.csv("data/employee_reviews.csv", function(allData) {

  for (var i = 0; i < allData.length; i++) {
    var d = allData[i];
    var review = {
      company: d.company,
      city: getCity(d.location),
      state: getState(d.location),
      summary: d.summary,
      pros: d.pros,
      cons: d.cons,
      overall_r: +d.overall_ratings,
      balance_r: +d.work_balance_stars,
      culture_r: +d.culture_values_stars,
      career_r: +d.carrer_opportunities_stars,
      benefit_r: +d.comp_benefit_stars,
      senior_r: +d.senior_mangemnet_stars
    };
    data[i] = review;
  }

  //Individual company data
  //Reference: https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-a-array-of-objects
  var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  var reducedData = groupBy(data, 'company');
  companyData = reducedData[currentCompany];
  for(var i = 0; i < companyData.length; i++){
    var d = companyData[i];
    var state = d.state;
    var s = stateData[state];
    if(s){
      s.fillKey = "yes";
      s.count += 1;
      s.overall_r += d.overall_r;
      s.balance_r += d.balance_r;
      s.culture_r += d.culture_r;
      s.career_r += d.career_r;
      s.benefit_r += d.benefit_r;
      s.senior_r += d.senior_r;
    }
  }

  for(var i=0; i < Object.keys(stateData).length; i++){
    var s = Object.keys(stateData)[i];
    var state = stateData[s];
    if(state.fillKey == "yes"){
      state.overall_r = +(state.overall_r/state.count).toFixed(1);
      state.balance_r = +(state.balance_r/state.count).toFixed(1);
      state.culture_r = +(state.culture_r/state.count).toFixed(1);
      state.career_r = +(state.career_r/state.count).toFixed(1);
      state.benefit_r = +(state.benefit_r/state.count).toFixed(1);
      state.senior_r = +(state.senior_r/state.count).toFixed(1);
    }
  }

  console.log(stateData);
  displayMap(stateData);

  function getCity(location){
    return location.split(",")[0];
  }

  function getState(location){
    return location.split(", ")[1];
  }

});


function displayMap(data){
  var election = new Datamap({
    scope: 'usa',
    element: document.getElementById('container'),
    geographyConfig: {
      highlightBorderColor: '#bada55',
      popupTemplate: function(geography, data) {
        if(data.fillKey == "yes"){
          return '<div class="hoverinfo">'
            + '<strong>' + geography.properties.name + '</strong>'
            + '<br>Number of Reviews:' +  data.count
            + '<br>Overall Rating:' +  data.overall_r
            + '<br>Work Life Balance Rating:' +  data.balance_r
            + '<br>Company Culture Rating:' +  data.culture_r
            + '<br>Career Development Rating:' +  data.career_r
            + '<br>Benefit Rating:' +  data.benefit_r
            + '<br>Senior Management Rating:' +  data.senior_r + "</div><br>";
        }else{
          return '<div class="hoverinfo">N/A</div>';
        }
      },
      highlightBorderWidth: 0
    },
    fills: {
      'yes': 'steelblue',
       defaultFill: 'lightGrey'
    },
    data:data

  });
  election.labels();
}
