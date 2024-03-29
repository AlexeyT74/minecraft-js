Minecraft JS Project.
Alexey Tal.

********************************************************************
THE RULES

1. A player can select world types. 3 types are currently availabe. Press "Reset" button to commit the change of the new world type.
2. Tiles are located one under another. 
    a) When you cut a tree - you see dirt underneath. 
    b) When you dig dirt - you see rocks underneath.
    c) When you harvest rocks - water fills the hole.
    d) You can do nothing with water tile.
3. Harvested tiles can be recovered from the inventory. Every piece is recovered into the place it was harvested from. 
4. Size of the inventory is limited to the "Height" parameter of current world type. When your inventory is full - you should restore some elements or press the Reset button.

********************************************************************

THE DEVELOPMENT

1. I know that I implemented different approach than the one that Omer sugested. Sorry - I implemented most part of the project before I knew "how it should be".
2. It was hard for me to implement the project without classes. I think with classes it would be much clear and easier. However we studied "classes" after the project was implemented and I decided not to change the implementation.
3. Initially I wanted to load "world" from some extarnal ".csv" file. Later I realized that it is hard to read from a local file in JavaScript. Instead of this I hardcoded worlds in the beggining of my ".js" file as arrays. Possibly, there is more convenient way to store/load data - please advise.
4. It was hard for me to debug the code. Hope that Omer will spend significant time to describe us best approaches of debugging web applications.
5. I did not know about events bubbling when implemented the project. Therefor I added separate event-listener into every tile. Now I understand that it is enough to add a listener into parent container. However, I decided not to change the code that works. 

