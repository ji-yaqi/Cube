var data = [];

d3.csv("data/employee_reviews.csv", function(allData) {

  console.log(allData);
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
  console.log(data);

  function getCity(location){
    console.log(location.split(",")[0]);
    return location.split(",")[0];
  }

  function getState(location){
    console.log(location.split(",")[1]);
    return location.split(",")[1];
  }

});
