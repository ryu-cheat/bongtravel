let geolocation = {
     gpsToGeoPoint(gps: String){
          let result = null;
          let DMS = gps.split(",", 3);
       
          let stringD = DMS[0].split("/");
          let D0 = +stringD[0];
          let D1 = +stringD[1];
          let FloatD = D0 / D1;
       
          let stringM = DMS[1].split("/");
          let M0 = +stringM[0];
          let M1 = +stringM[1];
          let FloatM = M0 / M1;
       
          let stringS = DMS[2].split("/");
          let S0 = +stringS[0];
          let S1 = +stringS[1];
          let FloatS = S0 / S1;
       
          result = parseFloat(FloatD + (FloatM / 60) + (FloatS / 3600));
       
          return result;
     }
}

module.exports = {
     geolocation,
}