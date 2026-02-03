import React from "react";
import { Bell, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MembershipDesktopNotification({
  type = "free", // free | monthly | yearly
  expiryDate = "",
  purchageDate = "",
  expireDays = "",
  customClass,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onUpgrade = () => navigate("/membership");
  const onRenew = () => navigate("/membership");

  // Determine if this plan is free or paid
  const isFree = type === "free";

  return (
    <div
      className="w-full bg-white border mt-1 mb-3 border-gray-300 rounded-xl shadow-md p-2 flex items-start gap-5"
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
      }}
    >
      {/* Left Icon */}
      <div className="w-7 h-7 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#4FB1E7] to-[#FF0075] text-white shadow">
        <Bell className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className={`flex-1 justify-between flex ${customClass}`}>
        {isFree ? (
          <>
            <div>
              <h5 className="text-sm font-semibold text-gray-900">
                <span className="font-bold">{t("membership.free.title")}</span>
              </h5>
              <p className="text-sm text-gray-600">
                {t("membership.free.description")}
              </p>
            </div>
            <button
              onClick={onUpgrade}
              className="inline-flex mt-2 md:mt-0 h-10 items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4FB1E7] to-[#FF0075] text-white rounded-full text-sm font-medium shadow hover:opacity-90 transition"
            >
              {t("membership.free.button")}
            </button>
          </>
        ) : (
          <>
            <div>
              <h5 className="text-sm font-semibold text-gray-900">
                {t(`membership.${type}.title`)}
              </h5>

              {expireDays && (
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {t(`membership.${type}.expiryDaysLabel`)}:{" "}
                  <span className="text-red-700 font-semibold">{expireDays}</span>
                </p>
              )}

              {purchageDate && (
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {t(`membership.${type}.purchaseDateLabel`)}:{" "}
                  <span className="text-green-700 font-semibold">{purchageDate}</span>
                </p>
              )}

              {expiryDate && (
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {t(`membership.${type}.expiryDateLabel`)}:{" "}
                  <span className="text-gray-700 font-semibold">{expiryDate}</span>
                </p>
              )}
            </div>

            <button
              onClick={onRenew}
              className="inline-flex mt-2 md:mt-0 h-10 items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4FB1E7] to-[#FF0075] text-white rounded-full text-sm font-medium shadow hover:bg-yellow-600 transition"
            >
              {t(`membership.${type}.renewButton`)}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(MembershipDesktopNotification);
