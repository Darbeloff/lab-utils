var jsonURL = 'https://darbeloff.github.io/lab-utils/employees.json';
var jqhxr = $.getJSON(jsonURL, function(data) {
	var html = generateHeader('Research Staff') + startTable();
	for (let e=0; e<data.research_staff.length; e++) {
		html += generateRow(e, data.research_staff[e], data, false);
	}
	html += endTable();
	document.getElementById('research-staff').innerHTML = html;

	html = generateHeader('Graduate Student-Workers') + startTable();
	gswTitles = ['M.S. Student','Ph.D. Student','Ph.D. Candidate'];
	data.grad_student_workers.sort((a,b) => gswTitles.indexOf(b.title)-gswTitles.indexOf(a.title));
	for (let e=0; e<data.grad_student_workers.length; e++) {
		html += generateRow(e, data.grad_student_workers[e], data, false);
	}
	html += endTable();
	document.getElementById('graduate-student-workers').innerHTML = html;

	html = generateHeader('Visiting Engineers') + startTable();
	for (let e=0; e<data.visiting_engineers.length; e++) {
		html += generateRow(e, data.visiting_engineers[e], data, false);
	}
	html += endTable();
	document.getElementById('visiting-engineers').innerHTML = html;

	html = generateHeader('Undergraduate Researchers') + startTable();
	for (let e=0; e<data.urops.length; e++) {
		html += generateRow(e, data.urops[e], data, true);
	}
	html += endTable();
	document.getElementById('undergraduate-researchers').innerHTML = html;

	html = generateHeader('Lab Alumni') + startTable();
	for (let e=0; e<data.alumni.length; e++) {
		delete data.alumni[e].degrees;
		delete data.alumni[e].alias;
		html += generateRow(e, data.alumni[e], data, true);
	}
	html += endTable();
	document.getElementById('lab-alumni').innerHTML = html;
});
jqhxr.fail(function() {
	throw new Error('JSON file not formatted correctly. Go to ' + jsonURL + ' to learn more.')
});

function generateHeader(title) {
	return '<h1 style="text-align: center;">' + title + '</h1><hr />'
}

function startTable() {
	return '\t<table id="tablepress-1" class="tablepress tablepress-id-1">\n' + 
				 '\t\t<tbody>\n';
}

function startRow(rowNum) {
	return '\t\t\t<tr class="row-' + rowNum + '">\n';
}

function imageCell(imageURL) {
	return '\t\t\t\t<td class="column-1" style="vertical-align: middle;"><img class="aligncenter size-medium" src="' + imageURL + '" alt="" width="200" /></td>\n'
}

function startContentCell() {
	return '\t\t\t\t<td class="column-2" style="vertical-align: middle;">\n';
}

function endCellAndRow() {
	return '</td>\n\t\t\t</tr>\n';
}

function endTable() {
	return '\t\t</tbody>\n\t</table>'
}

function generateRow(ind, employee, data, formatTight=false) {
	var html = startRow(ind);

	// Image
	if (employee.hasOwnProperty('image')) {
		html += imageCell(employee.image);
	} else {
		html += imageCell('https://cdn2.iconfinder.com/data/icons/lightly-icons/30/user-480.png');
	}

	// Name and Title
	html += startContentCell();
	html += '\t\t\t\t\t<h2>';
	if (employee.hasOwnProperty('title')) {
		html += '<strong>';
	}
	if (employee.hasOwnProperty('website')) {
		html += '<a href="' + employee.website + '">';
	}
	html += employee.name;
	if (employee.hasOwnProperty('website')) {
		html += '</a>';
	}
	if (employee.hasOwnProperty('title')) {
		html += '</strong> <em>' + employee.title + '</em>'
	}
	html += '</h2>';

	// Degrees
	if (employee.hasOwnProperty('degrees')) {
		html += '\t\t\t\t\t';
		if (formatTight) {
			html += '<em>';
		}
		html += formatDegreeString(employee.degrees);
		if (formatTight) {
			html += '</em>';
		} else {
			html += '<br>'
		}
		html += '<br>';
	}

	// Research Topic and Mentor
	if (employee.hasOwnProperty('mentor')) {
		var mentor = null;
		for (let e=0; e<data.grad_student_workers.length; e++) {
			if (data.grad_student_workers[e].name===employee.mentor) {
				html += '\t\t\t\t\t<strong>Research Topic:</strong> ' + data.grad_student_workers[e].research + '<br>';
				if (!formatTight) {
					html += '<br>';
				}
				break;
			}
		}
		html += '\t\t\t\t\t<strong>Research Mentor:</strong> ' + employee.mentor + '<br>';
	} else if (employee.hasOwnProperty('research')) {
		html += '\t\t\t\t\t<strong>Research Topic:</strong> ' + employee.research + '<br>';
		if (!formatTight) {
			html += '<br>';
		}
	}

	// Email
	if (employee.hasOwnProperty('alias')) {
		html += '\t\t\t\t\t<strong>Email:</strong> ' + employee.alias +  '@mit.edu<br>';
	}

	// End Cell and Row
	html += endCellAndRow();

	return html;
}

function formatDegreeString(degrees) {
	// "degrees" field can be either a string (to be printed literally) or an array of objects.
	// If it's an array of objects,
	if (Array.isArray(degrees)) {
		// Sort the degrees by year.
		degrees.sort((a,b) => (a.year<b.year) ? 1 : -1);

		// Assemble degrees in formatted strings, one line for each degree.
		var degStr = '';
		degrees.forEach(function(deg) {
			degStr += `${deg.degree} in ${deg.subject}, ${deg.institution} (${deg.year})\n`;
		});

		// Remove the last new line character.
		degrees = degStr.substring(0,degStr.length-1);
	}

	// Replace the newline characters with HTML breaks.
	return degrees.replace(/\n/g,'<br>');
}