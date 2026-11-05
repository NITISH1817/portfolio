export const springTransitions = {
  stiff: {
    type: "spring",
    stiffness: 400,
    damping: 30
  },
  smooth: {
    type: "spring",
    stiffness: 100,
    damping: 20
  },
  bouncy: {
    type: "spring",
    stiffness: 300,
    damping: 15
  }
};

export const easeTransitions = {
  easeInOut: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.5
  },
  easeOutExpo: {
    type: "tween",
    ease: [0.19, 1, 0.22, 1],
    duration: 0.8
  }
};
