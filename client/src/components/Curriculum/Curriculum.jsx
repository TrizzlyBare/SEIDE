import React, { useState } from "react";
import {
  CurriculumContainer,
  Header,
  SubHeader,
  Paragraph,
  Image,
  CourseContainer,
  SemesterContainer,
  CourseTitle,
  CourseDetails,
  DescriptionButton,
  ImageWrapper,
} from "./CurriculumStyle";
import { curriculumData } from "./curriculumData";

const Curriculum = () => {
  const [expandedCourse, setExpandedCourse] = useState(null);

  const toggleDescription = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <CurriculumContainer>
      <Header>B.Eng. in Software Engineering Program</Header>
      <Paragraph>
        The B.Eng. in Software Engineering Program is a 4-year undergraduate
        program aiming at producing graduates who are capable of working
        confidently in the international software industry as well as pursuing
        postgraduate study and research in leading universities worldwide. The
        curriculum of the program is designed in accordance with the recent
        ACM/IEEE guideline for undergraduate curriculum in software engineering.
      </Paragraph>
      <SubHeader style={{ textAlign: "center" }}>
        Curriculum Overview - Study Plans
      </SubHeader>
      <ImageWrapper>
        <Image src="/images/curriculum.jpg" alt="Program Overview" />
      </ImageWrapper>
      <SubHeader style={{ textDecoration: "underline" }}>
        Year 1 and Year 2
      </SubHeader>
      <Paragraph>
        In the first two years, the students will study basic courses in
        mathematics, computer science, and software engineering and develop
        their programming skills using various programming languages (including
        Python, C, C++, Java, etc.). Also, the students will be trained to
        communicate correctly and effectively. At the end of Year 2, every
        student is required to undertake an internship in a software company for
        8 - 10 weeks. All the courses in the first two years will be held at the
        International College in the Bangkok Campus of KMITL.
      </Paragraph>
      <SubHeader style={{ textDecoration: "underline" }}>
        Year 3 and Year 4
      </SubHeader>
      <Paragraph>
        In Year 3 and Year 4, the students will learn advanced topics in
        software engineering and important software development methodologies
        that are used in practice. The students will have opportunities to the
        apply the knowledge and skills they have acquired to conduct a team
        software project in Year 3 and a one-year research project in Year 4.
        Students entering Year 3 are required to take one of the following
        specializations:
        <ol>
          <li>
            Metaverse Software Engineering - Specializing in large and complex
            software for enterprises and digital transformation.
          </li>
          <li>
            Industrial Internet of Things - Specializing in the Internet of
            Things, including embedded and mobile systems.
          </li>
          <li>
            Artificial Intelligence - Specializing in applications of artificial
            intelligence and data science, including machine learning and Big
            Data.
          </li>
        </ol>
        The study plans for these three specializations differ in some required
        courses. Also the students are recommended to work on their senior
        projects that utilize the knowledge of their respective specializations.
      </Paragraph>
      <SubHeader style={{ textDecoration: "underline" }}>
        Year 3 and Year 4 (KMITL-Glasgow Double-Degree Program)
      </SubHeader>
      <Paragraph>
        The students joining the KMITL-Glasgow Double-Degree Program will take
        courses in Years 3 and 4 in the Software Engineering program at the
        School of Computing Science, University of Glasgow.
      </Paragraph>
      <SubHeader style={{ textDecoration: "underline" }}>
        Year 3 and Year 4 (KMITL-Queensland Double-Degree Program)
      </SubHeader>
      <Paragraph>
        The students joining the KMITL-Queensland Double-Degree Program will
        take courses in Years 3 and 4 in Software Engineering Program at the
        Faculty of Engineering, Architecture and Information Technology,
        University of Queensland.
      </Paragraph>

      {curriculumData.map((year) => (
        <div key={year.year}>
          <SubHeader>{year.year}</SubHeader>
          <CourseContainer>
            {year.semesters.map((semester) => (
              <SemesterContainer key={semester.semester}>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#333",
                    textAlign: "center",
                  }}
                >
                  {semester.semester}
                </h3>
                {semester.courses.map((course) => (
                  <div key={course.id}>
                    <CourseTitle
                      onClick={() => toggleDescription(course.id)}
                      style={{
                        cursor: "pointer",
                        textDecoration:
                          expandedCourse === course.id ? "underline" : "none",
                      }}
                    >
                      {course.title}
                    </CourseTitle>
                    <CourseDetails>
                      <strong>Prerequisite:</strong> {course.prerequisite}
                      <br />
                      <strong>Program:</strong> {course.program}
                      <br />
                      <strong>Subject Credit:</strong> {course.credit}
                    </CourseDetails>
                    {expandedCourse === course.id && (
                      <Paragraph>
                        <strong>Description:</strong> {course.description}
                      </Paragraph>
                    )}
                  </div>
                ))}
              </SemesterContainer>
            ))}
          </CourseContainer>
        </div>
      ))}
    </CurriculumContainer>
  );
};

export default Curriculum;
