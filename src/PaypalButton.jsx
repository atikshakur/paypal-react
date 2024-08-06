import { useEffect, useRef } from "react";

const PayPalButton = () => {
  const paypalButtonRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AX9c4IzmyPLqjI-E3t6SmmltZ49uY78uqzu-3xFO1pdkhdnDaROQWmUDiTw1-XVaRu8t-bimPikErX8j&merchant-id=KPE7SBCGTX5EN";
    script.async = true;
    script.onload = () => initializePayPalButton();
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializePayPalButton = () => {
    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: function (data) {
            console.log(data);
            console.log("createOrder");
            return fetch(
              "https://api-stage.agencyhandy.com/api/v1/orders/create-paypal-order",
              {
                method: "post",
                headers: {
                  "content-type": "application/json",
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF0aWtzdXB0ZXN0QHlvcG1haWwuY29tIiwibmFtZSI6InRvbnkta3Jvb3MtMSIsIl9pZCI6IjY2NTZhZmMxY2YwOWI0NmY5YTM2MmVkYiIsImZpcnN0TmFtZSI6IlRvbnkiLCJsYXN0TmFtZSI6Iktyb29zIiwiaWF0IjoxNzIyOTYxMzA3LCJleHAiOjE3MjMzMjEzMDd9.ytNuVAFghWQ-3N_rbWjJpzracQ_l7ovGk2K2x67E-Z0",
                  companyid: "6656afc1cf09b46f9a362eae",
                },
                body: JSON.stringify({
                  paymentSource: data.paymentSource,
                  projectId: "66b2190061bc293824f22850"
                }),
              }
            )
              .then((response) => response.json())
              .then((order) => {
                return order.data.paypalOrderId;
              });
          },
          onApprove: function (data) {
            console.log("onApprove", data);
            console.log("onApprove");
            return fetch(
              `https://api-stage.agencyhandy.com/api/v1/orders/capture-paypal-order-v2`,
              {
                method: "post",
                headers: {
                  "content-type": "application/json",
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF0aWtzdXB0ZXN0QHlvcG1haWwuY29tIiwibmFtZSI6InRvbnkta3Jvb3MtMSIsIl9pZCI6IjY2NTZhZmMxY2YwOWI0NmY5YTM2MmVkYiIsImZpcnN0TmFtZSI6IlRvbnkiLCJsYXN0TmFtZSI6Iktyb29zIiwiaWF0IjoxNzIyOTYxMzA3LCJleHAiOjE3MjMzMjEzMDd9.ytNuVAFghWQ-3N_rbWjJpzracQ_l7ovGk2K2x67E-Z0",
                  companyid: "6656afc1cf09b46f9a362eae",
                },
                body: JSON.stringify({
                  paypalOrderId: data.orderID,
                }),
              }
            )
              .then((response) => response.json())
              .then((orderData) => {
                alert(
                  "Transaction completed by " + orderData.payer.name.given_name
                );
              });
          },
        })
        .render(paypalButtonRef.current);
    }
  };

  return (
    <div>
      <div ref={paypalButtonRef} id="paypal-button-container"></div>
      <div id="card-fields-container"></div>
    </div>
  );
};

export default PayPalButton;
