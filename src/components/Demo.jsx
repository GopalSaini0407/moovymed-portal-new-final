import React, { useState } from "react";

const MembershipPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("free");

  const plans = [
    {
      id: "free",
      title: "Free Plan",
      price: "$0.00",
      duration: "Lifetime Free",
      features: [
        "Access to basic content",
        "Limited categories",
        "No priority support",
      ],
    },
    {
      id: "monthly",
      title: "Monthly Plan",
      price: "$25.00",
      duration: "Per Month",
      features: [
        "All premium content",
        "Unlimited categories",
        "Priority support",
        "Early access to new updates",
      ],
    },
    {
      id: "yearly",
      title: "Yearly Plan",
      price: "$275.00",
      duration: "Per Year",
      features: [
        "All premium content",
        "Unlimited categories",
        "Premium support",
        "Early access + Exclusive resources",
        "Save 35% compared to monthly",
      ],
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div
      id="main-content"
      className="min-h-screen w-full flex flex-col legal-page"
      style={{
        background:
          "linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)",
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-sm p-6 relative w-5xl m-auto"
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Choose Your Membership
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <label
              key={plan.id}
              className={`cursor-pointer border rounded-2xl p-6 shadow relative transition-all ${
                selectedPlan === plan.id
                  ? "border-none bg-blue-50"
                  : "border-gray-300 bg-white border-none"
              }`}
            >
              {/* ⭐ YEARLY BADGE */}
              {plan.id === "yearly" && (
                <div className="absolute top-0 right-2 text-white px-3 py-1 text-xs font-semibold rounded shadow"
                style={{
                    background:
                      "linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)",
                  }}
                >
             Best Value
                </div>
              )}

              <input
                type="radio"
                name="membership"
                value={plan.id}
                checked={selectedPlan === plan.id}
                onChange={() => handleSelectPlan(plan.id)}
                className="hidden"
              />

              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {plan.title}
                </h3>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedPlan === plan.id
                      ? "bg-[linear-gradient(135deg,rgba(79,177,231,1)_0%,rgba(255,0,117,1)_100%)]"
                      : "border-gray-400"
                  }`}
                  
                >
                  {selectedPlan === plan.id && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
              </div>

              <p className="text-3xl font-bold text-blue-600">{plan.price}</p>
              <p className="text-sm text-gray-500 mb-4">{plan.duration}</p>

              <ul className="text-sm text-gray-700 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-blue-500">✔</span> {feature}
                  </li>
                ))}
              </ul>
            </label>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-[linear-gradient(135deg,rgba(79,177,231,1)_0%,rgba(255,0,117,1)_100%)] text-white rounded-full text-lg shadow-lg hover:bg-blue-700 transition">
            Continue with {plans.find((p) => p.id === selectedPlan)?.title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
