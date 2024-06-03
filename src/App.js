import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

const Header = ({ tagline, lang }) => (
  <header className="header">
    <div className="header-content">
      <div className="left-column-header">
        <h1>Francesco Dondi</h1>
        <p className="tagline">{tagline}</p>
        <p><a href={'https://github.com/Fdondi/cv-latex/blob/main/cv_' + lang + '.pdf'}>Latest version of this CV</a></p>
      </div>
      <div className="right-column-header">
        <div className="contact-info">
          <p><i className="fas fa-envelope"></i> <a href="mailto:francesco314@gmail.com">francesco314@gmail.com</a></p>
          <p><i className="fas fa-phone"></i> +41 76 456 50 32</p>
          <p><i className="fab fa-linkedin"></i> <a href="https://linkedin.com/in/francesco-dondi">francesco-dondi</a></p>
          <p><i className="fab fa-github"></i> <a href="https://github.com/Fdondi">Fdondi</a></p>
          <p>Zugerstarsse 66, 8810 Horgen, ZH</p>
          <p>Born: 29/10/1990</p>
          <p>Citizenship: Italian, C permit</p>
          <p>Marital Status: Married, no children</p>
        </div>
        <img src="/cv-react/data/me.jpg" alt="Francesco Dondi" className="photo" />
      </div>
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
  
  const TwoColumnLayout = ({ leftContent, rightContent }) => {
    return (
      <div className="main-content">
        <div className="left-column">
          {leftContent}
        </div>
        <div className="right-column">
          {rightContent}
        </div>
      </div>
    );
  };

  const FormalEducation = (educationData) => {

    return (
      <div>
        {educationData.data.map((education, index) => (
          <EducationItem
            key={index}
            date={education.date}
            title={education.title}
            institution={education.institution}
            additional={education.additional}
            link={education.link}
          />
        ))}
      </div>
    );
  };
  
  const EducationItem = ({ date, title, institution, additional, link }) => (
    <div>
        <h6> {link ? <a href={link} target="_blank" rel="noopener noreferrer">{title}</a> : title} </h6>
        {institution}
        <i>{date}</i>
        {additional && <i>{additional}</i>}
        </div>
  );

 const ContinuousLearning = (courseKinds) => (
<>
    {courseKinds.data.map((courseCategory, index) => (
    <SubSection key={index} {...courseCategory} />
    ))}
</>
);

function SubSection({ title, courses, skills }){
  console.log( "Helloo!");
  const courseElements = 
    courses.map((course, index) => (
      <CourseItem key={index} {...course} />
    ));

  const skillElements = 
    skills.map((skill, index) => (
      <Skill key={index} {...skill} />
    ));

  return  ( <section>
  <h3>{title}</h3>
  <TwoColumnLayout leftContent={courseElements} rightContent={skillElements} />
</section> );
}

const CourseItem = ({ date, title, provider }) => (
 <p>
    <b>{title}</b> - {provider} - <i>{date}</i>
</p>
);
  
  const Projects = () => (
     "Add each project item here"
  );
  
  const Competitions = () => (
    "Add each competition item here"
  );
  
  const Personal = () => (
    <>
      <h5>Hobbies:</h5>
      Read, hike, bike, swim.
    </>
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
  const { data: education, loading: educationLoading } = useFetch(`/cv-react/data/education.json`, null);
  const { data: courses, loading: coursesLoading } = useFetch(`/cv-react/data/courses.json`, null);

  const err = [];
  if (!skills) err.push('Skills');
  if (!experiences) err.push('Experiences');
  if (!structure) err.push('Structure');
  if (!courses) err.push('Courses');
  if (!education) err.push('Education');

  if (skillsLoading || experiencesLoading || strucntureLoading || coursesLoading || educationLoading) {
    return <div>Loading...</div>;
  }

  if(err.length > 0){
    console.log(err);
    return Error({message: 'Error loading data: ' + err.join(', ')});
  }

  const presentationAndExperience = (
    <>
      <Section title={structure.presentation[language]}>
        <p>{experiences.description[language]}</p>
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
    </>
  );

  const professionalSkills = (
    <>
      {Object.keys(skills).map((section, index) => (
        <Section key={index} title={section}>
          {skills[section].map((skill, idx) => (
            <Skill key={idx} name={skill.name} level={skill.level} />
          ))}
        </Section>
      ))}
    </>
  );

  return (
  <div className="cv">
    <Header tagline={structure.tagline[language]} lang={language}/>
    <LanguageSelector language={language} setLanguage={setLanguage} />
    <TwoColumnLayout leftContent={presentationAndExperience} rightContent={professionalSkills} />
    <Section title="Formal Education"> <FormalEducation data={education}/> </Section>
    <Section title="Continuous Learning"><ContinuousLearning data={courses} /></Section>
    <Section title="Projects"><Projects /></Section>
    <TwoColumnLayout leftContent={<Competitions />} rightContent={<Personal />} />
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
