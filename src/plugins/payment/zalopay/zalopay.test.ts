import ZaloPay from "./zalopay";

const zalopay = new ZaloPay();
zalopay
  .CreateOrder(1000, "An chuyen tien cho Dung")
  .then((data: any) => {
    console.log(data.apptransid);
    setTimeout(() => {
      zalopay
        .GetOrderStatus(data.apptransid)
        .then((data: any) => {
          console.log(data);
        })
        .catch((err: Error) => {
          console.log(err);
        });
    }, 10000);
  })
  .catch((err: Error) => {
    console.log(err);
  });

// console.log(zalopay.Gateway(1000, ""));
