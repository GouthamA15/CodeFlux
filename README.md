# CodeFlux 🌌

## Project Main Goal

**CodeFlux** is a next-generation interactive program visualization and learning environment built directly into Visual Studio Code. The primary goal of CodeFlux is to bridge the gap between static source code and dynamic runtime execution. 

By transforming abstract programming concepts into tangible, visual, and interactive representations, CodeFlux aims to make the invisible state of a running program visible. Whether you are debugging complex asynchronous logic, learning a new language paradigm, or profiling algorithmic complexity, CodeFlux provides an intuitive lens into your software's execution state.

---

## Architecture

CodeFlux is designed as a modular VS Code extension, separating data extraction from visual rendering to ensure high performance and responsiveness:

1. **Extension Host (Backend):**
   - Runs in the VS Code Node.js extension process.
   - Integrates deeply with the **Debug Adapter Protocol (DAP)** to intercept and query runtime states (threads, stack frames, variables) without halting the developer's workflow.
   - Manages the lifecycle of debug sessions and coordinates data polling.
   - *Future:* Will integrate **Tree-sitter** for lightning-fast, incremental Abstract Syntax Tree (AST) parsing to map runtime data back to source code structures.

2. **Webview UI (Frontend):**
   - Runs in an isolated iframe within VS Code, communicating securely with the Extension Host via bidirectional message passing.
   - Designed to maintain its state seamlessly even when hidden in the background (`retainContextWhenHidden`).
   - *Future:* Will be powered by **React** for reactive UI state management and **Three.js / WebGL** for rendering spatial, 3D execution graphs and memory layouts.

---

## Current Running Phase

**Phase 0: Foundation** 🚧

We are currently in the foundational phase of development, ensuring robust communication and data extraction before introducing heavy visualization libraries. 

### Completed Milestones:
- **Phase 0.1: Minimal Webview Foundation** ✅
  - Established a secure, singleton Webview panel (`CodeFlux: Open Visualization`).
  - Implemented bidirectional messaging between the Extension Host and the Webview UI.
- **Phase 0.2: Debug Session Detection** ✅
  - Integrated with the `vscode.debug` API to listen for debug session lifecycles.
  - Seamlessly tracks active/focused debugging sessions and synchronizes state with the Webview UI.
- **Phase 0.3: Runtime State Feasibility** ✅
  - Successfully interrogated the debugger using standard DAP custom requests (`threads`, `stackTrace`, `scopes`, `variables`).
  - Extracted and displayed current stack frames and local variables directly in the Webview UI.

---

## Project Roadmap

### Phase 1: Core Visualization Engine *(Upcoming)*
- **Tree-sitter Integration:** Fast AST parsing to understand code structure.
- **Modern UI Framework:** Migration of the plain HTML/JS Webview to **React**.
- **Spatial Rendering:** Introduction of **Three.js / WebGL** for complex visual graphs.
- **Basic Visual Mappings:** Highlighting executing lines and linking variables to AST nodes.

### Phase 2: Execution Detective & Time Travel *(Upcoming)*
- **Program State Engine:** A robust internal engine to snapshot memory states efficiently.
- **Execution Event Log:** Recording state changes over time.
- **Replay Mechanism:** "Time-travel" debugging—scrubbing backwards and forwards through program execution.
- **State Difference Engine:** Visually diffing memory states between two points in time.

### Phase 3: Advanced Intelligence & Profiling *(Upcoming)*
- **Complexity Profiler:** Visualizing Big-O time and space complexity dynamically as data scales.
- **Async Visualization:** Mapping Promises, Event Loops, and Goroutines/Threads.
- **AI Integration:** Integrating LLMs to automatically explain *why* a variable changed or *how* an algorithm is operating on the data structure.

---

## Getting Started (For Developers)

If you'd like to run CodeFlux locally or contribute to the foundation:

1. Clone the repository and navigate to the `codeflux` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the TypeScript code:
   ```bash
   npm run compile
   ```
4. **Run the Extension:** 
   - Open the project in VS Code.
   - Press **`F5`** to open a new Extension Development Host window.
5. **Test the Features:**
   - In the new window, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
   - Run **`CodeFlux: Open Visualization`**.
   - Open a simple JavaScript file, set a breakpoint, and start debugging (`F5`).
   - Watch the CodeFlux panel detect the session. Once paused on a breakpoint, click **Refresh Runtime State** to inspect local variables.
