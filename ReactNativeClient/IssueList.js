import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    constructor() {
      super();
      this.state = { status: '', owner: '' };
      this.handleSubmit = this.handleSubmit.bind(this); 
      this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleFilterChange(field, value) {
      this.setState({ [field]: value }, () => {
      });
    }
    handleSubmit() {
      this.props.onFilter(this.state);
    }
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <View style={styles.filterContainer}>
        <Text>Filter Issues</Text>
        <TextInput
          style={styles.input}
          placeholder="Status (New, Assigned, Fixed, Closed)"
          onChangeText={(text) => this.handleFilterChange('status', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Owner"
          onChangeText={(text) => this.handleFilterChange('owner', text)}
        />
        <Button title="Submit Filter" onPress={this.handleSubmit} />
      </View>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  headerText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' },
  text: { textAlign: 'center', color: '#000' },
  form: { padding: 16 },
  input: { borderWidth: 1, padding: 8, marginBottom: 16, borderColor: '#ccc' },
  filterContainer: { padding: 16 },
});

const width= [40,80,80,80,80,80,200];

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const rowData = [
      issue.id,
      issue.title,
      issue.status,
      issue.owner,
      issue.effort,
      issue.created.toLocaleDateString(),
      issue.due ? issue.due.toLocaleDateString() : 'N/A',
    ];
    {/****** Q2: Coding Ends here.******/}
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row
      data={rowData}
      style={styles.row}
      textStyle={styles.text}
    />
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const tableHeader = ['ID', 'Title', 'Status', 'Owner', 'Effort', 'Created', 'Due'];
    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
      <>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
    <View style={styles.container}>
      <Table>
        <Row
          data={tableHeader}
          style={styles.header}
          textStyle={styles.text}
        />
        <ScrollView style={styles.dataWrapper}>{issueRows}</ScrollView>
      </Table>
    </View>
    {/****** Q2: Coding Ends here. ******/}
      </>
    );
  }

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = { title: '', owner: '', effort: '', due: '', status: 'New' };
      this.handleChange = this.handleChange.bind(this);
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleChange(field, value) {
      this.setState({ [field]: value });
    }
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const { title, owner, effort, due, status } = this.state;
      if (!title) {
        Alert.alert('Title is required');
        return;
      }
      const issue = {
        title,
        owner: owner || null,
        effort: effort ? parseInt(effort, 10) : undefined,
        due: due ? new Date(due).toISOString() : undefined,
        status,
      };
      this.props.createIssue(issue);
      this.setState({ title: '', owner: '', effort: '', due: '', status: 'New' });
      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      return (
          <View style={styles.form}>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={this.state.title}
              onChangeText={(text) => this.handleChange('title', text )}
            />
            <TextInput
              style={styles.input}
              placeholder="Owner"
              value={this.state.owner}
              onChangeText={(text) => this.handleChange('owner', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Effort"
              value={this.state.effort}
              keyboardType="numeric"
              onChangeText={(text) => this.handleChange('effort', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={this.state.due}
              onChangeText={(text) => this.handleChange('due', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Status (New, Assigned, Fixed, Closed)"
              value={this.state.status}
              onChangeText={(text) => this.handleChange('status', text)} 
            />
            <Button title="Add Issue" onPress={this.handleSubmit} />
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = { name: '' };
        this.handleChange = this.handleChange.bind(this);
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleChange(value) {
      this.setState({ name: value });
    }
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
      const { name } = this.state;
      this.props.addToBlacklist(name);
      this.setState({ name: '' });
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View style={styles.form}>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <TextInput
            style={styles.input}
            placeholder="Name to Blacklist"
            value={this.state.name}
            onChangeText={this.handleChange}
          />
          <Button title="Add to Blacklist" onPress={this.handleSubmit} />
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [], filteredIssues: [] };
        this.createIssue = this.createIssue.bind(this);
        this.addToBlacklist = this.addToBlacklist.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList, filteredIssues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }
    
    async addToBlacklist(name) {
      const query = `mutation addToBlacklist($nameInput: String!) {
        addToBlacklist(nameInput: $nameInput)
      }`;
      const data = await graphQLFetch(query, { nameInput: name });
      if (data) {
        alert(`"${name}" added to blacklist.`);
      }
    }

    applyFilter(filter) {
      const { status, owner } = filter;
      const filteredIssues = this.state.issues.filter((issue) => {
        return (
          (status === '' || issue.status.toLowerCase() === status.toLowerCase()) &&
          (owner === '' || issue.owner.toLowerCase().includes(owner.toLowerCase()))
        );
      });
      this.setState({ filteredIssues });
    }
    
    render() {
      return (
      <>
    {/****** Q1: Start Coding here. ******/}
      <SafeAreaView>
        <ScrollView>
          <IssueFilter onFilter={this.applyFilter} />
    {/****** Q1: Code ends here ******/}

    {/****** Q2: Start Coding here. ******/}
          <IssueTable issues={this.state.filteredIssues} />
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
          <IssueAdd createIssue={this.createIssue} />
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
          <BlackList addToBlacklist={this.addToBlacklist}/>
        </ScrollView>
      </SafeAreaView>
    {/****** Q4: Code Ends here. ******/}
      </>
      
    );
  }
}