var fs = require('fs');
var parse = require('xml-parser');
var inspect = require('util').inspect;

// Our constructors
var User = require('./user/user');
var Organization = require('./organization/organization');

// Read data from xml and parse it
var xml = fs.readFileSync('users.xml', 'utf8');
var obj = parse(xml);

var companies = [];

// Loop through each item in parsed object
obj.root.children.forEach(function(item) {
		// Check if company already exist in array
		var indexOfOrg = companies.findIndex(function(i) {
			return i.name === item.children[2].content;
		})

		// Create new user 
		var user = new User(item.children[0].content,
											  item.children[1].content,
											  item.children[2].content,
											  item.children[3].content,
											  item.children[4].content);		

		// If company already exist: push user to this company "users" array;
		// esle : create company and push user to newly created company's 
		// "users" array, and push companies to "organization" array
		if (indexOfOrg !== -1) {
			companies[indexOfOrg].users.push(inspect(user));
		} else {
			var org = new Organization(item.children[2].content);
			org.users.push(inspect(user));
			companies.push(org);
		}		
});

// Write "Companies" array to txt "organizations.txt"
fs.writeFile('organizations.txt', inspect(companies), function(err) {
	if (err) {
		return console.error(err);
	}
	console.log("Had written to file succesfuly");
});