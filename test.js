const Client = require("./dist/Client").default;
var l2 = new Client();
l2.enter({
  /* required */ Username: "raid1141",
  /* required */ Password: "12345",
  /* required */ Ip: "127.0.0.1",
  /* optional */ ServerId: 1, //Bartz 
  /* optional */ CharSlotIndex: 0,
}).then(()=> console.log("done"));