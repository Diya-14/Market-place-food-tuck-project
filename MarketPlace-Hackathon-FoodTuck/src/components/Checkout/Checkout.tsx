"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useShoppingCart } from "use-shopping-cart";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const router = useRouter();

  const { cartDetails, totalPrice, redirectToCheckout } = useShoppingCart();
   
  
  console.log(cartDetails);
  const [selectPaymentMethod, setSelectPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    firstName: "",
    email: "",
  });

  const isFormValid = Object.values(formValues).every(
    (value) => value.trim() !== ""
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Please fill all the required fields.");
      return;
    }

    if (selectPaymentMethod === "card") {
      setLoading(true);
      try {
        const result = await redirectToCheckout();
        if (result?.error) {
          console.error("Stripe error:", result.error);
        }
      } catch (error) {
        console.error("Stripe checkout failed:", error);
      }
    } else if (selectPaymentMethod === "cash") {
      setLoading(true);
      router.push("/success"); // Navigate to success page for Cash on Delivery
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => handlePlaceOrder(e)}
        className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 md:px-10"
      >
        <div className="max-w-6xl w-full bg-white rounded-lg flex flex-col md:flex-row gap-4">
          {/* Left Section */}
          <div className="w-full md:w-2/3 p-6 md:p-10">
            <h2 className="text-2xl font-semibold mb-4 text-[#333333] Headings">
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 text-[#333333] md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="firstName">Fisrt name</label>
                <input
                  id="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  type="text"
                  className="p-3 border focus:outline-none focus:ring-2 focus:ring-[#ffc14a]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  className="p-3 border focus:outline-none focus:ring-2 focus:ring-[#ffc14a]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                  value={formValues.email}
                  onChange={handleInputChange}
                  id="email"
                  type="email"
                  className="p-3 border focus:outline-none focus:ring-2 focus:ring-[#ffc14a]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="tel">Phone</label>
                <input
                  id="tel"
                  type="tel"
                  className="p-3 border focus:outline-none focus:ring-2 focus:ring-[#ffc14a]"
                />
              </div>

              <input
                type="text"
                placeholder="Address 1"
                className="col-span-1 md:col-span-2 p-3 border focus:outline-none focus:ring-2 focus:ring-[#ffc14a]"
              />

              <input
                type="text"
                placeholder="Address 2"
                className="col-span-1 md:col-span-2 p-3 border focus:outline-none focus:ring-2 focus:ring-[#ffc14a]"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between pt-4 space-y-4 md:space-y-0 gap-4">
            <button className="py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9F0D] w-full h-12 px-3">
             <Link href={"/shoppingCart"}>Back to cart</Link> 
            </button>
            <button className="px-6 py-2 bg-[#FF9F0D] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#FF9F0D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9F0D] w-full h-12">
              Proceed to shipping
            </button>
          </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/3 bg-gray-50 p-6 text-[#333333] md:p-10 border-t md:border-t-0 md:border-l border-gray-500">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {Object.values(cartDetails ?? {}).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex  items-center space-x-4">
                    <Image
                      src={entry.image as string}
                      alt="Chicken Tikka Kabab"
                      height={100}
                      width={100}
                      className="w-16 h-16 object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-medium">{entry.name}</h3>
                      <p className="text-xs text-gray-500">150 gm net</p>
                      <p className="text-xs text-gray-500">{entry.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">${entry.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sub-total</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>$0</span>
              </div>
            </div>

            <div className="mt-4 border-t pt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <input
                  defaultChecked
                  value="cash"
                  id="cash"
                  type="radio"
                  name="payment"
                  onChange={(e) => setSelectPaymentMethod(e.target.value)}
                />
                <label className="text-sm" htmlFor="cash">
                  Cash on Delivery
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  value="card"
                  id="card"
                  type="radio"
                  name="payment"
                  onChange={(e) => setSelectPaymentMethod(e.target.value)}
                />
                <label className="text-sm" htmlFor="card">
                  Card Payment
                </label>
              </div>
            </div>

            <button
            
              type="submit"
              disabled={!isFormValid || loading}
              className={`mt-6 w-full font-bold py-3 rounded-md ${
                !isFormValid || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : " text-white bg-[#ff9f0d] "
              }`}
            >
              {loading ? "Loading..." : "Place an order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;