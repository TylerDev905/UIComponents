/*
	##################################################################
							Utility Menu
							
	var menu = [
		{type:"tab",label:"settings",img:"img/key.png",context:{top:0,left:0,menu:[{type:"item",label:"One",img:"icons/clip.png",fnc:"one"},{type:"subMenu",label:"item",img:"icons/code.png",menu:[{type:"item",label:"item",img:"img/key.png"},{type:"disabled",label:"disabled"}]},{type:"divider"},{type:"disabled",label:"test"},{type:"disabled",label:"disabled"}]}},
		{type:"tab",label:"send",img:"img/send.png",context:{top:0,left:0,menu:[{type:"item",label:"Two",img:"icons/clip.png",fnc:"two"},{type:"subMenu",label:"item",img:"icons/code.png",menu:[{type:"item",label:"item",img:"img/key.png"},{type:"disabled",label:"disabled"}]},{type:"divider"},{type:"disabled",label:"test"},{type:"disabled",label:"disabled"}]}},
		{type:"tab",label:"robots",img:"img/robot.png",context:{top:0,left:0,menu:[{type:"item",label:"Three",img:"icons/clip.png"},{type:"subMenu",label:"item",img:"icons/code.png",menu:[{type:"item",label:"item",img:"img/key.png"},{type:"disabled",label:"disabled"}]},{type:"divider"},{type:"disabled",label:"test"},{type:"disabled",label:"disabled"}]}},
		{type:"tab",label:"currency",img:"img/money.png",context:{top:0,left:0,menu:[{type:"item",label:"Four",img:"icons/clip.png"},{type:"subMenu",label:"item",img:"icons/code.png",menu:[{type:"item",label:"item",img:"img/key.png"},{type:"disabled",label:"disabled"}]},{type:"divider"},{type:"disabled",label:"test"},{type:"disabled",label:"disabled"}]}}
	];
	
	##################################################################
*/

function UtilityMenu(content){
	this.container = $('#util');
	this.nav = content;
	this.display();
}
UtilityMenu.prototype.display = function(){
	var ul = $('<ul></ul>');
	this.container.append(ul);
	
	$.each(this.nav,function(index, value){
		var li = $('<li></li>',{
			"class":value.type,
			"html":'<img src="'+value.img+'"/><span>'+value.label+'</span>',
			});
		li.data('context', value.context);
		ul.append(li);
	});
	this.container.data('data', this);
};
UtilityMenu.prototype.addHighlight = function(item){
	$('#util ul li').removeClass('navSelect');
	item.addClass('navSelect');
};
UtilityMenu.prototype.removeHighlight = function(){
	$('#util ul li').removeClass('navSelect');
};
UtilityMenu.prototype.displayContextMenu = function(item){
	data = item.data('context');
	if(data != undefined){
		var pos = item.position();
		data.top = pos.top+26;
		data.left = pos.left-1;
		var contextMenu = new ContextMenu(data);
		contextMenu.open();
	}
};

/*
	##################################################################
								ContextMenu
								
	var contextObj = {top:0,left:0,menu:[{type:"item",label:"One",img:"icons/clip.png",fnc:"one"},{type:"subMenu",label:"item",img:"icons/code.png",menu:[{type:"item",label:"item",img:"img/key.png"},{type:"disabled",label:"disabled"}]},{type:"divider"},{type:"disabled",label:"test"},{type:"disabled",label:"disabled"}]};
	
	##################################################################
*/



function ContextMenu(context){
	this.container = $('#context');
	this.container.html(this.display(context));
	this.container.data('data',this);
}	
ContextMenu.prototype.display = function(context){
	var obj = this;
	if(context.top != undefined && context.left != undefined)
		var str = '<ul class="menu" style="top:'+context.top+';left:'+context.left+';">';
	else
		var str = '<ul class="menu">';
	
	$.each(context.menu,function(index, value){
		
		if(value.fnc == undefined)
			str += '<li class="'+value.type+'">';
		else
			str += '<li class="'+value.type+'" data-fnc="'+value.fnc+'">';
		
		if(value.type != "divider"){
			if(value.img != undefined)
				str +=	'<img class="menuImgLeft" src="'+value.img+'"/>';
			str +=	'<span>'+value.label+'</span>';
			if(value.type == "subMenu"){
				str +=	'<img class="menuImgRight" src="icons/arrow-right.png"/>';
				str += obj.display(value);
			}
		}
		str +=	'</li>';
	});
	return str+'</ul>';
};
ContextMenu.prototype.clicked = function(obj){
	var fnc = obj.data('fnc');
	if(fnc != undefined)
		action[fnc]();
};
ContextMenu.prototype.open = function(){
	this.container.show();
};
ContextMenu.prototype.close = function(){
	this.container.hide();
};

/*highlight tab and display menu*/
$(document).on("click","#util ul li",function(){
	var utilityMenu = $(this).closest("#util").data('data');
	utilityMenu.addHighlight($(this));
	utilityMenu.displayContextMenu($(this));
	utilityOpen = true;
});

