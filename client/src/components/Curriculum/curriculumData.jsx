export const curriculumData = [
  {
    year: "Year 1",
    semesters: [
      {
        semester: "Semester 1",
        courses: [
          {
            id: "01006710",
            title: "Introduction to Calculus",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Functions, limits, continuity and their applications, Mathematical induction, Introduction to derivative, Differentiation, Applications of derivative, Definite integrals, Antiderivative integration, Application of definite integral, Indeterminate forms, Improper integrals, Numerical integration, Sequences and series of numbers, Taylor series expansions of elementary functions.",
          },
          {
            id: "01286111",
            title: "Circuits and Electronics",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "Fundamentals of electric circuits: Ohm's law, Kirchhoff's law, Thevenin's and Norton's theorems, superposition, capacitor, Inductor. Semiconductor devices, device current-voltage and frequency characteristics, P-N junction, diode circuits, analysis, and design of BJT and MOS transistor circuits, operational amplifier, and its applications.",
          },
          // Add more courses for Semester 1
        ],
      },
      {
        semester: "Semester 2",
        courses: [
          {
            id: "01006717",
            title: "Differential Equations",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Linear differential equations, methods of solutions, Laplace transform, systems of differential equations, applications in engineering.",
          },
          // Add more courses for Semester 2
        ],
      },
    ],
  },
  // Add Year 2, Year 3, Year 4 similarly
];
