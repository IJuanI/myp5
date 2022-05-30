This project is intended to provide enhanced interaction p5js, by including customizable plugins which allows for introducing advanced functionalities.

`myP5` creates a framework for plugins to expand and interact with each one another, using an internal shared event bus. ~~You can find more details about this below~~ (Coming Soon).

The project includes several built-in plugins, such as:
- Render Queues: Defers all draw calls to the very end of a frame. This allows you to inspect and modify a frame before rendering it.
- Frame debug: Creates a breakdown of the draw calls drawn in every frame.
- Layer: Allows enhanced control over the order you draw shapes to screen, being more independent on the order calls are made in your code.
- Drag Handles: Adds control points which you can use to edit shapes directly with your mouse
  - Handle debugger: Shows extra information about a handle's position
  - Handle printer: Dumps all handlers to console and your clipboard

Ideas for new plugins:
- Gradients
- Draggable shapes
- Shape creation tool
- Hover & Drag animations on Controllers
- Highlight selected shape
- Interactive UI
- Shape to Code utility
- Realtime code visualizer
- Node insertion tool (Adds points to existing shapes)
- Shape eraser
- Node eraser
- Prevent controllers merging
- Handler visibility modes
  - Always visible
  - Never visible
  - Selected shape only

Do you have more ideas? Please create an issue or reach me out!

If you want to collaborate, open a pull request. I will gladly help you with editing this repo and review your changes.