/*close menu and remove highlight from tab*/
$(document).on("click", function(e){
	var contextMenu = $("#context").data('data');
	var obj = $(e.target);
	if(!obj.closest("#util").length && utilityOpen == true){
		var utilityMenu = $('#util').data('data');
		utilityMenu.removeHighlight();
		contextMenu.close();
		utilityOpen = false;
	}
});

/*execute ContextMenu action*/
$(document).on("click","#context li",function(){
	var contextMenu = $(this).closest("#context").data('data');
	contextMenu.clicked($(this));
});

/*
	##################################################################
								Popup
	
	var content = {type:"prompt",img:"img/alert.png",title:"Login",content:'<p><label>Username</label><input type="text" name="username" /></p><p><label>Password</label><input type="password" name="password" /></p>'};
	
	##################################################################
*/

function Popup(content){
	this.container = $("#popup");
	this.screen = $("#screen");
	this.box = content;
	this.display();
}
Popup.prototype.display = function(){
	var popup = '<div id="box"><div id="header"><img src="'+this.box.img+'"/><img src="icons/close.png" id="exit"/><div>'+this.box.title+'</div></div><div id="content"><div>'+this.box.content+'</div></div><div id="footer">';
	if(this.box.type == "prompt"){
		popup += '<div class="button" id="submit"></div>';
		popup = '<form>'+popup+'</form></div></div>';
	}
	this.container.html(popup);
	this.container.data('data',this);
	button = new Button({container:$("#submit"),label:"Submit",fnc:"popupSerialize"});
	this.screen.show();
	this.container.show();
};
Popup.prototype.destroy = function(){
	this.screen.hide();
	this.container.hide();
};

/*Destroy popup when clicking the x*/
$(document).on("click", "#exit", function(){
	var popup = $(this).closest("#popup").data('data');
	popup.destroy();
});

/*
	##################################################################
								Button
	
	button = new Button({container:$("#submit"),label:"Submit",fnc:"submit"});
	
	##################################################################
*/

function Button(content){
	this.content = content;
	this.build();
}
Button.prototype.build = function(){
	var button = "";
	if(this.content.img != undefined){
		button += '<img src="'+this.content.img+'"/>';
	}
	button += '<span class="label">'+this.content.label+'</span>';
	this.content.container.html(button);
	this.content.container.data("fnc",this.content.fnc);
};
$(document).on("click", ".button", function(e){
	e.preventDefault();
	var fnc = $(this).data('fnc');
	if(fnc != undefined)
		action[fnc]();
});

/*
	##################################################################
								Accordion
	
	var content = {
		container:$(".accordion"),
		sections:[
			{header:"Header1",content:"<p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p>"},
			{header:"Header2",content:"<p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p>"}
		]
	};
	
	##################################################################
*/

function Accordion(content){
	this.content = content;
	this.build();
}
Accordion.prototype.build = function(){
	str = "";
	$.each(this.content.sections,function(index,value){
		if(index == 0)
			str += '<div class="accordionHeader"><img src="img/minus.png"/><span>'+value.header+'</span></div><div class="accordionContent" style="display:block;">'+value.content+'</div>'
		else
			str += '<div class="accordionHeader"><img src="img/plus.png"/><span>'+value.header+'</span></div><div class="accordionContent" style="display:none;">'+value.content+'</div>';
	});
	this.content.container.html(str);
	this.content.container.data('data',this);
};
Accordion.prototype.toggle = function(obj){
	var img = obj.attr('src');
	var expand = 'img/plus.png';
	var contract = 'img/minus.png';
	if(img == expand)
		obj.attr('src', contract);
	else
		obj.attr('src', expand);
	obj.closest(".accordionHeader").next(".accordionContent").slideToggle();
};

$(document).on("click",".accordionHeader img",function(){
	var accordion = $(this).closest(".accordion").data('data');
	accordion.toggle($(this));
});

/*
	##################################################################
								TreeView
	
	extend the actions array with functions for execution
	
	##################################################################
*/

