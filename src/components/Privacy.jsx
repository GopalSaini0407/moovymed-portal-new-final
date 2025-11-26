import React from "react";
import { useTranslation } from "react-i18next";
import AuthNavbar from "./navbar/AuthNavbar";
import Footer from "./Footer";
const Privancy = () => {
  const { t } = useTranslation();

  return (
    <>
    <AuthNavbar/>
     <main id="main-content" 
    className="min-h-screen w-full flex flex-col privacy-page"
    style={{
      background:
        "linear-gradient(135deg, rgba(79, 177, 231, 1) 0%, rgba(255, 0, 117, 1) 100%)",
    }}>
      <div className="max-w-5xl mx-auto mt-5 bg-white shadow-md rounded-2xl p-8"
       style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
      }}>
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          {t("privacy.top-header.title")}
        </h2>

        {/* Intro */}
        <section className="space-y-4 text-gray-700 leading-relaxed">
          <p>{t("privacy.intro.p1")}</p>
          <p>{t("privacy.intro.p2")}</p>
        </section>

        {/* Section 1 */}
        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">
            {t("privacy.sections.1.title")}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {t("privacy.sections.1.address.line1")} <br />
            {t("privacy.sections.1.address.line2")} <br />
            {t("privacy.sections.1.address.line3")} <br />
            <br />
            Email:{" "}
            <a
              href={`mailto:${t("privacy.sections.1.email")}`}
              className="text-blue-600 hover:underline"
            >
              {t("privacy.sections.1.email")}
            </a>
          </p>
        </section>

        {/* Section 2 */}
        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">
            {t("privacy.sections.2.title")}
          </h3>
          <p className="text-gray-700 mb-4">
            {t("privacy.sections.2.desc1")}
          </p>
          <p className="font-medium text-gray-800 mb-2">
            {t("privacy.sections.2.collectedDataTitle")}
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            {t("privacy.sections.2.dataList", { returnObjects: true }).map(
              (item, i) => (
                <li key={i}>{item}</li>
              )
            )}
          </ul>
          <p className="mt-4 text-gray-700 leading-relaxed">
            {t("privacy.sections.2.legalBasis")}
          </p>
        </section>

        {/* Section 3 */}
        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">
            {t("privacy.sections.3.title")}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("privacy.sections.3.desc")}
          </p>
          <p className="text-gray-700 mb-4">{t("privacy.sections.3.legalBasis")}</p>
          <p className="text-gray-700">{t("privacy.sections.3.note")}</p>
        </section>

        {/* Section 4 */}
        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">
            {t("privacy.sections.4.title")}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {t("privacy.sections.4.desc")}
          </p>
        </section>

        {/* Section 5 */}
        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">
            {t("privacy.sections.5.title")}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {t("privacy.sections.5.desc")}
          </p>
        </section>

        {/* Section 6 */}
        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">
            {t("privacy.sections.6.title")}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {t("privacy.sections.6.desc")}
          </p>
        </section>

        {/* Section 7 */}
        <section className="mt-10">
          <h3 className="text-2xl font-semibold text-blue-700 mb-2">
            {t("privacy.sections.7.title")}
          </h3>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            {t("privacy.sections.7.rights", { returnObjects: true }).map(
              (r, i) => (
                <li key={i}>{r}</li>
              )
            )}
          </ul>
          <p className="mt-3 text-gray-700">
            <a
              href={t("privacy.sections.7.authorityLink")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {t("privacy.sections.7.authorityLinkText")}
            </a>
          </p>
        </section>

        {/* Cookies */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t("privacy.sections.cookies.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t("privacy.sections.cookies.desc")}
          </p>
          <p className="mt-4 text-gray-700">
            <strong>{t("privacy.sections.cookies.legalBasis")}</strong>
          </p>
        </section>

        {/* Footer */}
        <p className="mt-8 text-gray-500 text-sm text-center">
          {t("privacy.status")}
        </p>
      </div>
      <Footer/>

    </main>
    </>
   
  );
};

export default Privancy;
