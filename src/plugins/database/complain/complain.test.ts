import { ComplainDB, ComplainModel } from "./complain";

var complainDB = new ComplainDB();

var complain = {
  from_uid: 25,
  to_uid: 35,
  contract_id: 5,
  description: "Ban nay day thieu toi mot ngay",
  complain_time: ~~(Date.now() / 1000)
} as ComplainModel;

complainDB.setComlain(complain, (err: Error, data: any) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Set", data);
  }
});

complainDB.getDetailComplain(1, (err: Error, data: any) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Get detail", data);
  }
});
