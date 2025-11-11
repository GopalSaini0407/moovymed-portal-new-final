import React from "react";
import { useTranslation } from "react-i18next";
import AuthNavbar from "./navbar/AuthNavbar";
import Footer from "./Footer";
const LegalNotice = () => {
  const { t } = useTranslation("legalNotice"); // 👈 specify translation namespace

  return (
    <>
      <AuthNavbar />
      <main
        id="main-content"
        className="min-h-screen w-full flex flex-col"
        style={{
          background:
            "linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto mt-5 bg-white shadow-md rounded-2xl p-8"
         style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          }}>
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            {t("title-notice")}
          </h1>

          {/* Operator and Contact */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              {t("operatorTitle")}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t("operator.name")} <br />
              {t("operator.address.0")} <br />
              {t("operator.address.1")}
            </p>

            <p className="text-gray-700 mt-4">
              Email:{" "}
              <a
                href={`mailto:${t("operator.email")}`}
                className="text-blue-600 hover:underline"
              >
                {t("operator.email")}
              </a>
              <br />
              <br />
              Phone number:{" "}
              <span className="font-medium text-gray-800">
                {t("operator.phone")}
              </span>
            </p>
          </section>

          {/* Representation */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              {t("representationTitle")}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t("representation.text")}
              <br />
              <br />
              {t("representation.register")}
            </p>
          </section>

          {/* Online Dispute Resolution */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              {t("odrTitle")}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t("odr.text")}
              <br />
              <a
                href={t("odr.link")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {t("odr.linkText")}
              </a>
            </p>
          </section>

          {/* Image Credits */}
          <section>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              {t("imageCreditsTitle")}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t("imageCredits", { returnObjects: true }).map((credit, index) => (
                <span key={index}>
                  {credit.source}:{" "}
                  <a
                    href={credit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {credit.author}
                  </a>
                  <br />
                </span>
              ))}
            </p>
          </section>
        </div>
        <Footer/>

      </main>
    </>
  );
};

export default LegalNotice;
