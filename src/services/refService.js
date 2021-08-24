var dbService = require("../../src/services/dbService");

const refService = {
  fetchRefBy: async function (ref) {
    console.log("Ref service", ref);
    let resp = {};

    try {
      let query = {
        text: 'select "TUM_User" from tbl_user_mstr where "TUM_User_RefId"=$1',
        values: [ref],
      };
      resp = await dbService.execute(query);
    } catch (e) {
      console.log(e);
    }

    return resp;
  },
  refCountfetch: async function (id) {
    var gen1 = [];
    var gen2 = [];
    var gen3 = [];
    var gen4 = [];
    var gen5 = [];
    var gen1Count = [],
      gen2Count = [],
      gen3Count = [],
      gen4Count = [],
      gen5Count = [];
    try {
      let query = {
        text: "select * from fetch_refCount($1)",
        values: [parseInt(id)],
      };
      gen1 = await dbService.execute(query);
      gen1Count.push(gen1.length);
      if (gen1.length != 0) {
        for (gen1Id = 0; gen1Id < gen1.length; gen1Id++) {
          console.log(gen1Id);
          console.log("hhhhhhhhhhhhhhhhhhhhhh", gen1);

          try {
            let query = {
              text: "select * from fetch_refCount($1)",
              values: [parseInt(gen1[gen1Id].userid)],
            };
            gen2 = await dbService.execute(query);
            gen2Count.push(gen2.length);
            console.log(gen2Count);
            if (gen2.length != 0) {
              for (gen2Id = 0; gen2Id < gen2.length; gen2Id++) {
                console.log("hhyyyyyyyyyyyyyyh", gen2.length);
                try {
                  let query = {
                    text: "select * from fetch_refCount($1)",
                    values: [parseInt(gen2[gen2Id].userid)],
                  };
                  gen3 = await dbService.execute(query);
                  gen3Count.push(gen3.length);
                  if (gen3.length != 0) {
                    for (gen3Id = 0; gen3Id < gen3.length; gen3Id++) {
                      try {
                        let query = {
                          text: "select * from fetch_refCount($1)",
                          values: [parseInt(gen3[gen3Id].userid)],
                        };
                        gen4 = await dbService.execute(query);
                        gen4Count.push(gen4.length);
                        if (gen4.length != 0) {
                          for (gen4Id = 0; gen4Id < gen4.length; gen4Id++) {
                            try {
                              let query = {
                                text: "select * from fetch_refCount($1)",
                                values: [parseInt(gen4[gen4Id].userid)],
                              };
                              gen5 = await dbService.execute(query);
                              gen5Count.push(gen5.length);
                            } catch (e) {
                              console.log(e);
                            }
                          }
                        }
                      } catch (e) {
                        console.log(e);
                      }
                    }
                  }
                } catch (e) {
                  console.log(e);
                }
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    if (!gen1Count[0]) {
      gen1Count.push(0);
    }
    if (!gen2Count[0]) {
      gen2Count.push(0);
    }
    if (!gen3Count[0]) {
      gen3Count.push(0);
    }
    if (!gen4Count[0]) {
      gen4Count.push(0);
    }
    if (!gen5Count[0]) {
      gen5Count.push(0);
    }

    let gen1C = gen1Count.reduce((a, b) => a + b, 0);
    let gen2C = gen2Count.reduce((a, b) => a + b, 0);
    let gen3C = gen3Count.reduce((a, b) => a + b, 0);
    let gen4C = gen4Count.reduce((a, b) => a + b, 0);
    let gen5C = gen5Count.reduce((a, b) => a + b, 0);

    return [gen1C, gen2C, gen3C, gen4C, gen5C];
  },
  referralUpdatePoints: async (email) => {
      console.log(email)
    let resp = {};

    try {
      let query = {
        text: `select "TUM_User_Ref_By" from tbl_user_mstr where "TUM_User_Email"=$1`,
        values: [email],
      };
      resp = await dbService.execute(query);
      if (resp.length != 0) {
        let query = {
          text: `update tbl_user_mstr set "Gen1"= "Gen1" +1, "Total"= "Gen1"+"Gen2"+"Gen3"+"Gen4"+"Gen5"+1 where "TUM_User"=$1`,
          values: [resp[0].TUM_User_Ref_By],
        };
       let resp1 = await dbService.execute(query);
        if(resp1){
            let query = {
                text: `select "TUM_User_Ref_By" from tbl_user_mstr where "TUM_User"=$1`,
                values: [resp[0].TUM_User_Ref_By],
              };
            let  resp2 = await dbService.execute(query);
            if(resp2.length!= 0){
                let query = {
                    text: `update tbl_user_mstr set "Gen2"= "Gen2" +1, "Total"= "Gen1"+"Gen2"+"Gen3"+"Gen4"+"Gen5"+1 where "TUM_User"=$1`,
                    values: [resp2[0].TUM_User_Ref_By],
                  };
                  let  resp3 = await dbService.execute(query);
                  if(resp3){
                    let query = {
                        text: `select "TUM_User_Ref_By" from tbl_user_mstr where "TUM_User"=$1`,
                        values: [resp2[0].TUM_User_Ref_By],
                      };
                    let  resp4 = await dbService.execute(query);
                    if(resp4.length!=0){
                        let query = {
                            text: `update tbl_user_mstr set "Gen3"= "Gen3" +1 ,"Total"= "Gen1"+"Gen2"+"Gen3"+"Gen4"+"Gen5"+1 where "TUM_User"=$1`,
                            values: [resp4[0].TUM_User_Ref_By],
                          };
                          let  resp5 = await dbService.execute(query);
                          if(resp5){
                            let query = {
                                text: `select "TUM_User_Ref_By" from tbl_user_mstr where "TUM_User"=$1`,
                                values: [resp4[0].TUM_User_Ref_By],
                              };
                            let  resp6 = await dbService.execute(query);
                            if(resp6.length!=0){
                                let query = {
                                    text: `update tbl_user_mstr set "Gen4"= "Gen4" +1,"Total"= "Gen1"+"Gen2"+"Gen3"+"Gen4"+"Gen5"+1  where "TUM_User"=$1`,
                                    values: [resp6[0].TUM_User_Ref_By],
                                  };
                                  let  resp7 = await dbService.execute(query);
                                  if(resp7){
                                      let query = {
                                        text: `select "TUM_User_Ref_By" from tbl_user_mstr where "TUM_User"=$1`,
                                        values: [resp6[0].TUM_User_Ref_By],
                                      }
                                      let  resp8 = await dbService.execute(query);
                                      if(resp8.length!=0) {
                                        let query = {
                                            text: `update tbl_user_mstr set "Gen5"= "Gen5" +1,"Total"= "Gen1"+"Gen2"+"Gen3"+"Gen4"+"Gen5"+1  where "TUM_User"=$1`,
                                            values: [resp8[0].TUM_User_Ref_By],
                                          };
                                          let  resp9 = await dbService.execute(query);
                                          if(resp9){
                                            let query = {
                                                text: `select "TUM_User_Ref_By" from tbl_user_mstr where "TUM_User"=$1`,
                                                values: [resp8[0].TUM_User_Ref_By],
                                              }
                                              let  resp10 = await dbService.execute(query);
                                              
                                              

                                          }
                                      }
                                  }
                            }

                    }
                  }
                }
            }
        }
      }
    } catch (error) {
      console.log(error);
    }
    return resp
  },
  fetch_refDetailsById: async function (id) {
    let resp = {};
    try {
      resp = await dbService.execute(
        `select * from fetch_refDetails(${parseInt(id)})`
      );
    } catch (e) {
      console.log(e);
    }
    return resp;
  },
};

module.exports = refService;
