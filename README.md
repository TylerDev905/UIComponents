# UIComponents
UIComponents written in JavaScript(JQuery) / Html / CSS
```
Components:
1. Utility Menu
2. Accordion
3. Treeview
4. Sorting Table
5. Slider container
6. Alerts
7. Popups container (insert a form inside)
```
<img src="http://i62.tinypic.com/287exsi.png"/></img>

<img src="http://i59.tinypic.com/2dnvgg.png"/></img>

<img src="http://i58.tinypic.com/f1aan7.png"/><img>

The following components use a javascript object with specified properties to create the component on the page.
For components that use images just set the path.

Example use:

```javascript

var treeView;

//Create a javascript object with the following properties
var treeViewContent = {
	container:$(".tree"),
	data:[
		{type:"item",img:"icons/txt.png",label:"One"},
		{type:"item",img:"icons/txt.png",label:"Two"},
		{
			type:"expand",img:"icons/folder.png",
			label:"Tree",
			data:[
					{type:"item",img:"icons/txt.png",label:"Four"},
					{type:"item",img:"icons/txt.png",label:"Five"}
				]
		},
		{type:"item",img:"icons/txt.png",label:"Four"},
		{type:"item",img:"icons/txt.png",label:"Five"},
		{
			type:"expand",img:"icons/folder.png",
			label:"Tree",
			data:[
					{type:"item",img:"icons/txt.png",label:"Four"},
					{type:"item",img:"icons/txt.png",label:"Five"}
				]
		},
		{
			type:"expand",img:"icons/folder.png",
			label:"Tree",
			data:[
					{type:"item",img:"icons/txt.png",label:"Four"},
					{type:"item",img:"icons/txt.png",label:"Five"}
				]
		},
		{type:"item",img:"icons/txt.png",label:"One"},
		{type:"item",img:"icons/txt.png",label:"Two"}
	]
};

//create the component
var treeView = new TreeView(treeViewContent);	

```
