/**
 * Algorithm Playground
 *
 * What this app does:
 * - Generates a random array of numbers
 * - Lets the user run:
 *   1) Linear Search  (checks items one by one)
 *   2) Bubble Sort    (sorts by swapping neighbours)
 *   3) Binary Search  (fast search, but only works if the array is sorted)
 *
 * How it’s built:
 * - `arr` stores the current array (the "state")
 * - `renderArray()` redraws the pills in the UI whenever the state changes
 * - async/await + sleep() are used to slow down steps so you can see them happen
 */

let arr = []; // This holds the current numbers shown in the UI

// Turn debug logs on/off from one place
const DEBUG = true;

// Small helper so we can easily disable console logging
function debugLog(...args) {
  if (DEBUG) console.log("[DEBUG]", ...args);
}

/* 
   Grab elements from the page
 */
const arrayBox = document.getElementById("arrayBox");
const statusEl = document.getElementById("status");
const logEl = document.getElementById("log");

const inputSize = document.getElementById("inputSize");
const inputMax = document.getElementById("inputMax");
const inputTarget = document.getElementById("inputTarget");

/* 
   Button event listeners
   These connect the UI buttons to the functions.
*/
document.getElementById("btnGenerate").addEventListener("click", generateArray);
document.getElementById("btnLinear").addEventListener("click", runLinearSearch);
document.getElementById("btnSort").addEventListener("click", runBubbleSort);
document.getElementById("btnBinary").addEventListener("click", runBinarySearch);

/**
 * Shows a short one-line message to the user (top status box).
 */
function setStatus(msg) {
  statusEl.textContent = msg;
}

/**
 * Replaces the "log" panel text.
 */
function setLog(msg) {
  logEl.textContent = msg;
}

/**
 * Returns whatever is currently in the log panel (so we can append to it).
 */
function prevLog() {
  return logEl.textContent || "";
}

/**
 * Pauses for `ms` milliseconds.
 * This is used to slow the algorithm down so you can visually follow each step.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Draws the array on the page as "pills".
 * Optional highlighting is used during algorithms:
 * - activeIndex: the index currently being checked
 * - foundIndex: where the target was found
 * - low/high: the current bounds during binary search
 */
function renderArray({ activeIndex = null, foundIndex = null, low = null, high = null } = {}) {
  // Clear existing pills
  arrayBox.innerHTML = "";

  // Rebuild pills for each value in arr
  arr.forEach((value, i) => {
    const el = document.createElement("div");
    el.className = "pill";
    el.textContent = value;

    // Highlight current checked item
    if (i === activeIndex) el.classList.add("active");

    // Highlight the found item
    if (i === foundIndex) el.classList.add("found");

    // Highlight low/high bounds for binary search
    if (low !== null && high !== null && (i === low || i === high)) {
      el.classList.add("lowhigh");
    }

    arrayBox.appendChild(el);
  });
}

/**
 * Returns a random integer between min and max (inclusive).
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Keeps a number inside a safe range.
 * Example: if user enters 9999 for size, we clamp it down to max allowed.
 */
function clamp(n, min, max) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

/**
 * Creates a new random array using the user's "Size" and "Max Value" settings.
 * Then redraws the UI.
 */
function generateArray() {
  const size = clamp(parseInt(inputSize.value || "15", 10), 5, 50);
  const maxVal = clamp(parseInt(inputMax.value || "99", 10), 10, 999);

  // Build a new array of random numbers
  arr = Array.from({ length: size }, () => randomInt(1, maxVal));

  debugLog("generateArray() called");
  debugLog("size/maxVal:", size, maxVal);
  debugLog("arr:", arr);

  setStatus(`Generated an array of ${size} numbers.`);
  setLog("Try: Linear Search → Bubble Sort → Binary Search");
  renderArray();
}

/**
 * Reads and validates the target number the user typed.
 * Returns:
 * - a number if valid
 * - null if the input is empty/invalid
 */
function getTarget() {
  debugLog("getTarget raw input:", inputTarget.value);

  const t = parseInt(inputTarget.value, 10);
  debugLog("getTarget parsed:", t);

  if (Number.isNaN(t)) return null;
  return t;
}

/**
 * LINEAR SEARCH:
 * Checks each element from left to right until it finds the target or hits the end.
 * Time complexity: O(n)
 */
