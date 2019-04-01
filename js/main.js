var data = [];
var overall_svg;
var aspects = ["overall","balance","culture","career","benefit","senior"];

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

  //Companies with averaged rating.
  //Reference: https://stackoverflow.com/questions/51040651/group-by-in-javascript-using-reduce
  var reducedData = data.reduce(function(m, d){
      if(!m[d.company]){
        m[d.company] = {
          company:d.company,
          overall_r:d.overall_r,
          balance_r:d.balance_r,
          culture_r:d.culture_r,
          career_r:d.career_r,
          benefit_r:d.benefit_r,
          senior_r:d.senior_r,
          count: 1};
        return m;
      }
      m[d.company].overall_r += d.overall_r;
      m[d.company].balance_r += d.balance_r;
      m[d.company].culture_r += d.culture_r;
      m[d.company].career_r += d.career_r;
      m[d.company].benefit_r += d.benefit_r;
      m[d.company].senior_r += d.senior_r;
      m[d.company].count += 1;
      return m;
   },{});
   var averageData = Object.keys(reducedData).map(function(k){
       const item  = reducedData[k];
       return {
           company: item.company,
           overall_r: +(item.overall_r/item.count).toFixed(1),
           balance_r: +(item.balance_r/item.count).toFixed(1),
           culture_r: +(item.culture_r/item.count).toFixed(1),
           career_r: +(item.career_r/item.count).toFixed(1),
           benefit_r: +(item.benefit_r/item.count).toFixed(1),
           senior_r: +(item.senior_r/item.count).toFixed(1)
       }
  });
  console.log(averageData)
  // // Fake data :
  // var averageData = [
  //   {
  //     name: "microsoft",
  //     overall_r: 4.5,
  //     balance_r: 5,
  //     culture_r: 4,
  //     career_r: 3,
  //     benefit_r: 4,
  //     senior_r: 2
  //   },
  //   {
  //     name: "google",
  //     overall_r: 4,
  //     balance_r: 5,
  //     culture_r: 4,
  //     career_r: 5,
  //     benefit_r: 4,
  //     senior_r: 3
  //   },
  //   {
  //     name: "facebook",
  //     overall_r: 3,
  //     balance_r: 2,
  //     culture_r: 4,
  //     career_r: 5,
  //     benefit_r: 5,
  //     senior_r: 5
  //   },
  //   {
  //     name: "amazon",
  //     overall_r: 2,
  //     balance_r: 2.3,
  //     culture_r: 4,
  //     career_r: 5,
  //     benefit_r: 3,
  //     senior_r: 2
  //   }
  // ];

  plotOverallRating(averageData);

  function getCity(location){
    return location.split(",")[0];
  }

  function getState(location){
    return location.split(",")[1];
  }

});

function plotOverallRating(data){
  console.log(data);

  overall_svg = d3.select("#overall_rating")
                            .append("svg")
                            .attr("width",1000)
                            .attr("height",1000);

  drawCompanyDots("overall", data);
  drawCompanyDots("balance", data);
  drawCompanyDots("culture", data);
  drawCompanyDots("career", data);
  drawCompanyDots("benefit", data);
  drawCompanyDots("senior", data);

  // draw links
  drawCompanyLinkPath("amazon");
  drawCompanyLinkPath("microsoft");
  drawCompanyLinkPath("facebook");
  drawCompanyLinkPath("apple");
  drawCompanyLinkPath("google");
  drawCompanyLinkPath("netflix");

  // plot axis
  var x = d3.scaleBand()
      .rangeRound([0, 800])
  	  .paddingInner(0.1);

  x.domain(aspects);

  var y = d3.scaleLinear()
            .domain([3, 5])
            .range([500, 0]);

  var y_axis = d3.axisLeft()
                 .scale(y);

  var x_axis = d3.axisBottom()
                 .scale(x);

  overall_svg.append("g")
   .attr("transform", "translate(50, 10)")
   .call(y_axis);

 overall_svg.append("g")
  .attr("transform", "translate(50, 510)")
  .call(x_axis);

}

function drawCompanyDots(aspect,data){
  overall_svg.append("g")
             .selectAll(".dot")
             .data(data)
             .enter()
             .append("circle")
             .attr("class", function(d){
               return "dot " + d.company;
             })
             .attr("r", 8)
             .attr("cx",function(d){
               switch (aspect){
                  case "senior":
                    return 120+130*5;
                  case "benefit":
                    return 120+130*4;
                  case "career":
                    return 120+130*3;
                  case "culture":
                    return 120+130*2;
                  case "overall":
                    return 120;
                  case "balance":
                    return 120+130;
               }
             })
             .attr("cy",function(d){
               switch (aspect){
                  case "senior":
                    return 500-d.senior_r * 80;
                  case "benefit":
                    return 500-d.benefit_r * 80;
                  case "career":
                    return 500-d.career_r * 80;
                  case "culture":
                    return 500-d.culture_r * 80;
                  case "overall":
                    return 500-d.overall_r * 80;
                  case "balance":
                    return 500-d.balance_r * 80;
               }
             });
}

function drawCompanyLinkPath(companyName){
  var groups = overall_svg.selectAll("."+companyName)._groups[0];
  var dots = [];
  for (var i=0;i<groups.length;i++){
    var xy = {
      "x":groups[i].getAttribute("cx"),
      "y":groups[i].getAttribute("cy")
    };
    dots.push(xy);
  }

  // https://www.dashingd3js.com/svg-paths-and-d3js
  var lineFunction = d3.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .curve(d3.curveLinear);

  overall_svg.append("path")
             .attr("d", lineFunction(dots))
             .attr("class", companyName)
             .attr("fill", "none");

}
