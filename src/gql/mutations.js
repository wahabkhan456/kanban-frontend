import { gql } from 'graphql-tag';

export const CREATE_TASK = gql`
  mutation CreateTask($text: String!, $description: String, $categoryId: ID!, $date: String) {
    createTask(text: $text, description: $description, categoryId: $categoryId, date: $date) {
      task {
        id
        text
        description
        date
        category {
          id
          name
        }
      }
    }
  }
`;

export const GET_TASKS_AND_COLUMNS = gql`
  query {
    allTasks {
      id
      text
      description
      category {
        id
        name
        date
      }
    }
    allColumns {
      id
      name
      date
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $text: String, $description: String, $categoryId: ID, $date: String) {
    updateTask(id: $id, text: $text, description: $description, categoryId: $categoryId, date: $date) {
      task {
        id
        text
        description
        date
        category {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      task {
        id
        text
        description
        date
        category {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_COLUMN = gql`
  mutation CreateColumn($name: String!, $date: String) {
    createColumn(name: $name, date: $date) {
      column {
        id
        name
        date
      }
    }
  }
`;

export const UPDATE_COLUMN = gql`
  mutation UpdateColumn($id: ID!, $name: String!, $date: String) {
    updateColumn(id: $id, name: $name, date: $date) {
      column {
        id
        name
        date
      }
    }
  }
`;

export const DELETE_COLUMN = gql`
  mutation DeleteColumn($id: ID!) {
    deleteColumn(id: $id) {
      column {
        id
        date
      }
    }
  }
`;
