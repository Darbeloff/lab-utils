var jsonURL = 'https://darbeloff.github.io/lab-utils/employees.json';
var jqhxr = $.getJSON(jsonURL, function(data) {
	data.research_staff.forEach(employee => document.getElementById('research-staff').appendChild(generateEmployee(employee)));

	gswTitles = ['M.S. Student','Ph.D. Student','Ph.D. Candidate'];
	data.grad_student_workers.sort((a,b) => gswTitles.indexOf(b.title)-gswTitles.indexOf(a.title));
	data.grad_student_workers.forEach(employee => document.getElementById('graduate-student-workers').appendChild(generateEmployee(employee)));

	data.visiting_engineers.forEach(employee => document.getElementById('visiting-engineers').appendChild(generateEmployee(employee)));

	data.urops.forEach(employee => document.getElementById('urops').appendChild(generateEmployee(employee, true)));

	data.alumni.forEach(employee => {
		delete employee.degrees;
		delete employee.alias;
		delete employee.title;
		document.getElementById('lab-alumni').appendChild(generateEmployee(employee, true))
	});
});
jqhxr.fail(function() {
	throw new Error('JSON file not formatted correctly. Go to ' + jsonURL + ' to learn more.')
});

function generateEmployee(employee, formatTight=false) {
	var employeeDiv = document.createElement('DIV');
	employeeDiv.className = 'employee';

	var img = document.createElement('IMG');
	img.src = (employee.hasOwnProperty('image') ? employee.image : 'https://cdn2.iconfinder.com/data/icons/lightly-icons/30/user-480.png');
	img.alt = 'Image failed to load'
	employeeDiv.appendChild(img);

	var textDiv = document.createElement('DIV');
	textDiv.className = 'textDiv';
	if (formatTight) textDiv.className+= ' tight';
	
	// Name and Title
	var h2 = document.createElement('H2');
	var name = document.createTextNode(employee.name);
	if (employee.hasOwnProperty('website')) {
		var a = document.createElement('A');
		a.href = employee.website;
		a.appendChild(name);
		h2.appendChild(a);
	} else {
		h2.appendChild(name);
	}
	if (employee.hasOwnProperty('title')) {
		var em = document.createElement('EM');
		em.className = 'title';
		em.appendChild(document.createTextNode(employee.title));
		h2.appendChild(em);
	}
	textDiv.appendChild(h2);

	// Degrees
	if (employee.hasOwnProperty('degrees')) {
		var degreeDiv = document.createElement('DIV');
		var degrees = employee.degrees;
		if (Array.isArray(degrees)) {
			degrees.sort((a,b) => (a.year<b.year) ? 1 : -1);
			degrees.forEach(deg => {
				degreeDiv.appendChild(document.createTextNode(`${deg.degree} in ${deg.subject}, ${deg.institution} (${deg.year})`));
				degreeDiv.appendChild(document.createElement('BR'));
			});
		} else {
			degreeDiv.innerHTML+= degrees.replace(/\n/g,'<br>');
		}
		textDiv.appendChild(degreeDiv);
	}

	// Research Topic
	if (employee.hasOwnProperty('research')) {
		var researchDiv = document.createElement('DIV');
		var strong = document.createElement('STRONG');
		strong.appendChild(document.createTextNode('Research Topic: '));
		researchDiv.appendChild(strong);
		researchDiv.appendChild(document.createTextNode(employee.research));
		textDiv.appendChild(researchDiv);
	}

	// Mentor
	if (employee.hasOwnProperty('mentor')) {
		var mentorDiv = document.createElement('DIV');
		var strong = document.createElement('STRONG');
		strong.appendChild(document.createTextNode('Research Mentor: '));
		mentorDiv.appendChild(strong);
		mentorDiv.appendChild(document.createTextNode(employee.mentor));
		textDiv.appendChild(mentorDiv);
	}

	// Email
	if (employee.hasOwnProperty('alias')) {
		var emailDiv = document.createElement('DIV');
		var strong = document.createElement('STRONG');
		strong.appendChild(document.createTextNode('Email: '));
		emailDiv.appendChild(strong);
		emailDiv.appendChild(document.createTextNode(`${employee.alias}@mit.edu`));
		textDiv.appendChild(emailDiv);
	}

	employeeDiv.appendChild(textDiv);
	return employeeDiv;
}
