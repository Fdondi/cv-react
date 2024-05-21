import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';


const Header = () => (
  <header className="header">
    <img src="me.jpg" alt="Francesco Dondi" className="photo" />
    <h1>Francesco Dondi</h1>
    <p>The guarantee of experience, the enthusiasm for good engineering.</p>
    <p><a href="https://github.com/Fdondi/cv-latex/blob/main/cv_en.pdf">Latest version of this CV</a></p>
    <div className="contact-info">
      <p>Email: <a href="mailto:francesco314@gmail.com">francesco314@gmail.com</a></p>
      <p>Phone: +41 76 456 50 32</p>
      <p>LinkedIn: <a href="https://linkedin.com/in/francesco-dondi">francesco-dondi</a></p>
      <p>GitHub: <a href="https://github.com/Fdondi">Fdondi</a></p>
      <p>Address: Zugerstarsse 66, 8810 Horgen, ZH</p>
      <p>Born: 29/10/1990</p>
      <p>Citizenship: Italian, C permit</p>
      <p>Marital Status: Married, no children</p>
    </div>
  </header>
);

const Section = ({ title, children }) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
);

const ExperienceEntry = ({ period, location, companySize, title, company, description }) => (
  <div className="experience-entry">
    <h3>{title} at <span className="company">{company}</span></h3>
    <p className="period">{period} | {location} | {companySize}</p>
    <p>{description}</p>
  </div>
);

const Stars = ({ level }) => (
  <span>{'★'.repeat(level) + '☆'.repeat(5 - level)}</span>
);

const Skill = ({ name, level }) => (
  <div className="skill">
    <span>{name}</span>
    <Stars level={level} />
  </div>
);

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
];

const LanguageButton = ({ cur_language, setLanguage, lang_code, lang_name }) => (
  <button key={lang_code} onClick={() => setLanguage(lang_code)} disabled={cur_language === lang_code}>{lang_name}</button>
);

const LanguageSelector = ({ language, setLanguage }) => (
  <div className="language-selector">
    {languages.map(({ code, name }) => ( 
      <LanguageButton key={code} cur_language={language} setLanguage={setLanguage} lang_code={code} lang_name={name} />
    ))}
  </div>
);

function AppContent(){
  const [language, setLanguage] = useState('en'); // Default language is English

  const locationHook = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const defaultLang = params.get('lang');
    if (defaultLang) {
      setLanguage(defaultLang);
    }
  }, [locationHook.search]);

  const [skills, setSkills] = useState({});

  const isProduction = process.env.NODE_ENV === 'production';
  const rootUrl = isProduction ? `${process.env.PUBLIC_URL}` : '';

  useEffect(() => {
    fetch(`${rootUrl}/skills.json`)
      .then(response =>response.json())
      .then(data => setSkills(data.skills))
      .catch(error => console.error('Error fetching the skills data:', error));
  }, []);

  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetch(`${rootUrl}/experiences.json`)
    .then(response =>response.json())
    .then(data => setExperiences(data.experiences))
    .catch(error => console.error('Error fetching the experiences data:', error));
}, []);

  return (
  <div className="cv">
    <Header />
    <LanguageSelector language={language} setLanguage={setLanguage} />
    <div className="main-content">
      <div className="left-column">
        <Section title="Who I am">
          <p>
            As a seasoned software developer, I bring a wealth of experience in developing robust software solutions, optimizing SQL databases, and implementing effective data analytics. My expertise ranges from securing and improving server configurations to developing end-to-end sophisticated software solutions. I'm known among my peers and supervisors for being a reliable, intelligent, and friendly colleague, one who is always ready to take on responsibility and contribute to the team's success.
          </p>
        </Section>
        <Section title="Professional Experience">
          {experiences.map((experience, index) => (
              <ExperienceEntry
                key={index}
                period={experience.period}
                location={experience.location}
                companySize={experience.companySize}
                title={experience.title}
                company={experience.company}
                description={experience.description[language]}
              />
            ))}
        </Section>
      </div>
      <div className="right-column">
        {Object.keys(skills).map((section, index) => (
          <Section key={index} title={section}>
            {skills[section].map((skill, idx) => (
              <Skill key={idx} name={skill.name} level={skill.level} />
            ))}
          </Section>
          ))}
      </div>
    </div>
  </div>
);
}

const App = () => (
  <Router basename="/cv-react">
    <Routes>
      <Route path="/" element={<AppContent />} />
    </Routes>
  </Router>
);

export default App;
