class Grid {
  constructor(data) {
    // No validation - maybe later.
    this.title = data.title;
    this.description = data.description;
    this.rows = data.rows;
    this.cols = data.cols;
    this.frames = data.frames;
    this.currentFrame = 0;

    this.gridElement = document.getElementById("grid");

    // grid controls are managed in this class too
    this.prevFrameButton = document.getElementById("prev-frame-button");
    this.nextFrameButton = document.getElementById("next-frame-button");
    this.currentFrameIndicator = document.getElementById("current-frame-indicator");
    this.finalFrameIndicator = document.getElementById("final-frame-indicator");
    this.addFrameButton = document.getElementById("add-frame-button");
    this.deleteFrameButton = document.getElementById("delete-frame-button");
    this.clearFrameButton = document.getElementById("clear-frame-button");
    this.invertFrameButton = document.getElementById("invert-frame-button");
    this.resizeButton = document.getElementById("resize-button");
    this.resetButton = document.getElementById("reset-button");

    // also grid metadata
    this.titleInput = document.getElementById("title-input");
    this.descriptionInput = document.getElementById("description-input");

    this.addEventListeners();

    this.render();
  }

  addEventListeners() {
    // "click" feels sluggish; mousedown is snappy.
    this.gridElement.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("cell")) {
        this.toggleCell(Number(e.target.dataset.row), Number(e.target.dataset.col));
      }
    });
    this.prevFrameButton.addEventListener("click", () => {
      this.goToFrame(this.currentFrame - 1);
    });

    this.nextFrameButton.addEventListener("click", () => {
      this.goToFrame(this.currentFrame + 1);
    });

    this.addFrameButton.addEventListener("click", () => {
      this.addFrame();
    });
    this.deleteFrameButton.addEventListener("click", () => {
      this.deleteCurrentFrame();
    });
    this.clearFrameButton.addEventListener("click", () => {
      this.clearFrame();
    });
    this.invertFrameButton.addEventListener("click", () => {
      this.invertFrame();
    });
    this.resizeButton.addEventListener("click", () => {
      const rowsInput = document.getElementById("rows-input");
      const colsInput = document.getElementById("cols-input");

      let newRows = Math.floor(Number(rowsInput.value));
      let newCols = Math.floor(Number(colsInput.value));

      if (newRows < 1) newRows = this.rows;
      if (newCols < 1) newCols = this.cols;
      if (newRows > 50) newRows = 50;
      if (newCols > 50) newCols = 50;

      rowsInput.value = newRows;
      colsInput.value = newCols;

      this.resize(newRows, newCols);
    });

    this.resetButton.addEventListener("click", () => {
      this.reset();
    });
    this.titleInput.addEventListener("input", (e) => {
      this.title = e.target.value;
    });
    this.descriptionInput.addEventListener("input", (e) => {
      this.description = e.target.value;
    });
  }

  render() {
    // Cells are styled divs with row and column stored in data attributes.
    // We re-render the grid from scratch after every grid action: inefficient but simple and ok at these sizes.
    // Remember to call this after any grid action!
    this.gridElement.innerHTML = "";
    this.gridElement.style.setProperty("--cols", this.cols);

    const frame = this.frames[this.currentFrame];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (frame[row][col]) {
          cell.classList.add("on");
        }
        cell.dataset.row = row;
        cell.dataset.col = col;
        this.gridElement.appendChild(cell);
      }
    }

    // Update frame indicators too.
    // The frame indicators are 0-indexed.
    // E.g. when showing the first of ten total frames the frame indicator is "0/9".
    // This is so that the indicator matches t=0, t=1, ...
    this.currentFrameIndicator.textContent = `${this.currentFrame}`;
    this.finalFrameIndicator.textContent = `${this.frames.length - 1}`;

    // And the metadata
    this.titleInput.value = this.title;
    this.descriptionInput.value = this.description;
  }

  toggleCell(row, col) {
    const frame = this.frames[this.currentFrame];
    frame[row][col] = !frame[row][col];
    this.render();
  }

  addFrame() {
    // A new frame is initially a copy of the current frame (not necessarily the new frame's predecessor).
    const copy = this.frames[this.currentFrame].map((row) => [...row]);
    this.frames.push(copy);
    this.currentFrame = this.frames.length - 1;
    this.render();
  }

  goToFrame(index) {
    // No-op if index is out of bounds, so callers don't need to think about it.
    if (index >= 0 && index < this.frames.length) {
      this.currentFrame = index;
      this.render();
    }
  }

  createBlankFrame() {
    const frame = [];
    for (let i = 0; i < this.rows; i++) {
      frame.push(Array(this.cols).fill(false));
    }
    return frame;
  }

  clearFrame() {
    this.frames[this.currentFrame] = this.createBlankFrame();
    this.render();
  }

  invertFrame() {
    const frame = this.frames[this.currentFrame];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        frame[row][col] = !frame[row][col];
      }
    }
    this.render();
  }

  deleteCurrentFrame() {
    // No-op if there is only one frame.
    if (this.frames.length === 1) {
      return;
    }

    this.frames.splice(this.currentFrame, 1);

    // Decrement current frame if it's now out of bounds.
    if (this.currentFrame >= this.frames.length) {
      this.currentFrame = this.frames.length - 1;
    }

    this.render();
  }

  resize(newRows, newCols) {
    // Copy existing cells which are within new range.
    // Set new cells to false.
    this.frames = this.frames.map((oldFrame) => {
      const newFrame = [];
      for (let r = 0; r < newRows; r++) {
        const row = [];
        for (let c = 0; c < newCols; c++) {
          const state = r < this.rows && c < this.cols ? oldFrame[r][c] : false;
          row.push(state);
        }
        newFrame.push(row);
      }
      return newFrame;
    });

    this.rows = newRows;
    this.cols = newCols;
    this.render();
  }

  save() {
    // Returning null means the save was rejected.

    // Reject the save if the title is just whitespace.
    if (!this.title.trim()) {
      return null;
    }

    const data = {
      title: this.title,
      description: this.description,
      rows: this.rows,
      cols: this.cols,
      frames: this.frames,
    };

    const key = getLocalStorageKey(this.title);
    localStorage.setItem(key, JSON.stringify(data));
    return key;
  }

  downloadJSON() {
    const data = {
      title: this.title,
      description: this.description,
      rows: this.rows,
      cols: this.cols,
      frames: this.frames,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${this.title}.json`; // it's up to the browser what happens if the user has a same-named file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  load(key) {
    // Returns a boolean flag for whether the load was successful.
    const json = localStorage.getItem(key);

    if (!json) return false;

    const data = JSON.parse(json);
    this.title = data.title;
    this.description = data.description;
    this.rows = data.rows;
    this.cols = data.cols;
    this.frames = data.frames;
    this.currentFrame = 0;
    this.render();
    return true;
  }

  reset() {
    this.rows = 10;
    this.cols = 10;
    this.title = "";
    this.description = "";
    this.frames = [this.createBlankFrame()];
    this.currentFrame = 0;
    this.render();

    // Unselect whatever grid the user previously selected, to avoid confusion.
    // Also, the dropdown only listens to change events.
    // So if we didn't unselect, the user couldn't easily load the previously selected value.
    savedGridsSelect.value = "-";
  }
}

// app-level controls
const savedGridsSelect = document.getElementById("saved-grids");
const downloadJsonButton = document.getElementById("download-json-button");
const uploadJsonButton = document.getElementById("upload-json-button");
const uploadJsonInput = document.getElementById("upload-json-input");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");

// Add prefix to local storage key to try to avoid clobbering third-party data.
const local_storage_prefix = "grid_";

function getLocalStorageKey(title) {
  // Grids in the dropdown menu are listed by title, not key.
  // So we should ensure same-looking title => same key, to avoid same-looking titles in the dropdown.
  // I take "same-looking" to mean identical up to leading or trailing whitespace.
  return `${local_storage_prefix}${title.trim()}`;
}

function populateSavedGrids() {
  savedGridsSelect.innerHTML = "";

  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(local_storage_prefix)) {
      keys.push(key);
    }
  }

  // Sort alphabetically by title (case-insensitive)
  keys.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const option = document.createElement("option");
  option.value = "-";
  option.textContent = "-";
  option.disabled = true;
  savedGridsSelect.appendChild(option);

  for (const key of keys) {
    const data = JSON.parse(localStorage.getItem(key));
    const option = document.createElement("option");
    option.value = key;
    option.textContent = data.title;
    savedGridsSelect.appendChild(option);
  }
}

function initialize() {
  const small_world_storage_key = getLocalStorageKey(SMALL_WORLD.title);
  localStorage.setItem(small_world_storage_key, JSON.stringify(SMALL_WORLD));
  populateSavedGrids();

  const smallWorld = localStorage.getItem(small_world_storage_key);
  const grid = new Grid(JSON.parse(smallWorld));
  return grid;
}

// There is only ever one grid object.
// All grid actions modify that one object.
const grid = initialize();

downloadJsonButton.addEventListener("click", () => {
  grid.downloadJSON();
});

uploadJsonButton.addEventListener("click", () => {
  uploadJsonInput.click();
});

uploadJsonInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    const key = getLocalStorageKey(data.title);
    localStorage.setItem(key, JSON.stringify(data));

    populateSavedGrids();
    savedGridsSelect.value = key;
    grid.load(key);
    e.target.value = "";
  };
  reader.readAsText(file);
});

saveButton.addEventListener("click", () => {
  const key = grid.save();
  if (key) {
    populateSavedGrids();
    savedGridsSelect.value = key;
  }
});

savedGridsSelect.addEventListener("change", () => {
  // Unsaved grid state is lost.
  grid.load(savedGridsSelect.value);
});

deleteButton.addEventListener("click", () => {
  if (savedGridsSelect.value === "-") {
    // No grid selected, so no-op.
    // To "delete" the working grid, the user can just make a new grid.
    return;
  } else {
    // Delete the selected grid and reset the working grid.
    // If the user selected a grid, made changes, and just wants to revert those changes,
    // they can e.g. reset then load.
    localStorage.removeItem(savedGridsSelect.value);
    populateSavedGrids();
    grid.reset();
  }
});
