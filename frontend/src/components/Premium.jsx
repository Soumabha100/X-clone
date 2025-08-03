import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";

// A reusable, modern checkmark icon component.
const CheckIcon = () => (
  <svg
    className="w-6 h-6 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);

/**
 * The Premium component displays the subscription options for the application.
 * It features a dynamic toggle for monthly and yearly billing.
 */
const Premium = () => {
  // State to manage the currently selected billing cycle ('monthly' or 'yearly').
  const [billingCycle, setBillingCycle] = useState("monthly");

  // An object that holds all the pricing and feature data for the different plans.
  // This structure makes it easy to manage and render the plans dynamically.
  const plans = {
    monthly: [
      {
        name: "Basic",
        price: "₹219",
        features: [
          "Small reply boost",
          "Bookmark Folders",
          "Highlights reply",
          "Edit post",
        ],
      },
      {
        name: "Premium",
        price: "₹650",
        features: [
          "All Basic features",
          "Small Ads",
          "Verified checkmark",
          "Creator Tools",
        ],
        popular: true, // This flag is used to highlight the most popular plan.
      },
      {
        name: "Premium+",
        price: "₹1,250",
        features: [
          "All Premium Features",
          "No Ads",
          "Access to Grok 4",
          "Write Articles",
        ],
      },
    ],
    yearly: [
      {
        name: "Basic",
        price: "₹2,190",
        features: [
          "Small reply boost",
          "Bookmark Folders",
          "Highlights reply",
          "Edit post",
        ],
      },
      {
        name: "Premium",
        price: "₹6,500",
        features: [
          "All Basic features",
          "Small Ads",
          "Verified checkmark",
          "Creator Tools",
        ],
        popular: true,
      },
      {
        name: "Premium+",
        price: "₹12,500",
        features: [
          "All Premium Features",
          "No Ads",
          "Access to Grok 4",
          "Write Articles",
        ],
      },
    ],
  };

  // Select the correct set of plans based on the current billingCycle state.
  const currentPlans = plans[billingCycle];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative bg-gradient-to-br from-[#000000] to-[#1a0a2e] text-white">
      <Link
        to="/home"
        className="top-6 left-6 absolute text-gray-400 hover:text-white transition-colors duration-200"
      >
        <MdClose size="32px" />
      </Link>

      <div className="w-full max-w-5xl mx-auto text-center">
        <div className="mb-10 mt-8">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Who are you?
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the plan that's right for you. Unlock new features and, if
            eligible, receive a share of ad revenue.
          </p>
        </div>

        {/* --- Billing Cycle Toggle Switch --- */}
        <div className="flex justify-center items-center space-x-4 mb-12">
          <span
            className={`font-semibold ${
              billingCycle === "monthly" ? "text-white" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              onChange={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
            />
            <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <div className="flex items-center">
            <span
              className={`font-semibold ${
                billingCycle === "yearly" ? "text-white" : "text-gray-500"
              }`}
            >
              Yearly
            </span>
            <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              2 months free
            </span>
          </div>
        </div>

        {/* --- Pricing Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Map over the selected plans array to render a card for each plan. */}
          {currentPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-[#16181c] border ${
                plan.popular ? "border-blue-500" : "border-gray-700"
              } rounded-2xl p-8 flex flex-col text-left transform hover:scale-105 transition-transform duration-300`}
            >
              {/* If a plan is marked as 'popular', display a special badge. */}
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-3xl font-bold">{plan.name}</h2>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold mb-1">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500">
                  {" "}
                  /{billingCycle === "monthly" ? "Month" : "Year"}
                </span>
              </div>
              {/* The 'flex-grow' class ensures the feature list expands to push the button to the bottom. */}
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckIcon />
                    <span className="ml-3 text-gray-300 text-lg">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 font-bold rounded-full transition-colors duration-200 ${
                  plan.popular
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Premium;
