import React from 'react';
import Genesis from '../sections/Genesis';
import Identity from '../sections/Identity';
import Capabilities from '../sections/Capabilities';
import Work from '../sections/Work';
import Education from '../sections/Education';
import Certifications from '../sections/Certifications';
import Achievements from '../sections/Achievements';
import Resume from '../sections/Resume';
import Contact from '../sections/Contact';

export default function ClassicPortfolio() {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-20 space-y-24 z-20">
      <div id="genesis"><Genesis /></div>
      <div id="identity"><Identity /></div>
      <div id="capabilities"><Capabilities /></div>
      <div id="work"><Work /></div>
      <div id="education"><Education /></div>
      <div id="certifications"><Certifications /></div>
      <div id="achievements"><Achievements /></div>
      <div id="resume"><Resume /></div>
      <div id="contact"><Contact /></div>
    </div>
  );
}

