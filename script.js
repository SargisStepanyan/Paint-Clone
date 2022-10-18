const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');

const lineIcon = document.getElementById('line');
let isLine = false;

const circleIcon = document.getElementById('circle');
let isCirlce = false;
let circleCenter = {};


// switch and active circle tool
function switchToCircle() {
  isCirlce = true;
  isLine = false;
  isEraser = false;
  activeTool(circleIcon);
  activeToolEl.textContent = 'Circle';
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize()
}

circleIcon.addEventListener('click', () => {
  switchToCircle()
})


// switch and active line tool
function switchToLine() {
  isLine = true;
  isCirlce = false;
  isEraser = false;
  activeTool(lineIcon);
  activeToolEl.textContent = "Line";
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize()
}


lineIcon.addEventListener('click', () => {
  switchToLine()
})


// active tool to color black 
function activeTool(tool) {
  const activeTool = document.querySelector('.active');
  if(activeTool) activeTool.classList.remove('active');
  tool.classList.add('active');
}


const { body } = document;

// Global Variables

let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor = '#A51DAB';
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const context = canvas.getContext('2d');


// Formatting Brush Size
function displayBrushSize() {
  if(brushSlider.value < 10) {
    brushSize.innerText = '0' + brushSlider.value
  } else {
    brushSize.innerText = brushSlider.value
  }
}

// Setting Brush Size
brushSlider.addEventListener('change', () => {
  currentSize = brushSlider.value
  displayBrushSize()
});

// Setting Brush Color
brushColorBtn.addEventListener('change', () => {
  isEraser = false;
  currentColor = '#' + brushColorBtn.value
});

// Setting Background Color
bucketColorBtn.addEventListener('change', () => {
  bucketColor = '#' + bucketColorBtn.value;
  createCanvas()
  restoreCanvas();
});

// // Eraser
eraser.addEventListener('click', () => {
  isLine = false;
  isCirlce = false;
  isEraser = true;
  currentColor = bucketColor
  activeTool(eraser)
  activeToolEl.textContent = 'Eraser';

});

// // Switch back to Brush
function switchToBrush() {
  isLine = false;
  isEraser = false;
  activeTool(brushIcon);
  activeToolEl.textContent = 'Brush';
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize()
}

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);

}

// // Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  
  setTimeout(() => {
    switchToBrush();
    displayBrushSize();
  } , 1500);
});

// // Draw what is stored in DrawnArray
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    if(!drawnArray[i].isLine && !drawnArray[i].r) {
      context.beginPath();
      context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
      context.lineWidth = drawnArray[i].size;
      context.lineCap = 'round';
      if (drawnArray[i].eraser) {
        context.strokeStyle = bucketColor;
      } else {
        context.strokeStyle = drawnArray[i].color;
      }
      context.lineTo(drawnArray[i].x, drawnArray[i].y);
      context.stroke();
    } else if(drawnArray[i].isLine) {
      if(drawnArray[i].point == 1) {
        context.beginPath();
        context.moveTo(drawnArray[i].x, drawnArray[i].y);
        context.lineWidth = drawnArray[i].size;
        context.lineCap = 'round';
        context.strokeStyle = drawnArray[i].color;
      } else if(drawnArray[i].point == 2) {
        context.lineTo(drawnArray[i].x, drawnArray[i].y);
        context.stroke();
        context.closePath()
      }
    } else if(drawnArray[i].r) {
      context.beginPath()
      context.strokeStyle = drawnArray[i].color;
      context.lineWidth = drawnArray[i].size;
      context.arc(drawnArray[i].x, drawnArray[i].y, drawnArray[i].r, 0, 2* Math.PI, true);
      context.stroke();
    }
  }
}

// // Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase, isLine, isCircle, point, r) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
    isLine,
    isCircle,
    point,
    r,
  };
  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// Mouse Down
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  if(!isLine && !isCirlce) {
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = currentSize;
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
  }
  console.log('mouse is clicked', currentPosition);
  if(isLine) {
    context.beginPath();
    context.moveTo(currentPosition.x, currentPosition.y);
    context.lineWidth = currentSize;
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
    storeDrawn(
        currentPosition.x,
        currentPosition.y,
        currentSize,
        currentColor,
        isEraser,
        isLine,
        isCirlce,
        1,
    )
  }
  if(isCirlce) {
    circleCenter.x = currentPosition.x;
    circleCenter.y = currentPosition.y;
  }
  
});

// Mouse Move
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    if(!isLine && !isCirlce) {
      // console.log('mouse is moving', currentPosition);
      context.lineTo(currentPosition.x, currentPosition.y);
      context.stroke();
      storeDrawn(
        currentPosition.x,
        currentPosition.y,
        currentSize,
        currentColor,
        isEraser,
      );
    }
    // if(isCirlce) {
    //   const r = calcRadius(circleCenter.x, circleCenter.y, currentPosition.x, currentPosition.y);
    //   context.strokeStyle = currentColor;
    //   context.lineWidth = currentSize;
    //   context.arc(circleCenter.x, circleCenter.y, r, 0, 2* Math.PI, true);
    //   context.stroke();
    // }
    
  } else {
    if(!isLine && !isCirlce) {
      storeDrawn();
    }
    
  }
});

// Mouse Up
canvas.addEventListener('mouseup', (e) => {
  const currentPosition = getMousePosition(e)
  if(isLine) {
    context.lineTo(currentPosition.x, currentPosition.y)
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
      isLine,
      isCirlce,
      2
    )
  }
  if(isCirlce) {
    const r = calcRadius(circleCenter.x, circleCenter.y, currentPosition.x, currentPosition.y);
    context.beginPath();
    context.strokeStyle = currentColor;
    context.lineWidth = currentSize;
    context.arc(circleCenter.x, circleCenter.y, r, 0, 2* Math.PI, true);
    context.stroke();
    isCirlce = true
    storeDrawn(
      circleCenter.x,
      circleCenter.y,
      currentSize,
      currentColor,
      isEraser,
      isLine,
      isCirlce,
      1,
      r,
    )
  }
  isMouseDown = false;
  console.log('mouse is unclicked');
});

brushIcon.addEventListener('click', switchToBrush)


function calcRadius(x, y, x1, y1) {
  let a = Math.abs(x1 - x);
  let b = Math.abs(y1 - y);
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
}

// On Load
createCanvas();
switchToBrush();


function timoutMessage(message) {
  const oldText = activeToolEl.innerText;
  activeToolEl.innerText = message;
  setTimeout(() => {
    activeToolEl.innerText = oldText;
  }, 1000)
}


// Save to local storage
saveStorageBtn.addEventListener('click', () => {
  localStorage.setItem('savedPaint', JSON.stringify(drawnArray));
  localStorage.setItem('backgroundColor', String(bucketColor));
  timoutMessage('Saved to Storage')
})


// load from local storage
loadStorageBtn.addEventListener('click', () => {
  if(localStorage.savedPaint && localStorage.backgroundColor) {
    drawnArray = JSON.parse(localStorage.savedPaint);
    bucketColor = localStorage.backgroundColor;
    createCanvas();
    restoreCanvas();
    timoutMessage('Loaded from Storage');
  } else {
    timoutMessage('Storage is empty');
  }
})


clearStorageBtn.addEventListener('click', () => {
  localStorage.removeItem('savedPaint');
  localStorage.removeItem('backgroundColor');
  timoutMessage('Storage cleared');
})



downloadBtn.addEventListener('click', () => {
  const imgURL = canvas.toDataURL("image/jpeg")
  downloadBtn.href = imgURL;
  downloadBtn.download = 'Canvas.jpeg';
  timoutMessage('Saved');

})

