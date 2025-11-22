document.addEventListener('DOMContentLoaded', () => {
    const bootSequence = document.getElementById('boot-sequence');
    const mainContent = document.getElementById('main-content');
    const terminalBody = document.getElementById('terminal-body');
    const userInput = document.getElementById('user-input');

    // Boot Sequence Lines
    const bootLines = [
        "Initializing kernel...",
        "Loading modules...",
        "Mounting file systems...",
        "Checking memory... OK",
        "Loading interface... OK",
        "Starting user session...",
        "Welcome, user."
    ];

    let lineIndex = 0;

    function runBootSequence() {
        if (lineIndex < bootLines.length) {
            const line = document.createElement('div');
            line.classList.add('boot-line');
            line.textContent = `[OK] ${bootLines[lineIndex]}`;
            bootSequence.appendChild(line);
            lineIndex++;
            setTimeout(runBootSequence, 300); // Delay between lines
        } else {
            setTimeout(() => {
                bootSequence.style.display = 'none';
                mainContent.classList.remove('hidden');
                userInput.focus();
            }, 800);
        }
    }

    // Start Boot
    runBootSequence();

    // Command Line Interaction
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = userInput.value.trim().toLowerCase();
            handleCommand(command);
            userInput.value = '';
        }
    });

    const fileContents = {
        'bio.txt': `
> Arindom Aich
> Software Development Engineer
> Passionate about building scalable backend solutions.
> Java | Spring Boot | React | Docker | Cloud Computing
        `,
        'work_experience.log': `
[ Sept 2024 - Present ] Software Development Engineer - 1 @ Octopi Labs
> Backend solutions, Java, Spring Boot, Hibernate, MySQL, Docker, React.
> Projects: Caremax, Gasolina, Resonance.

[ Mar 2024 - Aug 2024 ] Software Development Intern @ Octopi Labs
> Backend solutions, Java, Spring Boot, Hibernate, MySQL, Docker, React.
> Project: Rent-savvy.

[ July 2023 - Aug 2023 ] Intern @ C-DAC Pune
> 5G simulation, OpenG5G, UERANSIM, Python, Ubuntu.
> Project: Advancements in 5G simulation.

[ Apr 2023 - June 2023 ] Web Development Intern @ Navalogy Club
> IoMT applications, React, Redux Toolkit.
> Project: Ensuring QoS in IoMT.
        `,
        'education.txt': `
Tezpur University
├── B.Tech in CSE (Nov 2020 - June 2024)
└── CGPA: 8.04

Higher Secondary, AHSEC
├── Nagaon, Assam (June 2017 - June 2019)
└── 79.20%

Sankardev Sishu/Vidya Niketan
├── HSLC, SEBA (Jan 2005 - May 2017)
└── 88.83%
        `,
        'skills_output': `
Languages:
[####################] Java
[################----] JavaScript/TS
[###############-----] Python
[##############------] C/C++
[#############-------] SQL

Frameworks:
Spring Boot, Hibernate, React, Redux, Flask, LangChain

Tools:
MySQL, Docker, ChromaDB, Streamlit, SQLite, Apache Cassandra
        `,
        'projects_output': `
[ Ensuring QoS in IoMT ]
> MeitY funded project using SDN.
> Stack: React, TS, Redux, MySQL, Python, Cassandra

[ Speaker Identification ]
> Machine Learning based speaker recognition.
> Stack: Python, ML

[ IoMT Hospital Network ]
> Patent published system for hospital networks.
> Stack: Networking, IoT, Cloud

[ BrainBox ]
> Idea Presentation - 2nd Position.
> Stack: Innovation
        `,
        'contact_info': `
Email: arindom.aich@example.com
LinkedIn: linkedin.com/in/arindom-aich
GitHub: github.com/arindomaich
        `
    };

    function handleCommand(cmd) {
        const outputDiv = document.createElement('div');
        outputDiv.innerHTML = `<span class="prompt">user@visitor:~$</span> <span class="command">${cmd}</span>`;

        // Insert before the input line
        userInput.parentElement.before(outputDiv);

        let response = '';

        switch (cmd) {
            case 'help':
                response = `
                    Available commands:
                    - cat bio.txt: View bio
                    - cat work_experience.log: View experience
                    - ./list_projects.sh: View projects
                    - grep -r "Skills" .: View skills
                    - cat education.txt: View education
                    - ./contact_me.sh: View contact info
                    - clear: Clear terminal
                    - ls: List files
                    
                    Shortcuts (Scroll):
                    - about, experience, projects, skills, education, contact
                `;
                break;
            case 'clear':
                // Remove all previous command outputs (except main content)
                const dynamicOutputs = document.querySelectorAll('.terminal-body > div:not(#boot-sequence):not(#main-content):not(.interactive-line)');
                dynamicOutputs.forEach(el => el.remove());
                return; // Exit early
            case 'ls':
            case 'ls -l':
            case 'll':
                response = `
                    total 42
                    -rw-r--r--  1 user  staff   4096 Nov 21 10:00 bio.txt
                    -rw-r--r--  1 user  staff   8192 Nov 21 10:00 work_experience.log
                    -rwxr-xr-x  1 user  staff   2048 Nov 21 10:00 list_projects.sh
                    drwxr-xr-x  2 user  staff    128 Nov 21 10:00 skills
                    -rw-r--r--  1 user  staff   1024 Nov 21 10:00 education.txt
                    -rwxr-xr-x  1 user  staff    512 Nov 21 10:00 contact_me.sh
                `;
                break;

            // File Content Commands
            case 'cat bio.txt':
                response = fileContents['bio.txt'];
                break;
            case 'cat work_experience.log':
                response = fileContents['work_experience.log'];
                break;
            case 'cat education.txt':
                response = fileContents['education.txt'];
                break;
            case './list_projects.sh':
            case 'list_projects.sh':
                response = "Executing ./list_projects.sh...\n" + fileContents['projects_output'];
                break;
            case 'grep -r "skills" .':
            case 'grep -r "Skills" .':
                response = fileContents['skills_output'];
                break;
            case './contact_me.sh':
            case 'contact_me.sh':
                response = fileContents['contact_info'];
                break;

            // Navigation Shortcuts
            case 'about':
            case 'whoami':
                document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
                response = "Navigating to About section...";
                break;
            case 'experience':
                document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
                response = "Navigating to Experience section...";
                break;
            case 'projects':
                document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                response = "Navigating to Projects section...";
                break;
            case 'skills':
                document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
                response = "Navigating to Skills section...";
                break;
            case 'education':
                document.getElementById('education').scrollIntoView({ behavior: 'smooth' });
                response = "Navigating to Education section...";
                break;
            case 'contact':
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                response = "Navigating to Contact section...";
                break;
            case '':
                break;
            default:
                response = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }

        if (response) {
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('output');
            responseDiv.classList.add('text-output');
            responseDiv.style.marginBottom = '10px';
            responseDiv.innerText = response;
            userInput.parentElement.before(responseDiv);
        }

        // Auto scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Keep focus on input
    document.addEventListener('click', () => {
        userInput.focus();
    });
});