function TreeView(content){
	this.content = content;
	this.build();
}
TreeView.prototype.build = function(){
	var str = this.recursize(this.content.data);
	this.content.container.html('<div>'+str+'</div>');
	this.content.container.data('data', this);
};
TreeView.prototype.recursize = function(content){
	var obj = this;
	var str = "";
	$.each(content,function(index, value){
		if(value.type == "item"){
			str += '<li class="item"><img src="'+value.img+'"/><span>'+value.label+'</span>';
		}
		if(value.type == "expand"){
			str += '<li class="expand"><img class="toggle" src="img/plus.png"/><img src="'+value.img+'"/><span>'+value.label+'</span>';
			str += obj.recursize(value.data);
		}
	});
	return '<ul>'+str+'</ul>';
};
TreeView.prototype.toggle = function(obj){
	var img = obj.attr('src');
	var expand = 'img/plus.png';
	var contract = 'img/minus.png';
	if(img == expand)
		obj.attr('src', contract);
	else
		obj.attr('src', expand);
		
		obj.next().next().next().slideToggle();
};
$(document).on("click",".tree .toggle",function(){
	var treeView = $(this).closest(".tree").data('data');
	treeView.toggle($(this));
});
$(document).on("dblclick",".tree .item",function(){
	if(action['treeView'] != undefined){
		action['treeView']($(this).children('span').html());
	}
});
/*
	##################################################################
								Table
	
	##################################################################
*/
function Table(content){
	this.content = content;
	this.build();
}
Table.prototype.build = function(){
	var str = "<tr>";
	$.each(this.content.columns,function(index, value){
		if(value.sort == "ASC"){
			value.col = value.col.sort();
			str += '<th><span>'+value.header+'</span><img src="img/down.png" /></th>';
		}
		if(value.sort == "DESC"){
			value.col = value.col.sort().reverse();
			str += '<th><span>'+value.header+'</span><img src="img/up.png" /></th>';
		}
	});
	str += '</tr>';
	
	var rowCount = this.content.columns[0].col.length;
	for(i = 0; i < rowCount; i++){
		str += '<tr>';
		$.each(this.content.columns, function(index, value){
			if(value.col[i] != undefined)
				str += '<td>'+value.col[i]+'</td>';
			else
				str += '<td></td>';
		});
		str += '</tr>';
	}
	this.content.container.html(str);
	this.content.container.data("data", this);
};

$(document).on("click",".table th",function(){
	var index = $(this).index();
	var table = $(this).closest('table').data('data');
	
	if(table.content.columns[index].sort == "ASC")
		table.content.columns[index].sort = "DESC";
	else
		table.content.columns[index].sort = "ASC";
	
	table.build();
});
/*
	##################################################################
								slider
	
	##################################################################
*/

function Slider(){
	this.content = {
		container:{id:$('.slider'),left:0,width:0},
		left:{left:0,width:0,data:"<p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p><p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p><p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p><p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p><p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p>"},
		handler:{left:0},
		right:{left:0,width:0,data:"<p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p><p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p><p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p><p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p><p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p><p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.</p>"},
		active:false
	};
	this.build();
}
Slider.prototype.build = function(){
	this.content.container.width = this.content.container.id.innerWidth();
	var width = this.content.container.width / 2 - 8;
	this.content.left.width = width;
	this.content.right.width = width;
	var str = '<div class="left" style="width:'+this.content.left.width+'px;">'+this.content.left.data+'</div>';
	str += '<div class="handler" style="width:16px;height:'+this.content.container.id.innerHeight()+';"></div>';
	str += '<div class="right" style="width:'+this.content.right.width+'px;">'+this.content.right.data+'</div>';
	this.content.container.id.html(str);
	this.position();
	this.content.container.id.data('data', this);
};
Slider.prototype.position = function(){
	var pos = this.content.container.id.position();
	this.content.container.left = pos.left;
	pos = this.content.container.id.children('.left').position();
	this.content.left.left = pos.left;
	pos = this.content.container.id.children('.handler').position();
	this.content.handler.left = pos.left;
	pos = this.content.container.id.children('.right').position();
	this.content.right.left = pos.left;
};
Slider.prototype.handle = function(handler){
	this.position();
	this.content.handler.left = handler;
	this.content.left.width = this.content.handler.left - this.content.left.left;
	this.content.right.width = this.content.container.width - this.content.handler.left;
}
Slider.prototype.update = function(obj){
	var limitLeft = this.content.container.left + 16;
	var limitRight = this.content.container.width - 16;
	if(this.content.handler.left > limitLeft && this.content.handler.left < limitRight){
		obj.children(".left").css('width', this.content.left.width);
		obj.children(".right").css('width', this.content.right.width);
		obj.children('.handler').css('left', this.content.handler.left);
		obj.data('data',this);
	}
};

$(document).on("click", ".slider .handler",function(){
	var slider = $(this).closest('.slider').data('data');
	if(slider.active)
		slider.active = false;
	else
		slider.active = true;
	$(this).closest('.slider').data('data', slider);
	slider = $(this).closest('.slider').data('data');
});

$(document).on("mousemove",".slider",function(e){
	var slider = $(this).data('data');
	if(slider.active){
		slider.handle(e.pageX);
		slider.update($(this));
	}
});


/*
	##################################################################
								Actions
	
	extend the actions array with functions for execution
	
	##################################################################
*/

var action = [];

action['popupSerialize'] = function(){	
	popupObj = popup.container.children("form").serializeArray();
	popup.destroy();
};
action['prompt'] = function(){
	var content = {type:"prompt",img:"img/prompt.png",title:"Login - Please enter your credentials.",content:'<p><label>Username</label><input type="text" name="username" /></p><p><label>Password</label><input type="password" name="password" /></p>'};
	popup = new Popup(content);
};
action['alert'] = function(){
	var content = {type:"",img:"img/alert.png",title:"Alert",content:'<p>An error occured please try again.</p>'};
	popup = new Popup(content);
};
action['treeView'] = function(data){
	var content = {type:"",img:"img/alert.png",title:"TreeView",content:'<p>[ '+data+' ] Was clicked!</p>'};
	popup = new Popup(content);
};
