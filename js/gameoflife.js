function seed() {
   var alp = [];
   for (i=0; i<arguments.length; i++)
   alp[i] = arguments[i];
  return alp.sort();
}

function same([x, y], [j, k]) {
  let a = [x, y]
  let b = [j,k]
  return Array.isArray(a) && Array.isArray(b) &&
  a.length === b.length &&
  a.every((val, index) => val === b[index]);
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some((e)=> same(e,cell));
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? "\u25A3":"\u25A2";
};

const corners = (state = []) => {
  if (state.length===0) {
   return {
     topRight: [0,0],
     bottomLeft: [0,0]
   }; 

  }
  const abs = state.map(([a,_]) => a);
  const babs = state.map(([_,b]) => b);
  return {
    topRight: [Math.max(...abs), Math.max(...babs)],
    bottomLeft: [Math.min(...abs), Math.min(...babs)]
  }

};

const printCells = (state) => {
  const { bottomLeft,topRight } = corners(state);
  let rectangle = "";
  for (let b =topRight[1]; b >= bottomLeft[1]; b--) {
    let row = [];
    for (let a = bottomLeft[0]; a <= topRight[0]; a++) {
      row.push(printCell([a,b], state));
    }
    rectangle += row.join(" ") + "\n";
  }
  return rectangle;
};

const getNeighborsOf = ([x, y]) => 
  [
    [x-1, y+1], [x, y+1], [x+1, y+1],
    [x-1, y],             [x+1, y],
    [x-1, y-1], [x, y-1], [x+1, y-1]
  ];


const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter((n) => contains.bind(state)(n));
};

const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state);

  return (
    livingNeighbors.length === 3 ||
    (contains.call(state, cell) && livingNeighbors.length == 2)
  );
};

const calculateNext = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let result =[];
  for (let b = topRight[1] + 1; b >= bottomLeft[1] - 1; b--) {
    for (let a = bottomLeft[0] - 1; a <= topRight[1] + 1; a++) {
      result = result.concat(willBeAlive([a,b], state) ? [[a, b]] : []); 
    }
  }
  return result;
};

const iterate = (state, iterations) => {
  const gamestates = [state];
  for (let i = 0; i < iterations; i++){
    gamestates.push(calculateNext(gamestates[gamestates.length - 1]));
  }
  return gamestates;
};

const main = (pattern, iterations) => {
  const res = iterate(startPatterns[pattern], iterations);
  res.forEach(r => console.log(printCells(r)));
    
  
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;