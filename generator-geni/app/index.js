'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var GeniGenerator = yeoman.generators.Base.extend({

    scaffoldFolders: function(){
            this.mkdir("app");
            this.mkdir("app/css");
            this.mkdir("app/sections");
            this.mkdir("build");
        },

        copyMainFiles: function(){
            this.copy("_footer.html", "app/footer.html");
            this.copy("_gruntfile.js", "Gruntfile.js");
            this.copy("_package.json", "package.json");
            this.copy("_main.css", "app/css/main.css");    
         
            var context = { 
                site_name: this.appName, 
				casino_name: this.casinoName, 
            };
         
            this.template("_header.html", "app/header.html", context);
        },

        generateDemoSection: function(){
			if (this.addDemoSection) {
				var context = {
					content: "Demo Section",
					id: this._.classify("Demo Section")
				}
		   
				var fileBase = Date.now() + "_" + this._.underscored("Demo Section");
				var htmlFile = "app/sections/" + fileBase + ".html";
				var cssFile  = "app/css/" + fileBase + ".css"; 
		   
				this.template("_section.html", htmlFile, context);
				this.template("_section.css", cssFile, context);
			}
		},
		generateMenu: function(){
			var menu = this.read("_menu.html");
		 
			var t = '<a><%= name %></a>';
			var files = this.expand("app/sections/*.html");
		 
			for (var i = 0; i < files.length; i++) {
				var name = this._.chain(files[i]).strRight("_").strLeftBack(".html").humanize().value();
		   
				var context = {
					name: name,
					id: this._.classify(name)
				};
		   
				var link = this.engine(t, context);
				menu = this.append(menu, "div.menu", link);
			}
		 
			this.write("app/menu.html", menu);
		},
        runNpm: function(){
            var done = this.async();
            this.npmInstall("", function(){
                console.log("\nEverything Setup !!!\n");
                done();
            });
        },

  promptUser: function() {

        var done = this.async();
 
        // have Yeoman greet the user
        console.log(this.yeoman);
 
        var prompts = [{
            name: 'appName',
            message: 'What is your app\'s name ?'
        },{
            name: 'casinoName',
            message: 'What is the casino\'s name',
        },{
            type: 'confirm',
            name: 'addLangSection',
            message: 'Would you like to generate a language select ?',
            default: true
        },{
            type: 'confirm',
            name: 'addDemoSection',
            message: 'Would you like to generate a demo section ?',
            default: true
        }];
 
        this.prompt(prompts, function (props) {
            this.appName = props.appName;
			this.casinoName = props.casinoName;
			this.addLangSection = props.addLangSection;
            this.addDemoSection = props.addDemoSection;
   
            done();
        }.bind(this));
    }
  
});

module.exports = GeniGenerator;