async function runLinearSearch() {
  if (arr.length === 0) return setStatus("Generate an array first.");

  const target = getTarget();
  if (target === null) return setStatus("Enter a target number.");

  setStatus(`Running Linear Search for ${target}...`);
  setLog("");

  debugLog("Linear Search started:", { target, length: arr.length });

  for (let i = 0; i < arr.length; i++) {
    debugLog(`Linear: checking i=${i}, value=${arr[i]}`);

    // Highlight current index in the UI
    renderArray({ activeIndex: i });

    // Append to on-screen log
    setLog(prevLog() + `Checking index ${i} (value=${arr[i]})\n`);

    // Pause so the user can see the highlight moving
    await sleep(120);

    // If we found the target, stop early
    if (arr[i] === target) {
      debugLog("Linear Search found:", { index: i, value: arr[i] });

      renderArray({ foundIndex: i });
      setStatus(`Found ${target} at index ${i} using Linear Search.`);
      return;
    }
  }

  debugLog("Linear Search ended: not found", { target });

  renderArray();
  setStatus(`${target} not found using Linear Search.`);
}

/**
 * BUBBLE SORT:
 * Compares neighbours and swaps if they’re in the wrong order.
 * Repeats passes until the array is sorted.
 * Time complexity: O(n^2)
 */
async function runBubbleSort() {
  if (arr.length === 0) return setStatus("Generate an array first.");

  setStatus("Running Bubble Sort...");
  setLog("");

  debugLog("Bubble Sort started:", [...arr]);

  for (let pass = 0; pass < arr.length - 1; pass++) {
    let swapped = false;
    debugLog(`Pass ${pass + 1} starting...`);

    // After each pass, the largest element is at the end,
    // so we can reduce comparisons by `pass`.
    for (let i = 0; i < arr.length - 1 - pass; i++) {
      renderArray({ activeIndex: i });
      setLog(prevLog() + `Compare index ${i} and ${i + 1}\n`);
      await sleep(80);

      if (arr[i] > arr[i + 1]) {
        debugLog(`Swap at i=${i}: ${arr[i]} > ${arr[i + 1]}`);

        // Swap the two values
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;

        renderArray({ activeIndex: i + 1 });
        setLog(prevLog() + `Swap → [${arr[i]} , ${arr[i + 1]}]\n`);
        await sleep(80);
      }
    }

    debugLog(`Pass ${pass + 1} done. swapped=${swapped}. arr=`, [...arr]);

    // If we made no swaps in a full pass, the array is already sorted
    if (!swapped) {
      debugLog("Early exit: array already sorted.");
      break;
    }
  }

  debugLog("Bubble Sort finished:", [...arr]);

  renderArray();
  setStatus("Array sorted (Bubble Sort). Now Binary Search will work correctly.");
}

/**
 * Checks if an array is sorted in ascending order.
 * Used to decide if binary search can run.
 */
function isSortedAscending(a) {
  for (let i = 1; i < a.length; i++) {
    if (a[i] < a[i - 1]) return false;
  }
  return true;
}

/**
 * BINARY SEARCH:
 * Only works on sorted arrays.
 * It repeatedly checks the middle element and halves the search range.
 * Time complexity: O(log n)
 */
async function runBinarySearch() {
  if (arr.length === 0) return setStatus("Generate an array first.");

  const target = getTarget();
  if (target === null) return setStatus("Enter a target number.");

  debugLog("Binary Search started:", { target, arr: [...arr] });

  // Binary search requires sorted array
  if (!isSortedAscending(arr)) {
    debugLog("Binary Search blocked: array not sorted.");
    setStatus("Binary Search requires a sorted array. Click Bubble Sort first.");
    return;
  }

  setStatus(`Running Binary Search for ${target}...`);
  setLog("");

  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    debugLog(`Binary step: low=${low}, high=${high}, mid=${mid}, value=${arr[mid]}`);

    // Highlight current mid + bounds
    renderArray({ activeIndex: mid, low, high });
    setLog(prevLog() + `low=${low}, high=${high}, mid=${mid} (value=${arr[mid]})\n`);
    await sleep(160);

    if (arr[mid] === target) {
      debugLog("Binary Search found:", { index: mid, value: arr[mid] });

      renderArray({ foundIndex: mid });
      setStatus(`Found ${target} at index ${mid} using Binary Search.`);
      return;
    }

    // Decide which half to keep
    if (arr[mid] < target) {
      low = mid + 1;   // go right
    } else {
      high = mid - 1;  // go left
    }
  }

  debugLog("Binary Search ended: not found", { target });

  renderArray();
  setStatus(`${target} not found using Binary Search.`);
}

// Start with a default array so the page isn’t empty on load
generateArray();
