import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useRazorpay from "react-razorpay";

const BlueTick = () => {
  const user = useSelector((state) => state.user.user);
  const [hasBlueTick, setHasBlueTick] = useState(false);
  const [Razorpay] = useRazorpay();

  const [blueTick,setBluetick] = useState({
    name: "Blue Tick",
    creator: "Fixel Feed",
    price: 1,
});

const initPay = (data) => {
    const options = {
      key : "************************",
      amount: data.amount,
      currency: data.currency,
      name: blueTick.name,
      description: "Test",
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyURL = "http://localhost:8000/bluetick/verify";
          const {data} = await fetch(verifyURL,response);
        } catch(error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  
  const handlePay = async () => {
    try {
      const orderURL = "http://localhost:8000/bluetick/buy";
      const response = await fetch(orderURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: blueTick.price }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      initPay(data.data);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };
  


  useEffect(() => {
    const hasBlueTick = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/bluetick/check/${user.id}`
        );
        if (response.ok) {
          const postsData = await response.json();
          // console.log("posts list", postsData);
          setHasBlueTick(postsData.hasBluetick);
        } else {
          console.error("Error fetching Bluetick data");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };
    // hasBlueTick();
  }, []);

  return (
    <div>
      {hasBlueTick !== null &&
      hasBlueTick !== undefined &&
      hasBlueTick == true ? (
        <div>
          You already have a bluetick, thanks for being a loyal member of Pixel
          Feed
        </div>
      ) : (
        <div>
          <p>Blue tick is to show that you are a known public person.</p>
          <p>You can buy this for a lifetime for 1 rupee.</p>
          <button onClick={handlePay}>Buy @ ₹1</button>
        </div>
      )}
    </div>
  );
};

export default BlueTick;
