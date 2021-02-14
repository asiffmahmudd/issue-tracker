document.getElementById('issueInputForm').addEventListener('submit', submitIssue);

const issueNumber = (issues) => {
  if(issues == null){
    document.getElementById('issues').innerHTML = '0';
    return;
  }
  let num = 0;
  issues.forEach( (issue) => {
    if(issue.status == 'Open'){
      num++;
    }
  });
  document.getElementById('issues').innerHTML = num;
}

function submitIssue(e) {
  const getInputValue = id => document.getElementById(id).value;
  const description = getInputValue('issueDescription');
  const severity = getInputValue('issueSeverity');
  const assignedTo = getInputValue('issueAssignedTo');
  const id = Math.floor(Math.random()*100000000) + '';
  const status = 'Open';

  const issue = { id, description, severity, assignedTo, status };
  let issues = [];
  if (localStorage.getItem('issues')){
    issues = JSON.parse(localStorage.getItem('issues'));
  }
  issues.push(issue);
  localStorage.setItem('issues', JSON.stringify(issues));

  document.getElementById('issueInputForm').reset();
  fetchIssues();
  e.preventDefault();
}

const closeIssue = id => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const currentIssue = issues.find(issue => issue.id == id);
  currentIssue.status = 'Closed'; 
  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();  
}

const deleteIssue = id => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const remainingIssues = issues.filter( function(issue){
    return issue.id != id;
  });
  localStorage.setItem('issues', JSON.stringify(remainingIssues));
  fetchIssues();
}

const fetchIssues = () => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  issueNumber(issues);
  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';

  if(issues == null){
    return;
  }
  for (var i = 0; i < issues.length; i++) {
    const {id, description, severity, assignedTo, status} = issues[i];
    let desc = '';
    let label = '';
    let btn = '';
    if(issues[i].status == 'Closed'){
      desc = `<s> ${description} </s>`;
      label = 'primary';
    }
    else{
      desc = description;
      label = 'info';
      btn = `<a href="#" onclick="closeIssue(${id})" class="btn btn-warning">Close</a>`;
    }
    issuesList.innerHTML +=   `<div class="well">
                              <h6>Issue ID: ${id} </h6>
                              <p><span class="label label-${label}"> ${status} </span></p>
                              <h3> ${desc} </h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              ${btn}
                              <a href="#" onclick="deleteIssue(${id})" class="btn btn-danger">Delete</a>
                              </div>`;
  }
  
}

