import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "./navbar/AuthNavbar";
import { useTranslation } from "react-i18next";

const MembershipPlan = () => {
  const initialPlan = localStorage.getItem("token") ? "monthly" : "free";

  const [selectedPlan, setSelectedPlan] = useState(initialPlan);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const plans = ["free", "monthly", "yearly"];

  const handleSelectPlan = (planId) => setSelectedPlan(planId);

  const handleNavigate = () => {
    if (token) navigate("/");
    else navigate("/login");
  };

  return (
    <>
      <AuthNavbar />
      <div
        id="main-content"
        className="min-h-screen w-full flex flex-col legal-page p-3"
        style={{
          background:
            "linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)",
        }}
      >
        <div
          className="bg-white rounded-2xl shadow-sm p-6"
          style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          }}
        >
          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {t("membershipTitle.chooseMembership")}
          </h2>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((planId) => {
              const plan = t(`membershipPlans.${planId}`, { returnObjects: true }) || {};

              return (
                <label
                  key={planId}
                  className={`border rounded-2xl p-6 shadow relative transition-all ${
                    selectedPlan === planId
                      ? "border-none bg-blue-50"
                      : "border-gray-300 bg-white"
                  } ${
                    token && planId === "free"
                      ? "opacity-50 pointer-events-none cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {/* Badge */}
                  {planId === "yearly" && plan.badge && (
                    <div
                      className="absolute top-0 right-2 text-white px-3 py-1 text-xs font-semibold rounded shadow"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)",
                      }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <input
                    type="radio"
                    name="membership"
                    value={planId}
                    checked={selectedPlan === planId}
                    disabled={token && planId === "free"}
                    onChange={() => handleSelectPlan(planId)}
                    className="hidden"
                  />

                  {/* Plan Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{plan.title}</h3>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedPlan === planId
                          ? "bg-[linear-gradient(135deg,rgba(79,177,231,1)_0%,rgba(255,0,117,1)_100%)]"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedPlan === planId && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Price & Duration */}
                  <p className="text-3xl font-bold text-blue-600">{plan.price}</p>
                  <p className="text-sm text-gray-500 mb-4">{plan.duration}</p>

                  {/* Features */}
                  <ul className="text-sm text-gray-700 space-y-2">
                    {(plan.features || []).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-500">✔</span> {feature}
                      </li>
                    ))}
                  </ul>
                </label>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleNavigate}
              className="px-8 py-3 bg-[linear-gradient(135deg,rgba(79,177,231,1)_0%,rgba(255,0,117,1)_100%)] text-white rounded-full text-lg shadow-lg hover:bg-blue-700 transition"
            >
              {t(`membershipPlans.${selectedPlan}.continueButton`)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipPlan;
