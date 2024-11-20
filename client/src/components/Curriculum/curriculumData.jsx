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
          {
            id: "01286120",
            title: "Elementary Systems Programming",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "This is an introductory course in systems programming using the Rust language. Emphasis is placed on developing the students’ abilities in the design and implementation of algorithms. The course describes the fundamentals of program design and implementation in Rust, variables and data types, input and output statements, conditional statements, loop statements, functions, modules, parameter passing, references and pointers, arrays and complex arrays, strings, files, memory, and ownership.",
          },
          {
            id: "01286121",
            title: "Computer Programming",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "This course provides an introduction to basic components of a computer and computer operation, an introduction to a programming language, basics of computer programming using structured and object-oriented approaches, data types, program structures, GUI (Graphical User Interface) programming, and some examples of computer programming to serve various purposes.",
          },
          {
            id: "96641009",
            title: "INTERCULTURAL COMMUNICATION SKILLS IN ENGLISH 1",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: " 3 (3-0-6)",
            description: "INTERCULTURAL COMMUNICATION SKILLS IN ENGLISH 1",
          },
          {
            id: "96642170 ",
            title: "Introduction to Logic",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: " 3 (3-0-6)",
            description: "-",
          },
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
          {
            id: "01006718",
            title: "Discrete Mathematics",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Basic set theory, theory and techniques of counting, properties of integers, mathematical induction, recursive definitions, recurrent equations, sequences and summations, relations, graphs, and trees",
          },
          {
            id: "01286112",
            title: "Digital System Fundamentals",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "Introduction to digital systems; binary systems; Boolean algebra and simplification; combinational circuit; sequential components, i.e., Latches, flip-flops, registers, and counters; sequential circuits; basic ALU (arithmetic and logic unit) and control unit; hardware description language.",
          },
          {
            id: "01286131",
            title: "Object-Oriented Programming",
            prerequisite:
              "01286121 Computer Programming of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "This course introduces the key concepts of object-oriented programming including objects and classes, encapsulation, abstraction, inheritances, polymorphism, as well as exception handling. Rather than the syntax of a particular programming language, the course emphasizes on how to think in term of objects. Students need to analyze program specifications and identify appropriate classes and objects. Additional programming topics include basic UML modelling such as class diagram and object diagram, principles of object-oriented design, and design patterns.",
          },
          {
            id: "96641010",
            title: "INTERCULTURAL COMMUNICATION SKILLS IN ENGLISH 2",
            prerequisite:
              "96641009 INTERCULTURAL COMMUNICATION SKILLS IN ENGLISH 1 of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description: "INTERCULTURAL COMMUNICATION SKILLS IN ENGLISH 2",
          },
        ],
      },
    ],
  },

  {
    year: "Year 2",
    semesters: [
      {
        semester: "Semester 1",
        courses: [
          {
            id: "01006730",
            title: "PROBABILITY MODELS AND DATA ANALYSIS",
            prerequisite:
              "01006710 Introduction to Calculus of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Combinatorial analysis, axioms of probability, conditional probability and independence, random variables, discrete random variables and probability distributions, continuous random variables and probability distributions, joint probability distributions and random samples, point estimation, statistical interval based on a single sample.",
          },
          {
            id: "01286213",
            title: "Computer Architecture and Organization",
            prerequisite:
              " 01286112 Digital System Fundamentals of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "Overview of computer architecture and organization; assembly programming and instruction set architecture; high-level software to low-level instructions; data representation; computer arithmetic; memory allocation and access; central processing unit; memory hierarchy; data transfer and input/output (I/O) techniques; measuring system performance. Additional topics include parallelism in computer architecture, and introduction to GPU.",
          },
          {
            id: "01286222",
            title: "Data Structures and Algorithms",
            prerequisite:
              "01286131 Object-Oriented Programming of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "Fundamental of solving problems using data structures including linked lists, trees, stacks, queues, hash tables, and graphs. Algorithms for sorting, searching, and other fundamental operations. Introduction to foundations for analysis of iterative and recursive algorithms. Implementation of selected algorithms using object-oriented paradigm.",
          },
          {
            id: "01286233",
            title: "Web Programming",
            prerequisite:
              " 01286131 Object-Oriented Programming of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "This course introduces the concepts of web programming and web applications development. The topics covered include basic construction of web page, HTML5, document object model (DOM), cascading style sheets (CSS), JavaScript, model-view-controller design, web framework, design concepts, as well as brief introduction to RESTful web services.",
          },
          {
            id: "96641007",
            title: "DIGITAL CITIZEN",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description: "-",
          },
        ],
      },
      {
        semester: "Semester 2",
        courses: [
          {
            id: "01006716",
            title: "Linear Algebra",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Matrices and system of linear equations; Solving system of linear equations; Vector spaces and subspaces; Orthogonality; Determinants; Eigenvalues and Eigenvectors; Linear transformation",
          },
          {
            id: "01286223",
            title: "Computer Networks",
            prerequisite:
              "01286222 Data Structures and Algorithms of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "Fundamental concepts and protocols in computer networks, particularly IP networks. Packet switching and circuit switching networks, layered network architectures. Application layer protocols, TCP/IP protocol suite, routing protocols, link layer protocols and multiple access networks. Wired and wireless local area network standards.",
          },
          {
            id: "01286228",
            title: "Algorithm Design and Analysis",
            prerequisite:
              "01286222 Data Structures and Algorithms of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course provides a study of theories and techniques of algorithm design and analysis. For algorithm design, students will study a wide range of algorithmic solutions to problems from various application areas, including searching, sorting, optimization, and important problems in graph theory. In addition, important design paradigms will be covered including greedy methods, divide-and-conquer methods, dynamic programming, backtracking, and branch-and-bound methods. For algorithm analysis, students will practice analyzing the execution time and the resource consumption of algorithms, and related mathematical techniques.",
          },
          {
            id: "01286232",
            title: "Software Engineering Principles",
            prerequisite:
              " 01286131 Object-Oriented Programming of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "This course is the study of important principles and concepts of software engineering, as well as an overview of software development processes. The topics include software development processes, requirement and specification of software, introduction to business process analysis and modelling, structured and object-oriented software analysis, design, and modelling, software verification and validation, software project management, software evolution and maintenance, and computer-aided software engineering (CASE) tools.",
          },
          {
            id: "01286241",
            title: "Database Systems",
            prerequisite:
              "01286222 Data Structures and Algorithms of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Database system concepts; files and databases; database system architecture; data entities and relationships; data modeling using Entity-Relation Diagrams and normalization technique; hierarchical; network and relational models of databases; query language and database language.",
          },
          {
            id: "01286391",
            title: "Seminar in Software Engineering",
            prerequisite:
              "01286222 Data Structures and Algorithms of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "0 (0-3-0)",
            description:
              "This course requires the students to attend seminars, lectures, and/or talks, given by invited speakers who are well-known in the software industry or in research and development in computing-related areas. The students are required to submit a written report summarizing what they have learned from each seminar.",
          },
          {
            id: "96642022",
            title: "PHILOSOPHY OF SCIENCE",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description: "-",
          },
        ],
      },
    ],
  },

  {
    year: "Year 3",
    semesters: [
      {
        semester: "Semester 1",
        courses: [
          {
            id: "01286324",
            title: "Operating Systems",
            prerequisite:
              "01286213 Computer Architecture and Organization of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Organization and structure of operating systems. Control, communication, and synchronization of concurrent processes. Processor and job scheduling. Memory organization and management including paging, segmentation, and virtual memory. Resource management. Deadlock avoidance, detection, recovery. File system concepts and structure. Protection and security. Distributed processing. A brief introduction to OS virtualization and cloud computing.",
          },
          {
            id: "01286326",
            title: "Theory of Computation",
            prerequisite:
              "01006718 Discrete Mathematics of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Finite automata, regular expressions, push-down automata, context free grammars, pumping lemmas, Turing machines, Time and space complexity measures, P and NP complete problems.",
          },
          {
            id: "01286334",
            title: "Software Design and Architecture",
            prerequisite:
              "01286232 Software Engineering Principles of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course introduces basic concepts and principles of software design and software architecture. It starts with discussion on design issues, followed by coverage on design patterns. It then gives an overview of architectural structures and styles. Practical approaches and methods for creating and analyzing software architecture are presented. The emphasis is on the interaction between quality attributes and software architecture. Students will also gain experiences with examples in design pattern application and case studies in software architecture.",
          },
          {
            id: "01286621",
            title: "(For Metaverse) Computer Graphics and Mixed Reality",
            prerequisite:
              "01006716 Linear Algebra of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "Overview of graphic systems; input-output devices; scan-conversion; two-dimensional transformations; translation; scaling; rotation; reflection; shearing; windowing concepts; clipping algorithms; window-to-viewport transformation; three-dimensional concepts; three-dimensional representations; three-dimensional transformations; three-dimensional viewing; hidden-surface and hidden-line removal; shading and color models; 3D worlds; computer graphic programming using OpenGL; introduction to Mixed Reality (MR), which includes Virtual Reality (VR) and Augmented Reality (AR); development of Metaverse web applications using WebGL Mixed Reality libraries or a Mixed Reality web framework.",
          },
          {
            id: "01286622",
            title:
              "(For Metaverse) Web Service Development and Service-Oriented Architecture",
            prerequisite:
              "01286233 Web Programming of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course provides a study of web service development and Service Oriented Architecture (SOA) with an introduction to microservices and cloud computing. The class focuses on the technical concepts of web services based on HTTP and REST protocols, and how to develop RESTful service APIs using a web-service platform available. The course also introduces students to microservices, SOA, and how to develop microservices on a SOA for service scalability using cloud computing platform available.",
          },
          {
            id: "01286622",
            title:
              "(For Industrial IoT) Web Service Development and Service-Oriented Architecture",
            prerequisite:
              "01286233 Web Programming of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course provides a study of web service development and Service Oriented Architecture (SOA) with an introduction to microservices and cloud computing. The class focuses on the technical concepts of web services based on HTTP and REST protocols, and how to develop RESTful service APIs using a web-service platform available. The course also introduces students to microservices, SOA, and how to develop microservices on a SOA for service scalability using cloud computing platform available.",
          },
          {
            id: "01286622",
            title:
              "(For Industrial IoT) Real-Time Embedded System Design and Development",
            prerequisite:
              "01286213 Computer Architecture and Organization of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "4 (3-3-8)",
            description:
              "Embedded systems are anywhere ranging from wearable devices, sensors, smart meters, drones, robots, and cars. This course provides a concrete study of real-time embedded system design and development. It covers the popular System-on-Chip (SoC) paradigm, real-time embedded system architectures, on-chip interconnects and memory systems, architectures of well-known embedded processors, such as ARM processors, models of computation and scheduling of embedded systems, multi-threading management, concepts of a real-time system, and finally metrics of embedded systems, i.e. performance, real-time characteristic, power consumption, reliability.For the system development part, the course covers the development lifecycle of a real-time embedded system. The purpose is to provide students with the knowledge and skills to design and develop a real-time embedded system. The course takes a requirement-driven design approach, where a functional specification is derived from a set of system requirements and then mapped into hardware and software components.",
          },
          {
            id: "01286661",
            title: "(For Artificial Intelligence) AI Programming",
            prerequisite:
              "01286222 Data Structures and Algorithms of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "1 (0-3-2)",
            description:
              "This course covers sessions of hand-on programming of AI systems. It includes Prolog programming and Python AI programming. For Prolog programming, the students learn Prolog syntax, Prolog interpreter, backtracking mechanism, how to debug Prolog programs, lists, recursion, cuts, and meta-programming. For Python AI programming, the students learn how to use popular several Python libraries for developing machine learning, data science, and data analytic applications.",
          },
          {
            id: "01286662",
            title: "(For Artificial Intelligence) Machine Learning",
            prerequisite:
              "01006730 PROBABILITY MODELS AND DATA ANALYSIS of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course provides a broad introduction to machine and statistical learning. Topics covered include supervised learning (generative/discriminative learning, parametric/non-parametric learning, neural networks, support vector machines); unsupervised learning (clustering, dimensionality reduction, recommender systems, deep learning); learning theory (bias/variance trade-offs; VC theory; large margins); reinforcement learning and adaptive control.",
          },
          {
            id: "01286663",
            title:
              "(For Artificial Intelligence) Data Science and Data Analytics",
            prerequisite:
              "01006730 PROBABILITY MODELS AND DATA ANALYSIS of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course introduces an overview of data science and their applications on software applications. The topics to be studied include the extraction of information from data, an overview of important data analysis techniques, data visualization, software tools for data science, and case studies of real-world problem-solving using data science.",
          },
        ],
      },
      {
        semester: "Semester 2",
        courses: [
          {
            id: "01286327",
            title: "Compiler Construction",
            prerequisite:
              "01286326 Theory of Computation of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course studies theories and concepts for constructing computer language translators. The topics include lexical analysis, syntax analysis, parser construction, syntax-directed translation, type checking, run-time environment handling, intermediate and machine code generation and code optimization, interpreter construction, together with case studies of compiler design and construction for some computer languages.",
          },
          {
            id: "01286335",
            title: "Software Development Process and Project Management",
            prerequisite:
              "01286232 Software Engineering Principles of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "A software development process is a set of activities, methods, and practices that are used in the production and maintenance process of software. This course is concerned with improving the processes used to develop and maintain high-quality software in a timely and economical manner. It covers the evolutions of different software development models and the currently popular and successful process models, for example, iterative software development (e.g. spiral models and the Rational Unified Process (RUP)), agile software development (e.g. Extreme Programming (XP), Agile Modeling (AM), Scrum, Crystal, Feature-Driven Development (FDD), and Incremental Funding Method (IFM)), Test-Driven Development (TDD), Personal Software Process (PSP), Team Software Process (TSP), and software maturity frameworks, such as the Capability Maturity Model (CMM).The course also covers software project management which includes estimating the effort in software projects, project planning and monitoring, costing and budgeting, risk management, testing strategies, and Quality assurance.",
          },
          {
            id: "01286336",
            title: "User Experience and User Interface Design",
            prerequisite:
              "01286233 Web Programming of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course provides a comprehensive overview of the user experience and user interface design process, and is intended to familiarize students with the methods, concepts, and techniques necessary to make user experience design an integral part of developing information interfaces. The course provides students with an opportunity to acquire the resources, skills, and hands-on experience they need to design, develop, and evaluate information interfaces from a user-centered design perspective.",
          },
          {
            id: "01286623",
            title: "(For Metaverse) Distributed Computing",
            prerequisite:
              "01286324 Operating Systems of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course covers a broad range of topics related to distributed systems, including distributed architectures, group communication, synchrony, clock synchronization, message ordering, mutual exclusion, distributed consensus, data replication, fault tolerance, and CAP theorem. Selected applications of distributed computing that are of current interest, such as distributed ledger technology and blockchains, are also studied.",
          },
          {
            id: "01286624",
            title: "(For Metaverse) Advanced Database Systems",
            prerequisite:
              "01286241 Database Systems of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Database management systems; structure and components; physical databases; access mechanisms; query processing; transaction processing; recovery control; concurrency control; distributed database systems; object-oriented databases; deductive databases.",
          },
          {
            id: "01286642",
            title:
              "(For Industrial IoT) Industrial IoT Networks and Communications",
            prerequisite:
              " 01286223 Computer Networks of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "With very limited memory and processing power as well as low energy consumption of IoT (Internet of Things) devices, their communication networks are so designed and developed to meet these constraints. This course will focus on widely industrial standards of computer networks and communications technologies developed specifically for industrial IoT devices, including network architectures and protocols layers.Another important topic covered by this course is network security for industrial IoT communication. It is the study how to make secure communications between industrial IoT devices by incorporating encryption into the communication protocol. Widely used encryption techniques are also studied.",
          },
          {
            id: "01286643",
            title:
              "(For Industrial IoT) Cyber-Physical Systems and Industry 4.0",
            prerequisite:
              "01286223 Computer Networks of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "We define any system that bridges the cyber-world of computing and communications with the physical world as cyber-physical systems (CPS). This course provides introduction to a CPS of an Industrial IoT system in a smart factory, and the concept of Digital Twin. As CPSs are the essential part of Industry 4.0, the course also provides introduction to Industry 4.0.In this course, the students study the foundation of factory automation, Programmable Logic Controllers (PLC), standard communication protocols for factory automation, and finally a SCADA (Supervisory Control And Data Acquisition) software, the software which is used to develop a CPS, in details with a hand-on case study of a real-world CPS for factory automation.",
          },
          {
            id: "01286664",
            title:
              "(For Artificial Intelligence) Knowledge Representation and Reasoning",
            prerequisite:
              "01286342 Artificial Intelligence of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course provides a comprehensive study of contemporary techniques and languages for knowledge representation and reasoning about knowledge. The course covers semantic modeling, e.g. semantic networks, conceptual graphs, ontology representation in Semantic Web, frame representation, rule-based representation, and logical representation, e.g. first-order logic, description logic, logic of actions and beliefs. For the reasoning about knowledge, the topics include abduction, deduction, induction, as well as reasoning about time, state, events, actions, and beliefs.",
          },
          {
            id: "01286665",
            title: "(For Artificial Intelligence) Deep Learning",
            prerequisite:
              "01286662 Machine Learning of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Types of learning; Linear classification with perceptron; Basic optimization with gradient descent; Fully connected neural network; Loss function; Back-propagation algorithm; Convolutional neural network.",
          },
          {
            id: "01286990",
            title: "Team Software Project",
            prerequisite:
              "01286232 Software Engineering Principles of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (0-9-5)",
            description:
              "This is a software engineering project course in which the students work as a team to develop software and hardware according to the requirements provided by users. The students will learn to integrate their knowledge and skills to perform each phase of software (or system) development, including requirement analysis, modeling, design, implementation, and testing, in order to obtain the required software (or system), whose topic is decided by the advisor(s) or by the students themselves. In addition, the students must adopt relevant software development models as well as apply relevant project management methodologies for conducting and managing their team project.",
          },
        ],
      },
    ],
  },

  {
    year: "Year 4",
    semesters: [
      {
        semester: "Semester 1",
        courses: [
          {
            id: "01286325",
            title: "Information and Computer Security",
            prerequisite:
              "01286223 Computer Networks of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "Overview of theories, principles, and knowledge in information security; Risk management, Access control; Encryption and Decryption; Physical security; Security architecture; Business continuity plan; Application security; Operating system and Service platform protections; Threats and Malwares; Basis of network security; Privacy, Ethical, and Legal issues.",
          },
          {
            id: "012866__",
            title: "Major Elective for Track 1",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "3 (x-x-x)",
            description: "-",
          },
          {
            id: "01286991",
            title: "Software Engineering Project 1",
            prerequisite:
              "01286232 Software Engineering Principles of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (0-9-5)",
            description:
              "This course is the first half of the senior project. In this course, the students will conduct their independent study, research and development of computer software and hardware using software engineering methodology according to their specialized track. The students will be guided by their project advisor(s) to conduct research and software (or system) development with the aim that they can develop their own original work with their creativity and problem solving skills.There is also an option for “industrial (software engineering) project” topics, to propose by project advisor(s) in order for the students and the advisor(s) to do a (software engineering) project according to their specialized track with companies, which the students can alternatively choose.The required project progress report must be submitted during the middle of the semester; and the entire project result of the semester will be presented to the examination committee at the end of the semester, where the project quality will be evaluated collectively for a team as well as be evaluated separately for each team member.",
          },
        ],
      },
      {
        semester: "Semester 2",
        courses: [
          {
            id: "01286337",
            title: " Software Verification and Validation",
            prerequisite:
              "01286232 Software Engineering Principles of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description:
              "This course studies three important methods for software verification and validation: testing, peer reviews, and formal verification, with emphasis on testing. Topics on testing include the necessity and limitations of testing, an overview of test processes, testing throughout the software development life cycle, unit testing, test design techniques, test automation, tool support for testing, and test management. The course will study how software peer reviews, which can help detect and prevent software defects, are carried out in practice and study the inspection processes throughout the software development life cycle, including the inspection of requirement documents, design documents, code, and test plans. The course will also provide a basic understanding of formal verification techniques, such as Hoare Logic and model checking.",
          },
          {
            id: "01286992",
            title: "Software Engineering Project 2",
            prerequisite:
              "01286991 Software Engineering Project 1 of Software-Engineering-2024 by",
            program: "Software Engineering - 2024",
            credit: "3 (0-9-5)",
            description:
              " This course is the continuation of Software Engineering Project 1. In this course, the students will conduct their independent study, research and development of computer software and hardware using software engineering methodology. The students will be guided by their project advisor(s) to conduct research and software (or system) development with the aim that they can develop their own original work with their creativity and problem solving skills.The required thesis must be submitted during the middle of the semester; and the entire project result of the two semesters will be presented to the examination committee at the end of the semester, where the project quality will be evaluated collectively for a team as well as be evaluated separately for each team member.",
          },
          {
            id: "96642037",
            title: "Professional Skills and Issues",
            prerequisite: "None",
            program: "Software Engineering - 2024",
            credit: "3 (3-0-6)",
            description: "-",
          },
        ],
      },
    ],
  },
];
