import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { splineScenes } from '../../config/splineScenes';

export default function SplineHero({ onLoad }) {
  return (
    <div className="w-full h-full pointer-events-auto">
      <Suspense fallback={<div className="w-full h-full bg-[#08090C] animate-pulse"></div>}>
        <Spline scene={splineScenes.hero} onLoad={onLoad} />
      </Suspense>
    </div>
  );
}
