# Learning Log — Algorithm Playground (JavaScript)

## 2026-01-03
- Goal: Improve readability and make the code easier to explain in interviews by adding simple comments and debug logging.
- What I changed:
  - Added a clear header explaining the app and the algorithms
  - Added `DEBUG` + `debugLog()` so I can trace what happens when buttons are clicked
  - Added comments to explain what each function does and why
  - Fixed a Bubble Sort error where my early-exit logic was written incorrectly
- Problem I hit: Bubble Sort wasn’t running because I accidentally wrote an invalid `break` statement (`break { ... }`).
- How I fixed it: Changed it to a normal `if (!swapped) { ... break; }` block and tested again using console logs.
- What I learned:
  - How event listeners connect UI buttons to JavaScript functions
  - Why binary search requires a sorted array and how to check sorting
  - How `async/await` + `sleep()` can be used to visualise algorithm steps
- Next step: Add a small improvement like a “Reset” button or a “Sorted: Yes/No” label and take 1–2 screenshots for the README.

## Reflection
- What I understand confidently now:
  - How Linear Search checks every element and stops early when it finds the target
  - How Bubble Sort works using passes and swaps + early exit when no swaps happen
  - How Binary Search halves the search space using `low/high/mid`
- What I still need to practise:
  - Time complexity explanations (O(n), O(n²), O(log n)) in simple words
  - Writing cleaner logs without spamming the console
- 3 interview questions I can answer now:
  1) Why does binary search only work on sorted data?
  2) What’s the difference between linear search and binary search?
  3) Why did you use `async/await` in this project?

## Tools/resources I used
- MDN Web Docs (DOM, `addEventListener`, arrays)
- W3Schools (quick JavaScript/HTML reference)
- Chrome DevTools Console (debugging, checking values during loops)
- A-Level Computer Science notes (algorithm steps and time complexity)
