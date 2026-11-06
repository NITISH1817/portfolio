import * as THREE from 'three/webgpu'

const text = `
 _   _ _____ _____ _____ ____  _   _   ____  ____  ______   ___    _   _ 
| \\ | |_   _|_   _|_   _/ ___|| | | | |  _ \\|  _ \\|_ _| \\ / / \\  | \\ | |
|  \\| | | |   | |   | | \\___ \\| |_| | | |_) | |_) || | \\ V / _ \\ |  \\| |
| |\\  | | |   | |   | |  ___) |  _  | |  __/|  _ < | |  | / ___ \\| |\\  |
|_| \\_| |_|   |_|   |_| |____/|_| |_| |_|   |_| \\_\\___| |_/_/   \\_\\_| \\_|
                                                                        
╔═ Developer ═══════════════════════════════════════════════════════════╗
║ Nitish Priyan R S
║ Software Engineer | Java Developer | AI/ML Engineer
║ Building intelligent software, AI systems and interactive digital experiences.
║ Bannari Amman Institute of Technology (B.E. CSE, Batch 2028 | CGPA: 7.8)
║ Location: Tamil Nadu, India | Phone: +91 9442497220
╚═══════════════════════════════════════════════════════════════════════╝

╔═ Verified Credentials & Achievements ═════════════════════════════════╗
║ • Oracle Certified Associate: Java SE 17 Developer
║ • AWS Cloud Practitioner Essentials — AWS
║ • Introduction to Cybersecurity — Cisco Networking Academy
║ • 250+ DSA Problems Solved in Java (LeetCode)
║ • Selected Participant, Smart India Hackathon (SIH 2025)
║ • Patent Filed: GovScheme Hybrid Eligibility Decision Engine & Platform
╚═══════════════════════════════════════════════════════════════════════╝

╔═ Flagship Production Projects ════════════════════════════════════════╗
║ 1. GOVSCHEME (Patent Filed)
║    AI Welfare Discovery & Lifecycle Platform | Sub-50ms Eligibility
║ 2. NEXORA
║    AI-Powered Campus Digital Twin | 129/129 Passing Tests
║ 3. STUDENT PERFORMANCE MLOPS
║    MLOps Decision Support System | 89.1% Accuracy, 82.6% Recall
╚═══════════════════════════════════════════════════════════════════════╝

╔═ Contact & Socials ═══════════════════════════════════════════════════╗
║ Mail     ⇒ nitishpriyan1807@gmail.com
║ GitHub   ⇒ https://github.com/NITISH1817
║ LinkedIn ⇒ https://www.linkedin.com/in/nitish-priyan/
║ LeetCode ⇒ https://leetcode.com/u/NITISH1817/
║ Resume   ⇒ /resume/Nitish_Priyan_Resume_Blue.pdf
╚═══════════════════════════════════════════════════════════════════════╝

╔═ Engine Attribution ══════════════════════════════════════════════════╗
║ Built on the open-source Folio 2025 engine by Bruno Simon (MIT License)
║ https://github.com/brunosimon/folio-2025
║ Three.js Release: ${THREE.REVISION} with TSL WebGPU/WebGL
║ Rapier3D Physics Engine (WASM)
║ Music CC0 by Kounine
╚═══════════════════════════════════════════════════════════════════════╝

╔═ Some more links ═════════════════════════════════════════════════════╗
║ Rapier (Physics library)  ⇒ https://rapier.rs/
║ Howler.js (Audio library) ⇒ https://howlerjs.com/
║ Amatic SC (Fonts)         ⇒ https://fonts.google.com/specimen/Amatic+SC
║ Nunito (Fonts)            ⇒ https://fonts.google.com/specimen/Nunito?query=Nunito
╚═══════════════════════════════════════════════════════════════════════╝
`

let finalText = ''
let finalStyles = []
const stylesSet = {
    letter: 'color: #ffffff; font: 400 1em monospace;',
    pipe: 'color: #D66FFF; font: 400 1em monospace;',
}
let currentStyle = null
for(let i = 0; i < text.length; i++)
{
    const char = text[i]

    const style = char.match(/[╔║═╗╚╝╔╝]/) ? 'pipe' : 'letter'
    if(style !== currentStyle)
    {
        currentStyle = style
        finalText += `%c${char}`
        finalStyles.push(stylesSet[style])
    }
    else
    {
        finalText += char
    }
}

console.log(finalText, ...finalStyles)
