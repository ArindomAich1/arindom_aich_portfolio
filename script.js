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

                // Start at the top
                terminalBody.scrollTop = 0;

                // Scroll settings
                const scrollSpeed = 20; // pixels per tick
                const scrollDelay = 5; // ms per tick
                const initialDelay = 1000; // ms to wait before starting scroll

                // Wait 1 second, then start auto-scroll
                setTimeout(() => {
                    const autoScroll = setInterval(() => {
                        // Check if reached bottom
                        if (Math.ceil(terminalBody.scrollTop + terminalBody.clientHeight) >= terminalBody.scrollHeight) {
                            clearInterval(autoScroll);
                            userInput.focus();
                        } else {
                            terminalBody.scrollTop += scrollSpeed;
                        }
                    }, scrollDelay);

                    // Stop scrolling on user interaction
                    const stopScroll = () => clearInterval(autoScroll);
                    terminalBody.addEventListener('wheel', stopScroll);
                    terminalBody.addEventListener('touchstart', stopScroll);
                    terminalBody.addEventListener('keydown', stopScroll);
                    terminalBody.addEventListener('mousedown', stopScroll);
                }, initialDelay);

            }, 800);
        }
    }

    // Start Boot
    runBootSequence();

    const availableCommands = [
        'help', 'clear', 'ls', 'ls -l', 'll',
        'cat bio.txt', 'cat work_experience.log', 'cat education.txt',
        './list_projects.sh', 'list_projects.sh', 'cat achievements.txt',
        'grep -r "skills" .', 'grep -r "Skills" .', 'grep -r skills', 'grep -r Skills', 'skills',
        './contact_me.sh', 'contact_me.sh',
        'about', 'whoami', 'experience', 'projects', 'achievements', 'education', 'contact'
    ];

    // Command Line Interaction
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = userInput.value.trim();
            handleCommand(command); // handleCommand handles case insensitivity for command matching, but we pass raw for now
            userInput.value = '';
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const currentInput = userInput.value.toLowerCase();
            if (currentInput) {
                const matches = availableCommands.filter(cmd => cmd.toLowerCase().startsWith(currentInput));
                if (matches.length === 1) {
                    userInput.value = matches[0];
                } else if (matches.length > 1) {
                    // Find common prefix
                    const commonPrefix = matches.reduce((a, b) => {
                        let i = 0;
                        while (i < a.length && i < b.length && a[i] === b[i]) i++;
                        return a.substring(0, i);
                    });
                    userInput.value = commonPrefix;
                }
            }
        }
    });

    const fileContents = {
        'bio.txt': `
> Arindom Aich
> Software Development Engineer
> Passionate about building scalable tech solutions.
> Java | Spring Boot | GenAI | Python | JS/TS | React | Docker | Cloud Computing
        `,
        'work_experience.log': `
[ Sept 2024 - Present ] Software Development Engineer - 1 @ Octopi Labs
> Backend solutions, Java, Spring Boot, Hibernate, MySQL, Docker, React.
> Projects: aiRen, Coremax, Gasolina, Resonance.

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

Ramanujan Jr. College
├── Higher Secondary, AHSEC (June 2017 - June 2019)
└── 79.20%

Sankardev Sishu/Vidya Niketan
├── HSLC, SEBA (Jan 2005 - May 2017)
└── 88.83%
        `,
        'skills_output': `
Languages:
[##################--] Java
[################----] SQL
[################----] Python
[##############------] C/C++
[###########---------] JavaScript/TS
[###########---------] Matlab
[#######-------------] Assembly(x86)

Frameworks:
Spring Boot, Hibernate, Flask, FastAPI, LangChain, React, Redux

Tools:
MySQL, Docker, ChromaDB, Streamlit, SQLite, Apache Cassandra, And many more new age AI tools...
        `,
        'projects_output': `
[ aiRen ]
> AI based fashion eCommaerce platform with Persionalized stylists and virtual tryons
> Stack: Python, AI/ML, MongoDB, Flask, Java, Springboot, LLMs, MySQL

[ Ensuring QoS in IoMT ]
> MeitY funded project using SDN.
> Stack: React, TS, Redux, MySQL, Python, Cassandra

[ Speaker Identification ]
> Machine Learning based speaker recognition.
> Stack: Python, ML
        `,
        'achievements.txt': `
GATE CS (2024) Qualified
> <a href="https://drive.google.com/file/d/1vrP5sSSHwvz19G47c0RgR_5rguHnfhyR/view" target="_blank" class="social-link">Scorecard</a>

Patent Published:
> "IoMT based hospital network system with openflow QoS support and Cloud/FOG offloading"
> Application No: 202331068011
        `,
        'contact_info': `
Email: arindomaich2@gmail.com
LinkedIn: linkedin.com/in/arindomaich
GitHub: github.com/ArindomAich1
        `
    };

    function handleCommand(cmd) {
        const outputDiv = document.createElement('div');
        // Escape cmd to prevent XSS in the command echo
        const escapedCmd = cmd.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        outputDiv.innerHTML = `<span class="prompt">user@visitor:~$</span> <span class="command">${escapedCmd}</span>`;

        // Insert before the input line
        userInput.parentElement.before(outputDiv);

        let shouldScrollToBottom = true;
        let response = '';
        let useHTML = false;

        switch (cmd) {
            case 'help':
                response = `
                    Available commands:
                    - cat bio.txt: View bio
                    - cat work_experience.log: View experience
                    - ./list_projects.sh: View projects
                    - cat achievements.txt: View achievements
                    - grep -r "skills" .: View skills
                    - cat education.txt: View education
                    - ./contact_me.sh: View contact info
                    - clear: Clear terminal
                    - ls: List files
                    
                    Shortcuts (Scroll):
                    - about, experience, projects, achievements, skills, education, contact
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
                    -rw-r--r--  1 user  staff   1024 Nov 21 10:00 achievements.txt
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
            case 'cat achievements.txt':
                response = fileContents['achievements.txt'];
                useHTML = true;
                break;
            case 'grep -r "skills" .':
            case 'grep -r "Skills" .':
            case 'grep -r skills':
            case 'grep -r Skills':
            case 'skills':
                response = fileContents['skills_output'];
                break;
            case './contact_me.sh':
            case 'contact_me.sh':
                response = fileContents['contact_info'];
                break;

            // Navigation Shortcuts
            case 'about':
            case 'whoami':
                setTimeout(() => document.getElementById('hero').scrollIntoView({ behavior: 'smooth' }), 100);
                response = "Navigating to About section...";
                shouldScrollToBottom = false;
                break;
            case 'experience':
                setTimeout(() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' }), 100);
                response = "Navigating to Experience section...";
                shouldScrollToBottom = false;
                break;
            case 'projects':
                setTimeout(() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }), 100);
                response = "Navigating to Projects section...";
                shouldScrollToBottom = false;
                break;
            case 'achievements':
                setTimeout(() => document.getElementById('achievements').scrollIntoView({ behavior: 'smooth' }), 100);
                response = "Navigating to Achievements section...";
                shouldScrollToBottom = false;
                break;
            case 'skills':
                setTimeout(() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' }), 100);
                response = "Navigating to Skills section...";
                shouldScrollToBottom = false;
                break;
            case 'education':
                setTimeout(() => document.getElementById('education').scrollIntoView({ behavior: 'smooth' }), 100);
                response = "Navigating to Education section...";
                shouldScrollToBottom = false;
                break;
            case 'contact':
                setTimeout(() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }), 100);
                response = "Navigating to Contact section...";
                shouldScrollToBottom = false;
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
            if (useHTML) {
                responseDiv.innerHTML = response;
            } else {
                responseDiv.innerText = response;
            }
            userInput.parentElement.before(responseDiv);
        }

        // Auto scroll to bottom only if not navigating
        if (shouldScrollToBottom) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    // Keep focus on input, but allow clicking on other inputs/links
    document.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
            userInput.focus({ preventScroll: true });
        }
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

            window.location.href = `mailto:arindomaich2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Optional: Show success message in terminal
            const outputDiv = document.createElement('div');
            outputDiv.classList.add('output');
            outputDiv.classList.add('text-output');
            outputDiv.style.marginBottom = '10px';
            outputDiv.innerText = "Opening email client...";
            userInput.parentElement.before(outputDiv);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        });

        // Handle button click manually if needed (though type="submit" should handle it)
        const sendBtn = contactForm.querySelector('button');
        sendBtn.addEventListener('click', () => {
            contactForm.dispatchEvent(new Event('submit'));
        });
    }

    // Custom block cursor positioning
    const blockCursor = document.querySelector('.block-cursor');
    const updateCursorPosition = () => {
        const text = userInput.value.substring(0, userInput.selectionStart);

        // Create a temporary span to measure text width
        const tempSpan = document.createElement('span');
        tempSpan.style.cssText = `
            position: absolute;
            visibility: hidden;
            font: ${window.getComputedStyle(userInput).font};
            white-space: pre;
        `;
        tempSpan.textContent = text || '\u200B'; // Zero-width space if empty
        document.body.appendChild(tempSpan);

        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        // Position cursor relative to input's parent
        const promptWidth = userInput.previousElementSibling.offsetWidth + 15; // prompt width + margin
        blockCursor.style.left = `${promptWidth + textWidth}px`;
    };

    // Update cursor position on various events
    userInput.addEventListener('input', updateCursorPosition);
    userInput.addEventListener('click', updateCursorPosition);
    userInput.addEventListener('keyup', updateCursorPosition);
    userInput.addEventListener('focus', updateCursorPosition);

    // Initial position
    setTimeout(updateCursorPosition, 100);
});
