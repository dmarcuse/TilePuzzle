# Sliding tile puzzle
This is an interactive sliding tile puzzle, built using [Bootstrap](https://getbootstrap.com/) and [Typescript](https://www.typescriptlang.org/) for my Intro to Mobile Development class. You can play it [here](https://dmarcuse.github.io/TilePuzzle/).

Click on tiles adjacent to an empty tile to move them. You can adjust some options or try the auto solver using the buttons on the right. The auto solver uses A* to search the graph of board states, and while it works, it's not very efficient. If you shuffle the board more than once or twice, it will probably time out (especailly on 5x5). I've optimized it a decent amount already, but there isn't a lot that can be done.

## Building
To compile the Typescript portion of the project, you need NPM. Clone the repository and open a terminal in it, and run `npm install` to install the dependencies. After that, you can use `npm run build` to compile it. If you're making changes frequently, you can use `npm run dev` to automatically recompile when there are changes in the `ts` directory.
