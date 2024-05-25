import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

const Header = ({tagline, lang}) => (
  <header className="header">
    <img src="me.jpg" alt="Francesco Dondi" className="photo" />
    <h1>Francesco Dondi</h1>
    <p>{tagline}</p>
    <p><a href={'https://github.com/Fdondi/cv-latex/blob/main/cv_' + lang + '.pdf'}>Latest version of this CV</a></p>
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

// Custom hook to fetch data
const useFetch = (url, initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching the data from ${url}:`, error);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
};

const Error = ({ message }) => (
    <div className="cv">
      <div className="main-content">
        <div className="left-column">
          <Section title="Error loading data">
            <p>
              {message}
            </p>
          </Section>
        </div>
      </div>
    </div>
  );

// Using the custom hook in your component
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

  const { data: skills, loading: skillsLoading } = useFetch(`/cv-react/data/skills.json`, null);
  const { data: experiences, loading: experiencesLoading } = useFetch(`/cv-react/data/experiences.json`, null);
  const { data: structure, loading: strucntureLoading } = useFetch(`/cv-react/data/structure.json`, null);

  const err = [];
  if (!skills) err.push('Skills');
  if (!experiences) err.push('Experiences');
  if (!structure) err.push('Structure');

  if (skillsLoading || experiencesLoading || strucntureLoading) {
    return <div>Loading...</div>;
  }

  if(err.length > 0){
    console.log(err);
    return Error({message: 'Error loading data: ' + err.join(', ')});
  }

  return (
  <div className="cv">
    <Header tagline={structure.tagline[language]} lang={language}/>
    <LanguageSelector language={language} setLanguage={setLanguage} />
    <div className="main-content">
      <div className="left-column">
        <Section title={structure.presentation[language]}>
          <p>
            {experiences.description[language]}
          </p>
        </Section>
        <Section title="Professional Experience">
          {experiences.experiences.map((experience, index) => (
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
